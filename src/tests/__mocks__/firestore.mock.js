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

const firestore = jest.fn(() => ({ collection }));

export default firestore;
