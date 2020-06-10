const signInWithPopup = jest.fn(() => Promise.resolve());

const signOut = jest.fn(() => Promise.resolve());

const resetAuth = () => {
  signInWithPopup.mockClear();
  signOut.mockClear();
  auth.mockClear();
};

const auth = jest.fn(() => ({ signInWithPopup, signOut }));

export { auth as default, signInWithPopup, signOut, resetAuth };
