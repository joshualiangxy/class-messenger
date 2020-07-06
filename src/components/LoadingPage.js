import React from 'react';

const LoadingPage = () => (
  <div className="loader">
    <img className="loader__image" src="/images/loader.gif" />
    <p>
      This loading gif is provided by{' '}
      <a href="https://loading.io/">loading.io</a>
    </p>
  </div>
);

export default LoadingPage;
