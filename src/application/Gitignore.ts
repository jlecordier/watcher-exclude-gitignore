import { Path } from './Path';

export class Gitignore {
    directory: Path;
    lines: string[];

    constructor(directory: Path, lines: string[]) {
        this.directory = directory;
        this.lines = lines;
    }

    getDirectory(): Path {
        return this.directory;
    }

    getLines(): string[] {
        return this.lines;
    }

    getPathes(): Path[] {
        return this.getLines()
            .map(l => l.trim())
            .filter(l => !!l && !l.startsWith('#'))
            .map(line => Path.of(`${this.getDirectory()}/${line}`));
    }
}

export function createGitignore({
    directory = '.',
    lines = [],
}: {
    directory?: string;
    lines?: string[];
} = {}): Gitignore {
    return new Gitignore(Path.of(directory), lines);
}
