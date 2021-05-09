const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {
  const getUserInput = 'http://localhost:3000/';

  test('renders ', async getUserInput => {
    try {
      let initialData = {
        issue_title: 'Issue to be Updated',
        issue_text: 'Functional Test - Put target',
        created_by: 'fCC',
      };
      const url = getUserInput('url') + '/api/issues/fcc-project';

      const itemToUpdate = await $.post(url, initialData);
      const updateSucccess = await $.ajax({
        url: url,
        type: 'PUT',
        data: { _id: itemToUpdate._id, issue_text: 'New Issue Text' },
      });
      assert.isObject(updateSucccess);
      assert.deepEqual(updateSucccess, {
        result: 'successfully updated',
        _id: itemToUpdate._id,
      });
      const getUpdatedId = await $.get(url + '?_id=' + itemToUpdate._id);
      assert.isArray(getUpdatedId);
      assert.isObject(getUpdatedId[0]);
      assert.isAbove(
        Date.parse(getUpdatedId[0].updated_on),
        Date.parse(getUpdatedId[0].created_on)
      );
    } catch (err) {
      throw new Error(err.responseText || err.message);
    }
  });

  test('Create an issue with every field: POST request to /api/issues/{project} ', () => {});
  test('Create an issue with only required fields: POST request to /api/issues/{project}', () => {});
  test('Create an issue with missing required fields: POST request to /api/issues/{project}', () => {});
  test('View issues on a project: GET request to /api/issues/{project}', () => {});
  test('View issues on a project with one filter: GET request to /api/issues/{project}', () => {});
  test('View issues on a project with multiple filters: GET request to /api/issues/{project}', () => {});
  test('Update one field on an issue: PUT request to /api/issues/{project}', () => {});
  test('Update multiple fields on an issue: PUT request to /api/issues/{project}', () => {});
  test('Update an issue with missing _id: PUT request to /api/issues/{project}', () => {});
  test('Update an issue with no fields to update: PUT request to /api/issues/{project}', () => {});
  test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', () => {});
  test('Delete an issue: DELETE request to /api/issues/{project}', () => {});
  test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', () => {});
  test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', () => {});
});
