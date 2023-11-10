import { Path } from '../application/Path';
import { getFilesWatcherExcludeObject } from '../application/WatcherExclude';
import { RealFileSystem } from '../application/filesystem/RealFileSystem';

async function main(): Promise<void> {
    const fileSystem = new RealFileSystem();
    const json = await getFilesWatcherExcludeObject(Path.of('.'), fileSystem);
    console.log(json);
}

main().catch(error => console.error(error));
