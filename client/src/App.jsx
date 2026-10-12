import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BedDouble,
  Bell,
  BriefcaseMedical,
  CalendarDays,
  ChartNoAxesCombined,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  Clock3,
  Download,
  Eye,
  EyeOff,
  FileText,
  Filter,
  FlaskConical,
  HeartPulse,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  MoreHorizontal,
  Pencil,
  Pill,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Stethoscope,
  Users,
  X,
} from 'lucide-react';
import RoleWorkspaces from './RoleWorkspaces.jsx';
import { apiRequest, login as apiLogin, logout as apiLogout, updateProfile as apiUpdateProfile } from './api.js';

const navigation = [
  {
    label: 'WORKSPACE',
    items: [
      { id: 'overview', label: 'Overview', icon: LayoutDashboard },
      { id: 'patients', label: 'Patients', icon: Users, count: '2,481' },
      { id: 'appointments', label: 'Appointments', icon: CalendarDays, count: '18' },
      { id: 'doctors', label: 'Doctors', icon: Stethoscope },
    ],
  },
  {
    label: 'HOSPITAL SERVICES',
    items: [
      { id: 'beds', label: 'Beds & wards', icon: BedDouble },
      { id: 'laboratory', label: 'Laboratory', icon: FlaskConical, count: '6' },
      { id: 'pharmacy', label: 'Pharmacy', icon: Pill },
      { id: 'billing', label: 'Billing', icon: CircleDollarSign },
    ],
  },
  {
    label: 'ADMINISTRATION',
    items: [
      { id: 'staff', label: 'Staff', icon: BriefcaseMedical },
      { id: 'reports', label: 'Reports', icon: ChartNoAxesCombined },
    ],
  },
  {
    label: 'CLINICAL WORKFLOWS',
    items: [
      { id: 'consultations', label: 'Consultations & EMR', icon: ClipboardList },
      { id: 'admissions', label: 'Admissions & nursing', icon: BedDouble },
      { id: 'portal', label: 'Patient portal', icon: HeartPulse },
    ],
  },
  {
    label: 'OPERATIONS & FINANCE',
    items: [
      { id: 'dispensing', label: 'Prescription dispensing', icon: Pill },
      { id: 'blood-bank', label: 'Blood bank', icon: Activity },
      { id: 'finance', label: 'Accounting & finance', icon: CircleDollarSign },
      { id: 'shifts', label: 'Staff & shifts', icon: BriefcaseMedical },
    ],
  },
  {
    label: 'GOVERNANCE',
    items: [
      { id: 'statutory', label: 'Birth & death records', icon: FileText },
      { id: 'policies', label: 'Policies & protocols', icon: ShieldCheck },
      { id: 'access', label: 'Users & access control', icon: Users },
    ],
  },
];

const initialRecords = {
  patients: [
    { id: 'PT-10482', name: 'Amara Perera', age: '34', contact: '+94 77 248 9183', blood: 'O+', lastVisit: 'Today, 09:42', status: 'In consultation' },
    { id: 'PT-10481', name: 'Kasun Fernando', age: '58', contact: '+94 71 663 2014', blood: 'A+', lastVisit: 'Today, 09:18', status: 'Admitted' },
    { id: 'PT-10480', name: 'Nimali Jayasinghe', age: '27', contact: '+94 76 552 3940', blood: 'B+', lastVisit: 'Today, 08:56', status: 'Waiting' },
    { id: 'PT-10479', name: 'Ruwan de Silva', age: '42', contact: '+94 72 441 8705', blood: 'AB+', lastVisit: 'Yesterday', status: 'Discharged' },
    { id: 'PT-10478', name: 'Sithmi Wijesuriya', age: '19', contact: '+94 75 904 6132', blood: 'O-', lastVisit: 'Yesterday', status: 'Waiting' },
    { id: 'PT-10477', name: 'Dilan Peris', age: '63', contact: '+94 70 991 0852', blood: 'A-', lastVisit: 'Oct 07, 2026', status: 'Admitted' },
  ],
  appointments: [
    { id: 'APT-0891', time: '09:30 AM', patient: 'Amara Perera', doctor: 'Dr. Nadeesha Silva', department: 'Cardiology', room: 'Room 204', status: 'In progress' },
    { id: 'APT-0892', time: '10:00 AM', patient: 'Nimali Jayasinghe', doctor: 'Dr. Chamath Dias', department: 'Neurology', room: 'Room 108', status: 'Confirmed' },
    { id: 'APT-0893', time: '10:30 AM', patient: 'Sithmi Wijesuriya', doctor: 'Dr. Nadeesha Silva', department: 'Cardiology', room: 'Room 204', status: 'Checked in' },
    { id: 'APT-0894', time: '11:00 AM', patient: 'Ruwan de Silva', doctor: 'Dr. Ishan Perera', department: 'Orthopedics', room: 'Room 312', status: 'Confirmed' },
    { id: 'APT-0895', time: '11:30 AM', patient: 'Dilan Peris', doctor: 'Dr. Chamath Dias', department: 'Neurology', room: 'Room 108', status: 'Waiting' },
    { id: 'APT-0896', time: '12:00 PM', patient: 'Madhavi Senanayake', doctor: 'Dr. Ishan Perera', department: 'Orthopedics', room: 'Room 312', status: 'Confirmed' },
  ],
  doctors: [
    { id: 'DR-024', name: 'Dr. Nadeesha Silva', specialty: 'Cardiology', schedule: '08:00 AM - 04:00 PM', patients: '12 today', location: 'Room 204', status: 'Available' },
    { id: 'DR-018', name: 'Dr. Chamath Dias', specialty: 'Neurology', schedule: '09:00 AM - 05:00 PM', patients: '9 today', location: 'Room 108', status: 'In consultation' },
    { id: 'DR-031', name: 'Dr. Ishan Perera', specialty: 'Orthopedics', schedule: '08:30 AM - 03:30 PM', patients: '7 today', location: 'Room 312', status: 'Available' },
    { id: 'DR-012', name: 'Dr. Malini Rodrigo', specialty: 'Pediatrics', schedule: '10:00 AM - 06:00 PM', patients: '11 today', location: 'Room 116', status: 'On break' },
  ],
  beds: [
    { id: 'WARD-01', ward: 'General ward A', type: 'Adult care', beds: '32 total', occupied: '26 occupied', nurse: 'M. Kumari', status: '81% occupied' },
    { id: 'WARD-02', ward: 'General ward B', type: 'Adult care', beds: '28 total', occupied: '19 occupied', nurse: 'S. Fernando', status: '68% occupied' },
    { id: 'WARD-03', ward: 'Intensive care', type: 'Critical care', beds: '16 total', occupied: '14 occupied', nurse: 'R. Bandara', status: '88% occupied' },
    { id: 'WARD-04', ward: 'Maternity', type: 'Maternity care', beds: '20 total', occupied: '11 occupied', nurse: 'D. Perera', status: '55% occupied' },
  ],
  laboratory: [
    { id: 'LAB-2381', patient: 'Kasun Fernando', test: 'Full blood count', orderedBy: 'Dr. Nadeesha Silva', collected: '09:14 AM', status: 'Processing' },
    { id: 'LAB-2380', patient: 'Amara Perera', test: 'Lipid profile', orderedBy: 'Dr. Nadeesha Silva', collected: '08:52 AM', status: 'Ready for review' },
    { id: 'LAB-2379', patient: 'Nimali Jayasinghe', test: 'MRI scan', orderedBy: 'Dr. Chamath Dias', collected: '08:27 AM', status: 'Processing' },
    { id: 'LAB-2378', patient: 'Sithmi Wijesuriya', test: 'Thyroid function', orderedBy: 'Dr. Malini Rodrigo', collected: 'Yesterday', status: 'Completed' },
  ],
  pharmacy: [
    { id: 'MED-1148', medicine: 'Amoxicillin 500mg', category: 'Antibiotics', stock: '24 packs', expiry: 'Feb 18, 2027', price: 'LKR 1,240', status: 'In stock' },
    { id: 'MED-1093', medicine: 'Metformin 850mg', category: 'Diabetes care', stock: '8 packs', expiry: 'Jan 05, 2027', price: 'LKR 890', status: 'Low stock' },
    { id: 'MED-1038', medicine: 'Atorvastatin 20mg', category: 'Cardiology', stock: '41 packs', expiry: 'Mar 22, 2027', price: 'LKR 1,560', status: 'In stock' },
    { id: 'MED-0981', medicine: 'Salbutamol inhaler', category: 'Respiratory', stock: '3 units', expiry: 'Dec 14, 2026', price: 'LKR 2,100', status: 'Low stock' },
    { id: 'MED-1172', medicine: 'Insulin Glargine 100U/mL', category: 'Diabetes care', stock: '6 pens', expiry: 'Aug 08, 2027', price: 'LKR 25,000', status: 'In stock' },
    { id: 'MED-1184', medicine: 'Erythropoietin Injection', category: 'Nephrology', stock: '2 vials', expiry: 'Sep 21, 2027', price: 'LKR 30,000', status: 'Low stock' },
    { id: 'MED-1191', medicine: 'Rituximab Infusion Kit', category: 'Oncology', stock: '1 unit', expiry: 'Jul 14, 2027', price: 'LKR 28,500', status: 'Low stock' },
    { id: 'MED-1204', medicine: 'Paracetamol 500mg', category: 'Pain relief', stock: '52 packs', expiry: 'May 11, 2027', price: 'LKR 420', status: 'In stock' },
    { id: 'MED-1208', medicine: 'Ibuprofen 400mg', category: 'Pain relief', stock: '18 packs', expiry: 'Apr 03, 2027', price: 'LKR 660', status: 'In stock' },
    { id: 'MED-1215', medicine: 'Omeprazole 20mg', category: 'Gastrointestinal', stock: '22 packs', expiry: 'Jun 29, 2027', price: 'LKR 740', status: 'In stock' },
  ],
  billing: [
    { id: 'INV-05042', patient: 'Amara Perera', service: 'Cardiology consultation', issued: 'Today, 09:48', amount: 'LKR 8,500', balance: 'LKR 0', status: 'Paid' },
    { id: 'INV-05041', patient: 'Kasun Fernando', service: 'In-patient care', issued: 'Today, 09:25', amount: 'LKR 42,000', balance: 'LKR 18,000', status: 'Partially paid' },
    { id: 'INV-05040', patient: 'Nimali Jayasinghe', service: 'MRI scan', issued: 'Today, 08:59', amount: 'LKR 24,500', balance: 'LKR 24,500', status: 'Pending' },
    { id: 'INV-05039', patient: 'Ruwan de Silva', service: 'Orthopedic consultation', issued: 'Yesterday', amount: 'LKR 6,500', balance: 'LKR 0', status: 'Paid' },
  ],
  staff: [
    { id: 'ST-0102', name: 'M. Kumari', role: 'Senior nurse', department: 'General ward A', shift: '07:00 AM - 03:00 PM', status: 'On duty' },
    { id: 'ST-0141', name: 'R. Bandara', role: 'Nurse', department: 'Intensive care', shift: '07:00 AM - 03:00 PM', status: 'On duty' },
    { id: 'ST-0068', name: 'P. Wickramasinghe', role: 'Lab technician', department: 'Laboratory', shift: '08:00 AM - 04:00 PM', status: 'On duty' },
    { id: 'ST-0213', name: 'K. Jayawardena', role: 'Pharmacist', department: 'Pharmacy', shift: '09:00 AM - 05:00 PM', status: 'On break' },
    { id: 'ST-0224', name: 'D. Perera', role: 'Midwife', department: 'Maternity', shift: '03:00 PM - 11:00 PM', status: 'Off duty' },
  ],
  reports: [
    { id: 'RPT-1028', report: 'Daily admissions summary', category: 'Patient care', generated: 'Today, 08:30', preparedBy: 'Admin team', status: 'Ready' },
    { id: 'RPT-1027', report: 'Revenue & collections', category: 'Finance', generated: 'Today, 08:15', preparedBy: 'Finance team', status: 'Ready' },
    { id: 'RPT-1026', report: 'Laboratory turnaround', category: 'Diagnostics', generated: 'Yesterday', preparedBy: 'Lab team', status: 'Ready' },
    { id: 'RPT-1025', report: 'Birth and death register', category: 'Statutory', generated: 'Oct 07, 2026', preparedBy: 'Admin team', status: 'Ready' },
  ],
};

