import yaml from 'js-yaml';
import fs from 'fs';
import { QuaverMapFormat } from './quavermapformat';

export class QuaverMap {

	mapData: QuaverMapFormat;

	constructor() {
		this.mapData = new QuaverMapFormat();
	}

	FromQua(filePath: string): QuaverMap {
		this.mapData = JSON.parse(JSON.stringify(yaml.loadAll(fs.readFileSync(filePath, 'utf-8')), null, 4))[0] as QuaverMapFormat;
		return this;
	}

	ToQua(writePath: string): void {
		fs.writeFileSync(writePath,yaml.dump(this.mapData, {}));
	}
}