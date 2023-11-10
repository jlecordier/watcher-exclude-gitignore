import { describe, expect, it } from 'vitest';
import { Path } from '../application/Path';

describe('Path', () => {
    describe('of', () => {
        describe('when there path is .', () => {
            it('should not modify the path', () => {
                const path = Path.of('.');
                expect(path.value).toBe('.');
            });
        });
        describe('when there path is ..', () => {
            it('should not modify the path', () => {
                const path = Path.of('..');
                expect(path.value).toBe('..');
            });
        });
        describe('when there is no trailing /', () => {
            it('should not modify the path', () => {
                const path = Path.of('./path');
                expect(path.value).toBe('./path');
            });
        });
        describe('when there is one trailing /', () => {
            it('should remove this trailing /', () => {
                const path = Path.of('./path/');
                expect(path.value).toBe('./path');
            });
        });
        describe('when there is multiple trailing /', () => {
            it('should remove those trailing /', () => {
                const path = Path.of('./path//');
                expect(path.value).toBe('./path');
            });
        });
        describe('when the path starts with a ./', () => {
            it('should not modify the path', () => {
                const path = Path.of('./path');
                expect(path.value).toBe('./path');
            });
        });
        describe('when the path starts with a /', () => {
            it('should not modify the path', () => {
                const path = Path.of('/path');
                expect(path.value).toBe('/path');
            });
        });
        describe('when the path does not start with a /', () => {
            it('should start with ./', () => {
                const path = Path.of('path');
                expect(path.value).toBe('./path');
            });
        });
    });
    describe('getDirectory', () => {
        describe('given a full file path', () => {
            it('should return the directory path', () => {
                const path = Path.of('./folder/file.ext');
                expect(path.getDirectory().value).toBe('./folder');
            });
        });
        describe('given a full directory path', () => {
            it('should return the parent directory path', () => {
                const path = Path.of('./my/folder');
                expect(path.getDirectory().value).toBe('./my');
            });
        });
    });
    describe('getName', () => {
        describe('given a full file path', () => {
            it('should return the name with the extension', () => {
                const path = Path.of('./folder/file.ext');
                expect(path.getName()).toBe('file.ext');
            });
        });
        describe('given a full directory path', () => {
            it('should return the name of the directory', () => {
                const path = Path.of('./my/folder');
                expect(path.getName()).toBe('folder');
            });
        });
        describe('given .', () => {
            it('should return .', () => {
                const path = Path.of('.');
                expect(path.getName()).toBe('.');
            });
        });
    });
});
