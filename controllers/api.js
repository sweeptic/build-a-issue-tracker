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
  const issueCollection = ISSUE(req.params.project);
  const _id = req.body._id;

  if (typeof _id === 'undefined') {
    return res.json({ error: 'missing _id' });
  }

  try {
    let newRecord = await issueCollection.findById(_id);
    // console.log('newRecord:', newRecord);

    // newRecord._id = new ObjectId(_id);
    // const originalRecord = newRecord

    let newId = { _id: new ObjectId(_id) };

    let updatedRecord = {
      ...newRecord._doc,
      ...req.query,
      updated_on: new Date(),
    };
    // let updatedRecord = { open: false };
    delete updatedRecord[_id];

    // console.log(updatedRecord);
    // console.log(req.query);

    newRecord.overwrite(updatedRecord);

    await newRecord.save();

    return res.status(200).json({ result: 'successfully updated', _id: _id });
    // console.log(newRecord);
  } catch (error) {
    console.log(error);

    return res.status(500).json('Server error');
  }

  // try {
  //   newRecord = await issueCollection.findById(_id);

  //   return res.status(500).json('finded');
  // } catch (err) {
  //    return res.status(500).json('Server error');

  // }
};

exports.deleteProject = function (req, res) {
  let project = req.params.project;
  res.json({ greeting: 'hello from deleteProject' });
};
