const chaiHttp = require('chai-http');
const chai = require('chai');
const server = require('../server');
const mongoose = require('mongoose');
const { getFakeObjectId } = require('./testutil/util');

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

// individual test cases with uses live DB. this will be creating one 'test' collection per test run

suite('Functional Tests', function () {
  mongoose.connection.db.dropCollection('test', function (err, result) {
    console.log('drop previous test collection, and begin a fresh one');
  });

  test('Create an issue with every field: POST request to /api/issues/{project}', done => {
    chai
      .request(server)
      .post('/api/issues/test')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({
        issue_title: 'Every field filled in',
        issue_text: 'Text',
        created_by: 'Created by',
        assigned_to: 'Assigned to',
        status_text: 'Filter me',
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        expect(res.body).to.have.property('_id');
        expect(res.body).to.have.property('issue_title').to.equal('Every field filled in');
        expect(res.body).to.have.property('issue_text').to.equal('Text');
        expect(res.body).to.have.property('created_by').to.equal('Created by');
        expect(res.body).to.have.property('assigned_to').to.equal('Assigned to');
        expect(res.body).to.have.property('status_text').to.equal('Filter me');
        expect(res.body).to.have.property('open').to.be.a('boolean').and.to.equal(true);
        expect(res.body).to.have.property('created_on');
        expect(res.body).to.have.property('updated_on');
        done();
      });
  });

  test('Create an issue with only required fields: POST request to /api/issues/{project} ', done => {
    chai
      .request(server)
      .post('/api/issues/test')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({
        issue_title: 'this is issue title field',
        issue_text: 'this is issue text!',
        created_by: 'Created by creator',
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        expect(res.body).to.have.property('_id');
        expect(res.body).to.have.property('issue_title').to.equal('this is issue title field');
        expect(res.body).to.have.property('issue_text').to.equal('this is issue text!');
        expect(res.body).to.have.property('created_by').to.equal('Created by creator');
        expect(res.body).to.have.property('assigned_to').to.equal('');
        expect(res.body).to.have.property('status_text').to.equal('');
        expect(res.body).to.have.property('open').to.be.a('boolean').and.to.equal(true);
        expect(res.body).to.have.property('created_on');
        expect(res.body).to.have.property('updated_on');
        done();
      });
  });

  test('Create an issue with missing required fields: POST request to /api/issues/{project} ', done => {
    chai
      .request(server)
      .post('/api/issues/test')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({
        issue_title: 'Missing required fields',
        issue_text: 'Property "assigned_to" was not filled',
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'required field(s) missing' });
        done();
      });
  });

  test('View issues on a project: GET request to /api/issues/{project} ', done => {
    chai
      .request(server)
      .post('/api/issues/test')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({
        issue_title: 'get this project!',
        issue_text: 'Text',
        created_by: 'Created by',
      })
      .end((err, res) => {
        chai
          .request(server)
          .get('/api/issues/test')
          .set('content-type', 'application/x-www-form-urlencoded')
          .query({})
          .end((err, res) => {
            assert.equal(res.status, 200);
            expect(res.status).to.equal(200);
            expect(res.body).is.a('array');
            expect(res.body[0]).to.have.property('_id');
            expect(res.body[0]).to.have.property('issue_title');
            expect(res.body[0]).to.have.property('issue_text');
            expect(res.body[0]).to.have.property('assigned_to');
            expect(res.body[0]).to.have.property('status_text');
            expect(res.body[0]).to.have.property('created_by');
            expect(res.body[0]).to.have.property('created_on');
            expect(res.body[0]).to.have.property('updated_on');
            expect(res.body[0]).to.have.property('open');
            done();
          });
      });
  });

  test('View issues on a project with one filter: GET request to /api/issues/{project}', done => {
    chai
      .request(server)
      .post('/api/issues/test')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({
        issue_title: 'GET project with single filters',
        issue_text: 'Text for single filter',
        created_by: 'Created by',
      })
      .end((err, res) => {
        chai
          .request(server)
          .get('/api/issues/test')
          .set('content-type', 'application/x-www-form-urlencoded')
          .query({ issue_text: 'Text for single filter' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            expect(res.body).is.a('array');
            expect(res.body[0]).to.have.property('issue_text').to.equal('Text for single filter');
            expect(res.body[0]).to.have.property('_id');
            expect(res.body[0]).to.have.property('issue_title');
            expect(res.body[0]).to.have.property('issue_text');
            expect(res.body[0]).to.have.property('assigned_to');
            expect(res.body[0]).to.have.property('created_by');
            expect(res.body[0]).to.have.property('created_on');
            expect(res.body[0]).to.have.property('updated_on');
            expect(res.body[0]).to.have.property('open');
            done();
          });
      });
  });

  test('View issues on a project with multiple filters: GET request to /api/issues/{project}', done => {
    chai
      .request(server)
      .post('/api/issues/test')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({
        issue_title: 'GET project with multiple filters',
        issue_text: 'Text',
        created_by: 'Created by',
      })
      .end((err, res) => {
        chai
          .request(server)
          .get('/api/issues/test')
          .set('content-type', 'application/x-www-form-urlencoded')
          .query({ issue_title: 'GET project with multiple filters', issue_text: 'Text' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            expect(res.body).is.a('array');
            expect(res.body[0]).to.have.property('_id');
            expect(res.body[0]).to.have.property('issue_title').to.equal('GET project with multiple filters');
            expect(res.body[0]).to.have.property('issue_text').to.equal('Text');
            expect(res.body[0]).to.have.property('created_on');
            expect(res.body[0]).to.have.property('updated_on');
            expect(res.body[0]).to.have.property('open').to.equal(true);
            done();
          });
      });
  });

  test('Update one field on an issue: PUT request to /api/issues/{project}', done => {
    chai
      .request(server)
      .post('/api/issues/test')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({
        issue_title: 'this field updated soon',
        issue_text: 'Text',
        created_by: 'Created by',
      })
      .end((err, res) => {
        chai
          .request(server)
          .put('/api/issues/test')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({ _id: res.body._id, issue_title: 'One field to update' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, { _id: res.body._id, result: 'successfully updated' });
            done();
          });
      });
  });

  test('Update multiple fields on an issue: PUT request to /api/issues/{project}', done => {
    chai
      .request(server)
      .post('/api/issues/test')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({
        issue_title: 'this field updated soon',
        issue_text: 'this field updated soon',
        created_by: 'Created by',
      })
      .end((err, res) => {
        chai
          .request(server)
          .put('/api/issues/test')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({ _id: res.body._id, issue_title: 'updated', issue_text: 'field updated' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, { _id: res.body._id, result: 'successfully updated' });
            done();
          });
      });
  });

  test('Update an issue with missing _id: PUT request to /api/issues/{project}', done => {
    chai
      .request(server)
      .post('/api/issues/test')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({
        issue_title: 'missing id soon',
        issue_text: 'Text',
        created_by: 'Created by',
      })
      .end((err, res) => {
        chai
          .request(server)
          .put('/api/issues/test')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({ issue_title: 'two field to update', issue_text: 'another field update' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, { error: 'missing _id' });
            done();
          });
      });
  });

  test('Update an issue with no fields to update: PUT request to /api/issues/{project}', done => {
    chai
      .request(server)
      .post('/api/issues/test')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({
        issue_title: 'missing fields soon',
        issue_text: 'Text',
        created_by: 'Created by',
      })
      .end((err, res) => {
        chai
          .request(server)
          .put('/api/issues/test')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({ _id: res.body._id })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, { _id: res.body._id, error: 'no update field(s) sent' });
            done();
          });
      });
  });

  test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', done => {
    const fakeId = getFakeObjectId();

    chai
      .request(server)
      .put('/api/issues/test')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ _id: fakeId, issue_title: 'field to update' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { _id: fakeId, error: 'could not update' });
        done();
      });
  });

  test('Delete an issue: DELETE request to /api/issues/{project}', done => {
    chai
      .request(server)
      .post('/api/issues/test')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({
        issue_title: 'deleted this soon',
        issue_text: 'Text',
        created_by: 'Created by',
      })
      .end((err, res) => {
        chai
          .request(server)
          .delete('/api/issues/test')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({ _id: res.body._id })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, { _id: res.body._id, result: 'successfully deleted' });
            done();
          });
      });
  });

  test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', done => {
    const fakeId = getFakeObjectId();

    chai
      .request(server)
      .delete('/api/issues/test')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ _id: fakeId })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { _id: fakeId, error: 'could not delete' });
        done();
      });
  });

  test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', done => {
    chai
      .request(server)
      .delete('/api/issues/test')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'missing _id' });
        done();
      });
  });
});
