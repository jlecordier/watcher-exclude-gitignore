import { Folder, createFolder } from './Folder';
import { Gitignore } from './Gitignore';
import { GitignoreLine } from './GitignoreLine';
import { Path } from './Path';
import { FileSystem } from './filesystem/FileSystem';

export function getExcludeLine(line: GitignoreLine): string {
    return `        "${line.getPath().value}": ${line
        .shouldIgnore()
        .toString()},`;
}

export function getExcludesLines(line: GitignoreLine[]): string[] {
    return line.map(getExcludeLine);
}

export function getExcludesLinesFromGitignore(gitignore: Gitignore): string[] {
    return getExcludesLines(gitignore.getLines());
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
