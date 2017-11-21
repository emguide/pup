import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, Message, Button, Header, Divider, Label, Grid } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import DocumentsCollection from '../../../api/Documents/Documents';
import { timeago, monthDayYearAtTime } from '../../../modules/dates';
import Loading from '../../components/Loading/Loading';

import './Documents.scss';

const handleRemove = (documentId) => {
  if (confirm('Are you sure? This is permanent!')) {
    Meteor.call('documents.remove', documentId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Document deleted!', 'success');
      }
    });
  }
};

const Documents = ({
  loading, documents, match, history,
}) => (!loading ? (
  <Grid className="Documents">
    <Grid.Row>
      <Grid.Column width={12}>
        <Header as="h3">Documents</Header>
      </Grid.Column>
      <Grid.Column width={4}>
        <Label
          as={Link}
          to={`${match.url}/new`}
          color="green"
          icon="plus"
          content="Add Document"
        />
      </Grid.Column>
    </Grid.Row>
    <Grid.Row>
      {documents.length ?
        <Table stackable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Title</Table.HeaderCell>
              <Table.HeaderCell>Last Updated</Table.HeaderCell>
              <Table.HeaderCell>Created</Table.HeaderCell>
              <Table.HeaderCell />
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {documents.map(({
              _id, title, createdAt, updatedAt,
            }) => (
              <Table.Row key={_id}>
                <Table.Cell>{title}</Table.Cell>
                <Table.Cell>{timeago(updatedAt)}</Table.Cell>
                <Table.Cell>{monthDayYearAtTime(createdAt)}</Table.Cell>
                <Table.Cell>
                  <Button
                    primary
                    onClick={() => history.push(`${match.url}/${_id}`)}
                    content="View"
                  />
                </Table.Cell>
                <Table.Cell>
                  <Button
                    negative
                    onClick={() => handleRemove(_id)}
                    content="Delete"
                  />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table> : <Message warning>No documents yet!</Message>
      }
    </Grid.Row>
  </Grid>
) : <Loading />);

Documents.propTypes = {
  loading: PropTypes.bool.isRequired,
  documents: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withTracker(() => {
  const subscription = Meteor.subscribe('documents');
  return {
    loading: !subscription.ready(),
    documents: DocumentsCollection.find().fetch(),
  };
})(Documents);
