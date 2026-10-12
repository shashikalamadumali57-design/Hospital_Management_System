import React, { useState } from 'react';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BedDouble,
  BriefcaseMedical,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Download,
  FileText,
  FlaskConical,
  HeartPulse,
  Pill,
  Plus,
  Search,
  ShieldCheck,
  Stethoscope,
  Users,
} from 'lucide-react';

const queue = [
  { id: 'APT-0891', name: 'Amara Perera', age: 34, reason: 'Follow-up · Cardiology', time: '09:30 AM', status: 'In consultation', blood: 'O+', allergy: 'Penicillin' },
  { id: 'APT-0892', name: 'Nimali Jayasinghe', age: 27, reason: 'Headache · Neurology', time: '10:00 AM', status: 'Waiting', blood: 'B+', allergy: 'None recorded' },
  { id: 'APT-0893', name: 'Sithmi Wijesuriya', age: 19, reason: 'Heart palpitations', time: '10:30 AM', status: 'Checked in', blood: 'O-', allergy: 'Latex' },
  { id: 'APT-0894', name: 'Ruwan de Silva', age: 42, reason: 'Knee pain · Orthopedics', time: '11:00 AM', status: 'Confirmed', blood: 'AB+', allergy: 'None recorded' },
];

const fullQueue = [
  ...queue,
  { id: 'APT-0895', name: 'Madhavi Senanayake', age: 31, reason: 'Pregnancy check · Obstetrics', time: '11:30 AM', status: 'Waiting', blood: 'A+', allergy: 'None recorded' },
  { id: 'APT-0896', name: 'Dilan Peris', age: 63, reason: 'Chest pain · Cardiology', time: '12:00 PM', status: 'Confirmed', blood: 'A-', allergy: 'None recorded' },
  { id: 'APT-0897', name: 'Kasun Fernando', age: 58, reason: 'Post-op review · Surgery', time: '12:30 PM', status: 'Checked in', blood: 'A+', allergy: 'Penicillin' },
  { id: 'APT-0898', name: 'Sahan Alwis', age: 49, reason: 'Fatigue · General medicine', time: '01:00 PM', status: 'Waiting', blood: 'B-', allergy: 'None recorded' },
  { id: 'APT-0899', name: 'Dilini Rathnayake', age: 36, reason: 'Follow-up · Endocrinology', time: '01:30 PM', status: 'Confirmed', blood: 'AB-', allergy: 'None recorded' },
  { id: 'APT-0900', name: 'Janith Silva', age: 45, reason: 'Back pain · Orthopedics', time: '02:00 PM', status: 'Waiting', blood: 'O+', allergy: 'None recorded' },
  { id: 'APT-0901', name: 'Tharushi de Soyza', age: 29, reason: 'Respiratory review · Pulmonology', time: '02:30 PM', status: 'Checked in', blood: 'B+', allergy: 'Dust' },
  { id: 'APT-0902', name: 'Mahesh Weerasinghe', age: 54, reason: 'Diabetes review · Endocrinology', time: '03:00 PM', status: 'Confirmed', blood: 'O-', allergy: 'None recorded' },
];

const admissionData = [
  { id: 'ADM-3021', name: 'Kasun Fernando', reason: 'Post-operative observation', bed: 'ICU · 04', nurse: 'R. Bandara', status: 'Vitals due' },
  { id: 'ADM-3020', name: 'Madhavi Senanayake', reason: 'Maternity admission', bed: 'MAT · 08', nurse: 'D. Perera', status: 'Awaiting check-in' },
  { id: 'ADM-3018', name: 'Dilan Peris', reason: 'Cardiac monitoring', bed: 'GEN-A · 12', nurse: 'M. Kumari', status: 'In ward' },
  { id: 'ADM-3016', name: 'Ruwan de Silva', reason: 'Orthopedic recovery', bed: 'GEN-B · 06', nurse: 'S. Fernando', status: 'Ready for discharge' },
];

function PageIntro({ eyebrow, title, description, action, onAction }) {
  return <section className="welcome-row module-welcome"><div><div className="eyebrow">{eyebrow.toUpperCase()} <span /> WORKSPACE</div><h1>{title}</h1><p>{description}</p></div>{action && <button className="button button-primary" onClick={onAction}><Plus size={16} />{action}</button>}</section>;
}

function WorkflowMetric({ icon: Icon, label, value, note, tone = 'mint' }) {
  return <article className="workflow-metric"><span className={`workflow-metric-icon ${tone}`}><Icon size={17} /></span><div><span className="workflow-metric-label">{label}</span><strong>{value}</strong><small>{note}</small></div></article>;
}

function WorkflowCard({ title, subtitle, action, onAction, children, className = '' }) {
  return <section className={`panel workflow-card ${className}`}><div className="workflow-card-heading"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{action && <button className="text-button" onClick={onAction}>{action}<ArrowRight size={14} /></button>}</div>{children}</section>;
}

function ConsultationPage({ onToast }) {
  const [selectedId, setSelectedId] = useState(queue[0].id);
  const [completed, setCompleted] = useState(false);
  const [showAllQueue, setShowAllQueue] = useState(false);
  const visibleQueue = showAllQueue ? fullQueue : queue;
  const selected = visibleQueue.find((patient) => patient.id === selectedId) || queue.find((patient) => patient.id === selectedId) || fullQueue[0];

  function openNextPatient() {
    const currentIndex = fullQueue.findIndex((patient) => patient.id === selectedId);
    const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % fullQueue.length : 0;
    setSelectedId(fullQueue[nextIndex].id);
    setCompleted(false);
    setShowAllQueue(true);
  }

  return <>
    <PageIntro eyebrow="Doctor workspace" title="Consultation room" description="Your clinic queue, patient history and care-plan actions." action="Open next patient" onAction={openNextPatient} />
    <div className="workflow-metrics"><WorkflowMetric icon={Users} label="Today's queue" value="12 patients" note="4 appointments remaining" /><WorkflowMetric icon={Clock3} label="Average wait" value="14 min" note="6 min faster than yesterday" tone="blue" /><WorkflowMetric icon={FileText} label="Notes to complete" value="3 records" note="Before end of shift" tone="peach" /></div>
    <div className="workflow-two-column consultation-layout">
      <WorkflowCard title="Clinic queue" subtitle="Cardiology · Room 204" action={showAllQueue ? 'Show active queue' : 'View all 12'} onAction={() => { setShowAllQueue((current) => !current); onToast(showAllQueue ? 'Showing the active clinic queue.' : 'Showing today’s full cardiology queue.'); }}>
        <div className="clinic-queue">{visibleQueue.map((patient) => <button key={patient.id} className={`clinic-queue-item ${selectedId === patient.id ? 'selected' : ''}`} onClick={() => { setSelectedId(patient.id); setCompleted(false); }}><span className="queue-time">{patient.time}</span><span className="table-avatar avatar-tone-1">{patient.name.split(' ').map((part) => part[0]).join('')}</span><span className="queue-patient"><strong>{patient.name}</strong><small>{patient.reason}</small></span><span className={`queue-state ${patient.status === 'Waiting' ? 'waiting' : ''}`}>{patient.status}</span></button>)}</div>
      </WorkflowCard>
      <WorkflowCard title="Patient chart" subtitle={selected?.id} className="patient-chart-card">
        {selected && <><div className="chart-patient-head"><span className="patient-large-avatar">{selected.name.split(' ').map((part) => part[0]).join('')}</span><div><strong>{selected.name}</strong><span>{selected.age} years · Patient since 2021</span></div><span className="status-badge active">{selected.status}</span></div><div className="chart-facts"><div><span>Blood group</span><strong>{selected.blood}</strong></div><div><span>Allergies</span><strong className={selected.allergy === 'None recorded' ? '' : 'allergy-warning'}>{selected.allergy}</strong></div><div><span>Last visit</span><strong>Sep 18, 2026</strong></div></div><div className="chart-history"><div className="chart-section-title"><strong>Recent clinical notes</strong><button type="button" className="text-button" onClick={() => onToast(`EMR opened for ${selected.name}.`)}>View EMR</button></div><div className="chart-note"><i /><span><strong>Cardiology follow-up</strong><small>Sep 18 · Stable angina, continue current treatment plan.</small></span></div><div className="chart-note"><i /><span><strong>ECG results reviewed</strong><small>Aug 04 · No significant rhythm abnormalities.</small></span></div></div><div className="chart-actions"><button className="button button-secondary" onClick={() => onToast(`Referral draft opened for ${selected.name}.`)}><ArrowRight size={14} /> Refer patient</button><button className="button button-primary" onClick={() => { const nextCompleted = !completed; setCompleted(nextCompleted); onToast(nextCompleted ? 'Consultation note saved to the EMR.' : 'Consultation saved to the patient record.'); }}><Check size={14} />{completed ? 'Saved to EMR' : 'Complete consultation'}</button></div></>}
      </WorkflowCard>
    </div>
  </>;
}

