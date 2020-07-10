import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="box-layout">
    <div className="box-layout__box">
      <h1 className="box-layout__title">Page not found</h1>
      <Link className="button" to="/">
        Home
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
