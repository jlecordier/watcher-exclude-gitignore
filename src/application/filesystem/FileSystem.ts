import { Path } from '../Path';

export interface FolderSearch {
    filesNames: string[];
    foldersNames: string[];
}

export function createFolderSearch({
    filesNames = [],
    foldersNames = [],
}: {
    filesNames?: string[];
    foldersNames?: string[];
} = {}): FolderSearch {
    return {
        filesNames: filesNames,
        foldersNames: foldersNames,
    };
}

export interface FileSystem {
    listFoldersAndFiles(path: Path): Promise<FolderSearch | null>;
    readFile(path: Path): (() => Promise<string[]>) | null;
}
