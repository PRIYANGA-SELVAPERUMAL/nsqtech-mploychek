const express = require('express');
const router = express.Router();
const recordController = require('../controllers/record.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.get('/', recordController.getRecords);           // supports ?delay=2000
router.get('/stats', recordController.getStats);
router.get('/:recordId', recordController.getRecordById);

module.exports = router;
