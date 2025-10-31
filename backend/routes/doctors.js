const express = require('express');
const router = express.Router();
const {
  getDoctors,
  getDoctorById,
  getDoctorAppointments,
  updateAppointmentStatus,
} = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getDoctors);
router.get('/:id', getDoctorById);
router.get('/:id/appointments', protect, authorize('doctor'), getDoctorAppointments);
router.put('/appointments/:id', protect, authorize('doctor'), updateAppointmentStatus);

module.exports = router;
