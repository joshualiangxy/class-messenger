import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div>
    <h2>Nothing here to look at</h2>
    <Link to="/" />
  </div>
);

export default NotFoundPage;
