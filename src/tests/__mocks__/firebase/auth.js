const { auth: actualAuth } = jest.requireActual('firebase');

const signInWithPopup = jest.fn(() => Promise.resolve());

const signOut = jest.fn(() => Promise.resolve());

const GoogleAuthProvider = actualAuth.GoogleAuthProvider;

const auth = jest.fn(() => ({ signInWithPopup, signOut }));

auth.GoogleAuthProvider = GoogleAuthProvider;

export { auth as default, signInWithPopup, signOut };
