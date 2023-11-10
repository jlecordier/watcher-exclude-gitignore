import { describe, expect, it } from 'vitest';
import { createFolder } from '../application/Folder';
import { Gitignore, createGitignore } from '../application/Gitignore';
import {
    FolderSearch,
    createFolderSearch,
} from '../application/filesystem/FileSystem';
import { createStubFileSystem } from '../application/filesystem/StubFileSystem';

describe('Folder', () => {
    describe('getGitignores', () => {
        describe('when there is no .gitignore files', () => {
            it('should return an empty list', async () => {
                const folder = createFolder({
                    path: '.',
                });
                const actual = await folder.getGitignores();
                const expected: Gitignore[] = [];
                expect(actual).toEqual(expected);
            });
        });
        describe('when there is a .gitignore in the folder', () => {
            it('should return a list containing this .gitignore', async () => {
                const lines = [
                    'filename.ext',
                    'folder/filename.ext',
                    'folder',
                    'glob/**',
                    '*.ext',
                ];
                const fileSystem = createStubFileSystem({
                    files: new Map<string, string[]>([['./.gitignore', lines]]),
                });
                const gitignore = createGitignore({
                    directory: '.',
                    lines: lines,
                });
                const folder = createFolder({
                    path: '.',
                    filesNames: ['.gitignore'],
                    fileSystem: fileSystem,
                });
                const actual = await folder.getGitignores();
                const expected: Gitignore[] = [gitignore];
                expect(actual).toEqual(expected);
            });
        });
        describe('when there is a .gitignore in an inner folder', () => {
            it('should return a list containing this .gitignore', async () => {
                const lines = [
                    'filename.ext',
                    'folder/filename.ext',
                    'folder',
                    'glob/**',
                    '*.ext',
                ];
                const fileSystem = createStubFileSystem({
                    files: new Map<string, string[]>([
                        ['./inner/.gitignore', lines],
                    ]),
                    folders: new Map<string, FolderSearch>([
                        [
                            './inner',
                            createFolderSearch({
                                filesNames: ['.gitignore'],
                            }),
                        ],
                    ]),
                });
                const gitignore = createGitignore({
                    directory: './inner',
                    lines: lines,
                });
                const rootFolder = createFolder({
                    path: '.',
                    foldersNames: ['inner'],
                    fileSystem: fileSystem,
                });
                const actual = await rootFolder.getGitignores();
                const expected: Gitignore[] = [gitignore];
                expect(actual).toEqual(expected);
            });
        });
        describe('when there is a .gitignore in an inner inner folder', () => {
            it('should return a list containing this .gitignore', async () => {
                const lines = [
                    'filename.ext',
                    'folder/filename.ext',
                    'folder',
                    'glob/**',
                    '*.ext',
                ];
                const fileSystem = createStubFileSystem({
                    files: new Map<string, string[]>([
                        ['./my/path/.gitignore', lines],
                    ]),
                    folders: new Map<string, FolderSearch>([
                        [
                            './my',
                            createFolderSearch({
                                foldersNames: ['path'],
                            }),
                        ],
                        [
                            './my/path',
                            createFolderSearch({
                                filesNames: ['.gitignore'],
                            }),
                        ],
                    ]),
                });
                const gitignore = createGitignore({
                    directory: './my/path',
                    lines: lines,
                });
                const rootFolder = createFolder({
                    path: '.',
                    foldersNames: ['my'],
                    fileSystem: fileSystem,
                });
                const actual = await rootFolder.getGitignores();
                const expected: Gitignore[] = [gitignore];
                expect(actual).toEqual(expected);
            });
        });
        describe('when there is a .gitignore at every level', () => {
            it('should return a list containing all those .gitignore files', async () => {
                const rootLines = ['filename.ext', 'folder/filename.ext'];
                const innerLines = ['folder'];
                const innerInnerLines = ['glob/**', '*.ext'];
                const fileSystem = createStubFileSystem({
                    files: new Map<string, string[]>([
                        ['./.gitignore', rootLines],
                        ['./my/.gitignore', innerLines],
                        ['./my/path/.gitignore', innerInnerLines],
                    ]),
                    folders: new Map<string, FolderSearch>([
                        [
                            './my',
                            createFolderSearch({
                                foldersNames: ['path'],
                                filesNames: ['.gitignore'],
                            }),
                        ],
                        [
                            './my/path',
                            createFolderSearch({
                                filesNames: ['.gitignore'],
                            }),
                        ],
                    ]),
                });
                const rootGitignore = createGitignore({
                    directory: '.',
                    lines: rootLines,
                });
                const innerGitignore = createGitignore({
                    directory: './my',
                    lines: innerLines,
                });
                const innerInnerGitignore = createGitignore({
                    directory: './my/path',
                    lines: innerInnerLines,
                });
                const rootFolder = createFolder({
                    path: '.',
                    foldersNames: ['my'],
                    filesNames: ['.gitignore'],
                    fileSystem: fileSystem,
                });
                const actual = await rootFolder.getGitignores();
                const expected: Gitignore[] = [
                    rootGitignore,
                    innerGitignore,
                    innerInnerGitignore,
                ];
                expect(actual).toEqual(expected);
            });
        });
    });
});
