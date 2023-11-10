import { File, createFile } from './File';
import { Gitignore, createGitignore } from './Gitignore';
import { Path } from './Path';
import { FileSystem } from './filesystem/FileSystem';
import { RealFileSystem } from './filesystem/RealFileSystem';

export class Folder {
    fileSystem: FileSystem;
    path: Path;
    filesNames: string[];
    foldersNames: string[];

    constructor(
        fileSystem: FileSystem,
        path: Path,
        filesNames: string[],
        foldersNames: string[],
    ) {
        this.fileSystem = fileSystem;
        this.path = path;
        this.filesNames = filesNames;
        this.foldersNames = foldersNames;
    }

    getPath(): Path {
        return this.path;
    }

    getFilesNames(): string[] {
        return this.filesNames;
    }

    getFilesPathes(): Path[] {
        return this.filesNames.map(fileName =>
            Path.of(`${this.path}/${fileName}`),
        );
    }

    getFiles(): File[] {
        return this.getFilesPathes()
            .map(path => {
                const linesGetter = this.fileSystem.readFile(path);
                if (!linesGetter) {
                    return null;
                }
                return createFile({
                    path: path,
                    linesGetter: linesGetter,
                });
            })
            .filter((f): f is File => !!f);
    }

    async getGitignores(): Promise<Gitignore[]> {
        const gitignoresFiles = this.getFiles().filter(f => f.isGitignore());
        const gitignores = await Promise.all(
            gitignoresFiles.map(async g =>
                createGitignore({
                    directory: g.getDirectory().value,
                    lines: await g.getLines(),
                }),
            ),
        );
        const folders = await this.getFolders();
        return [
            ...gitignores,
            ...(await Promise.all(folders.map(f => f.getGitignores()))).flat(),
        ];
    }

    getFoldersNames(): string[] {
        return this.foldersNames;
    }

    getFoldersPathes(): Path[] {
        return this.foldersNames.map(folderName =>
            Path.of(`${this.path}/${folderName}`),
        );
    }

    async getFolders(): Promise<Folder[]> {
        const folders = await Promise.all(
            this.getFoldersPathes().map(async path => {
                const search = await this.fileSystem.listFoldersAndFiles(path);
                if (!search) {
                    return null;
                }
                const { filesNames, foldersNames } = search;
                return createFolder({
                    path: path.value,
                    filesNames: filesNames,
                    foldersNames: foldersNames,
                    fileSystem: this.fileSystem,
                });
            }),
        );
        return folders.filter((f): f is Folder => !!f);
    }
}

export function createFolder({
    fileSystem = new RealFileSystem(),
    path,
    filesNames = [],
    foldersNames = [],
}: {
    fileSystem?: FileSystem;
    path: string;
    filesNames?: string[];
    foldersNames?: string[];
}): Folder {
    return new Folder(fileSystem, Path.of(path), filesNames, foldersNames);
}
