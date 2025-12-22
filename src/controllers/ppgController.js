const ClockRecord = require('../models/ClockRecord');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { roles } = require('../config/constants');
const Helpers = require('../utils/helpers');
const logger = require('../utils/logger');

class PPGController {
  // POST /api/ppg/clock-in
  static async clockIn(req, res, next) {
    try {
      const result = await ClockRecord.clockIn(req.user.id);

      // If late, notify supervisor
      if (result.isLate) {
        const { users: supervisors } = await User.findAll({ 
          role: roles.PPG_SUPERVISOR, 
          isActive: true 
        }, 1, 100);

        for (const supervisor of supervisors) {
          await Notification.create({
            userId: supervisor.id,
            type: 'late_clock_in',
            priority: 'medium',
            subject: 'PPG Late Clock-In',
            message: `PPG ${req.user.firstName} ${req.user.lastName} clocked in late today.`
          });
        }
      }

      logger.info(`PPG clocked in: ${req.user.id}, Late: ${result.isLate}`);

      res.json(
        Helpers.successResponse({
          ...result,
          message: result.isLate ? 'Clocked in late' : 'Clocked in on time'
        })
      );
    } catch (error) {
      if (error.message === 'Already clocked in for today') {
        return res.status(400).json(
          Helpers.errorResponse(error.message)
        );
      }
      next(error);
    }
  }

  // POST /api/ppg/clock-out
  static async clockOut(req, res, next) {
    try {
      const result = await ClockRecord.clockOut(req.user.id);

      logger.info(`PPG clocked out: ${req.user.id}`);

      res.json(
        Helpers.successResponse(result, 'Clocked out successfully')
      );
    } catch (error) {
      if (error.message === 'No active clock-in found for today') {
        return res.status(400).json(
          Helpers.errorResponse(error.message)
        );
      }
      next(error);
    }
  }

  // GET /api/ppg/shift-schedule
  static async getShiftSchedule(req, res, next) {
    try {
      const today = await ClockRecord.getTodayRecord(req.user.id);

      res.json(
        Helpers.successResponse({
          shiftStartTime: '08:00:00',
          shiftDuration: 8,
          todayRecord: today,
          status: today ? (today.clock_out_time ? 'completed' : 'in-progress') : 'not-started'
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // GET /api/ppg/attendance
  static async getAttendance(req, res, next) {
    try {
      const startDate = req.query.startDate || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
      const endDate = req.query.endDate || new Date().toISOString().split('T')[0];

      const records = await ClockRecord.getRecords(req.user.id, startDate, endDate);

      res.json(
        Helpers.successResponse(records)
      );
    } catch (error) {
      next(error);
    }
  }

  // GET /api/ppg/performance
  static async getPerformance(req, res, next) {
    try {
      const month = parseInt(req.query.month) || new Date().getMonth() + 1;
      const year = parseInt(req.query.year) || new Date().getFullYear();

      const report = await ClockRecord.getAttendanceReport(req.user.id, month, year);

      res.json(
        Helpers.successResponse(report)
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PPGController;