function AdmissionsPage({ onToast }) {
  const [admissions, setAdmissions] = useState(admissionData);

  function checkInPatient() {
    const patientToCheckIn = admissions.find((item) => item.status === 'Awaiting check-in');
    if (!patientToCheckIn) {
      onToast('No patient is waiting to be checked in.');
      return;
    }

    setAdmissions((current) => current.map((item) => item.id === patientToCheckIn.id ? { ...item, status: 'In ward' } : item));
    onToast(`${patientToCheckIn.name} checked in and moved to the ward.`);
  }

  function advance(admission) {
    const next = admission.status === 'Awaiting check-in' ? 'In ward' : admission.status === 'Vitals due' ? 'Vitals recorded' : admission.status === 'Ready for discharge' ? 'Discharged' : 'Vitals due';
    setAdmissions((current) => current.map((item) => item.id === admission.id ? { ...item, status: next } : item));
    onToast(`${admission.name}: ${next.toLowerCase()}.`);
  }
  return <>
    <PageIntro eyebrow="Nursing workspace" title="Admissions & nursing" description="Patient check-in, inpatient allocation and ward-round tasks." action="Check in patient" onAction={checkInPatient} />
    <div className="workflow-metrics"><WorkflowMetric icon={Users} label="Awaiting admission" value="3 patients" note="1 urgent request" tone="peach" /><WorkflowMetric icon={BedDouble} label="Available beds" value="44 beds" note="Across 4 wards" /><WorkflowMetric icon={Activity} label="Vitals due" value="5 patients" note="Next ward round · 10:30" tone="blue" /></div>
    <WorkflowCard title="Inpatient board" subtitle="Live ward census · Friday, October 9"><div className="workflow-table-wrap"><table className="workflow-table"><thead><tr><th>Patient</th><th>Admission reason</th><th>Bed</th><th>Assigned nurse</th><th>Status</th><th>Next action</th></tr></thead><tbody>{admissions.map((item) => <tr key={item.id}><td><strong>{item.name}</strong><small>{item.id}</small></td><td>{item.reason}</td><td><span className="bed-code">{item.bed}</span></td><td>{item.nurse}</td><td><span className={`workflow-status ${item.status.includes('due') || item.status.includes('Awaiting') ? 'attention' : item.status === 'Discharged' ? 'complete' : 'active'}`}><i />{item.status}</span></td><td><button className="table-action" onClick={() => advance(item)} disabled={item.status === 'Discharged'}>{item.status === 'Vitals due' ? 'Record vitals' : item.status === 'Awaiting check-in' ? 'Check in' : item.status === 'Ready for discharge' ? 'Discharge' : item.status === 'Discharged' ? 'Complete' : 'Add care note'}</button></td></tr>)}</tbody></table></div></WorkflowCard>
    <div className="workflow-two-column lower-workflow"><WorkflowCard title="Ward-round checklist" subtitle="General ward A · 10:30 AM"><div className="checklist-list"><label><input type="checkbox" defaultChecked /><span><strong>Review overnight observations</strong><small>6 of 8 patient charts updated</small></span></label><label><input type="checkbox" /><span><strong>Confirm medication administration</strong><small>2 schedules need nurse sign-off</small></span></label><label><input type="checkbox" /><span><strong>Complete nursing care notes</strong><small>Due before shift handover</small></span></label></div></WorkflowCard><WorkflowCard title="Bed availability" subtitle="Capacity by care unit"><div className="capacity-list"><div><span>General ward A</span><b>6 available</b><i><em style={{ width: '81%' }} /></i></div><div><span>General ward B</span><b>9 available</b><i><em style={{ width: '68%' }} /></i></div><div><span>Intensive care</span><b className="capacity-low">2 available</b><i><em style={{ width: '88%' }} /></i></div></div></WorkflowCard></div>
  </>;
}

function PatientPortalPage({ onToast, onCreate }) {
  function openProfile() {
    onToast('Patient profile opened.');
  }

  function openAppointmentDetails(label) {
    onToast(`${label} details opened.`);
  }

  function openDocument(type) {
    onToast(`${type} opened.`);
  }

  function payInvoice() {
    onToast('Payment checkout opened for LKR 2,500.');
  }

  return <>
    <PageIntro eyebrow="Patient portal" title="Good morning, Amara" description="Your care plan, upcoming visits and health records in one place." action="Book appointment" onAction={() => onCreate('appointments')} />
    <section className="portal-profile">
      <div className="portal-avatar">AP</div>
      <div className="portal-profile-copy"><span>YOUR PATIENT PROFILE</span><strong>Amara Perera</strong><small>Patient ID PT-10482 · Date of birth 14 May 1992</small></div>
      <div className="portal-profile-meta"><span>Blood group</span><strong>O positive</strong></div>
      <div className="portal-profile-meta"><span>Primary physician</span><strong>Dr. Nadeesha Silva</strong></div>
      <button type="button" className="text-button" onClick={openProfile}>View profile <ArrowRight size={14} /></button>
    </section>
    <div className="workflow-metrics"><WorkflowMetric icon={CalendarDays} label="Next appointment" value="Today · 10:30 AM" note="Cardiology · Room 204" /><WorkflowMetric icon={FlaskConical} label="Lab results" value="1 new result" note="Lipid profile · Ready" tone="blue" /><WorkflowMetric icon={FileText} label="Outstanding balance" value="LKR 2,500" note="Invoice INV-05043" tone="peach" /></div>
    <div className="workflow-two-column">
      <WorkflowCard title="Upcoming appointments" subtitle="Your next scheduled visits">
        <div className="portal-appointment"><span className="portal-date"><strong>09</strong><small>OCT</small></span><span><strong>Cardiology follow-up</strong><small>Dr. Nadeesha Silva · Today, 10:30 AM</small></span><button type="button" className="button button-secondary" onClick={() => openAppointmentDetails('Cardiology follow-up')}>Details</button></div>
        <div className="portal-appointment"><span className="portal-date pale-blue"><strong>22</strong><small>OCT</small></span><span><strong>Routine blood work</strong><small>Laboratory · 08:15 AM</small></span><button type="button" className="button button-secondary" onClick={() => openAppointmentDetails('Routine blood work')}>Details</button></div>
        <button type="button" className="panel-footer-link" onClick={() => onCreate('appointments')}>Manage appointments <ArrowRight size={14} /></button>
      </WorkflowCard>
      <WorkflowCard title="Health records" subtitle="Recent clinical documents">
        <div className="document-row"><span className="document-icon mint"><FileText size={16} /></span><span><strong>Consultation summary</strong><small>Sep 18, 2026 · Cardiology</small></span><button type="button" className="icon-button" aria-label="Download consultation summary" onClick={() => openDocument('Consultation summary')}><Download size={16} /></button></div>
        <div className="document-row"><span className="document-icon blue"><FlaskConical size={16} /></span><span><strong>Lipid profile results</strong><small>Oct 09, 2026 · Laboratory</small></span><button type="button" className="icon-button" aria-label="Open lipid profile results" onClick={() => openDocument('Lipid profile results')}><ArrowRight size={16} /></button></div>
        <div className="portal-bill"><span><strong>Invoice INV-05043</strong><small>Consultation fee · Due Oct 16</small></span><strong>LKR 2,500</strong><button type="button" className="button button-primary" onClick={payInvoice}>Pay now</button></div>
      </WorkflowCard>
    </div>
  </>;
}

