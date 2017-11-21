import React from 'react';
import PropTypes from 'prop-types';
import { Message, Label, Container, Icon } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';

import './VerifyEmailAlert.scss';

const handleResendVerificationEmail = (emailAddress) => {
  Meteor.call('users.sendVerificationEmail', (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert(`Check ${emailAddress} for a verification link!`, 'success');
    }
  });
};

const VerifyEmailAlert = ({ userId, emailVerified, emailAddress }) => (
  userId && !emailVerified ? (
    <Container textAlign="center">
      <Message icon>
        <Icon name="inbox" />
        <Message.Content>
          <Message.Header>
            Hey friend! Can you <strong>verify your email address</strong> ({emailAddress}) for us?
            <Label
              as="a"
              icon="mail"
              content="Re-send verification email"
              onClick={() => handleResendVerificationEmail(emailAddress)}
            />
          </Message.Header>
        </Message.Content>
      </Message>
    </Container>
  ) : null
);

VerifyEmailAlert.propTypes = {
  userId: PropTypes.string.isRequired,
  emailVerified: PropTypes.bool.isRequired,
  emailAddress: PropTypes.string.isRequired,
};

export default VerifyEmailAlert;
