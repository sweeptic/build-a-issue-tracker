exports.getProject = function (req, res) {
  let project = req.params.project;
  res.json({ greeting: 'hello from project' });
};

exports.postProject = function (req, res) {
  let project = req.params.project;
  res.json({ greeting: 'hello from project' });
};

exports.putProject = function (req, res) {
  let project = req.params.project;
  res.json({ greeting: 'hello from project' });
};

exports.deleteProject = function (req, res) {
  let project = req.params.project;
  res.json({ greeting: 'hello from project' });
};
