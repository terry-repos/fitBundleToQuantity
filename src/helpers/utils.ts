import { readFile } from 'fs/promises';

export const parseLinedFile = async (fileAndPath:string) => {
    const parsedFile = await readFile(fileAndPath, {encoding: 'utf8'});
    let splitVals = parsedFile.split(/\r?\n/);  //Be careful if you are in a \r\n world...
    return splitVals;
} 