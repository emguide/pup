import React from 'react';
import { Grid, Form, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import OAuthLoginButtons from '../../components/OAuthLoginButtons/OAuthLoginButtons';
import AccountPageFooter from '../../components/AccountPageFooter/AccountPageFooter';
// import validate from '../../../modules/validate';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.state = {
      form: {
        emailAddress: '',
        password: '',
      },
    };
  }

  // componentDidMount() {
  //   // TODO: validations
  //   const component = this;
  //   validate(component.form, {
  //     rules: {
  //       emailAddress: {
  //         required: true,
  //         email: true,
  //       },
  //       password: {
  //         required: true,
  //       },
  //     },
  //     messages: {
  //       emailAddress: {
  //         required: 'Need an email address here.',
  //         email: 'Is this email address correct?',
  //       },
  //       password: {
  //         required: 'Need a password here.',
  //       },
  //     },
  //     submitHandler() { component.handleSubmit(); },
  //   });
  // }
  handleSubmit(event) {
    event.preventDefault();

    Meteor.loginWithPassword(this.state.form.emailAddress, this.state.form.password, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Welcome back!', 'success');
      }
    });
  }

  handleInputChange({ target }) {
    const value = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({ form: { ...this.state.form, [target.name]: value } });
  }

  render() {
    return (
      <Grid centered className="Login">
        <Grid.Row>
          <Grid.Column mobile={12} tablet={6} computer={5} widescreen={4}>
            <h4 className="page-header">Log In</h4>
            <Grid.Row>
              <Grid.Column mobile={12}>
                <OAuthLoginButtons
                  services={['facebook', 'github', 'google']}
                  emailMessage={{
                    offset: 100,
                    text: 'Log In with an Email Address',
                  }}
                />
              </Grid.Column>
            </Grid.Row>
            <Form onSubmit={this.handleSubmit}>
              <Form.Input
                type="email"
                name="emailAddress"
                label="Email Address"
                onChange={this.handleInputChange}
                value={this.state.form.emailAddress}
              />
              <Form.Input
                type="password"
                name="password"
                label="Password"
                onChange={this.handleInputChange}
                value={this.state.form.password}
              />
              <Link className="pull-right" to="/recover-password">Forgot password?</Link>
              <Button type="submit" positive>Log In</Button>
              <AccountPageFooter>
                <p>{'Don\'t have an account?'} <Link to="/signup">Sign Up</Link>.</p>
              </AccountPageFooter>
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default Login;
