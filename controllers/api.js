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

    const allIssues = await issueCollection.find(query);

    res.status(200).json([...allIssues]);
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
      assigned_to: req.body.assigned_to || '',
      created_on: new Date(),
      updated_on: new Date(),
      created_by: req.body.created_by,
      open: true,
      status_text: req.body.status_text || '',
    });

    await findOne.save();
    return res.status(200).json(findOne);
  } catch (error) {
    return res.status(500).json('Server error');
  }
};

exports.putProject = async function (req, res) {
  const _id = req.body._id;
  const issueCollection = ISSUE(req.params.project);
  const newRecord = await issueCollection.findById(_id);

  if (typeof _id === 'undefined') {
    return res.json({ error: 'missing _id' });
  }

  if (Object.keys(req.body).join() === '_id') {
    return res.json({ error: 'no update field(s) sent', _id: _id });
  }

  if (newRecord === null) {
    return res.json({ error: 'could not update', _id: _id });
  }

  try {
    let updatedRecord = {
      ...newRecord._doc,
      ...req.body,
      updated_on: new Date(),
    };

    delete updatedRecord[_id];
    newRecord.overwrite(updatedRecord);
    await newRecord.save();

    return res.status(200).json({ result: 'successfully updated', _id: _id });
  } catch (error) {
    return res.json({ error: 'server error', _id: _id });
  }
};

exports.deleteProject = async function (req, res) {
  const _id = req.body._id;
  const issueCollection = ISSUE(req.params.project);
  const newRecord = await issueCollection.findById(_id);

  if (typeof _id === 'undefined') {
    return res.json({ error: 'missing _id' });
  }

  if (newRecord === null) {
    return res.json({ error: 'could not delete', _id: _id });
  }

  try {
    await issueCollection.deleteOne({ _id: _id });
    return res.status(200).json({ result: 'successfully deleted', _id: _id });
  } catch (error) {
    return res.json({ error: 'server error', _id: _id });
  }
};
