import {Config} from '@remotion/cli/config';
import {existsSync} from 'node:fs';

const CHROME = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
if (existsSync(CHROME)) Config.setBrowserExecutable(CHROME);
Config.setVideoImageFormat('png');
Config.setCodec('h264');
Config.setCrf(18);
Config.setPixelFormat('yuv420p');
Config.setOverwriteOutput(true);
