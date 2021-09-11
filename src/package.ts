import { Mapset } from './quaver/mapset';
import { QuaverMap } from './quaver/quavermap';
import { cwd } from 'process';
import fs from 'fs';
import { Utils } from './utils';

export class Package {

	packName: string;
	packArtist: string;
	packCreator: string;
	pack: Mapset = new Mapset();

	diffnameCreator: boolean;
	diffnameDifficulty: boolean;

	exportName: string;
	folderName: string;
	queueLeft: number;
	queueEnd: boolean;

	constructor(packName: string, packArtist: string, packCreator: string, diffnameCreator = false, diffnameDifficulty = false) {
		this.queueLeft = 0;
		this.queueEnd = false;
		this.packName = packName;
		this.packArtist = packArtist;
		this.packCreator = packCreator;
		this.diffnameCreator = diffnameCreator;
		this.diffnameDifficulty = diffnameDifficulty;

		this.exportName = packCreator + ' - ' + packName;
		this.folderName = cwd() + '/' + this.exportName;

		fs.rmdirSync(this.folderName, { recursive: true });
		fs.mkdirSync(this.folderName);
	}
	
	addExported(filePath: string, last: boolean): void {
		this.queueLeft++;
		const mapset: Mapset = new Mapset();

		mapset.FromQP(filePath).then((mapset: Mapset) => {
			mapset.maps.forEach((map: QuaverMap) => {
				const mostlyUniqueID = Utils.sanitizeFilename(map.mapData.Artist + '_' + map.mapData.Creator + '_' + map.mapData.Title + '_');
				const baseFilename = this.folderName + '/' + mostlyUniqueID;
				const baseDiffname = Utils.sanitizeFilename(map.mapData.DifficultyName);

				let diffname = map.mapData.Title;
				if(this.diffnameCreator) diffname = map.mapData.Creator + ' - ' + diffname;
				if(this.diffnameDifficulty) diffname += ' [' + map.mapData.DifficultyName + ']';

				fs.copyFileSync(mapset.working_dir + '/' + map.mapData.AudioFile, 		baseFilename + map.mapData.AudioFile);
				fs.copyFileSync(mapset.working_dir + '/' + map.mapData.BackgroundFile, 	baseFilename + map.mapData.BackgroundFile);

				map.mapData.Title = this.packName;
				map.mapData.Artist = this.packArtist;
				map.mapData.Creator = this.packCreator;
				map.mapData.DifficultyName = diffname;
				map.mapData.AudioFile = mostlyUniqueID + map.mapData.AudioFile;
				map.mapData.BackgroundFile = mostlyUniqueID + map.mapData.BackgroundFile;

				map.mapData.MapId = -1;
				map.mapData.MapSetId = -1;

				map.ToQua(baseFilename + baseDiffname + '.qua');

				this.pack.maps.push(map);
			});
			fs.rmdirSync(mapset.working_dir, { recursive: true });

			this.queueLeft--;
			if(last) {
				this.queueEnd = true;
			}
			
			if(this.queueEnd && this.queueLeft == 0) {
				this.toQP();
			}
		});
	}

	toQP(): void {
		Utils.zipDirectory(this.folderName, this.exportName+'.qp').then(() => {
			fs.rmdirSync(this.folderName, { recursive: true });
		});
	}
}