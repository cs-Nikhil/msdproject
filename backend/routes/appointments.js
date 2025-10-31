const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getUserAppointments,
  getAppointmentById,
  updateAppointment,
  cancelAppointment,
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('patient'), createAppointment);
router.get('/', protect, getUserAppointments);
router.get('/:id', protect, getAppointmentById);
router.put('/:id', protect, authorize('patient'), updateAppointment);
router.delete('/:id', protect, authorize('patient'), cancelAppointment);

module.exports = router;
