import { Path } from './Path';

export class File {
    directory: Path;
    name: string;
    linesGetter: () => Promise<string[]>;

    constructor(
        directory: Path,
        name: string,
        linesGetter: () => Promise<string[]>,
    ) {
        this.directory = directory;
        this.name = name;
        this.linesGetter = linesGetter;
    }

    getDirectory(): Path {
        return this.directory;
    }

    getName(): string {
        return this.name;
    }

    getLines(): Promise<string[]> {
        return this.linesGetter();
    }

    isGitignore(): boolean {
        return this.getName() === '.gitignore';
    }
}

export function createFile({
    path,
    linesGetter = () => Promise.resolve([]),
}: {
    path: Path;
    linesGetter?: () => Promise<string[]>;
}): File {
    const directory = path.getDirectory();
    const name = path.getName();
    return new File(directory, name, linesGetter);
}
