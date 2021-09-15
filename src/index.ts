import { glob } from 'glob';
import { Package } from './package';
import { Utils } from './utils';

async function main(input: string, packName: string, packArtist: string, packCreator: string, diffCrea: boolean, diffName: boolean): Promise<number> {
	const pack: Package = new Package(packName, packArtist, packCreator, diffCrea, diffName);

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
const diffCrea = process.argv[6];
const diffName = process.argv[7];

if(!Utils.isPathFolder(inputArg)) {
	console.log('Please specify an input folder containing all the .qp files as first argument');
	process.exit(1);
}

if(packName == undefined || packName.length<1) {
	console.log('Please specify a name for the pack in 2nd argument');
	process.exit(1);
}

if(packArtist == undefined || packArtist.length<1) {
	console.log('Please specify an artist for the pack in 3rd argument');
	process.exit(1);
}

if(packCreator == undefined || packCreator.length<1) {
	console.log('Please specify a name for the creator in 4th argument');
	process.exit(1);
}

const diffCreaB = diffCrea == undefined ? false : diffCrea == 'true';
const diffNameB = diffName == undefined ? true : diffName == 'true';

main(inputArg, packName, packArtist, packCreator, diffCreaB, diffNameB).then((result: number) => {
	return result;
});