import { Path } from '../Path';
import { RealFileSystem } from './RealFileSystem';

async function main(): Promise<void> {
    const fileSystem = new RealFileSystem();
    const search = await fileSystem.listFoldersAndFiles(Path.of('.'));
    const linesGetter = fileSystem.readFile(Path.of('./.gitignore'));
    const lines = linesGetter ? await linesGetter() : [];
    console.log(search);
    console.log(lines);
}

main().catch(error => console.error(error));
