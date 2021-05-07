'use strict';
const express = require('express');
const router = express.Router();
const projectController = require('../controllers/api');

router.get('/issues/:project', projectController.getProject);

router.post('/issues/:project', projectController.postProject);

router.put('/issues/:project', projectController.putProject);

router.delete('/issues/:project', projectController.deleteProject);

module.exports = router;