function BloodBankPage({ onToast }) {
  const [donors, setDonors] = useState([{ name: 'S. Wijesuriya', group: 'O-', location: 'Colombo 05', donated: 'Aug 14, 2026', status: 'Eligible' }, { name: 'M. Jayawardena', group: 'A+', location: 'Nugegoda', donated: 'Sep 02, 2026', status: 'Eligible' }, { name: 'R. Fernando', group: 'B-', location: 'Dehiwala', donated: 'Jul 28, 2026', status: 'Contact donor' }, { name: 'N. Perera', group: 'AB+', location: 'Colombo 03', donated: 'Jun 16, 2026', status: 'Eligible' }]);
  const groups = [{ type: 'O-', units: 4, state: 'Critical', tone: 'critical' }, { type: 'O+', units: 18, state: 'Healthy', tone: '' }, { type: 'A-', units: 7, state: 'Low stock', tone: 'low' }, { type: 'A+', units: 22, state: 'Healthy', tone: '' }, { type: 'B-', units: 5, state: 'Low stock', tone: 'low' }, { type: 'B+', units: 15, state: 'Healthy', tone: '' }, { type: 'AB-', units: 8, state: 'Healthy', tone: '' }, { type: 'AB+', units: 11, state: 'Healthy', tone: '' }];
  function addDonor() { setDonors((current) => [{ name: 'New donor record', group: 'O+', location: 'To be confirmed', donated: 'Not yet donated', status: 'Pending screening' }, ...current]); onToast('Donor profile added to the registry.'); }
  return <>
    <PageIntro eyebrow="Transfusion services" title="Blood bank" description="Blood component inventory, donor registry and urgent requests." action="Register donor" onAction={addDonor} />
    <div className="workflow-metrics"><WorkflowMetric icon={Activity} label="Total blood units" value="90 units" note="8 blood groups tracked" /><WorkflowMetric icon={Clock3} label="Expiring this week" value="6 units" note="Review component dates" tone="peach" /><WorkflowMetric icon={Users} label="Registered donors" value="1,284" note="38 eligible to donate" tone="blue" /></div>
    <WorkflowCard title="Component inventory" subtitle="Available packed red blood cells by blood group"><div className="blood-group-grid">{groups.map((group) => <article key={group.type} className={`blood-group-card ${group.tone}`}><span className="blood-type">{group.type}</span><strong>{group.units}<small> units</small></strong><span>{group.state}</span><div><i style={{ width: `${Math.min(group.units * 4, 100)}%` }} /></div></article>)}</div></WorkflowCard>
    <WorkflowCard title="Donor registry" subtitle="Recently active voluntary donors" action="Export registry" onAction={() => onToast('Donor registry export prepared.')}><div className="workflow-table-wrap"><table className="workflow-table"><thead><tr><th>Donor</th><th>Blood group</th><th>Location</th><th>Last donation</th><th>Eligibility</th><th /></tr></thead><tbody>{donors.map((donor, index) => <tr key={`${donor.name}-${index}`}><td><strong>{donor.name}</strong></td><td><span className="blood-code">{donor.group}</span></td><td>{donor.location}</td><td>{donor.donated}</td><td><span className={`workflow-status ${donor.status === 'Eligible' ? 'complete' : 'attention'}`}><i />{donor.status}</span></td><td><button className="table-action" onClick={() => onToast(`Contact workflow opened for ${donor.name}.`)}>Contact</button></td></tr>)}</tbody></table></div></WorkflowCard>
  </>;
}

function DispensingPage({ onToast }) {
  const [prescriptions, setPrescriptions] = useState([
    { id: 'RX-1832', patient: 'Amara Perera', physician: 'Dr. Nadeesha Silva', items: 'Atorvastatin 20mg · 30 tablets', time: '09:48 AM', status: 'Ready to dispense' },
    { id: 'RX-1831', patient: 'Kasun Fernando', physician: 'Dr. Nadeesha Silva', items: 'Aspirin 75mg · 14 tablets', time: '09:33 AM', status: 'Preparing' },
    { id: 'RX-1830', patient: 'Nimali Jayasinghe', physician: 'Dr. Chamath Dias', items: 'Sumatriptan 50mg · 6 tablets', time: '09:12 AM', status: 'Ready to dispense' },
    { id: 'RX-1829', patient: 'Ruwan de Silva', physician: 'Dr. Ishan Perera', items: 'Ibuprofen 400mg · 20 tablets', time: '08:54 AM', status: 'Dispensed' },
  ]);
  const [dispenseSequence, setDispenseSequence] = useState(0);

  const waitingCount = prescriptions.filter((item) => item.status !== 'Dispensed').length;
  const dispensedCount = prescriptions.filter((item) => item.status === 'Dispensed').length;

  function addNewDispense() {
    const patientPool = [
      { patient: 'Dulani Perera', physician: 'Dr. Priyantha Silva', items: 'Amoxicillin 500mg · 14 capsules' },
      { patient: 'Madhavi Weerasekara', physician: 'Dr. Chamath Dias', items: 'Metformin 500mg · 30 tablets' },
      { patient: 'Hasitha Wickramasinghe', physician: 'Dr. Nadeesha Silva', items: 'Cetirizine 10mg · 7 tablets' },
      { patient: 'Sajini Fernando', physician: 'Dr. Ishan Perera', items: 'Omeprazole 20mg · 14 capsules' },
    ];

    const nextIndex = dispenseSequence % patientPool.length;
    setDispenseSequence((current) => current + 1);

    const now = new Date();
    const selected = patientPool[nextIndex];
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newId = `RX-${String(now.getTime()).slice(-5)}-${nextIndex + 1}`;

    const newPrescription = {
      id: newId,
      patient: selected.patient,
      physician: selected.physician,
      items: selected.items,
      time,
      status: 'Ready to dispense',
    };

    setPrescriptions((current) => [newPrescription, ...current.filter((item) => item.id !== newId)]);
    onToast(`${newId} added to the dispensing queue.`);
  }

  function dispense(id) { setPrescriptions((current) => current.map((item) => item.id === id ? { ...item, status: 'Dispensed' } : item)); onToast(`${id} marked as dispensed.`); }
  return <>
    <PageIntro eyebrow="Pharmacy workspace" title="Prescription dispensing" description="Verify prescriptions, prepare medicines and complete patient handover." action="New dispense" onAction={addNewDispense} />
    <div className="workflow-metrics"><WorkflowMetric icon={ClipboardMetricIcon} label="Waiting to dispense" value={`${waitingCount} prescriptions`} note="3 patients in pharmacy" tone="peach" /><WorkflowMetric icon={Pill} label="Dispensed today" value={`${dispensedCount} orders`} note="Across outpatient and ward" /><WorkflowMetric icon={Activity} label="Stock alerts" value="2 medicines" note="Reorder level reached" tone="blue" /></div>
    <WorkflowCard title="Dispensing queue" subtitle="Prescriptions awaiting pharmacy processing"><div className="dispense-list">{prescriptions.map((item) => <article className="dispense-row" key={item.id}><span className="prescription-icon"><Pill size={17} /></span><span className="dispense-main"><strong>{item.patient}</strong><small>{item.id} · {item.physician}</small><span>{item.items}</span></span><span className={`workflow-status ${item.status === 'Dispensed' ? 'complete' : item.status === 'Preparing' ? 'active' : 'attention'}`}><i />{item.status}</span><span className="dispense-time">{item.time}</span><button className="button button-secondary" disabled={item.status === 'Dispensed'} onClick={() => dispense(item.id)}>{item.status === 'Dispensed' ? <Check size={14} /> : <CheckCircle2 size={14} />}{item.status === 'Dispensed' ? 'Done' : 'Dispense'}</button></article>)}</div></WorkflowCard>
  </>;
}

const ClipboardMetricIcon = FileText;

function FinancePage({ onToast }) {
  const ledger = [{ date: 'Oct 09, 2026', reference: 'RCPT-9821', account: 'Outpatient consultations', type: 'Revenue', amount: '+ LKR 184,500' }, { date: 'Oct 09, 2026', reference: 'EXP-1438', account: 'Medical supplies', type: 'Expense', amount: '- LKR 62,800' }, { date: 'Oct 08, 2026', reference: 'RCPT-9812', account: 'Inpatient services', type: 'Revenue', amount: '+ LKR 426,000' }, { date: 'Oct 08, 2026', reference: 'EXP-1434', account: 'Staff and payroll', type: 'Expense', amount: '- LKR 218,000' }];
  return <>
    <PageIntro eyebrow="Accountant workspace" title="Finance & accounting" description="Revenue, expenses, budgets and the hospital general ledger." action="Record expense" onAction={() => onToast('Expense entry form opened.')} />
    <div className="workflow-metrics"><WorkflowMetric icon={ArrowUpRight} label="Monthly revenue" value="LKR 610.5K" note="61.1% of monthly target" /><WorkflowMetric icon={Activity} label="Operating expenses" value="LKR 280.8K" note="28.1% of monthly budget" tone="peach" /><WorkflowMetric icon={BriefcaseMedical} label="Net operating income" value="LKR 329.7K" note="Updated from today's ledger" tone="blue" /></div>
    <div className="workflow-two-column"><WorkflowCard title="Revenue & expenses" subtitle="Monthly cash flow · LKR thousands"><div className="finance-chart-legend"><span><i className="revenue-dot" />Revenue</span><span><i className="expense-dot" />Expenses</span><button className="period-select">October 2026</button></div><div className="finance-chart">{[['0.42', '.18'], ['0.47', '.21'], ['0.52', '.24'], ['0.58', '.23'], ['0.61', '.28'], ['0.61', '.28']].map(([revenue, expense], index) => <div className="finance-month" key={index}><div className="finance-bars"><i style={{ height: `${Number(revenue) * 120}px` }} /><i style={{ height: `${Number(expense) * 120}px` }} /></div><span>{['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'][index]}</span></div>)}</div><div className="budget-progress"><span><span>Monthly revenue target</span><strong>LKR 610.5K / 1M</strong></span><i><em style={{ width: '61%' }} /></i></div></WorkflowCard><WorkflowCard title="Budget allocation" subtitle="Annual operating budget"><div className="budget-list"><div><span>Clinical operations</span><strong>LKR 3.2M</strong><i><em style={{ width: '72%' }} /></i><small>72% used</small></div><div><span>Staff & payroll</span><strong>LKR 2.8M</strong><i><em style={{ width: '64%' }} /></i><small>64% used</small></div><div><span>Medical supplies</span><strong>LKR 1.4M</strong><i><em style={{ width: '88%' }} /></i><small>88% used</small></div></div></WorkflowCard></div>
    <WorkflowCard title="General ledger" subtitle="Recent account activity" action="Full ledger" onAction={() => onToast('Full accounting ledger opened.')}><div className="workflow-table-wrap"><table className="workflow-table"><thead><tr><th>Date</th><th>Reference</th><th>Account</th><th>Entry type</th><th>Amount</th></tr></thead><tbody>{ledger.map((item) => <tr key={item.reference}><td>{item.date}</td><td><strong>{item.reference}</strong></td><td>{item.account}</td><td><span className={`ledger-type ${item.type.toLowerCase()}`}>{item.type}</span></td><td><strong className={item.type === 'Revenue' ? 'money-positive' : 'money-negative'}>{item.amount}</strong></td></tr>)}</tbody></table></div></WorkflowCard>
  </>;
}

