const ISSUE = require('../models/issue');
const ObjectId = require('mongodb').ObjectID;

exports.getProject = async function (req, res) {
  const issueCollection = ISSUE(req.params.project);
  const query = req.query;

  try {
    if (query._id) {
      query._id = new ObjectId(query._id);
    }
    if (query.open) {
      if (query.open === '' || query.open === 'true') {
        query.open = true;
      } else if (query.open === 'false') {
        query.open = false;
      } else query.open = false;
    }

    const findAll = await issueCollection.find(query);

    res.status(200).json([...findAll]);
  } catch (error) {
    return res.status(500).json('Server error');
  }
};

exports.postProject = async function (req, res) {
  const issueCollection = ISSUE(req.params.project);

  if (
    typeof req.body.issue_title === 'undefined' ||
    typeof req.body.issue_text === 'undefined' ||
    typeof req.body.created_by === 'undefined'
  ) {
    return res.status(200).json({ error: 'required field(s) missing' });
  }

  try {
    findOne = new issueCollection({
      issue_title: req.body.issue_title,
      issue_text: req.body.issue_text,
      created_on: new Date(),
      updated_on: new Date(),
      created_by: req.body.created_by,
      assigned_to: req.body.assigned_to || '',
      open: true,
      status_text: req.body.status_text || '',
    });

    await findOne.save();
    return res.status(200).json(findOne);
  } catch (error) {
    return res.status(500).json('Server error');
  }
};

exports.putProject = function (req, res) {
  let project = req.params.project;
  res.json({ greeting: 'hello from putProject' });
};

exports.deleteProject = function (req, res) {
  let project = req.params.project;
  res.json({ greeting: 'hello from deleteProject' });
};
