export const emailToUidDoc = jest.fn(docName => {
  switch (docName) {
    case 'email':
      return emailToUidDocRefExists;
    default:
      return emailToUidDocRef;
  }
});

export const emailToUidDocSet = jest.fn(() => Promise.resolve());

export const emailToUidDocExistsData = jest.fn(() => {
  return {
    uid: 'testuid'
  };
});

export const emailToUidDocExistsGet = jest.fn(() => {
  return Promise.resolve({
    exists: true,
    data: emailToUidDocExistsData
  });
});

export const emailToUidDocGet = jest.fn(() => {
  return Promise.resolve({
    exists: false
  })
})

// This email doesn't exist
const emailToUidDocRef = { set: emailToUidDocSet, get: emailToUidDocGet };

// This email exists in firestore
const emailToUidDocRefExists = {
  set: emailToUidDocSet,
  get: emailToUidDocExistsGet
};

const emailToUidCollectionRef = { doc: emailToUidDoc };

export default emailToUidCollectionRef;
