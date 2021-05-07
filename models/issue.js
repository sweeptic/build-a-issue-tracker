const mongoose = require('mongoose');
const Schema = mongoose.Schema;

issueSchema = new Schema(
  {
    issue_title: { type: String, required: true },
    issue_text: { type: String, required: true },
    created_by: { type: String, required: true },
    created_on: { type: Date },
    updated_on: { type: Date },
    assigned_to: { type: String },
    open: { type: Boolean },
    status_text: { type: String },
  },
  { versionKey: false }
);

// module.exports = mongoose.model('MyProject', issueSchema);

module.exports = function(collectionName) {
  return mongoose.model("Item", issueSchema, collectionName);
};