import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

const PublicNavigation = () => (
  <Menu.Menu position="right">
    <Menu.Item key={1} as={Link} to="/signup">Sign Up</Menu.Item>
    <Menu.Item key={2} as={Link} to="/login">Log In</Menu.Item>
  </Menu.Menu>
);

export default PublicNavigation;
