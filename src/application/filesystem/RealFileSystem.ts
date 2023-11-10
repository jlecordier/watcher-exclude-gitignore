import { readFile, readdir } from 'node:fs/promises';
import { Path } from '../Path';
import { FileSystem, FolderSearch } from './FileSystem';

export class RealFileSystem implements FileSystem {
    async listFoldersAndFiles(path: Path): Promise<FolderSearch | null> {
        const filesAndFolders = await readdir(path.value, {
            encoding: 'utf-8',
            recursive: false,
            withFileTypes: true,
        });
        const filesNames: string[] = [];
        const foldersNames: string[] = [];

        filesAndFolders.forEach(node => {
            if (node.isDirectory()) {
                foldersNames.push(node.name);
            } else if (node.isFile()) {
                filesNames.push(node.name);
            }
        });

        return {
            filesNames,
            foldersNames,
        };
    }

    readFile(path: Path): (() => Promise<string[]>) | null {
        return async () => {
            const lines = await readFile(path.value, {
                encoding: 'utf-8',
                flag: 'r',
            });
            return lines.split(/\r?\n/);
        };
    }
}
