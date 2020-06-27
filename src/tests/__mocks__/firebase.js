import authMock from './firebase/auth';
import firestoreMock from './firebase/firestore';
import storageMock from './firebase/storage';

export const initializeApp = jest.fn();

export const auth = authMock;

export const firestore = firestoreMock;

export const storage = storageMock;
