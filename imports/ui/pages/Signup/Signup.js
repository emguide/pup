import React from 'react';
import { Grid, Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Bert } from 'meteor/themeteorchef:bert';
import OAuthLoginButtons from '../../components/OAuthLoginButtons/OAuthLoginButtons';
import InputHint from '../../components/InputHint/InputHint';
import AccountPageFooter from '../../components/AccountPageFooter/AccountPageFooter';
// import validate from '../../../modules/validate';

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.state = {
      form: {
        firstName: '',
        lastName: '',
        emailAddress: '',
        password: '',
      },
    };
  }

  // componentDidMount() {
  //   // TODO: validations
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
  //       password: {
  //         required: true,
  //         minlength: 6,
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
  //       password: {
  //         required: 'Need a password here.',
  //         minlength: 'Please use at least six characters.',
  //       },
  //     },
  //     submitHandler() { component.handleSubmit(); },
  //   });
  // }

  handleSubmit(event) {
    event.preventDefault();

    const { history } = this.props;

    Accounts.createUser({
      email: this.state.form.emailAddress,
      password: this.state.form.password,
      profile: {
        name: {
          first: this.state.form.firstName,
          last: this.state.form.lastName,
        },
      },
    }, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Meteor.call('users.sendVerificationEmail');
        Bert.alert('Welcome!', 'success');
        history.push('/documents');
      }
    });
  }

  handleInputChange({ target }) {
    const value = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({ form: { ...this.state.form, [target.name]: value } });
  }

  render() {
    return (
      <Grid centered className="Signup">
        <Grid.Row>
          <Grid.Column mobile={12} tablet={6} computer={5} widescreen={4}>
            <h4 className="page-header">Sign Up</h4>
            <Grid.Row>
              <Grid.Column mobile={12}>
                <OAuthLoginButtons
                  services={['facebook', 'github', 'google']}
                  emailMessage={{
                    offset: 97,
                    text: 'Sign Up with an Email Address',
                  }}
                />
              </Grid.Column>
            </Grid.Row>
            <Form onSubmit={this.handleSubmit}>
              <Grid.Row>
                <Grid.Column mobile={6}>
                  <Form.Input
                    onChange={this.handleInputChange}
                    type="text"
                    name="firstName"
                    label="First Name"
                  />
                </Grid.Column>
                <Grid.Column mobile={6}>
                  <Form.Input
                    onChange={this.handleInputChange}
                    type="text"
                    name="lastName"
                    label="Last Name"
                  />
                </Grid.Column>
              </Grid.Row>
              <Form.Input
                onChange={this.handleInputChange}
                type="email"
                name="emailAddress"
                label="Email Address"
              />
              <Form.Input
                onChange={this.handleInputChange}
                type="password"
                name="password"
                label="Password"
                placeholder="Use at least six characters."
              />
              <Button type="submit" positive>Sign Up</Button>
              <AccountPageFooter>
                <p>Already have an account? <Link to="/login">Log In</Link>.</p>
              </AccountPageFooter>
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

Signup.propTypes = {
  history: PropTypes.object.isRequired,
};

export default Signup;