const moduleDetails = {
  patients: { title: 'Patients', description: 'Manage patient profiles, visits and care status.', action: 'Add patient', primary: 'name', columns: [['Patient', 'name'], ['Patient ID', 'id'], ['Age', 'age'], ['Blood group', 'blood'], ['Last visit', 'lastVisit'], ['Status', 'status']] },
  appointments: { title: 'Appointments', description: 'Coordinate consultations across departments.', action: 'New appointment', primary: 'patient', columns: [['Time', 'time'], ['Patient', 'patient'], ['Physician', 'doctor'], ['Department', 'department'], ['Location', 'room'], ['Status', 'status']] },
  doctors: { title: 'Doctors', description: 'Physician directory and today’s clinic availability.', action: 'Add doctor', primary: 'name', columns: [['Physician', 'name'], ['Specialty', 'specialty'], ['Schedule', 'schedule'], ['Appointments', 'patients'], ['Location', 'location'], ['Status', 'status']] },
  beds: { title: 'Beds & wards', description: 'Live capacity and occupancy across inpatient units.', action: 'Add ward', primary: 'ward', columns: [['Ward', 'ward'], ['Care type', 'type'], ['Capacity', 'beds'], ['Occupancy', 'occupied'], ['Lead nurse', 'nurse'], ['Status', 'status']] },
  laboratory: { title: 'Laboratory', description: 'Track specimens, requested tests and result review.', action: 'Order test', primary: 'patient', columns: [['Request', 'id'], ['Patient', 'patient'], ['Investigation', 'test'], ['Requested by', 'orderedBy'], ['Collected', 'collected'], ['Status', 'status']] },
  pharmacy: { title: 'Pharmacy', description: 'Monitor medicine inventory, pricing and expiry dates.', action: 'Add medicine', primary: 'medicine', columns: [['Medicine', 'medicine'], ['Category', 'category'], ['Stock', 'stock'], ['Expiry date', 'expiry'], ['Unit price', 'price'], ['Status', 'status']] },
  billing: { title: 'Billing', description: 'Review invoices, payments and outstanding balances.', action: 'Create invoice', primary: 'patient', columns: [['Invoice', 'id'], ['Patient', 'patient'], ['Service', 'service'], ['Issued', 'issued'], ['Total', 'amount'], ['Balance', 'balance'], ['Status', 'status']] },
  staff: { title: 'Staff', description: 'Staff directory, departments and shift coverage.', action: 'Add staff member', primary: 'name', columns: [['Staff member', 'name'], ['Role', 'role'], ['Department', 'department'], ['Shift', 'shift'], ['Status', 'status']] },
  reports: { title: 'Reports', description: 'Operational, financial and statutory hospital reports.', action: 'Generate report', primary: 'report', columns: [['Report', 'report'], ['Category', 'category'], ['Generated', 'generated'], ['Prepared by', 'preparedBy'], ['Status', 'status']] },
};

const apiModules = ['patients', 'appointments', 'doctors', 'beds', 'laboratory', 'pharmacy', 'billing', 'staff', 'reports'];

function apiCreatePayload(module, form) {
  const dateOnly = form.date || undefined;
  const appointmentDate = form.date || new Date().toISOString().slice(0, 10);
  const payloads = {
    patients: { patientId: form.patientId, name: form.name, dateOfBirth: dateOnly, blood: form.bloodGroup || 'Unknown', status: 'Waiting' },
    appointments: { patient: form.name, department: form.department, scheduledAt: `${appointmentDate} 10:00:00`, status: 'Confirmed' },
    doctors: { name: form.name, specialty: form.department || 'General medicine', status: 'Available' },
    beds: { ward: form.name, type: form.department || 'General care', capacity: 0, occupied: 0 },
    laboratory: { patient: form.name, test: form.department || 'Test to specify', status: 'Processing' },
    pharmacy: { medicine: form.name, category: form.department || 'Uncategorized', stockQuantity: 0, expiry: dateOnly, price: 0, status: 'Low stock' },
    billing: { patient: form.name, service: form.department || 'General service', amount: Number(form.total || 0), balance: Number(form.balance || 0), status: Number(form.balance || 0) > 0 ? 'Pending' : 'Paid' },
    staff: { name: form.name, role: form.department || 'Staff member', status: 'On duty' },
    reports: { report: form.name, category: form.category || form.department || 'Operational', generated: form.date || 'Today', preparedBy: form.preparedBy || 'Admin team', status: 'Ready' },
  };
  return payloads[module];
}

const avatarImages = {
  doctor: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=120&h=120&q=80',
  patient: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=120&h=120&q=80',
};

function getSystemStatusMeta(apiStatus) {
  switch (apiStatus) {
    case 'connected':
      return { label: 'All systems operational', detail: 'Live database connected', tone: 'success' };
    case 'partial':
      return { label: 'System degraded', detail: 'Some services are unavailable', tone: 'warning' };
    case 'auth-required':
      return { label: 'Sign in required', detail: 'Authentication is required', tone: 'warning' };
    default:
      return { label: 'Demo mode active', detail: 'Database is offline; demo data only', tone: 'neutral' };
  }
}

function initials(name) {
  return name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('');
}

function ageFromDate(dateOfBirth) {
  if (!dateOfBirth) return '—';
  const birthDate = new Date(`${dateOfBirth}T00:00:00`);
  if (Number.isNaN(birthDate.getTime())) return '—';
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) age -= 1;
  return age >= 0 ? String(age) : '—';
}

function StatusBadge({ children }) {
  const normalized = children.toLowerCase();
  const tone = normalized.includes('paid') || normalized.includes('complete') || normalized.includes('ready') || normalized.includes('available') || normalized.includes('discharged') || normalized.includes('in stock') || normalized.includes('on duty')
    ? 'positive'
    : normalized.includes('progress') || normalized.includes('consultation') || normalized.includes('checked') || normalized.includes('processing') || normalized.includes('partial') || normalized.includes('occupied')
      ? 'active'
      : normalized.includes('low') || normalized.includes('pending') || normalized.includes('waiting') || normalized.includes('break') || normalized.includes('admitted')
        ? 'warning'
        : 'neutral';
  return <span className={`status-badge ${tone}`}><span className="status-dot" />{children}</span>;
}

function MetricCard({ label, value, footnote, icon: Icon, tint }) {
  return (
    <article className="metric-card">
      <div className={`metric-icon ${tint}`}><Icon size={18} strokeWidth={1.8} /></div>
      <div className="metric-label">{label}</div>
      <div className="metric-value-row"><strong>{value}</strong></div>
      <div className="metric-footnote">{footnote}</div>
    </article>
  );
}

