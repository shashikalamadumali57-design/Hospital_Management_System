import { Router } from 'express';
import { pool } from '../config/database.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const clinicalRoles = new Set(['admin', 'doctor', 'nurse']);
const financeRoles = new Set(['admin', 'accountant']);

router.get('/overview', requireAuth, async (req, res, next) => {
  try {
    const [patientResult, appointmentResult, appointmentRows, wardResult, wardRows, invoiceResult, weeklyRows, doctorResult, doctors, staffResult] = await Promise.all([
      pool.execute('SELECT COUNT(*) AS total FROM patients'),
      pool.execute('SELECT COUNT(*) AS total FROM appointments WHERE scheduled_at >= CURRENT_DATE AND scheduled_at < CURRENT_DATE + INTERVAL 1 DAY'),
      pool.execute("SELECT public_id AS id, DATE_FORMAT(scheduled_at, '%h:%i %p') AS time, patient_name AS patient, COALESCE(doctor_name, 'Unassigned') AS doctor, COALESCE(department, 'General medicine') AS department, COALESCE(room, 'To be assigned') AS room, status FROM appointments WHERE scheduled_at >= CURRENT_DATE AND scheduled_at < CURRENT_DATE + INTERVAL 1 DAY ORDER BY scheduled_at LIMIT 4"),
      pool.execute('SELECT COALESCE(SUM(capacity), 0) AS capacity, COALESCE(SUM(occupied), 0) AS occupied, IF(COALESCE(SUM(capacity), 0) = 0, NULL, ROUND(SUM(occupied) / SUM(capacity) * 100, 1)) AS occupancy FROM wards'),
      pool.execute('SELECT public_id AS id, name, capacity, occupied, lead_nurse FROM wards ORDER BY name'),
      pool.execute("SELECT COALESCE(SUM(amount), 0) AS total FROM invoices WHERE issued_at >= DATE_FORMAT(CURRENT_DATE, '%Y-%m-01') AND issued_at < CURRENT_DATE + INTERVAL 1 DAY"),
      pool.execute("SELECT DATE_FORMAT(DATE(scheduled_at), '%Y-%m-%d') AS date, COUNT(*) AS total FROM appointments WHERE scheduled_at >= CURRENT_DATE - INTERVAL 6 DAY AND scheduled_at < CURRENT_DATE + INTERVAL 1 DAY GROUP BY DATE_FORMAT(DATE(scheduled_at), '%Y-%m-%d')"),
      pool.execute("SELECT COUNT(*) AS total FROM doctors WHERE status IN ('Available', 'In consultation')"),
      pool.execute("SELECT public_id AS id, name, specialty, COALESCE(location, 'Location not assigned') AS location, status FROM doctors WHERE status IN ('Available', 'In consultation') ORDER BY name LIMIT 3"),
      pool.execute("SELECT COUNT(*) AS total FROM staff WHERE LOWER(status) = 'on duty'"),
    ]);

    const [[patients]] = patientResult;
    const [[appointments]] = appointmentResult;
    const [todayAppointments] = appointmentRows;
    const [[wards]] = wardResult;
    const [wardList] = wardRows;
    const [[invoices]] = invoiceResult;
    const [weeklyAppointments] = weeklyRows;
    const [[doctorsOnDuty]] = doctorResult;
    const [doctorList] = doctors;
    const [[staffOnDuty]] = staffResult;

    return res.json({
      success: true,
      data: {
        patients: clinicalRoles.has(req.user.role) ? Number(patients.total) : null,
        appointmentsToday: clinicalRoles.has(req.user.role) ? Number(appointments.total) : null,
        appointments: clinicalRoles.has(req.user.role) ? todayAppointments : [],
        wards: clinicalRoles.has(req.user.role) ? wardList.map((ward) => ({
          id: ward.id,
          name: ward.name,
          capacity: Number(ward.capacity),
          occupied: Number(ward.occupied),
          available: Number(ward.capacity) - Number(ward.occupied),
        })) : [],
        beds: clinicalRoles.has(req.user.role) ? {
          capacity: Number(wards.capacity),
          occupied: Number(wards.occupied),
          available: Number(wards.capacity) - Number(wards.occupied),
          occupancy: wards.occupancy === null ? null : Number(wards.occupancy),
        } : null,
        invoicedThisMonth: financeRoles.has(req.user.role) ? Number(invoices.total) : null,
        weeklyAppointments: clinicalRoles.has(req.user.role) ? weeklyAppointments.map((day) => ({ date: day.date, total: Number(day.total) })) : [],
        careTeam: clinicalRoles.has(req.user.role) ? {
          physiciansOnDuty: Number(doctorsOnDuty.total),
          staffOnDuty: Number(staffOnDuty.total),
          physicians: doctorList,
        } : null,
      },
    });
  } catch (error) {
    return next(error);
  }
});

export default router;