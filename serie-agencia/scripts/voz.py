"""Voces de los vídeos A, B y C (edge-tts). Lee config.json, genera cada frase con la voz de su personaje y mide los tiempos.

Uso: SSL_CERT_FILE=/ruta/ca.crt python3 scripts/voz.py [A B C]

Salida: public/voz/<vídeo>/<escena>.wav y public/voz/<vídeo>/tiempos.json (palabras del texto original con tiempos + envolvente).
"""
import array, asyncio, json, math, os, pathlib, re, ssl, subprocess, sys, wave

import edge_tts
import edge_tts.communicate as _c

if os.environ.get("SSL_CERT_FILE"):
    _c._SSL_CTX = ssl.create_default_context(cafile=os.environ["SSL_CERT_FILE"])
PROXY = os.environ.get("HTTPS_PROXY")
RAIZ = pathlib.Path(__file__).resolve().parent.parent
FPS = 30
RECORTE = 4 / FPS


def guion(cfg, video):
    """Frases de cada vídeo. El usuario del seguidor solo se ve en el pósit (no se lee)."""
    if video == "A":
        return [
            ("intro", "riyad", "¡Ya nos sigue! Seguimos en el día 1."),
            ("paco", "lolo", "Paco acaba de terminar de trabajar… y ahora le tocan los presupuestos a mano."),
            ("copia", "riyad", "Paco, copia este prompt en ChatGPT o la IA que uses."),
            ("prompt", "riyad", "Le pegas tus notas y te devuelve un presupuesto ordenado: trabajo, materiales, mano de obra e IVA."),
            ("revisa", "kevin", "Eso sí: revisa siempre los precios antes de enviarlo."),
            ("cierre", "kevin", "Por cada mil seguidores bajamos un 1 % nuestros precios. Síguenos y sales en el próximo vídeo."),
        ]
    if video == "B":
        ayer = cfg["B"].get("AYER", "").strip().rstrip(".")
        return [
            ("intro", "kevin", "¡Ya nos sigue! Día 2 de nuestra agencia de IA."),
            *([("ayer", "riyad", f"Ayer: {ayer}.")] if ayer else []),
            ("rosa", "lolo", "Rosa tiene una empresa de multiservicios. Tres móviles… y solo dos manos."),
            ("agente", "lolo", "Un agente de voz coge la llamada, apunta servicio, nombre, teléfono y dirección, agenda la cita y avisa al técnico."),
            ("truco", "riyad", "Truco gratis: en WhatsApp Business pon un mensaje de ausencia que pida nombre, dirección y qué ha pasado."),
            ("cierre", "kevin", "Cada mil seguidores, un 1 % menos en nuestros precios. Síguenos y sales en el próximo."),
        ]
    return [
        ("intro", "riyad", "¡Ya nos sigue! Día 2 montando nuestra agencia de IA."),
        ("jordi", "lolo", "Jordi es instalador. Y cada día le hacen las mismas preguntas."),
        ("escalera", None, 3.0),  # sin voz: solo efectos
        ("chatbot", "lolo", "Un chatbot en tu web responde las preguntas de siempre, recoge los datos del cliente y agenda la visita."),
        ("truco", "kevin", "Truco gratis: apunta las diez preguntas que más te hacen y ponlas en tu web."),
        ("cierre", "riyad", "Cada mil seguidores, un 1 % menos en nuestros precios. Síguenos y sales en el próximo."),
    ]


def hablado(texto):
    """Ajustes de pronunciación que no cambian el número de palabras (para alinear con el texto en pantalla)."""
    t = []
    for tok in texto.split():
        # usuario de Instagram: se lee sin arroba/barra/punto inicial ("andreea punto dieciocho")
        m = re.match(r"^(¡?)[@/._]+(\w.*)$", tok)
        if m and any(ch in tok for ch in "@/"):
            tok = m.group(1) + re.sub(r"(\w)\1{2,}", r"\1", m.group(2))  # "andreeaaa" → "andreea"
        # los puntos suspensivos se leen como una coma (sin silencio largo)
        tok = tok.replace("…", ",")
        if tok == "%":
            tok = "por_ciento"
        t.append(tok)
    return " ".join(t).replace("por_ciento", "por ciento")


