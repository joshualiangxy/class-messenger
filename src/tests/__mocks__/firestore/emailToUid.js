export const emailToUidDoc = jest.fn(() => emailToUidDocRef);

export const emailToUidDocSet = jest.fn(() => Promise.resolve());

const emailToUidDocRef = { set: emailToUidDocSet };

const emailToUidCollectionRef = { doc: emailToUidDoc };

export default emailToUidCollectionRef;