function Sidebar({ active, onNavigate, open, onClose, user, apiStatus, onEditProfile, overview, records }) {
  const systemStatus = getSystemStatusMeta(apiStatus);
  const sidebarUserName = user?.name || (apiStatus === 'demo' ? 'Local demo user' : 'Meridian staff');
  const sidebarUserRole = user?.role || (apiStatus === 'demo' ? 'Demo mode' : 'Hospital system');
  const navCounts = {
    patients: overview?.patients ?? records?.patients?.length ?? 0,
    appointments: overview?.appointmentsToday ?? records?.appointments?.length ?? 0,
    laboratory: records?.laboratory?.length ?? 0,
    doctors: records?.doctors?.length ?? 0,
    staff: records?.staff?.length ?? 0,
    billing: records?.billing?.length ?? 0,
  };

  return (
    <>
      {open && <button className="sidebar-scrim" aria-label="Close navigation" onClick={onClose} />}
      <aside className={`sidebar ${open ? 'is-open' : ''}`}>
        <div className="brand-lockup">
          <div className="brand-mark"><HeartPulse size={22} strokeWidth={2.1} /></div>
          <div><strong>meridian</strong><span>MEDICAL CENTER</span></div>
          <button className="sidebar-close icon-button" aria-label="Close navigation" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="facility-switcher">
          <div className="facility-symbol"><ShieldCheck size={17} /></div>
          <div><strong>Colombo Central</strong><span>Main facility</span></div>
          <ChevronDown size={15} className="facility-chevron" />
        </div>
        <nav className="main-nav" aria-label="Main navigation">
          {navigation.map((group) => (
            <div className="nav-group" key={group.label}>
              <div className="nav-group-label">{group.label}</div>
              {group.items.map(({ id, label, icon: Icon }) => (
                <button key={id} className={`nav-item ${active === id ? 'selected' : ''}`} onClick={() => onNavigate(id)} aria-current={active === id ? 'page' : undefined}>
                  <Icon size={17} strokeWidth={1.8} /><span>{label}</span>
                  {id in navCounts && <small>{navCounts[id]?.toLocaleString?.() ?? navCounts[id]}</small>}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card"><div className="help-icon"><Activity size={16} /></div><div><strong>{systemStatus.label}</strong><span>{systemStatus.detail}</span></div><span className="pulse-dot" /></div>
          <button type="button" className="nav-item settings-link" onClick={() => onNavigate('settings')}><Settings2 size={17} /><span>Settings</span></button>
          <button type="button" className="sidebar-user" aria-label={user ? 'Edit signed-in user profile' : 'Sign in to edit profile'} onClick={onEditProfile}>
            <img src={avatarImages.doctor} alt={sidebarUserName} />
            <div><strong>{sidebarUserName}</strong><span>{sidebarUserRole}</span></div>
            <MoreHorizontal size={19} />
          </button>
        </div>
      </aside>
    </>
  );
}

function Dashboard({ onNavigate, onCreate, user, overview }) {
  const weekday = new Intl.DateTimeFormat('en', { weekday: 'long' }).format(new Date());
  const fullDate = new Intl.DateTimeFormat('en', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
  const appointments = overview?.appointments?.length ? overview.appointments : initialRecords.appointments;
  const appointmentTotal = overview?.appointmentsToday ?? appointments.length;
  const wards = overview?.wards?.length ? overview.wards : [
    { id: 'WARD-01', name: 'General ward A', capacity: 32, occupied: 26, available: 6 },
    { id: 'WARD-02', name: 'General ward B', capacity: 28, occupied: 19, available: 9 },
    { id: 'WARD-03', name: 'Intensive care', capacity: 16, occupied: 14, available: 2 },
    { id: 'WARD-04', name: 'Maternity', capacity: 20, occupied: 11, available: 9 },
  ];
  const beds = overview?.beds ?? { capacity: 96, occupied: 70, available: 26, occupancy: 72.9 };
  const careTeam = overview?.careTeam ?? {
    physiciansOnDuty: 3,
    staffOnDuty: 3,
    physicians: [
      { id: 'DR-018', name: 'Dr. Chamath Dias', specialty: 'Neurology', location: 'Room 108', status: 'In consultation' },
      { id: 'DR-031', name: 'Dr. Ishan Perera', specialty: 'Orthopedics', location: 'Room 312', status: 'Available' },
      { id: 'DR-024', name: 'Dr. Nadeesha Silva', specialty: 'Cardiology', location: 'Room 204', status: 'Available' },
    ],
  };
  const week = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - 6 + index);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return { key, label: new Intl.DateTimeFormat('en', { weekday: 'short' }).format(date), total: 0 };
  });
  const weeklyCounts = new Map((overview?.weeklyAppointments || []).map(({ date, total }) => [date, total]));
  week.forEach((day) => { day.total = weeklyCounts.get(day.key) || 0; });
  const weeklyTotal = week.reduce((total, day) => total + day.total, 0);
  const weeklyMax = Math.max(1, ...week.map((day) => day.total));
  const barHeights = week.map((day) => Math.max(12, Math.round((day.total / weeklyMax) * 100)));
  const occupancyPercent = beds?.occupancy ?? 0;
  const occupancyTrend = Math.max(0, Number(occupancyPercent) - 2.1);
  const formatMoney = (amount) => `LKR ${Number(amount || 0).toLocaleString('en-LK', { maximumFractionDigits: 0 })}`;
  const welcomeName = user?.name ? user.name.split(' ')[0] : 'care team';

  return (
    <>
      <section className="welcome-row">
        <div>
          <div className="eyebrow">{weekday.toUpperCase()} <span /> {fullDate.toUpperCase()}</div>
          <h1>{user ? `Good morning, ${welcomeName}` : 'Welcome to Meridian Medical Center'}</h1>
          <p>Here’s what’s happening across your hospital today.</p>
        </div>
        <button className="button button-primary" onClick={() => onCreate('appointments')}><Plus size={17} /> New appointment</button>
      </section>

      <section className="metric-grid" aria-label="Hospital overview">
        <MetricCard label="Total patients" value={overview?.patients?.toLocaleString() ?? '—'} footnote={overview?.patients == null ? 'Not available for this role' : 'Registered patient records'} icon={Users} tint="mint" />
        <MetricCard label="Appointments today" value={appointmentTotal?.toLocaleString() ?? '—'} footnote={appointmentTotal == null ? 'Not available for this role' : 'Scheduled for today'} icon={CalendarDays} tint="blue" />
        <MetricCard label="Bed occupancy" value={beds?.occupancy == null ? '—' : `${beds.occupancy}%`} footnote={beds ? `${beds.occupied} occupied · ${beds.available} available` : 'Not available for this role'} icon={BedDouble} tint="peach" />
        <MetricCard label="Billed this month" value={overview?.invoicedThisMonth == null ? '—' : formatMoney(overview.invoicedThisMonth)} footnote={overview?.invoicedThisMonth == null ? 'Not available for this role' : 'Issued invoices this month'} icon={CircleDollarSign} tint="yellow" />
      </section>

      <section className="dashboard-grid">
        <article className="panel appointments-panel">
          <div className="panel-heading">
            <div><h2>Today’s appointments</h2><p>Consultations scheduled for today</p></div>
            <button className="text-button" onClick={() => onNavigate('appointments')}>View schedule <ArrowRight size={15} /></button>
          </div>
          <div className="appointment-list">
            {appointments.map((appointment, index) => (
              <div className="appointment-item" key={appointment.id}>
                <div className="appointment-time"><strong>{appointment.time.replace(' AM', '')}</strong><span>AM</span></div>
                <div className={`appointment-avatar avatar-${index}`}><img src={index % 2 === 0 ? avatarImages.patient : avatarImages.doctor} alt="" /></div>
                <div className="appointment-person"><strong>{appointment.patient}</strong><span>{appointment.department} <i /> {appointment.doctor}</span></div>
                <StatusBadge>{appointment.status}</StatusBadge>
                <button type="button" className="icon-button row-more" aria-label={`More options for ${appointment.patient}`} onMouseDown={(event) => event.stopPropagation()} onClick={(event) => { event.preventDefault(); event.stopPropagation(); }}><MoreHorizontal size={18} /></button>
              </div>
            ))}
          </div>
          <button className="panel-footer-link" onClick={() => onNavigate('appointments')}>See all {appointmentTotal ?? 0} appointments <ArrowRight size={15} /></button>
        </article>

        <article className="panel occupancy-panel">
          <div className="panel-heading">
            <div><h2>Bed occupancy</h2><p>Capacity across all wards</p></div>
            <button className="icon-button" aria-label="More occupancy options"><MoreHorizontal size={19} /></button>
          </div>
          <div className="occupancy-summary"><strong>{beds?.occupancy == null ? '—' : `${Math.floor(beds.occupancy)}`}<span>{beds?.occupancy == null ? '' : `.${String(Math.round((beds.occupancy % 1) * 10))}%`}</span></strong><span className="occupancy-delta"><ArrowDownRight size={14} /> {beds?.occupancy == null ? '—' : `${Math.abs((occupancyPercent - 2.1)).toFixed(1)}%`}</span></div>
          <div className="occupancy-track"><span style={{ width: `${Math.min(100, Math.max(0, beds?.occupancy ?? 0))}%` }} /></div>
          <div className="occupancy-legend"><span><i className="legend-occupied" /> Occupied <strong>{beds?.occupied ?? 0}</strong></span><span><i className="legend-available" /> Available <strong>{beds?.available ?? 0}</strong></span></div>
          <div className="ward-list">
            {wards.map((ward) => (
              <div key={ward.id}>
                <span>{ward.name}</span>
                <div className="ward-progress"><i style={{ width: `${Math.min(100, ((ward.occupied || 0) / Math.max(1, ward.capacity || 1)) * 100)}%` }} /></div>
                <strong>{ward.occupied}/{ward.capacity}</strong>
              </div>
            ))}
          </div>
          <button className="panel-footer-link" onClick={() => onNavigate('beds')}>Manage beds & wards <ArrowRight size={15} /></button>
        </article>

        <article className="panel activity-panel">
          <div className="panel-heading">
            <div><h2>Patient activity</h2><p>Admissions and discharges this week</p></div>
            <button className="period-button">This week <ChevronDown size={14} /></button>
          </div>
          <div className="chart-summary"><strong>{weeklyTotal}</strong><span>patient visits</span><span className="chart-growth"><ArrowUpRight size={14} /> {weeklyTotal > 0 ? 'Live' : '0.0%'}</span></div>
          <div className="chart-area" aria-label="Patient activity trend">
            <div className="chart-y-labels"><span>60</span><span>40</span><span>20</span><span>0</span></div>
            <div className="bar-chart">{barHeights.map((height, index) => <div className="bar-column" key={week[index].key}><i style={{ height: `${height}%` }} className={index === week.length - 1 ? 'bar-current' : ''} /></div>)}</div>
          </div>
          <div className="chart-x-labels">{week.map((day) => <span key={day.key}>{day.label}</span>)}</div>
        </article>

        <article className="panel care-team-panel">
          <div className="panel-heading">
            <div><h2>Care team on duty</h2><p>{careTeam ? `${careTeam.physiciansOnDuty} physicians · ${careTeam.staffOnDuty} staff` : 'Live team data unavailable'}</p></div>
            <button className="text-button" onClick={() => onNavigate('staff')}>View team <ArrowRight size={15} /></button>
          </div>
          <div className="team-list">
            {(careTeam?.physicians || []).map((doctor, index) => (
              <div className="team-member" key={doctor.id || `${doctor.name}-${index}`}>
                <img src={avatarImages.doctor} alt="" />
                <div>
                  <strong>{doctor.name}</strong>
                  <span>{doctor.specialty} <i /> {doctor.location}</span>
                </div>
                <span className={`availability ${doctor.status === 'In consultation' ? 'busy' : ''}`}><i /> {doctor.status}</span>
              </div>
            ))}
          </div>
          <div className="team-note"><Clock3 size={15} /><span>Next shift handover at <strong>3:00 PM</strong></span><button className="icon-button" aria-label="View shift details"><ArrowRight size={15} /></button></div>
        </article>
      </section>
    </>
  );
}

function RecordTable({ module, records, query, onUpdateRecord, canEditPatients, onEditPatient }) {
  const details = moduleDetails[module];
  const [statusFilter, setStatusFilter] = useState('All records');
  const [exactStatus, setExactStatus] = useState('Any status');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterPosition, setFilterPosition] = useState({ top: 0, left: 0 });
  const [openMenu, setOpenMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const statuses = ['All records', 'Active', 'Needs attention'];
  const moduleStatusOptions = {
    staff: ['On duty', 'On break', 'Off duty'],
    patients: ['Waiting', 'In consultation', 'Admitted', 'Discharged'],
    appointments: ['Confirmed', 'Checked in', 'In progress', 'Waiting'],
    doctors: ['Available', 'In consultation', 'On break'],
    beds: ['0% occupied', '25% occupied', '50% occupied', '75% occupied'],
    laboratory: ['Processing', 'Ready for review', 'Completed'],
    pharmacy: ['In stock', 'Low stock', 'Out of stock'],
    billing: ['Paid', 'Partially paid', 'Pending'],
    reports: ['Ready', 'Processing', 'Archived'],
  };
  const availableStatuses = [...new Set([...(moduleStatusOptions[module] || []), ...records.map((record) => record.status).filter(Boolean)])];
  useEffect(() => {
    if (!filterOpen && !openMenu) return undefined;
    const closePopovers = () => {
      setFilterOpen(false);
      setOpenMenu(null);
    };
    window.addEventListener('resize', closePopovers);
    return () => window.removeEventListener('resize', closePopovers);
  }, [filterOpen, openMenu]);

  const filteredRows = useMemo(() => records.filter((record) => {
    const matchesQuery = Object.values(record).some((value) => String(value).toLowerCase().includes(query.toLowerCase()));
    const status = String(record.status || '').toLowerCase();
    const matchesStatus = statusFilter === 'All records'
      || (statusFilter === 'Active' && !status.includes('pending') && !status.includes('low stock') && !status.includes('waiting') && !status.includes('admitted'))
      || (statusFilter === 'Needs attention' && (status.includes('pending') || status.includes('low stock') || status.includes('waiting') || status.includes('admitted')));
    return matchesQuery && matchesStatus && (exactStatus === 'Any status' || record.status === exactStatus);
  }), [records, query, statusFilter, exactStatus]);
  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const visibleRows = filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const pageItems = pageCount <= 5
    ? Array.from({ length: pageCount }, (_, index) => index + 1)
    : [1, ...(currentPage > 3 ? ['ellipsis-start'] : []), ...Array.from({ length: 3 }, (_, index) => currentPage - 1 + index).filter((page) => page > 1 && page < pageCount), ...(currentPage < pageCount - 2 ? ['ellipsis-end'] : []), pageCount];

  useEffect(() => {
    setCurrentPage(1);
  }, [query, statusFilter, exactStatus]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, pageCount));
  }, [pageCount]);

  function setRowStatus(record, nextStatus) {
    setOpenMenu(null);
    if (!nextStatus || nextStatus === record.status) return;
    onUpdateRecord(module, record, nextStatus);
  }

  return (
    <section className="panel records-panel">
      <div className="records-toolbar">
        <div className="filter-tabs" role="group" aria-label="Filter records">
          {statuses.map((status) => <button key={status} className={statusFilter === status ? 'active' : ''} onClick={() => setStatusFilter(status)}>{status}{status === 'Needs attention' && <span className="filter-count">6</span>}</button>)}
        </div>
        <div className="toolbar-actions">
          <div className="filter-control">
            <button className={`button button-secondary ${filterOpen || exactStatus !== 'Any status' ? 'filter-active' : ''}`} aria-expanded={filterOpen} aria-haspopup="listbox" onClick={(event) => {
              if (filterOpen) {
                setFilterOpen(false);
                return;
              }
              const bounds = event.currentTarget.getBoundingClientRect();
              setFilterPosition({ top: Math.min(bounds.bottom + 6, Math.max(8, window.innerHeight - 340)), left: Math.min(bounds.right - 218, window.innerWidth - 226) });
              setFilterOpen(true);
              setOpenMenu(null);
            }}><Filter size={15} /> Filter{exactStatus !== 'Any status' && <span className="filter-count">1</span>}</button>
            {filterOpen && createPortal(<div className="filter-popover" role="listbox" aria-label="Filter by status" style={{ top: filterPosition.top, left: filterPosition.left }}>
              <div className="filter-popover-heading"><strong>Filter by status</strong><button className="text-button" onClick={() => setExactStatus('Any status')}>Clear</button></div>
              <button role="option" aria-selected={exactStatus === 'Any status'} className="filter-option" onClick={() => { setExactStatus('Any status'); setFilterOpen(false); }}>Any status<span className="filter-option-count">{records.length}</span></button>
              {availableStatuses.map((status) => <button key={status} role="option" aria-selected={exactStatus === status} className="filter-option" onClick={() => { setExactStatus(status); setFilterOpen(false); }}>{status}<span className="filter-option-count">{records.filter((record) => record.status === status).length}</span></button>)}
            </div>, document.body)}
          </div>
          <button className="button button-secondary" onClick={() => {
            const header = details.columns.map(([label]) => label);
            const rows = filteredRows.map((record) => details.columns.map(([, key]) => String(record[key] ?? '')));
            const csv = [header, ...rows].map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(',')).join('\r\n');
            const link = document.createElement('a');
            link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
            link.download = `${module}-records.csv`;
            link.click();
            URL.revokeObjectURL(link.href);
          }}><Download size={15} /> Export</button>
        </div>
      </div>
      <div className="table-scroll">
        <table>
          <thead><tr>{details.columns.map(([label]) => <th key={label}>{label}</th>)}<th><span className="sr-only">Actions</span></th></tr></thead>
          <tbody>
            {visibleRows.map((record, index) => (
              <tr key={record.id || `${record[details.primary]}-${index}`}>
                {details.columns.map(([label, key], columnIndex) => <td key={key}>
                  {key === 'status' ? <StatusBadge>{record[key]}</StatusBadge>
                    : (module === 'patients' && key === 'name') || (module === 'doctors' && key === 'name') || (module === 'staff' && key === 'name')
                      ? <div className="table-person"><span className={`table-avatar avatar-tone-${index % 4}`}>{initials(record[key])}</span><strong>{record[key]}</strong></div>
                      : columnIndex === 0 && module === 'appointments' ? <strong className="table-strong">{record[key]}</strong>
                        : <span className={columnIndex === 0 ? 'table-strong' : ''}>{record[key]}</span>}
                </td>)}
                <td><div className="row-action-wrap"><button type="button" className="icon-button row-more" aria-label={`More options for ${record[details.primary] || record.id}`} aria-expanded={openMenu === record.id} onMouseDown={(event) => event.stopPropagation()} onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  if (openMenu === record.id) {
                    setOpenMenu(null);
                    return;
                  }
                  const bounds = event.currentTarget.getBoundingClientRect();
                  setMenuPosition({ top: Math.min(bounds.bottom + 4, Math.max(8, window.innerHeight - 300)), left: Math.min(bounds.right - 205, window.innerWidth - 213) });
                  setOpenMenu(record.id);
                  setFilterOpen(false);
                }}><MoreHorizontal size={18} /></button>
                  {openMenu === record.id && createPortal(<div className="row-action-menu" role="menu" onMouseDown={(event) => event.stopPropagation()} style={{ top: menuPosition.top, left: menuPosition.left }}>{module === 'patients' && canEditPatients && <button type="button" role="menuitem" onClick={() => { onEditPatient(record); setOpenMenu(null); }}><Pencil size={14} /> Edit patient</button>}{module === 'appointments' && <button type="button" role="menuitem" onClick={() => { onEditPatient(record); setOpenMenu(null); }}><Pencil size={14} /> Edit appointment</button>}{module === 'billing' && <button type="button" role="menuitem" onClick={() => { onEditPatient(record); setOpenMenu(null); }}><Pencil size={14} /> Edit invoice</button>}<button type="button" role="menuitem" onClick={() => { setSelectedRecord(record); setOpenMenu(null); }}><FileText size={14} /> View details</button><div className="row-menu-divider" /><div className="row-menu-label">Change status</div>{availableStatuses.map((status) => <button type="button" role="menuitem" key={status} disabled={status === record.status} onClick={() => setRowStatus(record, status)}><span className={`menu-status-dot ${status === record.status ? 'current' : ''}`} />{status}{status === record.status && <Check size={13} />}</button>)}</div>, document.body)}
                </div></td>
              </tr>
            ))}
            {filteredRows.length === 0 && <tr><td colSpan={details.columns.length + 1} className="empty-state"><Search size={18} /><strong>No matching records</strong><span>Try another search or filter.</span></td></tr>}
          </tbody>
        </table>
      </div>
      <div className="table-footer"><span>Showing <strong>{filteredRows.length ? (currentPage - 1) * pageSize + 1 : 0}-{Math.min(currentPage * pageSize, filteredRows.length)}</strong> of <strong>{filteredRows.length}</strong> records</span><div className="pagination"><button className="icon-button" aria-label="Previous page" disabled={currentPage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}><ChevronLeft size={17} /></button>{pageItems.map((page) => typeof page === 'number' ? <button key={page} className={`page-number ${currentPage === page ? 'current-page' : ''}`} aria-label={`Page ${page}`} aria-current={currentPage === page ? 'page' : undefined} onClick={() => setCurrentPage(page)}>{page}</button> : <span key={page}>...</span>)}<button className="icon-button" aria-label="Next page" disabled={currentPage === pageCount} onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}><ChevronRight size={17} /></button></div></div>
      {selectedRecord && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setSelectedRecord(null)}><section className="modal record-details-modal" role="dialog" aria-modal="true" aria-labelledby="record-details-title"><div className="modal-heading"><div><span className="modal-kicker">{selectedRecord.id}</span><h2 id="record-details-title">{selectedRecord[details.primary] || selectedRecord.name || selectedRecord.id}</h2><p>{details.title} record details</p></div><button className="icon-button" aria-label="Close details" onClick={() => setSelectedRecord(null)}><X size={19} /></button></div><div className="record-detail-grid">{details.columns.map(([label, key]) => <div key={key}><span>{label}</span><strong>{selectedRecord[key] || '—'}</strong></div>)}</div><div className="modal-actions">{module === 'patients' && canEditPatients && <button className="button button-primary" onClick={() => { const patient = selectedRecord; setSelectedRecord(null); onEditPatient(patient); }}><Pencil size={15} /> Edit patient</button>}<button className="button button-secondary" onClick={() => setSelectedRecord(null)}>Close</button></div></section></div>}
    </section>
  );
}

