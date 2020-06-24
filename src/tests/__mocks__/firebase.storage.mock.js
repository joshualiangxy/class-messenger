export const item = { delete: jest.fn(() => Promise.resolve()) };

const items = [item, item, item];

const dir = { items };

export const listAll = jest.fn(() => Promise.resolve(dir));

export const put = jest.fn();

export const ref = jest.fn(() => ({ put, listAll }));

const storage = jest.fn(() => ({ ref }));

export default storage;
