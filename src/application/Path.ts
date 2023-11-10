export class Path {
    value: string;

    private constructor(value: string) {
        this.value = value;
    }

    getDirectory(): Path {
        return Path.of(this.value.split('/').slice(0, -1).join('/'));
    }

    getName(): string {
        return this.value.split('/').slice(-1)[0];
    }

    toString(): string {
        return this.value;
    }

    static of(value: string): Path {
        value = value.replace(/[\\/]+$/, '');
        if (
            !value.startsWith('./') &&
            !value.startsWith('/') &&
            value !== '.' &&
            value !== '..'
        ) {
            value = `./${value}`;
        }
        return new Path(value);
    }
}