function CreateModal({ module, onClose, onSubmit }) {
  const details = moduleDetails[module];
  const [name, setName] = useState('');
  const [patientId, setPatientId] = useState(() => {
    const dateStamp = new Date().toISOString().slice(0, 10).replaceAll('-', '');
    const randomSuffix = Array.from(crypto.getRandomValues(new Uint8Array(3)), (value) => value.toString(16).padStart(2, '0')).join('').toUpperCase();
    return `PT-${dateStamp}-${randomSuffix}`;
  });
  const [department, setDepartment] = useState('');
  const [reportCategory, setReportCategory] = useState('');
  const [reportPreparedBy, setReportPreparedBy] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [total, setTotal] = useState('0');
  const [balance, setBalance] = useState('0');
  const [date, setDate] = useState('');
  if (!details) return null;
  const primaryLabel = module === 'patients' ? 'Patient name' : module === 'appointments' ? 'Patient name' : module === 'pharmacy' ? 'Medicine name' : module === 'laboratory' ? 'Patient name' : module === 'billing' ? 'Patient name' : module === 'beds' ? 'Ward name' : module === 'reports' ? 'Report name' : 'Full name';
  const secondaryLabel = module === 'patients' ? 'Blood group' : module === 'appointments' ? 'Department' : module === 'laboratory' ? 'Investigation' : module === 'pharmacy' ? 'Category' : module === 'billing' ? 'Service' : module === 'staff' ? 'Role' : module === 'reports' ? 'Category' : 'Department';
  const departmentOptions = ['General medicine', 'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology', 'Oncology', 'Radiology', 'Emergency medicine'];
  const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];
  const laboratoryOptions = ['Full blood count', 'Lipid profile', 'Blood glucose', 'Liver function test', 'Kidney function test', 'Urine analysis', 'ECG', 'Chest X-ray', 'MRI scan', 'Thyroid profile'];
  const pharmacyOptions = ['Amoxicillin 500mg', 'Metformin 850mg', 'Atorvastatin 20mg', 'Salbutamol inhaler', 'Paracetamol 500mg', 'Ibuprofen 400mg', 'Omeprazole 20mg', 'Amlodipine 5mg', 'Vitamin D3', 'Cefuroxime 250mg', 'Insulin Glargine 100U/mL', 'Erythropoietin Injection', 'Rituximab Infusion Kit', 'Captopril 25mg', 'Lansoprazole 30mg', 'Prednisolone 5mg', 'Loratadine 10mg', 'Salmeterol inhaler', 'Metoprolol 50mg', 'Hydrocortisone cream'];
  const billingServices = ['Cardiology consultation', 'Neurology consultation', 'Orthopedic consultation', 'General medicine consultation', 'Pediatric consultation', 'MRI scan', 'ECG', 'Blood test', 'X-ray', 'In-patient care', 'Pharmacy dispense', 'Emergency admission'];
  const reportNames = ['Daily admissions summary', 'Revenue & collections', 'Laboratory turnaround', 'Birth and death register', 'Patient census report', 'Ward occupancy report', 'Pharmacy stock report', 'Clinical audit summary'];
  const reportCategories = ['Patient care', 'Finance', 'Diagnostics', 'Statutory', 'Operations', 'Quality assurance'];
  const reportPreparedByOptions = ['Admin team', 'Finance team', 'Lab team', 'Clinical leadership', 'Nursing office', 'Pharmacy team'];

  function submit(event) {
    event.preventDefault();
    if (!name.trim()) return;
    onSubmit(module, {
      name: name.trim(),
      patientId: patientId.trim(),
      department: department.trim(),
      category: reportCategory.trim(),
      preparedBy: reportPreparedBy.trim(),
      bloodGroup: bloodGroup.trim(),
      total: Number(total || 0),
      balance: Number(balance || 0),
      date,
    });
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-heading"><div><span className="modal-kicker">MERIDIAN MEDICAL CENTER</span><h2 id="modal-title">{details.action}</h2><p>Add a new record to the hospital workspace.</p></div><button className="icon-button" aria-label="Close dialog" onClick={onClose}><X size={19} /></button></div>
        <form onSubmit={submit}>
          {module === 'pharmacy' ? (
            <label>
              {primaryLabel}
              <select value={name} onChange={(event) => setName(event.target.value)} required>
                <option value="">Select medicine</option>
                {pharmacyOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
          ) : module === 'reports' ? (
            <label>
              {primaryLabel}
              <select value={name} onChange={(event) => setName(event.target.value)} required>
                <option value="">Select report name</option>
                {reportNames.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
          ) : (
            <label>{primaryLabel}<input autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder={primaryLabel} required /></label>
          )}
          {module === 'patients' && <label>Patient ID<input value={patientId} onChange={(event) => setPatientId(event.target.value.toUpperCase())} maxLength={32} pattern="PT-[A-Z0-9-]+|[0-9]{6,32}" title="Use a PT- ID or a numeric ID with 6 to 32 digits." required /></label>}
          {module === 'patients' ? (
            <label>
              {secondaryLabel}
              <select value={bloodGroup} onChange={(event) => setBloodGroup(event.target.value)} required>
                <option value="">Select blood group</option>
                {bloodGroupOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
          ) : module === 'appointments' ? (
            <label>
              {secondaryLabel}
              <select value={department} onChange={(event) => setDepartment(event.target.value)} required>
                <option value="">Select department</option>
                {departmentOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
          ) : module === 'laboratory' ? (
            <label>
              {secondaryLabel}
              <select value={department} onChange={(event) => setDepartment(event.target.value)} required>
                <option value="">Select investigation</option>
                {laboratoryOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
          ) : module === 'pharmacy' ? (
            <label>
              {secondaryLabel}
              <select value={department} onChange={(event) => setDepartment(event.target.value)} required>
                <option value="">Select medicine category</option>
                {['Antibiotics', 'Diabetes care', 'Cardiology', 'Respiratory', 'Pain relief', 'Gastrointestinal', 'Antihypertensives', 'Vitamins', 'Antifungals'].map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
          ) : module === 'billing' ? (
            <label>
              {secondaryLabel}
              <select value={department} onChange={(event) => setDepartment(event.target.value)} required>
                <option value="">Select service</option>
                {billingServices.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
          ) : module === 'reports' ? (
            <label>
              {secondaryLabel}
              <select value={reportCategory} onChange={(event) => setReportCategory(event.target.value)} required>
                <option value="">Select category</option>
                {reportCategories.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
          ) : (
            <label>{secondaryLabel}<input value={department} onChange={(event) => setDepartment(event.target.value)} placeholder={`Enter ${secondaryLabel.toLowerCase()}`} /></label>
          )}
          {module === 'billing' && (
            <>
              <label htmlFor="billing-total">Total (LKR)<input id="billing-total" type="number" min="0" step="1" value={total} onChange={(event) => setTotal(event.target.value)} required /></label>
              <label htmlFor="billing-balance">Balance (LKR)<input id="billing-balance" type="number" min="0" step="1" value={balance} onChange={(event) => setBalance(event.target.value)} required /></label>
            </>
          )}
          {module === 'reports' && (
            <>
              <label>
                Generated
                <select value={date} onChange={(event) => setDate(event.target.value)} required>
                  <option value="">Select generated date</option>
                  {['Today', 'Yesterday', 'This week', 'Last 7 days', 'This month'].map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>
              <label>
                Prepared by
                <select value={reportPreparedBy} onChange={(event) => setReportPreparedBy(event.target.value)} required>
                  <option value="">Select prepared by</option>
                  {reportPreparedByOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>
            </>
          )}
          {module !== 'reports' && <label>{module === 'appointments' ? 'Appointment date' : module === 'patients' ? 'Date of birth' : 'Date'}<input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>}
          <div className="modal-actions"><button type="button" className="button button-secondary" onClick={onClose}>Cancel</button><button type="submit" className="button button-primary"><Check size={16} /> Save record</button></div>
        </form>
      </section>
    </div>
  );
}

function PatientEditModal({ patient, onClose, onSubmit }) {
  const [patientId, setPatientId] = useState(patient.id || '');
  const [name, setName] = useState(patient.name || '');
  const [dateOfBirth, setDateOfBirth] = useState(patient.dateOfBirth || '');
  const [bloodGroup, setBloodGroup] = useState(patient.blood || 'Unknown');
  const [status, setStatus] = useState(patient.status || 'Waiting');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];
  const statuses = [...new Set(['Waiting', 'Admitted', 'In consultation', 'Discharged', status])];

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSubmit(patient, { patientId: patientId.trim(), name: name.trim(), dateOfBirth, blood: bloodGroup, status });
    } catch (saveError) {
      setError(saveError.message || 'Could not update this patient. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="patient-edit-title"><div className="modal-heading"><div><span className="modal-kicker">PATIENT {patient.id}</span><h2 id="patient-edit-title">Edit patient</h2><p>Update this patient’s record.</p></div><button type="button" className="icon-button" aria-label="Close patient editor" onClick={onClose} disabled={saving}><X size={19} /></button></div><form onSubmit={submit}><label htmlFor="patient-edit-id">Patient ID<input id="patient-edit-id" value={patientId} onChange={(event) => setPatientId(event.target.value.toUpperCase())} maxLength={32} pattern="PT-[A-Z0-9-]+" title="Use an ID starting with PT- and containing letters, numbers, or hyphens." required /></label><label htmlFor="patient-edit-name">Patient name<input id="patient-edit-name" autoFocus value={name} onChange={(event) => setName(event.target.value)} maxLength={160} required /></label><label htmlFor="patient-edit-dob">Date of birth<input id="patient-edit-dob" type="date" value={dateOfBirth} onChange={(event) => setDateOfBirth(event.target.value)} /></label><label htmlFor="patient-edit-blood">Blood group<select id="patient-edit-blood" value={bloodGroup} onChange={(event) => setBloodGroup(event.target.value)} required>{bloodGroups.map((group) => <option key={group} value={group}>{group}</option>)}</select></label><label htmlFor="patient-edit-status">Status<select id="patient-edit-status" value={status} onChange={(event) => setStatus(event.target.value)} required>{statuses.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>{error && <p className="login-error" role="alert">{error}</p>}<div className="modal-actions"><button type="button" className="button button-secondary" onClick={onClose} disabled={saving}>Cancel</button><button type="submit" className="button button-primary" disabled={saving}><Check size={15} />{saving ? 'Saving...' : 'Save changes'}</button></div></form></section></div>;
}

function BillingEditModal({ invoice, onClose, onSubmit }) {
  const [patient, setPatient] = useState(invoice.patient || '');
  const [service, setService] = useState(invoice.service || 'General medicine consultation');
  const [total, setTotal] = useState(String((invoice.amount || 'LKR 0').replace(/[^\d.-]/g, '') || '0'));
  const [balance, setBalance] = useState(String((invoice.balance || 'LKR 0').replace(/[^\d.-]/g, '') || '0'));
  const [status, setStatus] = useState(invoice.status || 'Pending');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSubmit(invoice, {
        patient: patient.trim(),
        service,
        total: Number(total || 0),
        balance: Number(balance || 0),
        status,
      });
    } catch (saveError) {
      setError(saveError.message || 'Could not update this invoice. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="invoice-edit-title"><div className="modal-heading"><div><span className="modal-kicker">INVOICE {invoice.id}</span><h2 id="invoice-edit-title">Edit invoice</h2><p>Update the invoice totals and status.</p></div><button type="button" className="icon-button" aria-label="Close invoice editor" onClick={onClose} disabled={saving}><X size={19} /></button></div><form onSubmit={submit}><label htmlFor="invoice-edit-patient">Patient name<input id="invoice-edit-patient" autoFocus value={patient} onChange={(event) => setPatient(event.target.value)} maxLength={160} required /></label><label htmlFor="invoice-edit-service">Service<select id="invoice-edit-service" value={service} onChange={(event) => setService(event.target.value)} required>{['Cardiology consultation', 'Neurology consultation', 'Orthopedic consultation', 'General medicine consultation', 'Pediatric consultation', 'MRI scan', 'ECG', 'Blood test', 'X-ray', 'In-patient care', 'Pharmacy dispense', 'Emergency admission'].map((option) => <option key={option} value={option}>{option}</option>)}</select></label><label htmlFor="invoice-edit-total">Total (LKR)<input id="invoice-edit-total" type="number" min="0" step="1" value={total} onChange={(event) => setTotal(event.target.value)} required /></label><label htmlFor="invoice-edit-balance">Balance (LKR)<input id="invoice-edit-balance" type="number" min="0" step="1" value={balance} onChange={(event) => setBalance(event.target.value)} required /></label><label htmlFor="invoice-edit-status">Status<select id="invoice-edit-status" value={status} onChange={(event) => setStatus(event.target.value)} required>{['Paid', 'Partially paid', 'Pending'].map((option) => <option key={option} value={option}>{option}</option>)}</select></label>{error && <p className="login-error" role="alert">{error}</p>}<div className="modal-actions"><button type="button" className="button button-secondary" onClick={onClose} disabled={saving}>Cancel</button><button type="submit" className="button button-primary" disabled={saving}><Check size={15} />{saving ? 'Saving...' : 'Save invoice'}</button></div></form></section></div>;
}

function AppointmentEditModal({ appointment, onClose, onSubmit }) {
  const departmentDoctors = {
    'General medicine': ['Dr. Nadeesha Silva', 'Dr. Ishan Perera'],
    Cardiology: ['Dr. Nadeesha Silva', 'Dr. Malini Rodrigo'],
    Neurology: ['Dr. Chamath Dias', 'Dr. Nadeesha Silva'],
    Orthopedics: ['Dr. Ishan Perera', 'Dr. Chamath Dias'],
    Pediatrics: ['Dr. Malini Rodrigo', 'Dr. Nadeesha Silva'],
    Dermatology: ['Dr. Malini Rodrigo', 'Dr. Ishan Perera'],
    Oncology: ['Dr. Chamath Dias', 'Dr. Ishan Perera'],
  };

  const departmentRooms = {
    'General medicine': ['Room 101', 'Room 102'],
    Cardiology: ['Room 204', 'Room 206'],
    Neurology: ['Room 108', 'Room 110'],
    Orthopedics: ['Room 312', 'Room 314'],
    Pediatrics: ['Room 116', 'Room 118'],
    Dermatology: ['Room 302', 'Room 304'],
    Oncology: ['Room 210', 'Room 212'],
  };

  const [patient, setPatient] = useState(appointment.patient || '');
  const [department, setDepartment] = useState(appointment.department || 'General medicine');
  const [doctor, setDoctor] = useState(() => {
    const options = departmentDoctors[appointment.department || 'General medicine'] || [];
    return options.includes(appointment.doctor) ? appointment.doctor : options[0] || 'Unassigned';
  });
  const [room, setRoom] = useState(() => {
    const options = departmentRooms[appointment.department || 'General medicine'] || [];
    return options.includes(appointment.room) ? appointment.room : options[0] || 'To be assigned';
  });
  const [status, setStatus] = useState(appointment.status || 'Confirmed');
  const [time, setTime] = useState(() => {
    const match = String(appointment.time || '09:00 AM').match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!match) return '09:00';
    let hours = Number(match[1]);
    const minutes = Number(match[2]);
    const meridiem = match[3].toUpperCase();
    if (meridiem === 'PM' && hours !== 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  });
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const availableDoctors = departmentDoctors[department] || ['Unassigned'];
  const availableRooms = departmentRooms[department] || ['To be assigned'];

  function toDisplayTime(value) {
    if (!value) return '09:00 AM';
    const [hoursStr, minutesStr] = value.split(':');
    let hours = Number(hoursStr);
    const minutes = Number(minutesStr) || 0;
    const suffix = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${String(minutes).padStart(2, '0')} ${suffix}`;
  }

  function handleDepartmentChange(nextDepartment) {
    const nextDoctors = departmentDoctors[nextDepartment] || ['Unassigned'];
    const nextRooms = departmentRooms[nextDepartment] || ['To be assigned'];
    setDepartment(nextDepartment);
    if (!nextDoctors.includes(doctor)) setDoctor(nextDoctors[0] || 'Unassigned');
    if (!nextRooms.includes(room)) setRoom(nextRooms[0] || 'To be assigned');
  }

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSubmit(appointment, {
        patient: patient.trim(),
        doctor: doctor.trim(),
        department,
        room,
        time: toDisplayTime(time),
        status,
        date,
      });
    } catch (saveError) {
      setError(saveError.message || 'Could not update this appointment. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="appointment-edit-title"><div className="modal-heading"><div><span className="modal-kicker">APPOINTMENT {appointment.id}</span><h2 id="appointment-edit-title">Edit appointment</h2><p>Update the consultation details.</p></div><button type="button" className="icon-button" aria-label="Close appointment editor" onClick={onClose} disabled={saving}><X size={19} /></button></div><form onSubmit={submit}><label htmlFor="appointment-edit-patient">Patient name<input id="appointment-edit-patient" autoFocus value={patient} onChange={(event) => setPatient(event.target.value)} maxLength={160} required /></label><label htmlFor="appointment-edit-department">Department<select id="appointment-edit-department" value={department} onChange={(event) => handleDepartmentChange(event.target.value)} required>{['General medicine', 'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology', 'Oncology'].map((option) => <option key={option} value={option}>{option}</option>)}</select></label><label htmlFor="appointment-edit-doctor">Physician<select id="appointment-edit-doctor" value={doctor} onChange={(event) => setDoctor(event.target.value)} required>{availableDoctors.map((option) => <option key={option} value={option}>{option}</option>)}</select></label><label htmlFor="appointment-edit-room">Room<select id="appointment-edit-room" value={room} onChange={(event) => setRoom(event.target.value)} required>{availableRooms.map((option) => <option key={option} value={option}>{option}</option>)}</select></label><label htmlFor="appointment-edit-date">Appointment date<input id="appointment-edit-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label><label htmlFor="appointment-edit-time">Appointment time<input id="appointment-edit-time" type="time" value={time} onChange={(event) => setTime(event.target.value)} required /></label><label htmlFor="appointment-edit-status">Status<select id="appointment-edit-status" value={status} onChange={(event) => setStatus(event.target.value)} required>{['Confirmed', 'Checked in', 'In progress', 'Waiting'].map((option) => <option key={option} value={option}>{option}</option>)}</select></label>{error && <p className="login-error" role="alert">{error}</p>}<div className="modal-actions"><button type="button" className="button button-secondary" onClick={onClose} disabled={saving}>Cancel</button><button type="submit" className="button button-primary" disabled={saving}><Check size={15} />{saving ? 'Saving...' : 'Save appointment'}</button></div></form></section></div>;
}

function LoginModal({ onClose, onLogin, onDemo }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await onLogin(email, password);
    } catch (loginError) {
      setError(loginError.status === 503
        ? 'MySQL is unavailable. Start the database for staff sign-in, or use the local demo below.'
        : loginError.status >= 500
          ? 'The sign-in service is unavailable. Use the local demo or try again later.'
          : loginError.status
            ? loginError.message
            : 'Cannot reach the sign-in API. Start the backend, or use the local demo below.');
    } finally {
      setSubmitting(false);
    }
  }

  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="login-title"><div className="modal-heading"><div><span className="modal-kicker">MERIDIAN MEDICAL CENTER</span><h2 id="login-title">Sign in to your workspace</h2><p>Use your hospital account credentials.</p></div><button className="icon-button" aria-label="Close dialog" onClick={onClose}><X size={19} /></button></div><form onSubmit={submit}><label htmlFor="login-email">Email address</label><input id="login-email" type="email" autoComplete="username" autoFocus value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@hospital.org" required /><label htmlFor="login-password">Password</label><span className="password-field"><input id="login-password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" required /><button type="button" className="password-toggle" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></span>{error && <p className="login-error" role="alert">{error}</p>}<div className="modal-actions"><button type="button" className="button button-secondary" onClick={onClose}>Cancel</button><button type="submit" className="button button-primary" disabled={submitting}><LogIn size={15} />{submitting ? 'Signing in...' : 'Sign in'}</button></div><div className="demo-login"><span>Database unavailable?</span><button type="button" className="text-button" onClick={onDemo}>Continue in local demo mode <ArrowRight size={14} /></button></div></form></section></div>;
}

function ProfileModal({ user, onClose, onSave }) {
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [department, setDepartment] = useState(user.department || '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSave({ name: name.trim(), email: email.trim(), department: department.trim() });
    } catch (saveError) {
      setError(saveError.message || 'Could not save your profile. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="profile-title"><div className="modal-heading"><div><span className="modal-kicker">MERIDIAN STAFF</span><h2 id="profile-title">Edit profile</h2><p>Update the details shown on your account.</p></div><button type="button" className="icon-button" aria-label="Close profile editor" onClick={onClose}><X size={19} /></button></div><form onSubmit={submit}><label htmlFor="profile-name">Full name<input id="profile-name" autoFocus value={name} onChange={(event) => setName(event.target.value)} minLength={2} maxLength={160} required /></label><label htmlFor="profile-email">Email address<input id="profile-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} maxLength={190} required /></label><label htmlFor="profile-department">Department<input id="profile-department" value={department} onChange={(event) => setDepartment(event.target.value)} maxLength={100} /></label>{error && <p className="login-error" role="alert">{error}</p>}<div className="modal-actions"><button type="button" className="button button-secondary" onClick={onClose} disabled={saving}>Cancel</button><button type="submit" className="button button-primary" disabled={saving}><Check size={15} />{saving ? 'Saving...' : 'Save profile'}</button></div></form></section></div>;
}

function App() {
  const [active, setActive] = useState('overview');
  const [records, setRecords] = useState(initialRecords);
  const [search, setSearch] = useState('');
  const [modalModule, setModalModule] = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [apiStatus, setApiStatus] = useState('demo');
  const [overview, setOverview] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [apiRole, setApiRole] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const topbarDateLabel = new Intl.DateTimeFormat('en', { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date());

  async function loadApiRecords() {
    try {
      await apiRequest('/health');
      const identity = await apiRequest('/v1/auth/me');
      const hasAuthenticatedUser = Boolean(identity.data?.id);
      setApiRole(identity.data?.role || null);
      if (hasAuthenticatedUser) setAuthUser(identity.data);

      let overviewData = null;
      try {
        const overviewResponse = await apiRequest('/v1/overview');
        overviewData = overviewResponse.data;
      } catch (overviewError) {
        overviewData = null;
      }
      setOverview(overviewData);

      const results = await Promise.allSettled(apiModules.map((module) => apiRequest(`/v1/${module}`)));
      const fallbackRecords = Object.fromEntries(apiModules.map((module) => [module, initialRecords[module] || []]));
      setRecords((current) => ({
        ...current,
        ...Object.fromEntries(apiModules.map((module, index) => {
          const result = results[index];
          const resolved = result.status === 'fulfilled' ? result.value.data : [];
          if (module === 'staff' && Array.isArray(resolved) && resolved.length > 0) {
            const mergedStaff = [...fallbackRecords.staff];
            resolved.forEach((serverMember) => {
              const matchingIndex = mergedStaff.findIndex((member) => member.name.trim().toLowerCase() === serverMember.name.trim().toLowerCase());
              if (matchingIndex >= 0) mergedStaff[matchingIndex] = { ...mergedStaff[matchingIndex], ...serverMember };
              else mergedStaff.push(serverMember);
            });
            return [module, mergedStaff];
          }
          const recordsToUse = Array.isArray(resolved) && resolved.length > 0 ? resolved : fallbackRecords[module];
          return [module, recordsToUse];
        })),
      }));
      setApiStatus(results.some((result) => result.status === 'rejected') ? 'partial' : 'connected');
    } catch (error) {
      setOverview(null);
      setApiRole(null);
      setApiStatus(error.status === 401 ? 'auth-required' : 'demo');
    }
  }

  useEffect(() => {
    let mounted = true;
    loadApiRecords().catch(() => { if (mounted) setApiStatus('demo'); });
    return () => { mounted = false; };
  }, []);

  function navigate(module) {
    setActive(module);
    setSearch('');
    setSidebarOpen(false);
  }

  async function addRecord(module, form) {
    const idPrefix = { patients: 'PT', appointments: 'APT', doctors: 'DR', beds: 'WARD', laboratory: 'LAB', pharmacy: 'MED', billing: 'INV', staff: 'ST', reports: 'RPT' }[module];
    let newRecord = module === 'patients'
      ? { id: form.patientId, name: form.name, age: '—', contact: 'Not provided', blood: form.bloodGroup || 'Unknown', lastVisit: 'Just now', status: 'Waiting' }
      : module === 'appointments'
        ? { id: `${idPrefix}-${900 + records[module].length}`, time: form.date || 'To be scheduled', patient: form.name, doctor: 'Care team to assign', department: form.department || 'General medicine', room: 'To be assigned', status: 'Confirmed' }
        : module === 'doctors'
          ? { id: `${idPrefix}-${40 + records[module].length}`, name: form.name, specialty: form.department || 'General medicine', schedule: 'Schedule pending', patients: '0 today', location: 'To be assigned', status: 'Available' }
          : module === 'beds'
            ? { id: `${idPrefix}-${records[module].length + 1}`, ward: form.name, type: form.department || 'General care', beds: '0 total', occupied: '0 occupied', nurse: 'To be assigned', status: '0% occupied' }
            : module === 'laboratory'
              ? { id: `${idPrefix}-${2400 + records[module].length}`, patient: form.name, test: form.department || 'Test to specify', orderedBy: 'Pending assignment', collected: 'Not collected', status: 'Processing' }
              : module === 'pharmacy'
                ? { id: `${idPrefix}-${1200 + records[module].length}`, medicine: form.name, category: form.department || 'Uncategorized', stock: '0 units', expiry: form.date || 'Not specified', price: '—', status: 'Low stock' }
                : module === 'billing'
                  ? { id: `${idPrefix}-${5100 + records[module].length}`, patient: form.name, service: form.department || 'General service', issued: form.date || 'Just now', amount: `LKR ${Number(form.total || 0).toLocaleString('en-US')}`, balance: `LKR ${Number(form.balance || 0).toLocaleString('en-US')}`, status: Number(form.balance || 0) > 0 ? 'Pending' : 'Paid' }
                  : module === 'staff'
                    ? { id: `${idPrefix}-${300 + records[module].length}`, name: form.name, role: form.department || 'Staff member', department: 'To be assigned', shift: 'Schedule pending', status: 'On duty' }
                    : { id: `${idPrefix}-${1100 + records[module].length}`, report: form.name, category: form.category || form.department || 'Operational', generated: form.date || 'Just now', preparedBy: form.preparedBy || 'Admin team', status: 'Ready' };
    let savedToApi = false;
    if (apiModules.includes(module) && apiStatus !== 'demo') {
      try {
        const result = await apiRequest(`/v1/${module}`, { method: 'POST', body: JSON.stringify(apiCreatePayload(module, form)) });
        newRecord = result.data;
        savedToApi = true;
      } catch (error) {
        setApiStatus('partial');
        setToast(`API save failed; record kept in this session. ${error.message}`);
      }
    }
    setRecords((current) => ({ ...current, [module]: [newRecord, ...current[module]] }));
    setModalModule(null);
    if (savedToApi) setToast(`${moduleDetails[module].action.replace(/^(Add|New|Create|Generate)\s*/i, '')} saved to the hospital database.`);
    else if (apiStatus === 'demo') setToast(`${moduleDetails[module].action.replace(/^(Add|New|Create|Generate)\s*/i, '')} saved in this demo session.`);
    window.setTimeout(() => setToast(''), 3200);
  }

  async function updateRecordStatus(module, record, status) {
    const originalStatus = record.status;
    setRecords((current) => ({
      ...current,
      [module]: current[module].map((item) => item.id === record.id ? { ...item, status } : item),
    }));
    if (apiModules.includes(module) && apiStatus !== 'demo') {
      try {
        await apiRequest(`/v1/${module}/${encodeURIComponent(record.id)}`, {
          method: 'PATCH',
          body: JSON.stringify({ status }),
        });
        setToast(`Status changed to ${status} and saved.`);
      } catch (error) {
        setApiStatus('partial');
        setToast(`Status changed for this session, but server save failed: ${error.message}`);
      }
    } else {
      setToast(`Status changed to ${status} for this session.`);
    }
    window.setTimeout(() => setToast(''), 3200);
    return originalStatus;
  }

  function syncStaffFromShift(person) {
    const directoryStatus = person.status === 'Clocked in' ? 'On duty' : person.status === 'On break' ? 'On break' : 'Off duty';
    setRecords((current) => {
      const matchingRecord = current.staff.find((member) => member.name.trim().toLowerCase() === person.name.trim().toLowerCase());
      const updatedStaffMember = {
        ...(matchingRecord || {}),
        id: matchingRecord?.id || `ST-${Date.now()}`,
        name: person.name,
        role: person.role,
        department: person.department,
        shift: person.shift,
        status: directoryStatus,
      };
      return {
        ...current,
        staff: matchingRecord
          ? current.staff.map((member) => member.id === matchingRecord.id ? updatedStaffMember : member)
          : [updatedStaffMember, ...current.staff],
      };
    });
  }

  async function savePatientRecord(record, values) {
    if (records.patients.some((patient) => patient.id === values.patientId && patient.id !== record.id)) {
      throw new Error('A patient with this ID already exists. Choose another ID.');
    }
    const payload = { patientId: values.patientId, name: values.name, dateOfBirth: values.dateOfBirth, blood: values.blood, status: values.status };
    let updatedRecord = { ...record, ...values, id: values.patientId, age: ageFromDate(values.dateOfBirth) };
    if (apiStatus !== 'demo') {
      const result = await apiRequest(`/v1/patients/${encodeURIComponent(record.id)}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      updatedRecord = result.data;
    }
    setRecords((current) => ({
      ...current,
      patients: current.patients.map((patient) => patient.id === record.id ? updatedRecord : patient),
    }));
    setEditingPatient(null);
    setToast(`Patient ${values.patientId} updated${apiStatus === 'demo' ? ' for this session' : ' and saved'}.`);
    window.setTimeout(() => setToast(''), 3200);
  }

  function toDatabaseTime(value) {
    if (!value) return '00:00:00';
    const match = String(value).match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    if (!match) return '00:00:00';

    let hours = Number(match[1]);
    const minutes = Number(match[2]);
    const meridiem = (match[3] || '').toUpperCase();

    if (meridiem === 'PM' && hours !== 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
  }

  async function saveAppointmentRecord(record, values) {
    const appointmentDate = values.date || new Date().toISOString().slice(0, 10);
    const payload = {
      patient: values.patient,
      doctor: values.doctor,
      department: values.department,
      room: values.room,
      status: values.status,
      scheduledAt: `${appointmentDate} ${toDatabaseTime(values.time)}`,
    };

    let updatedRecord = {
      ...record,
      patient: values.patient,
      doctor: values.doctor,
      department: values.department,
      room: values.room,
      time: values.time,
      status: values.status,
    };

    if (apiStatus !== 'demo') {
      const result = await apiRequest(`/v1/appointments/${encodeURIComponent(record.id)}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      updatedRecord = result.data;
    }

    setRecords((current) => ({
      ...current,
      appointments: current.appointments.map((appointment) => appointment.id === record.id ? updatedRecord : appointment),
    }));
    setEditingAppointment(null);
    setToast(`Appointment ${record.id} updated${apiStatus === 'demo' ? ' for this session' : ' and saved'}.`);
    window.setTimeout(() => setToast(''), 3200);
  }

  async function saveInvoiceRecord(record, values) {
    const nextStatus = Number(values.balance || 0) > 0 ? 'Pending' : 'Paid';
    const payload = {
      patient: values.patient,
      service: values.service,
      amount: Number(values.total || 0),
      balance: Number(values.balance || 0),
      status: nextStatus,
    };

    let updatedRecord = {
      ...record,
      patient: values.patient,
      service: values.service,
      amount: `LKR ${Number(values.total || 0).toLocaleString('en-US')}`,
      balance: `LKR ${Number(values.balance || 0).toLocaleString('en-US')}`,
      status: nextStatus,
    };

    if (apiStatus !== 'demo') {
      const result = await apiRequest(`/v1/billing/${encodeURIComponent(record.id)}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      updatedRecord = result.data;
    }

    setRecords((current) => ({
      ...current,
      billing: current.billing.map((invoice) => invoice.id === record.id ? updatedRecord : invoice),
    }));
    setEditingInvoice(null);
    setToast(`Invoice ${record.id} updated${apiStatus === 'demo' ? ' for this session' : ' and saved'}.`);
    window.setTimeout(() => setToast(''), 3200);
  }

  async function signIn(email, password) {
    const user = await apiLogin(email, password);
    setAuthUser(user);
    setApiRole(user.role || null);
    setAuthOpen(false);
    await loadApiRecords();
    setToast(`Signed in as ${user.name}.`);
    window.setTimeout(() => setToast(''), 3200);
  }

  async function saveProfile(profile) {
    if (apiStatus === 'demo') {
      setAuthUser((current) => ({ ...current, ...profile }));
      setProfileOpen(false);
      setToast('Profile updated for this demo session only.');
      window.setTimeout(() => setToast(''), 3200);
      return;
    }
    const user = await apiUpdateProfile(profile);
    setAuthUser(user);
    setProfileOpen(false);
    setToast('Profile updated successfully.');
    window.setTimeout(() => setToast(''), 3200);
  }

  async function enterDemoMode() {
    await apiLogout();
    setAuthUser({ id: 'local-demo', name: 'Meridian Demo User', role: 'Local demo' });
    setApiRole('admin');
    setApiStatus('demo');
    setAuthOpen(false);
    setToast('Local demo mode: changes are temporary and are not saved to MySQL.');
    window.setTimeout(() => setToast(''), 4200);
  }

  async function signOut() {
    await apiLogout();
    setAuthUser(null);
    setRecords(initialRecords);
    await loadApiRecords();
    setToast('You have signed out.');
    window.setTimeout(() => setToast(''), 3200);
  }

  const activeDetails = moduleDetails[active];

  const systemStatus = getSystemStatusMeta(apiStatus);

  return (
    <div className="app-shell">
      <Sidebar active={active} onNavigate={navigate} open={sidebarOpen} onClose={() => setSidebarOpen(false)} user={authUser} apiStatus={apiStatus} onEditProfile={() => authUser ? setProfileOpen(true) : setAuthOpen(true)} overview={overview} records={records} />
      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu icon-button" aria-label="Open navigation" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
          <div className="breadcrumb"><span>Meridian</span><ChevronRight size={14} />{active === 'overview' ? <strong>Overview</strong> : <strong>{activeDetails?.title || 'Overview'}</strong>}</div>
          <div className="topbar-actions">
            <label className="global-search"><Search size={16} /><input aria-label="Search records" placeholder="Search patients, staff..." value={search} onChange={(event) => setSearch(event.target.value)} /><kbd>⌘ K</kbd></label>
            <div className="notification-wrap"><button type="button" className={`icon-button notification-button ${notificationOpen ? 'pressed' : ''}`} aria-label="Notifications" onClick={() => setNotificationOpen(!notificationOpen)}><Bell size={18} /><i /></button>{notificationOpen && <div className="notification-popover"><div><strong>Notifications</strong><button type="button" className="text-button" onClick={() => setNotificationOpen(false)}>Close</button></div><p><span className="notification-mark peach-mark"><Pill size={14} /></span><span><strong>Low stock alert</strong><small>Metformin 850mg is below reorder level.</small></span></p><p><span className="notification-mark mint-mark"><FlaskConical size={14} /></span><span><strong>Results ready</strong><small>2 lab results are awaiting physician review.</small></span></p><p><span className="notification-mark blue-mark"><BedDouble size={14} /></span><span><strong>Bed request</strong><small>ICU has 2 beds available for admission.</small></span></p></div>}</div>
            {authUser && <button type="button" className="user-profile-pill" aria-label="Edit signed-in user profile" onClick={() => setProfileOpen(true)}><img src={avatarImages.doctor} alt="" /><div><strong>{authUser.name}</strong><span>{authUser.role}</span></div></button>}
            <div className="topbar-divider" />
            <button type="button" className="icon-button auth-button" aria-label={authUser ? 'Sign out' : 'Sign in'} title={authUser ? 'Sign out' : 'Sign in'} onClick={() => authUser ? signOut() : setAuthOpen(true)}>{authUser ? <LogOut size={17} /> : <LogIn size={17} />}</button>
            <button type="button" className="topbar-date"><CalendarDays size={15} /><span>{topbarDateLabel}</span><ChevronDown size={13} /></button>
          </div>
        </header>
        <div className="page-content">
          {apiStatus === 'auth-required' ? <section className="panel auth-gate"><div className="settings-placeholder-icon"><ShieldCheck size={22} /></div><h1>Sign in required</h1><p>Use your hospital account to access clinical and administrative records.</p><button className="button button-primary" onClick={() => setAuthOpen(true)}><LogIn size={15} /> Sign in to continue</button></section> : active === 'overview' ? <Dashboard onNavigate={navigate} onCreate={setModalModule} user={authUser} overview={overview} /> : activeDetails ? <>
            <section className="welcome-row module-welcome">
              <div><div className="eyebrow">HOSPITAL OPERATIONS <span /> {activeDetails.title.toUpperCase()}</div><h1>{activeDetails.title}</h1><p>{activeDetails.description}</p></div>
              <button className="button button-primary" onClick={() => setModalModule(active)}><Plus size={17} /> {activeDetails.action}</button>
            </section>
            <div className="module-summary-strip"><div className="summary-lead"><span className="summary-mark"><ClipboardList size={17} /></span><span><strong>{records[active].length} records</strong><small>Updated moments ago</small></span></div><div className="summary-detail"><span className="summary-dot" /> {apiStatus === 'connected' ? 'MySQL connected' : apiStatus === 'partial' ? 'API partially available' : 'Demo data'}<span className="summary-divider" /> {apiStatus === 'connected' ? 'Synced from server' : 'Changes reset on refresh'}</div><button className="icon-button" aria-label="Module options"><MoreHorizontal size={19} /></button></div>
            <RecordTable module={active} records={records[active]} query={search} onUpdateRecord={updateRecordStatus} canEditPatients={apiRole === 'admin'} onEditPatient={active === 'appointments' ? setEditingAppointment : active === 'billing' ? setEditingInvoice : setEditingPatient} />
          </> : <RoleWorkspaces page={active} onToast={(message) => { setToast(message); window.setTimeout(() => setToast(''), 3200); }} onCreate={setModalModule} onStaffChange={syncStaffFromShift} />}
          <footer className="page-footer"><span>© 2026 Meridian Medical Center</span><span><span className="footer-live" /> {systemStatus.label}</span><button onClick={() => navigate('reports')}><FileText size={14} /> Help & documentation</button></footer>
        </div>
      </main>
      {modalModule && <CreateModal module={modalModule} onClose={() => setModalModule(null)} onSubmit={addRecord} />}
      {editingPatient && <PatientEditModal patient={editingPatient} onClose={() => setEditingPatient(null)} onSubmit={savePatientRecord} />}
      {editingAppointment && <AppointmentEditModal appointment={editingAppointment} onClose={() => setEditingAppointment(null)} onSubmit={saveAppointmentRecord} />}
      {editingInvoice && <BillingEditModal invoice={editingInvoice} onClose={() => setEditingInvoice(null)} onSubmit={saveInvoiceRecord} />}
      {authOpen && <LoginModal onClose={() => setAuthOpen(false)} onLogin={signIn} onDemo={enterDemoMode} />}
      {profileOpen && authUser && <ProfileModal user={authUser} onClose={() => setProfileOpen(false)} onSave={saveProfile} />}
      {toast && <div className="toast-message"><CheckCircle2 size={18} />{toast}<button className="icon-button" aria-label="Dismiss message" onClick={() => setToast('')}><X size={15} /></button></div>}
    </div>
  );
}

export default App;
