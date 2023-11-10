import { describe, expect, it } from 'vitest';
import { createGitignore } from '../application/Gitignore';
import { Path } from '../application/Path';

describe('Gitignore', () => {
    it('getPathes', () => {
        const gitignore = createGitignore({
            directory: '.',
            lines: [
                'filename.ext',
                '',
                'folder/filename.ext',
                ' ',
                'folder',
                '# comment',
                'glob/**',
                '*.ext',
            ],
        });
        const actual = gitignore.getPathes();
        const expected = [
            Path.of('./filename.ext'),
            Path.of('./folder/filename.ext'),
            Path.of('./folder'),
            Path.of('./glob/**'),
            Path.of('./*.ext'),
        ];
        expect(actual).toEqual(expected);
    });
});
