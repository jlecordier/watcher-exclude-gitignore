import { describe, expect, it } from 'vitest';
import { createGitignoreLine } from '../application/GitignoreLine';

describe('GitignoreLine', () => {
    describe('createGitignoreLine', () => {
        describe('when the path should be ignored', () => {
            it('should be correctly ignored', () => {
                const gitignoreLine = createGitignoreLine({
                    line: 'filename.ext',
                });
                expect(gitignoreLine.getPath().value).toEqual('./filename.ext');
                expect(gitignoreLine.shouldIgnore()).toBeTruthy();
            });
        });
        describe('when the path should not be ignored', () => {
            it('should not ignore the path', () => {
                const gitignoreLine = createGitignoreLine({
                    line: '!filename.ext',
                });
                expect(gitignoreLine.getPath().value).toEqual('./filename.ext');
                expect(gitignoreLine.shouldIgnore()).toBeFalsy();
            });
        });
        describe('given a directory', () => {
            it('should return a path containing the directory', () => {
                const gitignoreLine = createGitignoreLine({
                    directory: './folder',
                    line: '!filename.ext',
                });
                expect(gitignoreLine.getPath().value).toEqual(
                    './folder/filename.ext',
                );
                expect(gitignoreLine.shouldIgnore()).toBeFalsy();
            });
        });
    });
});
