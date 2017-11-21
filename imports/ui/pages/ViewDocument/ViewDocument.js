import React from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, Header } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import Documents from '../../../api/Documents/Documents';
import NotFound from '../NotFound/NotFound';
import Loading from '../../components/Loading/Loading';

const handleRemove = (documentId, history) => {
  if (confirm('Are you sure? This is permanent!')) {
    Meteor.call('documents.remove', documentId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Document deleted!', 'success');
        history.push('/documents');
      }
    });
  }
};

const renderDocument = (doc, match, history) => (doc ? (
  <Grid className="ViewDocument">
    <Grid.Row>
      <Grid.Column width={12}>
        <Header as="h3">{ doc && doc.title }</Header>
      </Grid.Column>
      <Grid.Column width={4}>
        <Button.Group floated="right">
          <Button onClick={() => history.push(`${match.url}/edit`)}>Edit</Button>
          <Button.Or />
          <Button negative onClick={() => handleRemove(doc._id, history)}>Delete</Button>
        </Button.Group>
      </Grid.Column>
    </Grid.Row>
    <Grid.Row>
      { doc && doc.body }
    </Grid.Row>
  </Grid>
) : <NotFound />);

const ViewDocument = ({
  loading, doc, match, history,
}) => (
  !loading ? renderDocument(doc, match, history) : <Loading />
);

ViewDocument.defaultProps = {
  doc: null,
};

ViewDocument.propTypes = {
  loading: PropTypes.bool.isRequired,
  doc: PropTypes.object,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withTracker(({ match }) => {
  const documentId = match.params._id;
  const subscription = Meteor.subscribe('documents.view', documentId);

  return {
    loading: !subscription.ready(),
    doc: Documents.findOne(documentId),
  };
})(ViewDocument);
