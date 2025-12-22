const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { roles } = require('../config/constants');
const ppgController = require('../controllers/ppgController');

router.use(auth);
router.use(roleCheck([roles.PPG, roles.PPG_SUPERVISOR, roles.ADMIN]));

// POST /api/ppg/clock-in - Clock in for shift
router.post('/clock-in', 
  roleCheck([roles.PPG]), 
  ppgController.clockIn
);

// POST /api/ppg/clock-out - Clock out from shift
router.post('/clock-out', 
  roleCheck([roles.PPG]), 
  ppgController.clockOut
);

// GET /api/ppg/shift-schedule - Get shift schedule
router.get('/shift-schedule', ppgController.getShiftSchedule);

// GET /api/ppg/attendance - Get attendance records
router.get('/attendance', ppgController.getAttendance);

// GET /api/ppg/performance - Get performance metrics
router.get('/performance', ppgController.getPerformance);

module.exports = router;