function ClaimsPage({ onToast }) {
  const [claims, setClaims] = useState([{ id: 'CLM-4428', patient: 'Kasun Fernando', insurer: 'Ceylinco Healthcare', service: 'Inpatient cardiac care', submitted: 'Oct 08, 2026', amount: 'LKR 186,000', status: 'Under review' }, { id: 'CLM-4427', patient: 'Amara Perera', insurer: 'AIA Insurance', service: 'Cardiology consultation', submitted: 'Oct 08, 2026', amount: 'LKR 8,500', status: 'Approved' }, { id: 'CLM-4426', patient: 'Nimali Jayasinghe', insurer: 'Allianz Life', service: 'MRI scan', submitted: 'Oct 07, 2026', amount: 'LKR 24,500', status: 'Needs documents' }, { id: 'CLM-4425', patient: 'Dilan Peris', insurer: 'Union Assurance', service: 'Emergency admission', submitted: 'Oct 06, 2026', amount: 'LKR 72,000', status: 'Submitted' }]);
  const [claimQuery, setClaimQuery] = useState('');

  const totalOpenClaims = claims.length;
  const underReviewCount = claims.filter((claim) => claim.status === 'Under review').length;
  const approvedTotal = claims.filter((claim) => claim.status === 'Approved').length;
  const needsDocsCount = claims.filter((claim) => claim.status === 'Needs documents').length;
  const filteredClaims = claims.filter((claim) => `${claim.id} ${claim.patient} ${claim.insurer} ${claim.service} ${claim.amount} ${claim.status}`.toLowerCase().includes(claimQuery.toLowerCase()));

  function createClaim() {
    const nextId = `CLM-${String(Date.now()).slice(-5)}`;
    const newClaim = {
      id: nextId,
      patient: 'New patient',
      insurer: 'AIA Insurance',
      service: 'Outpatient consultation',
      submitted: 'Oct 12, 2026',
      amount: 'LKR 12,500',
      status: 'Under review',
    };

    setClaims((current) => [newClaim, ...current]);
    setClaimQuery('');
    onToast(`${nextId} created and sent for review.`);
  }

  function updateClaim(id) { setClaims((current) => current.map((claim) => claim.id === id ? { ...claim, status: claim.status === 'Needs documents' ? 'Submitted' : 'Approved' } : claim)); onToast(`${id} claim status updated.`); }
  return <>
    <PageIntro eyebrow="Revenue cycle" title="Insurance claims" description="Submit, review and reconcile third-party payer claims." action="Create claim" onAction={createClaim} />
    <div className="workflow-metrics"><WorkflowMetric icon={FileText} label="Open claims" value={`${totalOpenClaims} claims`} note="LKR 1.84M receivable" /><WorkflowMetric icon={Clock3} label="Under review" value={`${underReviewCount} claims`} note="Average review · 4 days" tone="blue" /><WorkflowMetric icon={CheckCircle2} label="Approved this month" value={`${approvedTotal} claims`} note="Across 6 insurance partners" /></div>
    <WorkflowCard title="Claims register" subtitle="Insurance submissions and adjudication status"><div className="claim-summary-strip"><span><i className="claim-indicator review" />Review <strong>{underReviewCount}</strong></span><span><i className="claim-indicator documents" />Documents needed <strong>{needsDocsCount}</strong></span><span><i className="claim-indicator paid" />Approved <strong>{approvedTotal}</strong></span><label className="claim-search"><Search size={14} /><input value={claimQuery} onChange={(event) => setClaimQuery(event.target.value)} placeholder="Search claims" aria-label="Search claims" /></label></div><div className="workflow-table-wrap"><table className="workflow-table"><thead><tr><th>Claim</th><th>Patient & payer</th><th>Service</th><th>Submitted</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead><tbody>{filteredClaims.map((claim) => <tr key={claim.id}><td><strong>{claim.id}</strong></td><td><strong>{claim.patient}</strong><small>{claim.insurer}</small></td><td>{claim.service}</td><td>{claim.submitted}</td><td><strong>{claim.amount}</strong></td><td><span className={`workflow-status ${claim.status === 'Approved' ? 'complete' : claim.status === 'Under review' || claim.status === 'Submitted' ? 'active' : 'attention'}`}><i />{claim.status}</span></td><td><button className="table-action" onClick={() => updateClaim(claim.id)}>{claim.status === 'Needs documents' ? 'Request docs' : claim.status === 'Approved' ? 'View' : 'Review'}</button></td></tr>)}</tbody></table>{filteredClaims.length === 0 && <div className="empty-table-state">No claims match “{claimQuery}”.</div>}</div></WorkflowCard>
  </>;
}

