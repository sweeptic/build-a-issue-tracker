const mongoose = require('mongoose');
const Schema = mongoose.Schema;

issueSchema = new Schema({
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_on: { type: Date },
  updated_on: { type: Date },
  created_by: { type: String, required: true },
  assigned_to: { type: String },
  open: { type: Boolean, required: true },
  status_text: { type: String },
  /*
  issue_title: 'Fix error in posting data',
  issue_text: 'When we post data it has an error.',
  created_on: '2017-01-08T06:35:14.240Z',
  updated_on: '2017-01-08T06:35:14.240Z',
  created_by: 'Joe',
  assigned_to: 'Joe',
  open: true,
  status_text: 'In QA',
  */
});

module.exports = mongoose.model('Issue', issueSchema);
