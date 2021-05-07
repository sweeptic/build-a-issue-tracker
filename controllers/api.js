const ISSUE = require('../models/issue');



exports.getProject = async function (req, res) {
  
  let project = req.params.project;
  const myIssue = ISSUE(project)

  let findAll = await myIssue.find();

  res.json(findAll.map(issue => issue));

};






exports.postProject = async function (req, res) {

  
  let project = req.params.project;
  const myIssue = ISSUE(project)
  

  const { issue_title, issue_text, created_by, assigned_to = '', status_text = '',} = req.body;

 

  if (
    typeof issue_title === 'undefined' ||
    typeof issue_text === 'undefined' ||
    typeof created_by === 'undefined'
  ) {
    console.log({ error: 'required field(s) missing' });
    return res.status(200).json({ error: 'required field(s) missing' });
  }



  try {
    let findOne = await myIssue.findOne({ issue_title: issue_title });

    if (findOne) {
      console.log('Issue is already in database');
      return res.status(200).json('Issue is already in database');
    } else {

      


      findOne = new myIssue({
        issue_title: issue_title,
        issue_text: issue_text,
        created_on: new Date(),
        updated_on: new Date(),
        created_by: created_by,
        assigned_to: assigned_to,
        open: true,
        status_text: status_text,
      });

      await findOne.save();


      return res.status(200).json(findOne);
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
