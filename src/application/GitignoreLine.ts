import { Path } from './Path';

export class GitignoreLine {
    directory: Path;
    line: string;
    ignore: boolean;

    constructor(directory: Path, line: string, ignore: boolean) {
        this.directory = directory;
        this.line = line;
        this.ignore = ignore;
    }

    getDirectory(): Path {
        return this.directory;
    }

    getPath(): Path {
        return Path.of(`${this.directory}/${this.line}`);
    }

    shouldIgnore(): boolean {
        return this.ignore;
    }
}

export function createGitignoreLine({
    directory = '.',
    line,
}: {
    directory?: string;
    line: string;
}): GitignoreLine {
    const ignore = !line.startsWith('!');
    if (line.startsWith('!')) {
        line = line.substring(1);
    }
    return new GitignoreLine(Path.of(directory), line, ignore);
}
