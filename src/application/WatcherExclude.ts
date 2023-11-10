import { Folder, createFolder } from './Folder';
import { Gitignore } from './Gitignore';
import { Path } from './Path';
import { FileSystem } from './filesystem/FileSystem';

export function getExcludeLine(path: Path): string {
    return `        "${path}": true,`;
}

export function getExcludesLines(pathes: Path[]): string[] {
    return pathes.map(getExcludeLine);
}

export function getExcludesLinesFromGitignore(gitignore: Gitignore): string[] {
    return getExcludesLines(gitignore.getPathes());
}

export async function getExcludesLinesFromFolder(
    folder: Folder,
): Promise<string[]> {
    const gitignores = await folder.getGitignores();
    return gitignores.flatMap(getExcludesLinesFromGitignore);
}

export async function getExcludesLinesFromPath(
    path: Path,
    fileSystem: FileSystem,
): Promise<string[]> {
    const search = await fileSystem.listFoldersAndFiles(path);
    if (!search) {
        return [];
    }
    const { filesNames, foldersNames } = search;
    const folder = createFolder({
        path: path.value,
        filesNames: filesNames,
        foldersNames: foldersNames,
        fileSystem: fileSystem,
    });
    return getExcludesLinesFromFolder(folder);
}

export async function getFilesWatcherExcludeObject(
    path: Path,
    fileSystem: FileSystem,
): Promise<string> {
    const lines = await getExcludesLinesFromPath(path, fileSystem);
    return `
{
    "files.watcherExclude": {
${lines.join('\n')}
    }
}
`;
}
