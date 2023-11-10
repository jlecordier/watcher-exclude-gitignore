import { Path } from '../application/Path';
import { getFilesWatcherExcludeObject } from '../application/WatcherExclude';
import {
    FolderSearch,
    createFolderSearch,
} from '../application/filesystem/FileSystem';
import { createStubFileSystem } from '../application/filesystem/StubFileSystem';

async function main(): Promise<void> {
    const fileSystem = createStubFileSystem({
        files: new Map<string, string[]>([
            ['./.gitignore', ['filename.ext', 'folder/filename.ext']],
            ['./my/.gitignore', ['folder']],
            ['./my/path/.gitignore', ['glob/**', '*.ext']],
        ]),
        folders: new Map<string, FolderSearch>([
            [
                '.',
                createFolderSearch({
                    foldersNames: ['my'],
                    filesNames: ['.gitignore'],
                }),
            ],
            [
                './my',
                createFolderSearch({
                    foldersNames: ['path'],
                    filesNames: ['.gitignore'],
                }),
            ],
            [
                './my/path',
                createFolderSearch({
                    filesNames: ['.gitignore'],
                }),
            ],
        ]),
    });
    const json = await getFilesWatcherExcludeObject(Path.of('.'), fileSystem);
    console.log(json);
}

main().catch(error => console.error(error));
