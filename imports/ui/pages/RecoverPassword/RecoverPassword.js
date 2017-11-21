import React from 'react';
import { Grid, Message, Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';
import { Bert } from 'meteor/themeteorchef:bert';
import AccountPageFooter from '../../components/AccountPageFooter/AccountPageFooter';
// import validate from '../../../modules/validate';

class RecoverPassword extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.state = {
      form: {
        emailAddress: '',
      },
    };
  }

  // componentDidMount() {
  //   const component = this;
  //
  //   validate(component.form, {
  //     rules: {
  //       emailAddress: {
  //         required: true,
  //         email: true,
  //       },
  //     },
  //     messages: {
  //       emailAddress: {
  //         required: 'Need an email address here.',
  //         email: 'Is this email address correct?',
  //       },
  //     },
  //     submitHandler() { component.handleSubmit(); },
  //   });
  // }

  handleSubmit(event) {
    event.preventDefault();

    const { history } = this.props;
    const email = this.state.form.emailAddress;

    Accounts.forgotPassword({ email }, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert(`Check ${email} for a reset link!`, 'success');
        history.push('/login');
      }
    });
  }

  handleInputChange({ target }) {
    const value = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({ form: { ...this.state.form, [target.name]: value } });
  }

  render() {
    return (
      <Grid centered className="RecoverPassword">
        <Grid.Row>
          <Grid.Column mobile={12} tablet={6} computer={5} widescreen={4}>
            <h4 className="page-header">Recover Password</h4>
            <Message info>
              Enter your email address below to receive a link to reset your password.
            </Message>
            <Form onSubmit={this.handleSubmit}>
              <Form.Input
                onChange={this.handleInputChange}
                type="email"
                name="emailAddress"
                label="Email Address"
              />
              <Button type="submit" positive>Recover Password</Button>
              <AccountPageFooter>
                <p>Remember your password? <Link to="/login">Log In</Link>.</p>
              </AccountPageFooter>
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

RecoverPassword.propTypes = {
  history: PropTypes.object.isRequired,
};

export default RecoverPassword;
