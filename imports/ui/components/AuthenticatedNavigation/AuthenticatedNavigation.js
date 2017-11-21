import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { Menu, Dropdown } from 'semantic-ui-react';

const AuthenticatedNavigation = ({ name, history }) => (
  [
    <Menu.Item as={Link} key={1} to="/documents">Documents</Menu.Item>,
    <Menu.Menu key={2} position="right">
      <Dropdown item text={name}>
        <Dropdown.Menu>
          <Dropdown.Item as={Link} to="/profile" text="Profile" />
          <Dropdown.Divider />
          <Dropdown.Item onClick={() => history.push('/logout')} text="Logout" />
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Menu>,
  ]
);

AuthenticatedNavigation.propTypes = {
  name: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(AuthenticatedNavigation);
