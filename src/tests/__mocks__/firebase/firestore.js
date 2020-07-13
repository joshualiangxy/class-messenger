import emailToUidCollectionRef from './firestore/emailToUid';
import userCollectionRef from './firestore/users';
import groupCollectionRef from './firestore/groups';

export const collection = jest.fn(collectionName => {
  switch (collectionName) {
    case 'users':
      return userCollectionRef;
    case 'emailToUid':
      return emailToUidCollectionRef;
    case 'groups':
      return groupCollectionRef;
  }
});

export const deleteReturnValue = 'delete';
export const arrayUnionReturnValue = 'arrayUnion';
export const arrayRemoveReturnValue = 'arrayRemove';

export const FieldValue = {
  delete: jest.fn(() => deleteReturnValue),
  arrayUnion: jest.fn(() => arrayUnionReturnValue),
  arrayRemove: jest.fn(() => arrayRemoveReturnValue)
};

const firestore = jest.fn(() => ({ collection }));
firestore.FieldValue = FieldValue;

export default firestore;