function ShiftsPage({ onToast, onStaffChange }) {
  const today = new Date();
  const todayDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const [staff, setStaff] = useState([
    { id: 'ST-0141', name: 'R. Bandara', role: 'Nurse', department: 'Intensive care', location: 'Ward 04', date: todayDate, shift: '07:00 AM – 03:00 PM', status: 'Upcoming' },
    { id: 'ST-0102', name: 'M. Kumari', role: 'Senior nurse', department: 'General ward A', location: 'Ward 06', date: todayDate, shift: '07:00 AM – 03:00 PM', status: 'Clocked in' },
    { id: 'ST-0068', name: 'P. Wickramasinghe', role: 'Lab technician', department: 'Laboratory', location: 'Specimen lab', date: todayDate, shift: '08:00 AM – 04:00 PM', status: 'Clocked in' },
    { id: 'ST-0213', name: 'K. Jayawardena', role: 'Pharmacist', department: 'Pharmacy', location: 'Main pharmacy', date: todayDate, shift: '09:00 AM – 05:00 PM', status: 'On break' },
    { id: 'ST-0224', name: 'D. Perera', role: 'Midwife', department: 'Maternity', location: 'Maternity unit', date: todayDate, shift: '03:00 PM – 11:00 PM', status: 'Upcoming' }
  ]);
  const [shiftSequence, setShiftSequence] = useState(0);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [scheduleError, setScheduleError] = useState('');
  const [editingShiftId, setEditingShiftId] = useState(null);
  const [scheduleForm, setScheduleForm] = useState({
    name: '',
    role: 'Nurse',
    department: 'General ward A',
    location: 'Ward 04',
    date: todayDate,
    shift: '07:00 AM – 03:00 PM',
    status: 'Upcoming',
  });

  const staffOnDuty = staff.filter((person) => person.status === 'Clocked in').length;
  const attendanceExceptions = staff.filter((person) => person.status === 'On break' || person.status === 'Upcoming').length;
  const openShiftCount = staff.filter((person) => person.status === 'Upcoming').length;

  const getWeekRange = (date) => {
    const current = new Date(date);
    const day = current.getDay();
    const diffToMonday = (day === 0 ? -6 : 1 - day);
    const start = new Date(current);
    start.setDate(current.getDate() + diffToMonday);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    const monthFmt = new Intl.DateTimeFormat('en-US', { month: 'long' });
    const dayFmt = new Intl.DateTimeFormat('en-US', { day: 'numeric' });
    const yearFmt = new Intl.DateTimeFormat('en-US', { year: 'numeric' });
    return `${monthFmt.format(start)} ${dayFmt.format(start)} – ${dayFmt.format(end)}, ${yearFmt.format(end)}`;
  };

  const weekRangeLabel = getWeekRange(new Date());

  function handleFieldChange(event) {
    const { name, value } = event.target;
    setScheduleForm((current) => ({ ...current, [name]: value }));
    if (scheduleError) setScheduleError('');
  }

  function scheduleShift() {
    const name = scheduleForm.name.trim();
    if (!name) {
      setScheduleError('Please enter a staff member name before scheduling the shift.');
      onToast('Please enter a staff member name before scheduling the shift.');
      return;
    }

    const duplicate = staff.some((member) => member.id !== editingShiftId && member.name.toLowerCase() === name.toLowerCase() && member.date === scheduleForm.date && member.shift === scheduleForm.shift);
    if (duplicate) {
      const message = `${name} already has a shift assigned on ${scheduleForm.date} for ${scheduleForm.shift}. Please choose a different date or time.`;
      setScheduleError(message);
      onToast(message);
      return;
    }

    const nextEntry = {
      id: editingShiftId || `SHIFT-${Date.now()}`,
      name,
      role: scheduleForm.role,
      department: scheduleForm.department,
      location: scheduleForm.location,
      date: scheduleForm.date,
      shift: scheduleForm.shift,
      status: scheduleForm.status,
    };

    if (editingShiftId) {
      setStaff((current) => current.map((member) => member.id === editingShiftId ? nextEntry : member));
      onStaffChange?.(nextEntry);
      onToast(`${name}'s shift details updated.`);
    } else {
      setShiftSequence((current) => current + 1);
      setStaff((current) => [nextEntry, ...current]);
      onStaffChange?.(nextEntry);
      onToast(`${name} scheduled for ${scheduleForm.shift}.`);
    }
    setScheduleForm({ name: '', role: 'Nurse', department: 'General ward A', location: 'Ward 04', date: todayDate, shift: '07:00 AM – 03:00 PM', status: 'Upcoming' });
    setScheduleError('');
    setEditingShiftId(null);
    setShowScheduleForm(false);
  }

  function editShift(person) {
    setEditingShiftId(person.id);
    setScheduleForm({ name: person.name, role: person.role, department: person.department, location: person.location, date: person.date, shift: person.shift, status: person.status });
    setScheduleError('');
    setShowScheduleForm(true);
  }

  function updateStatus(id, nextStatus) {
    setStaff((current) => current.map((member) => member.id === id ? { ...member, status: nextStatus } : member));
    const person = staff.find((member) => member.id === id);
    if (person) onStaffChange?.({ ...person, status: nextStatus });
    onToast(`Status updated for ${person?.name || 'staff member'}.`);
  }

  function formatShiftDate(dateValue) {
    return new Intl.DateTimeFormat('en', { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date(`${dateValue}T12:00:00`));
  }

  const todayLabel = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(today);
  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    const day = date.getDay();
    date.setDate(date.getDate() + (day === 0 ? -6 : 1 - day) + index);
    return { date, key: date.toISOString().slice(0, 10), label: `${new Intl.DateTimeFormat('en', { weekday: 'narrow' }).format(date)} ${String(date.getDate()).padStart(2, '0')}` };
  });

  return <>
    <PageIntro eyebrow="Human resources" title="Staff & shifts" description="Attendance, department coverage and shift handover planning." action="Schedule shift" onAction={() => setShowScheduleForm((current) => !current)} />
    {showScheduleForm && <section className="panel" style={{ marginBottom: '18px', padding: '18px 20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
        <label style={{ display: 'grid', gap: '6px', fontSize: '13px', color: '#4a5a52' }}>
          Staff member
          <input name="name" value={scheduleForm.name} onChange={handleFieldChange} placeholder="Staff member name" style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid #cfe1d8', background: '#fff' }} />
        </label>
        <label style={{ display: 'grid', gap: '6px', fontSize: '13px', color: '#4a5a52' }}>
          Role
          <select name="role" value={scheduleForm.role} onChange={handleFieldChange} style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid #cfe1d8', background: '#fff' }}>
            <option value="Nurse">Nurse</option>
            <option value="Senior nurse">Senior nurse</option>
            <option value="Lab technician">Lab technician</option>
            <option value="Pharmacist">Pharmacist</option>
            <option value="Midwife">Midwife</option>
            <option value="Radiographer">Radiographer</option>
            <option value="Ward clerk">Ward clerk</option>
          </select>
        </label>
        <label style={{ display: 'grid', gap: '6px', fontSize: '13px', color: '#4a5a52' }}>
          Shift date
          <input name="date" type="date" value={scheduleForm.date} onChange={handleFieldChange} required style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid #cfe1d8', background: '#fff' }} />
        </label>
        <label style={{ display: 'grid', gap: '6px', fontSize: '13px', color: '#4a5a52' }}>
          Department
          <select name="department" value={scheduleForm.department} onChange={handleFieldChange} style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid #cfe1d8', background: '#fff' }}>
            <option value="General ward A">General ward A</option>
            <option value="General ward B">General ward B</option>
            <option value="Intensive care">Intensive care</option>
            <option value="Laboratory">Laboratory</option>
            <option value="Pharmacy">Pharmacy</option>
            <option value="Maternity">Maternity</option>
            <option value="Diagnostics">Diagnostics</option>
            <option value="Administration">Administration</option>
          </select>
        </label>
        <label style={{ display: 'grid', gap: '6px', fontSize: '13px', color: '#4a5a52' }}>
          Location
          <select name="location" value={scheduleForm.location} onChange={handleFieldChange} style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid #cfe1d8', background: '#fff' }}>
            <option value="Ward 04">Ward 04</option>
            <option value="Ward 06">Ward 06</option>
            <option value="Ward 08">Ward 08</option>
            <option value="Intensive care">Intensive care</option>
            <option value="Main pharmacy">Main pharmacy</option>
            <option value="Maternity unit">Maternity unit</option>
            <option value="Specimen lab">Specimen lab</option>
            <option value="Diagnostics">Diagnostics</option>
          </select>
        </label>
        <label style={{ display: 'grid', gap: '6px', fontSize: '13px', color: '#4a5a52' }}>
          Shift time
          <select name="shift" value={scheduleForm.shift} onChange={handleFieldChange} style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid #cfe1d8', background: '#fff' }}>
            <option value="07:00 AM – 03:00 PM">07:00 AM – 03:00 PM</option>
            <option value="08:00 AM – 04:00 PM">08:00 AM – 04:00 PM</option>
            <option value="09:00 AM – 05:00 PM">09:00 AM – 05:00 PM</option>
            <option value="11:00 AM – 07:00 PM">11:00 AM – 07:00 PM</option>
            <option value="03:00 PM – 11:00 PM">03:00 PM – 11:00 PM</option>
          </select>
        </label>
        <label style={{ display: 'grid', gap: '6px', fontSize: '13px', color: '#4a5a52' }}>
          Initial status
          <select name="status" value={scheduleForm.status} onChange={handleFieldChange} style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid #cfe1d8', background: '#fff' }}>
            <option value="Upcoming">Upcoming</option>
            <option value="Clocked in">Clocked in</option>
            <option value="On break">On break</option>
          </select>
        </label>
      </div>
      {scheduleError && <div style={{ marginTop: '14px', padding: '10px 12px', borderRadius: '10px', background: '#fff3f1', border: '1px solid #f4b3a8', color: '#9d3f32', fontSize: '13px' }}>{scheduleError}</div>}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
        <button className="button button-secondary" type="button" onClick={() => { setShowScheduleForm(false); setEditingShiftId(null); setScheduleError(''); }}>Cancel</button>
        <button className="button button-primary" type="button" onClick={scheduleShift}>{editingShiftId ? 'Save changes' : 'Add shift'}</button>
      </div>
    </section>}
    <div className="workflow-metrics"><WorkflowMetric icon={Users} label="Staff on duty" value={`${staffOnDuty} people`} note="Across 8 departments" /><WorkflowMetric icon={Clock3} label="Attendance exceptions" value={`${attendanceExceptions} staff`} note="Review late arrivals" tone="peach" /><WorkflowMetric icon={CalendarDays} label="Open shifts" value={`${openShiftCount} shifts`} note="Next 7 days" tone="blue" /></div>
    <div className="shift-week-strip"><div><span>WEEK OF</span><strong>{weekRangeLabel}</strong></div><div className="shift-days">{weekDays.map(({ key, label, date }) => <button key={key} className={date.toDateString() === today.toDateString() ? 'today' : ''} onClick={() => { setScheduleForm((current) => ({ ...current, date: key })); setEditingShiftId(null); setScheduleError(''); setShowScheduleForm(true); }}>{label}</button>)}</div><button className="button button-secondary" onClick={() => onToast(`Showing this week's roster, ${todayLabel}.`)}>This week</button></div>
    <WorkflowCard title="Scheduled shifts" subtitle={`${todayLabel} · Staff shift assignments`}><div className="workflow-table-wrap"><table className="workflow-table"><thead><tr><th>Staff member</th><th>Role</th><th>Department</th><th>Location</th><th>Shift date</th><th>Scheduled shift</th><th>Attendance</th><th>Action</th></tr></thead><tbody>{staff.map((person) => <tr key={person.id}><td><strong>{person.name}</strong></td><td>{person.role}</td><td>{person.department}</td><td>{person.location}</td><td>{formatShiftDate(person.date)}</td><td>{person.shift}</td><td><span className={`workflow-status ${person.status === 'Clocked in' ? 'complete' : person.status === 'On break' ? 'active' : 'attention'}`}><i />{person.status}</span></td><td><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><select aria-label={`Status for ${person.name}`} value={person.status} onChange={(event) => updateStatus(person.id, event.target.value)} style={{ minWidth: '120px', padding: '8px 10px', borderRadius: '8px', border: '1px solid #d9e8df', background: '#fff' }}>
              <option value="Upcoming">Upcoming</option>
              <option value="Clocked in">Clocked in</option>
              <option value="On break">On break</option>
            </select><button className="table-action" type="button" onClick={() => editShift(person)}>Edit</button></div></td></tr>)}</tbody></table></div></WorkflowCard>
  </>;
}

function PoliciesPage({ onToast }) {
  const [query, setQuery] = useState('');
  const [policies, setPolicies] = useState([{ id: 'POL-014', title: 'Patient data privacy & confidentiality', category: 'Clinical governance', owner: 'Medical director', reviewed: '2026-09-12', due: '2027-03-12', status: 'Current' }, { id: 'POL-011', title: 'Medication storage and controlled drugs', category: 'Pharmacy', owner: 'Chief pharmacist', reviewed: '2026-08-28', due: '2026-10-28', status: 'Review due' }, { id: 'POL-008', title: 'Infection prevention & control', category: 'Nursing', owner: 'Nursing director', reviewed: '2026-07-05', due: '2027-01-05', status: 'Current' }, { id: 'POL-003', title: 'Workplace safety & incident reporting', category: 'Administration', owner: 'HR manager', reviewed: '2026-04-16', due: '2026-10-16', status: 'Review due' }]);
  const [showPolicyForm, setShowPolicyForm] = useState(false);
  const [editingPolicyId, setEditingPolicyId] = useState(null);
  const [policyError, setPolicyError] = useState('');
  const emptyPolicyForm = { title: '', category: '', owner: '', due: '', status: 'Current' };
  const [policyForm, setPolicyForm] = useState(emptyPolicyForm);
  const filtered = policies.filter((item) => `${item.title} ${item.category} ${item.owner}`.toLowerCase().includes(query.toLowerCase()));

  function openPolicyForm(policy = null) {
    setEditingPolicyId(policy?.id ?? null);
    setPolicyForm(policy ? { title: policy.title, category: policy.category, owner: policy.owner, due: policy.due, status: policy.status } : { ...emptyPolicyForm });
    setPolicyError('');
    setShowPolicyForm(true);
  }

  function handlePolicyChange(event) {
    const { name, value } = event.target;
    setPolicyForm((current) => ({ ...current, [name]: value }));
    if (policyError) setPolicyError('');
  }

  function savePolicy(event) {
    event.preventDefault();
    const title = policyForm.title.trim();
    const category = policyForm.category.trim();
    const owner = policyForm.owner.trim();
    if (!title || !category || !owner || !policyForm.due) {
      setPolicyError('Enter the document name, category, owner, and next review date.');
      return;
    }

    if (editingPolicyId) {
      setPolicies((current) => current.map((policy) => policy.id === editingPolicyId ? { ...policy, title, category, owner, due: policyForm.due, status: policyForm.status } : policy));
      onToast(`${title} updated.`);
    } else {
      const nextNumber = policies.reduce((highest, policy) => Math.max(highest, Number(policy.id.split('-').at(-1)) || 0), 0) + 1;
      const nextPolicy = { id: `POL-${String(nextNumber).padStart(3, '0')}`, title, category, owner, reviewed: new Date().toISOString().slice(0, 10), due: policyForm.due, status: policyForm.status };
      setPolicies((current) => [nextPolicy, ...current]);
      onToast(`${title} added to the policy register.`);
    }
    setShowPolicyForm(false);
    setEditingPolicyId(null);
    setPolicyForm({ ...emptyPolicyForm });
    setPolicyError('');
  }

  function formatPolicyDate(date) {
    if (!date) return 'Not set';
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`));
  }

  function markReviewed(id) { setPolicies((current) => current.map((item) => item.id === id ? { ...item, status: 'Current', reviewed: new Date().toISOString().slice(0, 10) } : item)); onToast(`${id} review recorded.`); }

  return <>
    <PageIntro eyebrow="Hospital governance" title="Policies & protocols" description="Controlled clinical and administrative documents with review dates." action="Add policy" onAction={() => openPolicyForm()} />
    {showPolicyForm && <form className="panel" onSubmit={savePolicy} style={{ marginBottom: '18px', padding: '18px 20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '14px' }}>
        <label style={{ display: 'grid', gap: '6px', fontSize: '13px', color: '#4a5a52' }}>Document name<input name="title" value={policyForm.title} onChange={handlePolicyChange} placeholder="Policy or protocol title" /></label>
        <label style={{ display: 'grid', gap: '6px', fontSize: '13px', color: '#4a5a52' }}>Category<input name="category" value={policyForm.category} onChange={handlePolicyChange} placeholder="e.g. Nursing" /></label>
        <label style={{ display: 'grid', gap: '6px', fontSize: '13px', color: '#4a5a52' }}>Document owner<input name="owner" value={policyForm.owner} onChange={handlePolicyChange} placeholder="Owner or responsible role" /></label>
        <label style={{ display: 'grid', gap: '6px', fontSize: '13px', color: '#4a5a52' }}>Next review date<input name="due" type="date" value={policyForm.due} onChange={handlePolicyChange} /></label>
        <label style={{ display: 'grid', gap: '6px', fontSize: '13px', color: '#4a5a52' }}>Status<select name="status" value={policyForm.status} onChange={handlePolicyChange}><option value="Current">Current</option><option value="Review due">Review due</option></select></label>
      </div>
      {policyError && <div role="alert" style={{ marginTop: '14px', padding: '10px 12px', borderRadius: '8px', background: '#fff3f1', border: '1px solid #f4b3a8', color: '#9d3f32', fontSize: '13px' }}>{policyError}</div>}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}><button className="button button-secondary" type="button" onClick={() => setShowPolicyForm(false)}>Cancel</button><button className="button button-primary" type="submit">{editingPolicyId ? 'Save changes' : 'Add document'}</button></div>
    </form>}
    <div className="policy-banner"><span className="policy-banner-icon"><ShieldCheck size={18} /></span><span><strong>Policy library</strong><small>26 active documents · 4 reviews due this month</small></span><button className="button button-secondary" onClick={() => onToast('Policy audit history opened.')}>Audit history</button></div>
    <WorkflowCard title="Document register" subtitle="Current approved policies and protocols"><label className="policy-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search policies, categories, owners" /></label><div className="policy-list">{filtered.map((policy) => <article className="policy-row" key={policy.id}><span className={`policy-file ${policy.status === 'Review due' ? 'review' : ''}`}><FileText size={17} /></span><span className="policy-main"><strong>{policy.title}</strong><small>{policy.id} · {policy.category}</small></span><span className="policy-owner"><small>Document owner</small><strong>{policy.owner}</strong></span><span className="policy-due"><small>Next review</small><strong>{formatPolicyDate(policy.due)}</strong></span><span className={`workflow-status ${policy.status === 'Current' ? 'complete' : 'attention'}`}><i />{policy.status}</span><div style={{ display: 'flex', gap: '8px' }}><button className="table-action" type="button" onClick={() => openPolicyForm(policy)}>Edit</button><button className="table-action" type="button" onClick={() => policy.status === 'Review due' ? markReviewed(policy.id) : onToast(`${policy.title} opened.`)}>{policy.status === 'Review due' ? 'Review now' : 'Open policy'}</button></div></article>)}{filtered.length === 0 && <div className="policy-empty">No policies match “{query}”.</div>}</div></WorkflowCard>
  </>;
}

function AccessPage({ onToast }) {
  const [users, setUsers] = useState([{ name: 'Dr. Anjali Perera', email: 'anjali.perera@meridian.lk', role: 'Administrator', department: 'Administration', status: 'Active' }, { name: 'Dr. Nadeesha Silva', email: 'nadeesha.silva@meridian.lk', role: 'Doctor', department: 'Cardiology', status: 'Active' }, { name: 'M. Kumari', email: 'kumari.m@meridian.lk', role: 'Nurse', department: 'General ward A', status: 'Active' }, { name: 'K. Jayawardena', email: 'jayawardena.k@meridian.lk', role: 'Pharmacist', department: 'Pharmacy', status: 'Active' }, { name: 'P. Wickramasinghe', email: 'wickramasinghe.p@meridian.lk', role: 'Laboratory', department: 'Diagnostics', status: 'Pending invite' }]);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteError, setInviteError] = useState('');
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: 'Nurse', department: 'General ward A' });
  const roleGroups = [
    { role: 'Administrator', scope: 'System configuration · users · audit', matches: ['Administrator'] },
    { role: 'Doctor', scope: 'Clinical records · prescriptions · referrals', matches: ['Doctor'] },
    { role: 'Nurse', scope: 'Admissions · beds · vitals · care notes', matches: ['Nurse'] },
    { role: 'Patient', scope: 'Own appointments · records · invoices', matches: ['Patient'] },
    { role: 'Pharmacist / Lab', scope: 'Inventory · dispense · test processing', matches: ['Pharmacist', 'Laboratory'] },
  ];
  const distinctRoleCount = new Set(users.map((user) => user.role)).size;

  function handleInviteChange(event) {
    const { name, value } = event.target;
    setInviteForm((current) => ({ ...current, [name]: value }));
    if (inviteError) setInviteError('');
  }

  function inviteUser(event) {
    event.preventDefault();
    const name = inviteForm.name.trim();
    const email = inviteForm.email.trim().toLowerCase();
    if (!name || !email || !inviteForm.role || !inviteForm.department) {
      setInviteError('Complete the name, email, role, and department fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setInviteError('Enter a valid email address.');
      return;
    }
    if (users.some((user) => user.email.toLowerCase() === email)) {
      setInviteError('An account with this email address already exists.');
      return;
    }

    setUsers((current) => [{ ...inviteForm, name, email, status: 'Pending invite' }, ...current]);
    setInviteForm({ name: '', email: '', role: 'Nurse', department: 'General ward A' });
    setInviteError('');
    setShowInviteForm(false);
    onToast(`Invitation created for ${name}.`);
  }

  function toggleUser(name) { setUsers((current) => current.map((user) => user.name === name ? { ...user, status: user.status === 'Active' ? 'Suspended' : 'Active' } : user)); onToast(`Access status changed for ${name}.`); }
  return <>
    <PageIntro eyebrow="System administration" title="Users & access control" description="Role assignments, account status and least-privilege access." action="Invite user" onAction={() => { setInviteError(''); setShowInviteForm((current) => !current); }} />
    {showInviteForm && <form className="panel" onSubmit={inviteUser} style={{ marginBottom: '18px', padding: '18px 20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
        <label style={{ display: 'grid', gap: '6px', fontSize: '13px', color: '#4a5a52' }}>Full name<input name="name" value={inviteForm.name} onChange={handleInviteChange} placeholder="Staff member name" style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cfe1d8', background: '#fff' }} /></label>
        <label style={{ display: 'grid', gap: '6px', fontSize: '13px', color: '#4a5a52' }}>Email address<input name="email" type="email" value={inviteForm.email} onChange={handleInviteChange} placeholder="name@meridian.lk" style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cfe1d8', background: '#fff' }} /></label>
        <label style={{ display: 'grid', gap: '6px', fontSize: '13px', color: '#4a5a52' }}>Role<select name="role" value={inviteForm.role} onChange={handleInviteChange} style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cfe1d8', background: '#fff' }}><option>Administrator</option><option>Doctor</option><option>Nurse</option><option>Patient</option><option>Pharmacist</option><option>Laboratory</option><option>Receptionist</option><option>HR manager</option></select></label>
        <label style={{ display: 'grid', gap: '6px', fontSize: '13px', color: '#4a5a52' }}>Department<select name="department" value={inviteForm.department} onChange={handleInviteChange} style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cfe1d8', background: '#fff' }}><option>Administration</option><option>Cardiology</option><option>General ward A</option><option>Intensive care</option><option>Pharmacy</option><option>Diagnostics</option><option>Laboratory</option><option>Reception</option><option>Patient services</option><option>Human resources</option></select></label>
      </div>
      {inviteError && <div role="alert" style={{ marginTop: '14px', padding: '10px 12px', borderRadius: '8px', background: '#fff3f1', border: '1px solid #f4b3a8', color: '#9d3f32', fontSize: '13px' }}>{inviteError}</div>}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}><button className="button button-secondary" type="button" onClick={() => setShowInviteForm(false)}>Cancel</button><button className="button button-primary" type="submit">Send invitation</button></div>
    </form>}
    <div className="workflow-metrics"><WorkflowMetric icon={Users} label="User accounts" value={`${users.length} users`} note={`Across ${distinctRoleCount} assigned roles`} /><WorkflowMetric icon={ShieldCheck} label="Access reviews" value="12 due" note="Quarterly review cycle" tone="peach" /><WorkflowMetric icon={Activity} label="Recent sign-ins" value="42 today" note="No unusual activity" tone="blue" /></div>
    <div className="workflow-two-column"><WorkflowCard title="Role permissions" subtitle="Access scope by system role"><div className="role-permission-list">{roleGroups.map((item) => <div key={item.role}><span className="role-shield"><ShieldCheck size={15} /></span><span><strong>{item.role}</strong><small>{item.scope}</small></span><em>{users.filter((user) => item.matches.includes(user.role)).length} users</em><button className="table-action" onClick={() => onToast(`${item.role} permissions opened.`)}>Review</button></div>)}</div></WorkflowCard><WorkflowCard title="Recent audit activity" subtitle="System access log"><div className="audit-list"><div><i className="audit-dot green" /><span><strong>Role updated</strong><small>Admin changed ward access for M. Kumari</small></span><time>09:42 AM</time></div><div><i className="audit-dot blue" /><span><strong>Successful sign-in</strong><small>Dr. Nadeesha Silva · Colombo Central</small></span><time>09:16 AM</time></div><div><i className="audit-dot peach" /><span><strong>Invitation sent</strong><small>New laboratory account pending activation</small></span><time>08:50 AM</time></div><div><i className="audit-dot gray" /><span><strong>Policy acknowledged</strong><small>Patient privacy policy · 6 staff members</small></span><time>Yesterday</time></div></div></WorkflowCard></div>
    <WorkflowCard title="User directory" subtitle="Manage hospital system accounts"><div className="workflow-table-wrap"><table className="workflow-table"><thead><tr><th>User</th><th>Role</th><th>Department</th><th>Account status</th><th>Action</th></tr></thead><tbody>{users.map((user) => <tr key={user.email}><td><strong>{user.name}</strong><small>{user.email}</small></td><td><span className="role-badge">{user.role}</span></td><td>{user.department}</td><td><span className={`workflow-status ${user.status === 'Active' ? 'complete' : 'attention'}`}><i />{user.status}</span></td><td><button className="table-action" onClick={() => toggleUser(user.name)}>{user.status === 'Active' ? 'Suspend' : 'Activate'}</button></td></tr>)}</tbody></table></div></WorkflowCard>
  </>;
}

function StatutoryPage({ onToast }) {
  const [reports, setReports] = useState([{ id: 'REG-2026-184', type: 'Birth registration', subject: 'Baby of Madhavi Senanayake', date: '2026-10-08', filedBy: 'D. Perera', status: 'Ready to file' }, { id: 'REG-2026-183', type: 'Death registration', subject: 'S. Abeysekara · PT-10391', date: '2026-10-07', filedBy: 'Admin team', status: 'Filed' }, { id: 'REG-2026-182', type: 'Birth registration', subject: 'Baby of Ishara Fernando', date: '2026-10-06', filedBy: 'D. Perera', status: 'Filed' }]);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registrationForm, setRegistrationForm] = useState({ type: '', subject: '', date: new Date().toISOString().slice(0, 10), filedBy: '', status: '' });
  const currentMonth = new Date().toISOString().slice(0, 7);
  const thisMonthReports = reports.filter((report) => report.date.startsWith(currentMonth));
  const birthCount = thisMonthReports.filter((report) => report.type === 'Birth registration').length;
  const deathCount = thisMonthReports.filter((report) => report.type === 'Death registration').length;
  const readyCount = reports.filter((report) => report.status === 'Ready to file').length;

  function handleRegistrationChange(event) {
    const { name, value } = event.target;
    setRegistrationForm((current) => ({ ...current, [name]: value }));
  }

  function createRegistration(event) {
    event.preventDefault();
    const nextNumber = reports.reduce((highest, report) => Math.max(highest, Number(report.id.split('-').at(-1)) || 0), 0) + 1;
    const newReport = { id: `REG-${registrationForm.date.slice(0, 4)}-${String(nextNumber).padStart(3, '0')}`, ...registrationForm, subject: registrationForm.subject.trim() };
    setReports((current) => [newReport, ...current]);
    setRegistrationForm({ type: '', subject: '', date: new Date().toISOString().slice(0, 10), filedBy: '', status: '' });
    setShowRegistrationForm(false);
    onToast(`${newReport.id} registration created.`);
  }

  function fileReport(id) { setReports((current) => current.map((report) => report.id === id ? { ...report, status: 'Filed' } : report)); onToast(`${id} marked as filed.`); }
  return <>
    <PageIntro eyebrow="Statutory reporting" title="Birth & death records" description="Review, certify and file official hospital registrations." action="Create registration" onAction={() => setShowRegistrationForm((current) => !current)} />
    {showRegistrationForm && <section className="panel" style={{ marginBottom: '18px', padding: '18px 20px' }}>
      <form onSubmit={createRegistration}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
          <label style={{ display: 'grid', gap: '6px', fontSize: '13px', color: '#4a5a52' }}>Record type
            <select name="type" value={registrationForm.type} onChange={handleRegistrationChange} required style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid #cfe1d8', background: '#fff' }}>
              <option value="" disabled>Select record type</option>
              <option value="Birth registration">Birth registration</option>
              <option value="Death registration">Death registration</option>
            </select>
          </label>
          <label style={{ display: 'grid', gap: '6px', fontSize: '13px', color: '#4a5a52' }}>Patient / subject name
            <input name="subject" value={registrationForm.subject} onChange={handleRegistrationChange} required placeholder="Enter full name" style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid #cfe1d8', background: '#fff' }} />
          </label>
          <label style={{ display: 'grid', gap: '6px', fontSize: '13px', color: '#4a5a52' }}>Event date
            <input name="date" type="date" value={registrationForm.date} onChange={handleRegistrationChange} required style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid #cfe1d8', background: '#fff' }} />
          </label>
          <label style={{ display: 'grid', gap: '6px', fontSize: '13px', color: '#4a5a52' }}>Prepared by
            <select name="filedBy" value={registrationForm.filedBy} onChange={handleRegistrationChange} required style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid #cfe1d8', background: '#fff' }}>
              <option value="" disabled>Select staff member</option>
              <option value="D. Perera">D. Perera</option>
              <option value="Admin team">Admin team</option>
              <option value="Medical registrar">Medical registrar</option>
              <option value="Nursing director">Nursing director</option>
            </select>
          </label>
          <label style={{ display: 'grid', gap: '6px', fontSize: '13px', color: '#4a5a52' }}>Status
            <select name="status" value={registrationForm.status} onChange={handleRegistrationChange} required style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid #cfe1d8', background: '#fff' }}>
              <option value="" disabled>Select status</option>
              <option value="Draft">Draft</option>
              <option value="Ready to file">Ready to file</option>
              <option value="Filed">Filed</option>
            </select>
          </label>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
          <button className="button button-secondary" type="button" onClick={() => setShowRegistrationForm(false)}>Cancel</button>
          <button className="button button-primary" type="submit">Save registration</button>
        </div>
      </form>
    </section>}
    <div className="workflow-metrics"><WorkflowMetric icon={FileText} label="Births this month" value={`${birthCount} records`} note="From registrations listed" /><WorkflowMetric icon={Activity} label="Deaths this month" value={`${deathCount} records`} note="From registrations listed" tone="peach" /><WorkflowMetric icon={CheckCircle2} label="Ready for filing" value={`${readyCount} records`} note="Review required" tone="blue" /></div>
    <WorkflowCard title="Registration register" subtitle="Official events requiring review and filing"><div className="workflow-table-wrap"><table className="workflow-table"><thead><tr><th>Registration</th><th>Record type</th><th>Patient / subject</th><th>Event date</th><th>Prepared by</th><th>Status</th><th /></tr></thead><tbody>{reports.map((report) => <tr key={report.id}><td><strong>{report.id}</strong></td><td><span className={`record-type ${report.type.startsWith('Birth') ? 'birth' : 'death'}`}>{report.type}</span></td><td><strong>{report.subject}</strong></td><td>{new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(`${report.date}T00:00:00`))}</td><td>{report.filedBy}</td><td><span className={`workflow-status ${report.status === 'Filed' ? 'complete' : 'attention'}`}><i />{report.status}</span></td><td><button className="table-action" onClick={() => report.status === 'Filed' ? onToast(`${report.id} opened.`) : fileReport(report.id)}>{report.status === 'Filed' ? 'View' : 'Certify & file'}</button></td></tr>)}</tbody></table></div></WorkflowCard>
    <div className="statutory-note"><ShieldCheck size={17} /><span><strong>Restricted clinical records</strong><small>Access and filing activity is recorded in the hospital audit log.</small></span><button className="text-button" onClick={() => onToast('Statutory record audit trail opened.')}>View audit log <ArrowRight size={14} /></button></div>
  </>;
}

function SettingsPage({ onToast }) {
  const [settings, setSettings] = useState({ appointmentReminders: true, lowStockAlerts: true, labResultAlerts: true, twoFactor: false, sessionTimeout: true, patientPortal: true });
  function toggle(key) { setSettings((current) => ({ ...current, [key]: !current[key] })); }
  return <>
    <PageIntro eyebrow="System administration" title="Hospital settings" description="Facility profile, service preferences and account security." action="Save changes" onAction={() => onToast('Hospital settings saved successfully.')} />
    <div className="workflow-two-column settings-columns">
      <WorkflowCard title="Facility profile" subtitle="Displayed across patient and staff workspaces"><div className="settings-form"><label>Hospital name<input defaultValue="Meridian Medical Center" /></label><div className="settings-form-row"><label>Facility code<input defaultValue="MMC-CC-001" /></label><label>Time zone<select defaultValue="Asia/Colombo"><option value="Asia/Colombo">Asia / Colombo (GMT+5:30)</option><option value="UTC">UTC</option></select></label></div><div className="settings-form-row"><label>Contact number<input defaultValue="+94 11 234 5678" /></label><label>Billing currency<select defaultValue="LKR"><option value="LKR">LKR · Sri Lankan Rupee</option><option value="USD">USD · US Dollar</option></select></label></div><label>Facility address<input defaultValue="No. 18, Hospital Road, Colombo 07" /></label></div></WorkflowCard>
      <WorkflowCard title="Notifications" subtitle="Choose which operational updates are sent to staff"><div className="settings-toggle-list">{[['appointmentReminders', 'Appointment reminders', 'Notify care teams before scheduled consultations.'], ['lowStockAlerts', 'Low-stock medicine alerts', 'Alert pharmacy staff when inventory reaches reorder level.'], ['labResultAlerts', 'Critical laboratory results', 'Notify the ordering physician when results require review.']].map(([key, title, description]) => <div key={key}><span><strong>{title}</strong><small>{description}</small></span><button type="button" role="switch" aria-checked={settings[key]} aria-label={title} className={`toggle-switch ${settings[key] ? 'on' : ''}`} onClick={() => toggle(key)}><i /></button></div>)}</div></WorkflowCard>
      <WorkflowCard title="Security & access" subtitle="Protect patient and hospital records"><div className="settings-toggle-list">{[['twoFactor', 'Require two-factor authentication', 'Add a second sign-in step for staff accounts.'], ['sessionTimeout', 'Automatic session timeout', 'Sign out inactive accounts after 15 minutes.'], ['patientPortal', 'Patient portal access', 'Allow patients to view their own records and invoices.']].map(([key, title, description]) => <div key={key}><span><strong>{title}</strong><small>{description}</small></span><button type="button" role="switch" aria-checked={settings[key]} aria-label={title} className={`toggle-switch ${settings[key] ? 'on' : ''}`} onClick={() => toggle(key)}><i /></button></div>)}</div></WorkflowCard>
      <WorkflowCard title="Connected services" subtitle="Integration health and environment"><div className="integration-list"><div><span className="integration-icon mint"><Activity size={15} /></span><span><strong>Hospital API</strong><small>Local demo mode · API not configured</small></span><span className="integration-state">Not connected</span></div><div><span className="integration-icon blue"><FlaskConical size={15} /></span><span><strong>Laboratory system</strong><small>Result interface configuration</small></span><button className="table-action" onClick={() => onToast('Laboratory integration settings opened.')}>Configure</button></div><div><span className="integration-icon peach"><ShieldCheck size={15} /></span><span><strong>Audit logging</strong><small>Access and record changes are logged</small></span><span className="workflow-status complete"><i />Active</span></div></div></WorkflowCard>
    </div>
  </>;
}

export default function RoleWorkspaces({ page, onToast, onCreate, onStaffChange }) {
  if (page === 'consultations') return <ConsultationPage onToast={onToast} />;
  if (page === 'admissions') return <AdmissionsPage onToast={onToast} />;
  if (page === 'portal') return <PatientPortalPage onToast={onToast} onCreate={onCreate} />;
  if (page === 'blood-bank') return <BloodBankPage onToast={onToast} />;
  if (page === 'dispensing') return <DispensingPage onToast={onToast} />;
  if (page === 'finance') return <FinancePage onToast={onToast} />;
  if (page === 'shifts') return <ShiftsPage onToast={onToast} onStaffChange={onStaffChange} />;
  if (page === 'policies') return <PoliciesPage onToast={onToast} />;
  if (page === 'access') return <AccessPage onToast={onToast} />;
  if (page === 'statutory') return <StatutoryPage onToast={onToast} />;
  if (page === 'settings') return <SettingsPage onToast={onToast} />;
  return null;
}