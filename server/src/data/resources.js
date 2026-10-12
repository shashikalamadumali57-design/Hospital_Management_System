const clinical = ['admin', 'doctor', 'nurse'];
const operations = ['admin', 'pharmacist', 'laboratory', 'accountant'];

export const resources = {
  patients: {
    table: 'patients', prefix: 'PT', read: clinical, write: ['admin', 'doctor', 'nurse'],
    select: { id: 'public_id', name: 'name', dateOfBirth: "IF(date_of_birth IS NULL, '', DATE_FORMAT(date_of_birth, '%Y-%m-%d'))", age: "IF(date_of_birth IS NULL, '—', TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()))", contact: 'phone', blood: 'blood_group', lastVisit: "COALESCE(DATE_FORMAT(last_visit, '%b %d, %Y'), 'Never')", status: 'status' },
    create: { name: ['name', 'string', true], dateOfBirth: ['date_of_birth', 'date', false], contact: ['phone', 'string', false], blood: ['blood_group', 'string', false], status: ['status', 'string', false] }, search: ['name', 'phone', 'public_id', 'blood_group'], order: 'created_at',
  },
  appointments: {
    table: 'appointments', prefix: 'APT', read: clinical, write: ['admin', 'doctor', 'nurse'],
    select: { id: 'public_id', time: "DATE_FORMAT(scheduled_at, '%h:%i %p')", patient: 'patient_name', doctor: "COALESCE(doctor_name, 'Unassigned')", department: "COALESCE(department, 'General medicine')", room: "COALESCE(room, 'To be assigned')", status: 'status' },
    create: { patient: ['patient_name', 'string', true], doctor: ['doctor_name', 'string', false], department: ['department', 'string', false], room: ['room', 'string', false], scheduledAt: ['scheduled_at', 'datetime', true], status: ['status', 'string', false], reason: ['reason', 'string', false] }, search: ['patient_name', 'doctor_name', 'department', 'public_id'], order: 'scheduled_at',
  },
  doctors: {
    table: 'doctors', prefix: 'DR', read: clinical, write: ['admin'],
    select: { id: 'public_id', name: 'name', specialty: 'specialty', schedule: "COALESCE(schedule, 'Schedule pending')", patients: "CONCAT(appointments_today, ' today')", location: "COALESCE(location, 'To be assigned')", status: 'status' },
    create: { name: ['name', 'string', true], specialty: ['specialty', 'string', true], schedule: ['schedule', 'string', false], appointmentsToday: ['appointments_today', 'number', false], location: ['location', 'string', false], status: ['status', 'string', false] }, search: ['name', 'specialty', 'location'], order: 'name',
  },
  beds: {
    table: 'wards', prefix: 'WARD', read: clinical, write: ['admin', 'nurse'],
    select: { id: 'public_id', ward: 'name', type: 'care_type', beds: "CONCAT(capacity, ' total')", occupied: "CONCAT(occupied, ' occupied')", nurse: "COALESCE(lead_nurse, 'To be assigned')", status: "CONCAT(IF(capacity = 0, 0, ROUND(occupied / capacity * 100)), '% occupied')" },
    create: { ward: ['name', 'string', true], type: ['care_type', 'string', false], capacity: ['capacity', 'number', false], occupied: ['occupied', 'number', false], nurse: ['lead_nurse', 'string', false] }, search: ['name', 'care_type', 'lead_nurse'], order: 'name',
  },
  laboratory: {
    table: 'lab_orders', prefix: 'LAB', read: clinical, write: ['admin', 'doctor', 'laboratory'],
    select: { id: 'public_id', patient: 'patient_name', test: 'test_name', orderedBy: "COALESCE(ordered_by, 'Unassigned')", collected: "COALESCE(DATE_FORMAT(collected_at, '%h:%i %p'), 'Not collected')", status: 'status' },
    create: { patient: ['patient_name', 'string', true], test: ['test_name', 'string', true], orderedBy: ['ordered_by', 'string', false], status: ['status', 'string', false] }, search: ['patient_name', 'test_name', 'ordered_by', 'public_id'], order: 'created_at',
  },
  pharmacy: {
    table: 'medicines', prefix: 'MED', read: [...clinical, 'pharmacist'], write: ['admin', 'pharmacist'],
    select: { id: 'public_id', medicine: 'name', category: "COALESCE(category, 'Uncategorized')", stock: "CONCAT(stock_quantity, ' ', unit)", expiry: "COALESCE(DATE_FORMAT(expires_on, '%b %d, %Y'), 'Not specified')", price: "CONCAT('LKR ', FORMAT(unit_price, 0))", status: 'status' },
    create: { medicine: ['name', 'string', true], category: ['category', 'string', false], stockQuantity: ['stock_quantity', 'number', false], unit: ['unit', 'string', false], expiry: ['expires_on', 'date', false], price: ['unit_price', 'number', false], reorderLevel: ['reorder_level', 'number', false], status: ['status', 'string', false] }, search: ['name', 'category', 'public_id'], order: 'name',
  },
  billing: {
    table: 'invoices', prefix: 'INV', read: ['admin', 'doctor', 'nurse', 'accountant'], write: ['admin', 'accountant'],
    select: { id: 'public_id', patient: 'patient_name', service: 'service', issued: "DATE_FORMAT(issued_at, '%b %d, %Y %h:%i %p')", amount: "CONCAT('LKR ', FORMAT(amount, 0))", balance: "CONCAT('LKR ', FORMAT(balance, 0))", status: 'status' },
    create: { patient: ['patient_name', 'string', true], service: ['service', 'string', true], amount: ['amount', 'number', false], balance: ['balance', 'number', false], status: ['status', 'string', false] }, search: ['patient_name', 'service', 'public_id'], order: 'issued_at',
  },
  staff: {
    table: 'staff', prefix: 'ST', read: ['admin', 'nurse', 'accountant'], write: ['admin'],
    select: { id: 'public_id', name: 'name', role: 'role', department: "COALESCE(department, 'Unassigned')", shift: "COALESCE(shift, 'Schedule pending')", status: 'status' },
    create: { name: ['name', 'string', true], role: ['role', 'string', true], department: ['department', 'string', false], shift: ['shift', 'string', false], status: ['status', 'string', false] }, search: ['name', 'role', 'department', 'public_id'], order: 'name',
  },
  reports: {
    table: 'reports', prefix: 'RPT', read: ['admin', 'doctor', 'nurse', 'laboratory', 'accountant'], write: ['admin', 'accountant'],
    select: { id: 'public_id', report: 'title', category: "COALESCE(category, 'Operational')", generated: "DATE_FORMAT(generated_at, '%b %d, %Y %h:%i %p')", preparedBy: "COALESCE(prepared_by, 'System')", status: 'status' },
    create: { report: ['title', 'string', true], category: ['category', 'string', false], preparedBy: ['preparedBy', 'string', false], status: ['status', 'string', false] }, search: ['title', 'category', 'prepared_by', 'public_id'], order: 'generated_at',
  },
  admissions: {
    table: 'admissions', prefix: 'ADM', read: clinical, write: ['admin', 'nurse'],
    select: { id: 'public_id', patient: 'patient_name', reason: "COALESCE(reason, '')", bed: "COALESCE(bed, 'Unassigned')", nurse: "COALESCE(assigned_nurse, 'Unassigned')", status: 'status' },
    create: { patient: ['patient_name', 'string', true], reason: ['reason', 'string', false], bed: ['bed', 'string', false], nurse: ['assigned_nurse', 'string', false], status: ['status', 'string', false] }, search: ['patient_name', 'reason', 'bed', 'public_id'], order: 'admitted_at',
  },
  donors: {
    table: 'blood_donors', prefix: 'DON', read: ['admin', 'doctor', 'nurse', 'laboratory'], write: ['admin', 'nurse', 'laboratory'],
    select: { id: 'public_id', name: 'name', group: 'blood_group', location: "COALESCE(location, '')", donated: "COALESCE(DATE_FORMAT(last_donation, '%b %d, %Y'), 'Not yet donated')", status: 'status' },
    create: { name: ['name', 'string', true], group: ['blood_group', 'string', true], location: ['location', 'string', false], donated: ['last_donation', 'date', false], status: ['status', 'string', false], phone: ['phone', 'string', false] }, search: ['name', 'blood_group', 'location', 'public_id'], order: 'created_at',
  },
  prescriptions: {
    table: 'prescriptions', prefix: 'RX', read: [...clinical, 'pharmacist'], write: ['admin', 'doctor', 'pharmacist'],
    select: { id: 'public_id', patient: 'patient_name', physician: "COALESCE(physician, 'Unassigned')", items: 'items', status: 'status' },
    create: { patient: ['patient_name', 'string', true], physician: ['physician', 'string', false], items: ['items', 'string', true], status: ['status', 'string', false] }, search: ['patient_name', 'physician', 'items', 'public_id'], order: 'created_at',
  },
  ledger: {
    table: 'ledger_entries', prefix: 'LED', read: ['admin', 'accountant'], write: ['admin', 'accountant'],
    select: { id: 'public_id', account: 'account', type: 'entry_type', amount: "CONCAT(IF(entry_type = 'Revenue', '+ ', '- '), 'LKR ', FORMAT(amount, 0))", date: "DATE_FORMAT(entry_date, '%b %d, %Y')" },
    create: { account: ['account', 'string', true], type: ['entry_type', 'string', true], amount: ['amount', 'number', true], date: ['entry_date', 'date', true] }, search: ['account', 'entry_type', 'public_id'], order: 'entry_date',
  },
  claims: {
    table: 'insurance_claims', prefix: 'CLM', read: ['admin', 'accountant'], write: ['admin', 'accountant'],
    select: { id: 'public_id', patient: 'patient_name', insurer: 'insurer', service: 'service', amount: "CONCAT('LKR ', FORMAT(amount, 0))", status: 'status', submitted: "DATE_FORMAT(submitted_at, '%b %d, %Y')" },
    create: { patient: ['patient_name', 'string', true], insurer: ['insurer', 'string', true], service: ['service', 'string', true], amount: ['amount', 'number', true], status: ['status', 'string', false], submitted: ['submitted_at', 'date', false] }, search: ['patient_name', 'insurer', 'service', 'public_id'], order: 'submitted_at',
  },
  policies: {
    table: 'policies', prefix: 'POL', read: ['admin', 'doctor', 'nurse', 'pharmacist', 'laboratory', 'accountant'], write: ['admin'],
    select: { id: 'public_id', title: 'title', category: "COALESCE(category, 'General')", owner: "COALESCE(owner, 'Administration')", reviewed: "COALESCE(DATE_FORMAT(reviewed_at, '%b %d, %Y'), 'Not reviewed')", due: "COALESCE(DATE_FORMAT(review_due, '%b %d, %Y'), 'Not scheduled')", status: 'status' },
    create: { title: ['title', 'string', true], category: ['category', 'string', false], owner: ['owner', 'string', false], reviewed: ['reviewed_at', 'date', false], due: ['review_due', 'date', false], status: ['status', 'string', false] }, search: ['title', 'category', 'owner', 'public_id'], order: 'title',
  },
};

export const validResourceNames = Object.keys(resources);
