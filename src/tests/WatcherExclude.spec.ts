import { describe, expect, it } from 'vitest';
import { createFolder } from '../application/Folder';
import { createGitignore } from '../application/Gitignore';
import { createGitignoreLine } from '../application/GitignoreLine';
import { Path } from '../application/Path';
import {
    getExcludeLine,
    getExcludesLines,
    getExcludesLinesFromFolder,
    getExcludesLinesFromGitignore,
    getExcludesLinesFromPath,
    getFilesWatcherExcludeObject,
} from '../application/WatcherExclude';
import {
    FolderSearch,
    createFolderSearch,
} from '../application/filesystem/FileSystem';
import { createStubFileSystem } from '../application/filesystem/StubFileSystem';

describe('WatcherExclude', () => {
    describe('getExcludeLine', () => {
        describe('given a file with no depth', () => {
            describe('when the line should be ignored', () => {
                it('should return a line ready to be pasted', () => {
                    const actual = getExcludeLine(
                        createGitignoreLine({ line: 'filename.ext' }),
                    );
                    const expected = '        "./filename.ext": true,';
                    expect(actual).toBe(expected);
                });
            });
            describe('when the line should not be ignored', () => {
                it('should return a line ready to be pasted', () => {
                    const actual = getExcludeLine(
                        createGitignoreLine({ line: '!filename.ext' }),
                    );
                    const expected = '        "./filename.ext": false,';
                    expect(actual).toBe(expected);
                });
            });
        });
        describe('given a file with a depth of one', () => {
            it('should return a line ready to be pasted', () => {
                const actual = getExcludeLine(
                    createGitignoreLine({ line: 'folder/filename.ext' }),
                );
                const expected = '        "./folder/filename.ext": true,';
                expect(actual).toBe(expected);
            });
        });
        describe('given a file with a depth of two', () => {
            it('should return a line ready to be pasted', () => {
                const actual = getExcludeLine(
                    createGitignoreLine({ line: 'my/path/filename.ext' }),
                );
                const expected = '        "./my/path/filename.ext": true,';
                expect(actual).toBe(expected);
            });
        });
        describe('given a folder with no depth', () => {
            it('should return a line ready to be pasted', () => {
                const actual = getExcludeLine(
                    createGitignoreLine({ line: 'folder' }),
                );
                const expected = '        "./folder": true,';
                expect(actual).toBe(expected);
            });
        });
        describe('given a folder with a depth of one', () => {
            it('should return a line ready to be pasted', () => {
                const actual = getExcludeLine(
                    createGitignoreLine({ line: 'my/folder' }),
                );
                const expected = '        "./my/folder": true,';
                expect(actual).toBe(expected);
            });
        });
        describe('given a folder with a depth of two', () => {
            it('should return a line ready to be pasted', () => {
                const actual = getExcludeLine(
                    createGitignoreLine({ line: 'my/folder/path' }),
                );
                const expected = '        "./my/folder/path": true,';
                expect(actual).toBe(expected);
            });
        });
        describe('given a ** glob with a depth of one', () => {
            it('should return a line ready to be pasted', () => {
                const actual = getExcludeLine(
                    createGitignoreLine({ line: 'glob/**' }),
                );
                const expected = '        "./glob/**": true,';
                expect(actual).toBe(expected);
            });
        });
        describe('given a *.ext glob with no depth', () => {
            it('should return a line ready to be pasted', () => {
                const actual = getExcludeLine(
                    createGitignoreLine({ line: '*.ext' }),
                );
                const expected = '        "./*.ext": true,';
                expect(actual).toBe(expected);
            });
        });
    });
    describe('getExcludesLines', () => {
        describe('given a list of lines', () => {
            it('should return a list of lines ready to be pasted', () => {
                const actual = getExcludesLines([
                    createGitignoreLine({ line: '!filename.ext' }),
                    createGitignoreLine({ line: '!folder/filename.ext' }),
                    createGitignoreLine({ line: 'folder' }),
                    createGitignoreLine({ line: 'glob/**' }),
                    createGitignoreLine({ line: '*.ext' }),
                ]);
                const expected = [
                    '        "./filename.ext": false,',
                    '        "./folder/filename.ext": false,',
                    '        "./folder": true,',
                    '        "./glob/**": true,',
                    '        "./*.ext": true,',
                ];
                expect(actual).toEqual(expected);
            });
        });
    });
    describe('getExcludesLinesFromGitignore', () => {
        describe('given a Gitignore file', () => {
            describe('when the directory is the root', () => {
                it('should return a list of lines ready to be pasted', () => {
                    const gitignore = createGitignore({
                        directory: '.',
                        lines: [
                            '!filename.ext',
                            '',
                            '!folder/filename.ext',
                            ' ',
                            'folder',
                            '# comment',
                            'glob/**',
                            '*.ext',
                        ],
                    });
                    const actual = getExcludesLinesFromGitignore(gitignore);
                    const expected = [
                        '        "./filename.ext": false,',
                        '        "./folder/filename.ext": false,',
                        '        "./folder": true,',
                        '        "./glob/**": true,',
                        '        "./*.ext": true,',
                    ];
                    expect(actual).toEqual(expected);
                });
            });
            describe('when the directory has depth', () => {
                it('should return a list of lines ready to be pasted', () => {
                    const gitignore = createGitignore({
                        directory: './my/path',
                        lines: [
                            '!filename.ext',
                            '',
                            '!folder/filename.ext',
                            ' ',
                            'folder',
                            '# comment',
                            'glob/**',
                            '*.ext',
                        ],
                    });
                    const actual = getExcludesLinesFromGitignore(gitignore);
                    const expected = [
                        '        "./my/path/filename.ext": false,',
                        '        "./my/path/folder/filename.ext": false,',
                        '        "./my/path/folder": true,',
                        '        "./my/path/glob/**": true,',
                        '        "./my/path/*.ext": true,',
                    ];
                    expect(actual).toEqual(expected);
                });
            });
        });
    });
    describe('getExcludesLinesFromFolder', () => {
        describe('given a folder containing no .gitignore', () => {
            it('should return an empty list', async () => {
                const folder = createFolder({
                    path: '.',
                });
                const actual = await getExcludesLinesFromFolder(folder);
                const expected: string[] = [];
                expect(actual).toEqual(expected);
            });
        });
        describe('given a folder containing a .gitignore', () => {
            it('should return a list of lines ready to be pasted', async () => {
                const fileSystem = createStubFileSystem({
                    files: new Map<string, string[]>([
                        [
                            './.gitignore',
                            [
                                '!filename.ext',
                                '',
                                '!folder/filename.ext',
                                ' ',
                                'folder',
                                '# comment',
                                'glob/**',
                                '*.ext',
                            ],
                        ],
                    ]),
                });
                const folder = createFolder({
                    path: '.',
                    filesNames: ['.gitignore'],
                    fileSystem: fileSystem,
                });
                const actual = await getExcludesLinesFromFolder(folder);
                const expected = [
                    '        "./filename.ext": false,',
                    '        "./folder/filename.ext": false,',
                    '        "./folder": true,',
                    '        "./glob/**": true,',
                    '        "./*.ext": true,',
                ];
                expect(actual).toEqual(expected);
            });
        });
        describe('given a folder containing a folder containing a .gitignore', () => {
            it('should return a list of lines ready to be pasted', async () => {
                const fileSystem = createStubFileSystem({
                    files: new Map<string, string[]>([
                        [
                            './inner/.gitignore',
                            [
                                '!filename.ext',
                                '',
                                '!folder/filename.ext',
                                ' ',
                                'folder',
                                '# comment',
                                'glob/**',
                                '*.ext',
                            ],
                        ],
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
                const rootFolder = createFolder({
                    path: '.',
                    foldersNames: ['inner'],
                    fileSystem: fileSystem,
                });
                const actual = await getExcludesLinesFromFolder(rootFolder);
                const expected = [
                    '        "./inner/filename.ext": false,',
                    '        "./inner/folder/filename.ext": false,',
                    '        "./inner/folder": true,',
                    '        "./inner/glob/**": true,',
                    '        "./inner/*.ext": true,',
                ];
                expect(actual).toEqual(expected);
            });
        });
        describe('given a folder containing a folder containing a folder containing a .gitignore', () => {
            it('should return a list of lines ready to be pasted', async () => {
                const fileSystem = createStubFileSystem({
                    files: new Map<string, string[]>([
                        [
                            './my/path/.gitignore',
                            [
                                '!filename.ext',
                                '',
                                '!folder/filename.ext',
                                ' ',
                                'folder',
                                '# comment',
                                'glob/**',
                                '*.ext',
                            ],
                        ],
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
                const rootFolder = createFolder({
                    path: '.',
                    foldersNames: ['my'],
                    fileSystem: fileSystem,
                });
                const actual = await getExcludesLinesFromFolder(rootFolder);
                const expected = [
                    '        "./my/path/filename.ext": false,',
                    '        "./my/path/folder/filename.ext": false,',
                    '        "./my/path/folder": true,',
                    '        "./my/path/glob/**": true,',
                    '        "./my/path/*.ext": true,',
                ];
                expect(actual).toEqual(expected);
            });
        });
        describe('given .gitignore files at every level', () => {
            it('should return a list of lines ready to be pasted', async () => {
                const fileSystem = createStubFileSystem({
                    files: new Map<string, string[]>([
                        [
                            './.gitignore',
                            ['!filename.ext', '!folder/filename.ext'],
                        ],
                        ['./my/.gitignore', ['folder']],
                        ['./my/path/.gitignore', ['glob/**', '*.ext']],
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
                const rootFolder = createFolder({
                    path: '.',
                    foldersNames: ['my'],
                    filesNames: ['.gitignore'],
                    fileSystem: fileSystem,
                });
                const actual = await getExcludesLinesFromFolder(rootFolder);
                const expected = [
                    '        "./filename.ext": false,',
                    '        "./folder/filename.ext": false,',
                    '        "./my/folder": true,',
                    '        "./my/path/glob/**": true,',
                    '        "./my/path/*.ext": true,',
                ];
                expect(actual).toEqual(expected);
            });
        });
    });
    describe('getExcludesLinesFromPath', () => {
        describe('given a folder containing no .gitignore', () => {
            it('should return an empty list', async () => {
                const fileSystem = createStubFileSystem({
                    folders: new Map<string, FolderSearch>([
                        ['.', createFolderSearch()],
                    ]),
                });
                const actual = await getExcludesLinesFromPath(
                    Path.of('.'),
                    fileSystem,
                );
                const expected: string[] = [];
                expect(actual).toEqual(expected);
            });
        });
        describe('given a folder containing a .gitignore', () => {
            it('should return a list of lines ready to be pasted', async () => {
                const fileSystem = createStubFileSystem({
                    files: new Map<string, string[]>([
                        [
                            './.gitignore',
                            [
                                '!filename.ext',
                                '!folder/filename.ext',
                                'folder',
                                'glob/**',
                                '*.ext',
                            ],
                        ],
                    ]),
                    folders: new Map<string, FolderSearch>([
                        [
                            '.',
                            createFolderSearch({
                                filesNames: ['.gitignore'],
                            }),
                        ],
                    ]),
                });
                const actual = await getExcludesLinesFromPath(
                    Path.of('.'),
                    fileSystem,
                );
                const expected = [
                    '        "./filename.ext": false,',
                    '        "./folder/filename.ext": false,',
                    '        "./folder": true,',
                    '        "./glob/**": true,',
                    '        "./*.ext": true,',
                ];
                expect(actual).toEqual(expected);
            });
        });
        describe('given a folder containing a folder containing a .gitignore', () => {
            it('should return a list of lines ready to be pasted', async () => {
                const fileSystem = createStubFileSystem({
                    files: new Map<string, string[]>([
                        [
                            './inner/.gitignore',
                            [
                                '!filename.ext',
                                '!folder/filename.ext',
                                'folder',
                                'glob/**',
                                '*.ext',
                            ],
                        ],
                    ]),
                    folders: new Map<string, FolderSearch>([
                        [
                            '.',
                            createFolderSearch({
                                foldersNames: ['inner'],
                            }),
                        ],
                        [
                            './inner',
                            createFolderSearch({
                                filesNames: ['.gitignore'],
                            }),
                        ],
                    ]),
                });
                const actual = await getExcludesLinesFromPath(
                    Path.of('.'),
                    fileSystem,
                );
                const expected = [
                    '        "./inner/filename.ext": false,',
                    '        "./inner/folder/filename.ext": false,',
                    '        "./inner/folder": true,',
                    '        "./inner/glob/**": true,',
                    '        "./inner/*.ext": true,',
                ];
                expect(actual).toEqual(expected);
            });
        });
        describe('given a folder containing a folder containing a folder containing a .gitignore', () => {
            it('should return a list of lines ready to be pasted', async () => {
                const fileSystem = createStubFileSystem({
                    files: new Map<string, string[]>([
                        [
                            './my/path/.gitignore',
                            [
                                '!filename.ext',
                                '!folder/filename.ext',
                                'folder',
                                'glob/**',
                                '*.ext',
                            ],
                        ],
                    ]),
                    folders: new Map<string, FolderSearch>([
                        [
                            '.',
                            createFolderSearch({
                                foldersNames: ['my'],
                            }),
                        ],
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
                const actual = await getExcludesLinesFromPath(
                    Path.of('.'),
                    fileSystem,
                );
                const expected = [
                    '        "./my/path/filename.ext": false,',
                    '        "./my/path/folder/filename.ext": false,',
                    '        "./my/path/folder": true,',
                    '        "./my/path/glob/**": true,',
                    '        "./my/path/*.ext": true,',
                ];
                expect(actual).toEqual(expected);
            });
        });
        describe('given .gitignore files at every level', () => {
            it('should return a list of lines ready to be pasted', async () => {
                const fileSystem = createStubFileSystem({
                    files: new Map<string, string[]>([
                        [
                            './.gitignore',
                            ['!filename.ext', '!folder/filename.ext'],
                        ],
                        ['./my/.gitignore', ['folder']],
                        ['./my/path/.gitignore', ['glob/**', '*.ext']],
                    ]),
                    folders: new Map<string, FolderSearch>([
                        [
                            '.',
                            createFolderSearch({
                                foldersNames: ['my'],
                                filesNames: ['.gitignore'],
                            }),
                        ],
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
                const actual = await getExcludesLinesFromPath(
                    Path.of('.'),
                    fileSystem,
                );
                const expected = [
                    '        "./filename.ext": false,',
                    '        "./folder/filename.ext": false,',
                    '        "./my/folder": true,',
                    '        "./my/path/glob/**": true,',
                    '        "./my/path/*.ext": true,',
                ];
                expect(actual).toEqual(expected);
            });
        });
    });
    describe('getFilesWatcherExcludeObject', () => {
        describe('given .gitignore files at every level', () => {
            it('should return a JSON ready to be pasted', async () => {
                const fileSystem = createStubFileSystem({
                    files: new Map<string, string[]>([
                        [
                            './.gitignore',
                            ['!filename.ext', '!folder/filename.ext'],
                        ],
                        ['./my/.gitignore', ['folder']],
                        ['./my/path/.gitignore', ['glob/**', '*.ext']],
                    ]),
                    folders: new Map<string, FolderSearch>([
                        [
                            '.',
                            createFolderSearch({
                                foldersNames: ['my'],
                                filesNames: ['.gitignore'],
                            }),
                        ],
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
                const actual = await getFilesWatcherExcludeObject(
                    Path.of('.'),
                    fileSystem,
                );
                const expected = `
{
    "files.watcherExclude": {
        "./filename.ext": false,
        "./folder/filename.ext": false,
        "./my/folder": true,
        "./my/path/glob/**": true,
        "./my/path/*.ext": true,
    }
}
`;
                expect(actual).toEqual(expected);
            });
        });
    });
});
