/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
// import validate from '../../../modules/validate';

class DocumentEditor extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.state = {
      form: {
        title: (props.doc && props.doc.title) || '',
        body: (props.doc && props.doc.body) || '',
      },
    };
  }

  // componentDidMount() {
  //   const component = this;
  //   validate(component.form, {
  //     rules: {
  //       title: {
  //         required: true,
  //       },
  //       body: {
  //         required: true,
  //       },
  //     },
  //     messages: {
  //       title: {
  //         required: 'Need a title in here, Seuss.',
  //       },
  //       body: {
  //         required: 'This thneeds a body, please.',
  //       },
  //     },
  //     submitHandler() { component.handleSubmit(); },
  //   });
  // }

  handleSubmit(event) {
    event.preventDefault();
    const { history } = this.props;
    const existingDocument = this.props.doc && this.props.doc._id;
    const methodToCall = existingDocument ? 'documents.update' : 'documents.insert';
    const doc = {
      title: this.state.form.title.trim(),
      body: this.state.form.body.trim(),
    };

    if (existingDocument) doc._id = existingDocument;
    Meteor.call(methodToCall, doc, (error, documentId) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        const confirmation = existingDocument ? 'Document updated!' : 'Document added!';
        this.setState({ form: { title: '', body: '' } });
        Bert.alert(confirmation, 'success');
        history.push(`/documents/${documentId}`);
      }
    });
  }

  handleInputChange({ target }) {
    const value = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({ form: { ...this.state.form, [target.name]: value } });
  }

  render() {
    const { doc } = this.props;
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Input
          type="text"
          name="title"
          placeholder="Oh, The Places You'll Go!"
          onChange={this.handleInputChange}
          value={this.state.form.title}
          label="Title"
        />
        <Form.TextArea
          name="body"
          onChange={this.handleInputChange}
          value={this.state.form.body}
          placeholder="Congratulations! Today is your day. You're off to Great Places! You're off and away!"
          label="Body"
        />
        <Button type="submit" positive>
          {doc && doc._id ? 'Save Changes' : 'Add Document'}
        </Button>
      </Form>
    );
  }
}

DocumentEditor.defaultProps = {
  doc: { title: '', body: '' },
};

DocumentEditor.propTypes = {
  doc: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default DocumentEditor;
