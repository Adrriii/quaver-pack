import { glob } from 'glob';
import { Package } from './package';
import { cwd } from 'process';
import { Utils } from './utils';
import { systemPreferences } from 'electron';

async function main(input: string, packName: string, packArtist: string, packCreator: string): Promise<number> {
	const pack: Package = new Package(packName, packArtist, packCreator, false, true);

	glob(input + '/*.qp',	{}, (error, qpFiles) => {
		let i: number = qpFiles.length - 1;
		qpFiles.forEach((qpFile) => {
			pack.addExported(qpFile, i==0);
			i--;
		});
	});
	
	return 0;
}

const inputArg = process.argv[2];
const packName = process.argv[3];
const packArtist = process.argv[4];
const packCreator = process.argv[5];

if(!Utils.isPathFolder(inputArg)) {
	console.log('Please specify an input folder containing all the .qp files as first argument');
	process.exit(1);
}

main(inputArg, packName, packArtist, packCreator).then((result: number) => {
	return result;
});