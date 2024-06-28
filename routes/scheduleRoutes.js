const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

router.get('/', scheduleController.getAllSchedules);
router.post('/create', scheduleController.createSchedule);
router.get('/:id', scheduleController.getScheduleDetails);
router.post('/:id/update', scheduleController.updateSchedule);

module.exports = router;
