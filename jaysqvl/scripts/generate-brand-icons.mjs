import { mkdir, readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

// Header and icon exports share the same editable vector geometry.
const mark = JSON.parse(await readFile(new URL('../data/brand-mark.json', import.meta.url), 'utf8'));
const output = new URL('../public/brand/', import.meta.url);
const { x, y, width, height, rx } = mark.dot;
const shapes = `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${rx}"/><path d="${mark.path}" fill-rule="evenodd"/>`;
const icon = (radius) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><rect width="160" height="160" rx="${radius}" fill="#151514"/><g transform="translate(8 18)" fill="#f1efe7">${shapes}</g></svg>\n`;
const svg = icon(28);

await mkdir(output, { recursive: true });
await writeFile(new URL('je-rounded-v1.svg', output), svg);

// ICO directory entries contain lossless PNG frames for browser tab sizes.
const sizes = [16, 32, 48];
const frames = await Promise.all(sizes.map((size) => sharp(Buffer.from(svg)).resize(size, size).png().toBuffer()));
const directory = Buffer.alloc(6 + sizes.length * 16);
directory.writeUInt16LE(1, 2);
directory.writeUInt16LE(sizes.length, 4);
let offset = directory.length;
for (let index = 0; index < sizes.length; index += 1) {
  const entry = 6 + index * 16;
  directory[entry] = sizes[index];
  directory[entry + 1] = sizes[index];
  directory.writeUInt16LE(1, entry + 4);
  directory.writeUInt16LE(32, entry + 6);
  directory.writeUInt32LE(frames[index].length, entry + 8);
  directory.writeUInt32LE(offset, entry + 12);
  offset += frames[index].length;
}
const ico = Buffer.concat([directory, ...frames]);
await writeFile(new URL('je-rounded-v1.ico', output), ico);
await writeFile(new URL('../public/favicon.ico', import.meta.url), ico);
await sharp(Buffer.from(icon(0))).resize(180, 180).png().toFile(new URL('apple-touch-icon-je-v1.png', output).pathname);
console.log('Generated rounded je SVG, 16/32/48px ICO, and Apple touch icon.');
