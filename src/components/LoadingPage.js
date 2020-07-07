import React from 'react';

const LoadingPage = () => (
  <div className="box-layout">
    <div className="loader">
      <img className="loader__image" src="/images/loader.svg" />
      <p className="loader__text">
        This loading gif is provided by{' '}
        <a href="https://loading.io/">loading.io</a>
      </p>
    </div>
  </div>
);

export default LoadingPage;
