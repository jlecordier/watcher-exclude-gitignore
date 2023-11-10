import { Path } from '../Path';
import { FileSystem, FolderSearch } from './FileSystem';

export class StubFileSystem implements FileSystem {
    folders: Map<string, FolderSearch>;
    files: Map<string, string[]>;

    constructor(
        folders: Map<string, FolderSearch>,
        files: Map<string, string[]>,
    ) {
        this.folders = folders;
        this.files = files;
    }

    listFoldersAndFiles(path: Path): Promise<FolderSearch | null> {
        return Promise.resolve(this.folders.get(path.value) ?? null);
    }

    readFile(path: Path): (() => Promise<string[]>) | null {
        const lines = this.files.get(path.value);
        return lines ? () => Promise.resolve(lines) : null;
    }
}

export function createStubFileSystem({
    folders = new Map<string, FolderSearch>(),
    files = new Map<string, string[]>(),
}: {
    folders?: Map<string, FolderSearch>;
    files?: Map<string, string[]>;
} = {}): StubFileSystem {
    return new StubFileSystem(folders, files);
}
