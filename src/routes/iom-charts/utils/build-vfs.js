import fs from 'fs';

const vfsBefore = 'window.pdfMake = window.pdfMake || {}; window.pdfMake.vfs = ';
const vfsAfter = ';';
const sourcePath = process.argv[2];
const vfsFilename = process.argv[3] ? process.argv[3] : './build/vfs_fonts.js';

const vfs = {};

if (sourcePath === undefined) {
	console.error('Usage: node build-vfs.js path [filename]');
	console.log('');
	console.log('Parameters:');
	console.log('  path      Source path with fonts.');
	console.log('  filename  Optional. Output vfs file. Default: ./build/vfs_fonts.js');
	console.log('');
	console.log('Examples:');
	console.log('  node build-vfs.js "examples/fonts"');
	console.log('  node build-vfs.js "examples/fonts" "./build/vfs_fonts.js"');
	//   exit node script
	process.exit(1);
}

if (!fs.existsSync(sourcePath)) {
	console.error('Source path "' + sourcePath + '" not found.');
	process.exit(1);
}

console.log('Source path:', sourcePath);
console.log('');

const files = fs.readdirSync(sourcePath);

files.forEach(function (file) {
	const fileBase64 = fs.readFileSync(sourcePath + '/' + file).toString('base64');
	console.log('FILE:', file);

	// @ts-expect-error ts error
	vfs[file] = fileBase64;
});

const vfsFileContent = vfsBefore + JSON.stringify(vfs, null, 2) + vfsAfter;
fs.writeFileSync(vfsFilename, vfsFileContent);

console.log('');
console.log('Builded ' + files.length + ' files to ' + vfsFilename + '.');