def limpia(t):
    return re.sub(r"[^\wáéíóúüñÁÉÍÓÚÜÑ@%+/]", "", t).lower()


def alinea(texto, limites):
    """Reparte los tiempos de la voz entre las palabras del texto original (con su puntuación)."""
    tokens = texto.split()
    habl = hablado(texto).split()
    # cuántas palabras habladas genera cada token original ("%" → "por ciento" = 2; "andreea.18" → 2)
    peso = [2 if t == "%" else max(1, len(re.findall(r"[^\W\d_]+|\d+", h))) for t, h in zip(tokens, habl)]
    plano = []
    for b in limites:
        n = max(1, len(b["text"].split()))
        dur = (b["end"] - b["start"]) / n
        for k in range(n):
            plano.append((b["start"] + k * dur, b["start"] + (k + 1) * dur))
    salida, i = [], 0
    for tok, p in zip(tokens, peso):
        if i >= len(plano):
            break
        st, en = plano[i][0], plano[min(len(plano) - 1, i + p - 1)][1]
        salida.append({"w": tok, "start": round(st, 3), "end": round(en, 3)})
        i += p
    assert len(habl) >= 1
    return salida


async def sintetiza(texto, v, destino):
    com = edge_tts.Communicate(hablado(texto), v["nombre"], rate=v["rate"], pitch=v["pitch"], boundary="WordBoundary", proxy=PROXY)
    audio, lim = bytearray(), []
    async for ch in com.stream():
        if ch["type"] == "audio":
            audio += ch["data"]
        elif ch["type"] == "WordBoundary":
            lim.append({"text": ch["text"], "start": ch["offset"] / 1e7, "end": (ch["offset"] + ch["duration"]) / 1e7})
    mp3 = destino.with_suffix(".mp3")
    mp3.write_bytes(audio)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(mp3), "-ar", "48000", "-ac", "1", str(destino)], check=True)
    mp3.unlink()
    return lim


def envolvente(wav):
    with wave.open(str(wav)) as w:
        sr = w.getframerate()
        datos = array.array("h", w.readframes(w.getnframes()))
    paso = sr // FPS
    env = [math.sqrt(sum(x * x for x in datos[i:i + paso]) / max(1, len(datos[i:i + paso]))) for i in range(0, len(datos), paso)]
    pico = max(env) or 1
    return [round(min(1.0, v / pico * 1.4), 3) for v in env]


async def main():
    cfg = json.loads((RAIZ / "config.json").read_text())
    for video in (sys.argv[1:] or ["A", "B", "C"]):
        carpeta = RAIZ / "public/voz" / video
        carpeta.mkdir(parents=True, exist_ok=True)
        frases = []
        for esc, quien, texto in guion(cfg, video):
            if quien is None:
                frases.append({"id": esc, "hablante": None, "silencio": texto, "palabras": [], "envolvente": []})
                continue
            wav = carpeta / f"{esc}.wav"
            lim = await sintetiza(texto, cfg["voces"][quien], wav)
            frases.append({"id": esc, "hablante": quien, "texto": texto, "archivo": f"voz/{video}/{esc}.wav", "palabras": alinea(texto, lim), "envolvente": envolvente(wav), "limites": [b["text"] for b in lim]})
        (carpeta / "tiempos.json").write_text(json.dumps({"fps": FPS, "recorte": RECORTE, "frases": frases}, ensure_ascii=False))
        total = 0
        print(f"── Vídeo {video}")
        for f in frases:
            if not f["palabras"]:
                total += f["silencio"]
                print(f"{f['id']:15s} (sin voz) {f['silencio']:.2f}s")
                continue
            d = f["palabras"][-1]["end"] - RECORTE
            total += d
            n = len(f["palabras"])
            print(f"{f['id']:15s} {f['hablante']:6s} {d:5.2f}s  {n / d:.2f} pal/s  " + " ".join(p["w"] for p in f["palabras"]) + "  |  " + " ".join(f["limites"]))
        print(f"voz total {total:.2f} s")


asyncio.run(main())
