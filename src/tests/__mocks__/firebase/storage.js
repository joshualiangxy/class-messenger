export const itemOne = { delete: jest.fn(() => Promise.resolve()) };

export const itemTwo = { delete: jest.fn(() => Promise.resolve()) };

export const itemThree = { delete: jest.fn(() => Promise.resolve()) };

const items = [itemOne, itemTwo, itemThree];

export const prefixOne = { name: 'folderOne' };

export const prefixTwo = { name: 'folderTwo' };

export const prefixThree = { name: 'folderThree' };

const prefixes = [prefixOne, prefixTwo, prefixThree];

const dir = { items, prefixes };

export const listAll = jest.fn(() => Promise.resolve(dir));

export const put = jest.fn();

export const ref = jest.fn(() => ({ put, listAll }));

const storage = jest.fn(() => ({ ref }));

export default storage;
