import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
import { year } from '../../../modules/dates';

import './Footer.scss';

const copyrightYear = () => {
  const currentYear = year();
  return currentYear === '2017' ? '2017' : `2017-${currentYear}`;
};

const Footer = () => (
  <Menu borderless>
    <Menu.Item position="left">&copy; {copyrightYear()} Application Name</Menu.Item>
    <Menu.Menu poition="right">
      <Menu.Item as={Link} to="/terms">Terms of Service</Menu.Item>
      <Menu.Item as={Link} to="/privacy">Privacy Policy</Menu.Item>
    </Menu.Menu>

  </Menu>
);

Footer.propTypes = {};

export default Footer;
