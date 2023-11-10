import { describe, expect, it } from 'vitest';
import { createGitignore } from '../application/Gitignore';
import { createGitignoreLine } from '../application/GitignoreLine';

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
        const actual = gitignore.getLines();
        const expected = [
            createGitignoreLine({ line: 'filename.ext' }),
            createGitignoreLine({ line: 'folder/filename.ext' }),
            createGitignoreLine({ line: 'folder' }),
            createGitignoreLine({ line: 'glob/**' }),
            createGitignoreLine({ line: '*.ext' }),
        ];
        expect(actual).toEqual(expected);
    });
});
