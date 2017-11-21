import React from 'react';
import { Message } from 'semantic-ui-react';

const NotFound = () => (
  <div className="NotFound">
    <Message negative>
      <p><strong>Error [404]</strong>: {window.location.pathname} does not exist.</p>
    </Message>
  </div>
);

export default NotFound;
