import archiver from 'archiver';
import fs from 'fs';

export class Utils {
	static sanitizeFilename(filename: string): string {
		return filename.replace(/[^a-z0-9]/gi, '_').toLowerCase();
	}

	static zipDirectory(source: string, out: string): Promise<void> {
		const archive = archiver('zip', { zlib: { level: 9 }});
		const stream = fs.createWriteStream(out);

		return new Promise<void>((resolve, reject) => {
			archive
				.directory(source, false)
				.on('error', err => reject(err))
				.pipe(stream);

			stream.on('close', () => resolve());
			archive.finalize();
		});
	}

	static isPathFolder(path: string): boolean {
		return fs.lstatSync(path).isDirectory();
	}
}