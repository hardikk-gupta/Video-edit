// Fetch only the free CC0 library. No upstream code or install scripts are run.
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {existsSync, lstatSync, mkdirSync, readFileSync, readlinkSync, symlinkSync} from 'node:fs';
import {dirname, join, relative, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const library = join(root, 'vendor/sfx-kit');
const revision = '92780e7ab0cdfb557497a988089c47f46e8c7412';
const git = (...args) => execFileSync('git', ['-C', library, ...args], {stdio: 'inherit'});

if (!existsSync(join(library, '.git'))) {
  mkdirSync(dirname(library), {recursive: true});
  execFileSync('git', ['clone', '--no-checkout', 'https://github.com/wyzowl/sfx-kit.git', library], {stdio: 'inherit'});
}
try {
  execFileSync('git', ['-C', library, 'cat-file', '-e', `${revision}^{commit}`], {stdio: 'ignore'});
} catch {
  git('fetch', '--depth', '1', 'origin', revision);
}
git('checkout', '--detach', revision);

const manifest = JSON.parse(readFileSync(join(library, 'sounds.json'), 'utf8'));
if (manifest.license !== 'CC0-1.0' || manifest.sounds.length !== 320) {
  throw new Error('Unexpected SFX Kit licence or catalogue size.');
}
for (const sound of manifest.sounds) {
  const actual = createHash('sha256').update(readFileSync(join(library, sound.file))).digest('hex');
  if (actual !== sound.sha256) throw new Error(`SFX checksum mismatch: ${sound.id}`);
}

const target = join(library, 'sounds');
const link = join(root, 'toolkit/public/sfx/kit');
mkdirSync(dirname(link), {recursive: true});
const existing = lstatSync(link, {throwIfNoEntry: false});
if (existing) {
  if (!existing.isSymbolicLink() || resolve(dirname(link), readlinkSync(link)) !== target) {
    throw new Error(`Refusing to overwrite ${link}; it points at another sound library.`);
  }
} else {
  symlinkSync(relative(dirname(link), target), link, 'dir');
}
console.log('Ready: 320 CC0 sounds, all WAV checksums verified, available at public/sfx/kit.');
