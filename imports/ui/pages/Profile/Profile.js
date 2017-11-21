/* eslint-disable no-underscore-dangle */

import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Form, Button } from 'semantic-ui-react';
import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Bert } from 'meteor/themeteorchef:bert';
import { withTracker } from 'meteor/react-meteor-data';
import InputHint from '../../components/InputHint/InputHint';
// import validate from '../../../modules/validate';

import './Profile.scss';

class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.getUserType = this.getUserType.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderOAuthUser = this.renderOAuthUser.bind(this);
    this.renderPasswordUser = this.renderPasswordUser.bind(this);
    this.renderProfileForm = this.renderProfileForm.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

    const user = props.user;
    this.state = {
      form: {
        firstName: user.profile.name.first,
        lastName: user.profile.name.last,
        emailAddress: user.emails[0].address,
        currentPassword: '',
        newPassword: '',
      },
    };
  }

  // componentDidMount() {
  //   const component = this;
  //
  //   validate(component.form, {
  //     rules: {
  //       firstName: {
  //         required: true,
  //       },
  //       lastName: {
  //         required: true,
  //       },
  //       emailAddress: {
  //         required: true,
  //         email: true,
  //       },
  //       currentPassword: {
  //         required() {
  //           // Only required if newPassword field has a value.
  //           return component.newPassword.value.length > 0;
  //         },
  //       },
  //       newPassword: {
  //         required() {
  //           // Only required if currentPassword field has a value.
  //           return component.currentPassword.value.length > 0;
  //         },
  //       },
  //     },
  //     messages: {
  //       firstName: {
  //         required: 'What\'s your first name?',
  //       },
  //       lastName: {
  //         required: 'What\'s your last name?',
  //       },
  //       emailAddress: {
  //         required: 'Need an email address here.',
  //         email: 'Is this email address correct?',
  //       },
  //       currentPassword: {
  //         required: 'Need your current password if changing.',
  //       },
  //       newPassword: {
  //         required: 'Need your new password if changing.',
  //       },
  //     },
  //     submitHandler() { component.handleSubmit(); },
  //   });
  // }

  getUserType(user) {
    const userToCheck = user;
    delete userToCheck.services.resume;
    const service = Object.keys(userToCheck.services)[0];
    return service === 'password' ? 'password' : 'oauth';
  }

  handleSubmit(event) {
    event.preventDefault();

    const profile = {
      emailAddress: this.state.form.emailAddress,
      profile: {
        name: {
          first: this.state.form.firstName,
          last: this.state.form.lastName,
        },
      },
    };

    Meteor.call('users.editProfile', profile, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Profile updated!', 'success');
      }
    });

    if (this.state.form.newPassword) {
      Accounts.changePassword(this.state.form.currentPassword, this.state.form.newPassword, (error) => {
        if (error) {
          Bert.alert(error.reason, 'danger');
        } else {
          this.setState({ form: { ...this.state.form, currentPassword: '', newPassword: '' } });
        }
      });
    }
  }

  handleInputChange({ target }) {
    const value = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({ form: { ...this.state.form, [target.name]: value } });
  }

  renderOAuthUser(loading, user) {
    return !loading ? (
      <div className="OAuthProfile">
        {Object.keys(user.services).map(service => (
          <div key={service} className={`LoggedInWith ${service}`}>
            <img src={`/${service}.svg`} alt={service} />
            <p>{`You're logged in with ${_.capitalize(service)} using the email address ${user.services[service].email}.`}</p>
            <Button
              className={`btn btn-${service}`}
              href={{
                facebook: 'https://www.facebook.com/settings',
                google: 'https://myaccount.google.com/privacy#personalinfo',
                github: 'https://github.com/settings/profile',
              }[service]}
              target="_blank"
              >
                Edit Profile on {_.capitalize(service)}
              </Button>
            </div>
          ))}
        </div>) : <div />;
      }

      renderPasswordUser(loading, user) {
        return !loading ? (
          <Grid>
            <Grid.Row>
              <Grid.Column mobile={8}>
                <Form.Input
                  type="text"
                  name="firstName"
                  label="First Name"
                  value={this.state.form.firstName}
                  onChange={this.handleInputChange}
                />
              </Grid.Column>
              <Grid.Column mobile={8}>
                <Form.Input
                  type="text"
                  name="lastName"
                  label="Last Name"
                  value={this.state.form.lastName}
                  onChange={this.handleInputChange}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={8}>
                <Form.Input
                  type="email"
                  name="emailAddress"
                  label="Email Address"
                  value={this.state.form.emailAddress}
                  onChange={this.handleInputChange}
                />
              </Grid.Column>
              <Grid.Column width={4}>
                <Form.Input
                  type="password"
                  name="currentPassword"
                  label="Current Password"
                  value={this.state.form.currentPassword}
                  onChange={this.handleInputChange}
                />
              </Grid.Column>
              <Grid.Column width={4}>
                <Form.Input
                  type="password"
                  name="newPassword"
                  label="New Password"
                  value={this.state.form.newPassword}
                  onChange={this.handleInputChange}
                  placeholder="Use at least six characters."
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={4}>
                <Button type="submit" positive>Save Profile</Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
    ) : <div />;
  }

  renderProfileForm(loading, user) {
    return !loading ? ({
      password: this.renderPasswordUser,
      oauth: this.renderOAuthUser,
    }[this.getUserType(user)])(loading, user) : <div />;
  }

  render() {
    const { loading, user } = this.props;
    return (
      <Grid className="Profile">
        <Grid.Row>
          <Grid.Column mobile={6} tablet={6} computer={12} widescreen={12}>
            <h4 className="page-header">Edit Profile</h4>
            <Form onSubmit={this.handleSubmit}>
              {this.renderProfileForm(loading, user)}
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

Profile.propTypes = {
  loading: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
};

export default withTracker(() => {
  const subscription = Meteor.subscribe('users.editProfile');

  return {
    loading: !subscription.ready(),
    user: Meteor.user(),
  };
})(Profile);
