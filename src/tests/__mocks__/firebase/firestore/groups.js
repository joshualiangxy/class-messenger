import user from '../../../fixtures/user';
import groupOneDocRef from './groupCollections/groupOne';
import groupTwoDocRef from './groupCollections/groupTwo';
import groupThreeDocRef from './groupCollections/groupThree';

export const groupDoc = jest.fn(gid => {
  switch (gid) {
    case user.groups[0]:
      return groupOneDocRef;
    case user.groups[1]:
      return groupTwoDocRef;
    case user.groups[2]:
      return groupThreeDocRef;
  }
});

const groupCollectionRef = { doc: groupDoc };

export default groupCollectionRef;
