import { GitignoreLine, createGitignoreLine } from './GitignoreLine';
import { Path } from './Path';

export class Gitignore {
    directory: Path;
    lines: GitignoreLine[];

    constructor(directory: Path, lines: GitignoreLine[]) {
        this.directory = directory;
        this.lines = lines;
    }

    getDirectory(): Path {
        return this.directory;
    }

    getLines(): GitignoreLine[] {
        return this.lines;
    }
}

export function createGitignore({
    directory = '.',
    lines = [],
}: {
    directory?: string;
    lines?: string[];
} = {}): Gitignore {
    return new Gitignore(
        Path.of(directory),
        lines
            .map(l => l.trim())
            .filter(l => !!l && !l.startsWith('#'))
            .map(line => createGitignoreLine({ directory, line })),
    );
}
