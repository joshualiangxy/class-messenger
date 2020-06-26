export const data = 'data';

export const blob = new Blob();

export const mockGenerateAsync = jest.fn(() => Promise.resolve(blob));

export const mockFile = jest.fn();

const JSZip = jest.fn(() => ({
  file: mockFile,
  generateAsync: mockGenerateAsync
}));

export default JSZip;
