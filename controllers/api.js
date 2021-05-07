const ISSUE = require('../models/issue');

exports.getProject = function (req, res) {
  let project = req.params.project;
  res.json({ greeting: 'hello from getProject' });
};

exports.postProject = async function (req, res) {
  //   let project = req.params.project;

  const {
    issue_title, //*
    issue_text, //*
    created_by, //*
    assigned_to,
    status_text,
  } = req.body;

  console.log(req.body);

  if (issue_title === '' || typeof issue_title === 'undefined') {
    console.log('issue_title field is required');

    return res.status(404).json('issue_title field is required');
  }

  if (issue_text === '' || typeof issue_text === 'undefined') {
    console.log('issue_text field is required');

    return res.status(404).json('issue_text field is required');
  }
  if (created_by === '' || typeof created_by === 'undefined') {
    console.log('created_by field is required');

    return res.status(404).json('created_by field is required');
  }

  try {
    let findOne = await ISSUE.findOne({ issue_title: issue_title });

    if (findOne) {
      console.log('Issue is already in database');
      return res.status(200).json('Issue is already in database');
    } else {
      findOne = new ISSUE({
        issue_title: issue_title,
        issue_text: issue_text,
        created_on: new Date(),
        updated_on: '',
        created_by: created_by,
        assigned_to: assigned_to,
        open: true,
        status_text: status_text,
      });
      await findOne.save();
      console.log(findOne);
      return res.status(200).json('ok');
    }
  } catch (error) {
    console.log(error);
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
