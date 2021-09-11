import { QuaverMap } from './quavermap';
import extractZip from 'extract-zip';
import { cwd } from 'process';
import { glob } from 'glob';
import { Utils } from '../utils';

export class Mapset {

	maps: Array<QuaverMap>;
	working_dir: string;

	constructor() {
		this.maps = [];
		this.working_dir = '';
	}

	async FromQP(filePath: string): Promise<Mapset> {
		return new Promise((resolve) => {
			
			this.working_dir = cwd() + '/map_working_' + Utils.sanitizeFilename(filePath.split('/').pop()?.split('\\').pop() as string);

			extractZip(filePath, { dir: this.working_dir }).then(() => {
				glob(this.working_dir + '/*.qua', {}, (error, files) => {
					files.forEach((file) => {
						const map: QuaverMap = new QuaverMap().FromQua(file);
						this.maps.push(map);
					});

					resolve(this);
				});
			});			
		});
	}
}