import React from 'react';
import {
  Users,
  GraduationCap,
  BookOpen,
  CheckSquare,
  Receipt,
  AlertTriangle,
  UserPlus,
  DollarSign,
  ArrowRight,
  Clock,
  Award,
  Calendar,
  Sparkles,
  Download,
  Filter
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { StatCard } from '../common/StatCard';
import {
  MOCK_STUDENTS,
  MOCK_ADMISSIONS,
  MOCK_FEE_VOUCHERS,
  MOCK_EVENTS,
  MOCK_NOTICES,
  SCHOOL_INFO
} from '../../mockData';
import type { AdminTab } from '../../types';
import { useToast } from '../common/Toast';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

interface DashboardHomeProps {
  onNavigate: (tab: AdminTab) => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({ onNavigate }) => {
  const { showToast } = useToast();
  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Chart 1: Income vs Expenses (Jan - Dec)
  const incomeVsExpenseData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Income (PKR Millions)',
        data: [2.6, 2.7, 2.9, 3.4, 2.8, 2.5, 2.6, 3.2, 2.45, 2.8, 3.0, 3.1],
        backgroundColor: '#0B3974',
        borderRadius: 6
      },
      {
        label: 'Expenses (PKR Millions)',
        data: [1.6, 1.7, 1.8, 1.9, 1.8, 1.7, 1.65, 1.85, 1.62, 1.7, 1.75, 1.8],
        backgroundColor: '#E62929',
        borderRadius: 6
      }
    ]
  };

  // Chart 2: Weekly Student Attendance Trend
  const attendanceTrendData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    datasets: [
      {
        fill: true,
        label: 'Attendance Rate (%)',
        data: [96.2, 95.8, 94.7, 95.1, 93.4, 88.5],
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.12)',
        tension: 0.35,
        pointBackgroundColor: '#4CAF50',
        pointRadius: 4
      }
    ]
  };

  const feeCollectionData = {
    labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    datasets: [
      {
        label: 'Target (PKR M)',
        data: [2.8, 2.8, 2.8, 2.8, 2.8, 2.8],
        backgroundColor: '#e2e8f0',
        borderRadius: 6
      },
      {
        label: 'Collected (PKR M)',
        data: [2.72, 2.68, 2.85, 2.79, 2.84, 2.45],
        backgroundColor: '#0B3974',
        borderRadius: 6
      }
    ]
  };

  // Chart 4: Subject-wise Performance %
  const subjectPerformanceData = {
    labels: ['Math', 'Physics', 'Chemistry', 'Biology', 'English', 'Comp Sci', 'Urdu'],
    datasets: [
      {
        label: 'Average Score (%)',
        data: [86.4, 82.1, 84.8, 88.2, 89.5, 92.4, 87.0],
        backgroundColor: [
          '#0B3974',
          '#FFD700',
          '#4CAF50',
          '#E62929',
          '#155cb4',
          '#388e3c',
          '#d4af37'
        ],
        borderRadius: 6
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: { family: 'Plus Jakarta Sans', size: 12 },
          boxWidth: 12,
          usePointStyle: true
        }
      }
    },
    scales: {
      y: {
        grid: { color: '#f1f5f9' },
        ticks: { font: { family: 'Plus Jakarta Sans', size: 11 } }
      },
      x: {
        grid: { display: false },
        ticks: { font: { family: 'Plus Jakarta Sans', size: 11 } }
      }
    }
  };

  return (
    <div>
      {/* Top Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #04142a 0%, #0B3974 55%, #082a57 100%)',
          borderRadius: '20px',
          padding: '24px clamp(20px, 4vw, 36px)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px',
          boxShadow: '0 10px 25px -5px rgba(11, 57, 116, 0.25)',
          position: 'relative',
          overflow: 'hidden',
          borderLeft: '5px solid #E62929'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, flex: '1 1 280px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.12)', border: '1px solid rgba(255, 215, 0, 0.4)', padding: '4px 14px', borderRadius: '30px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '10px' }}>
            <img src="/logo.png" alt="Read Academy Sahiwal" style={{ height: '20px', width: 'auto' }} />
            <span style={{ color: '#FFD700' }}>Read Academy Sahiwal ERP • "Read To Lead"</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 1.85rem)', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
            Good Morning, Admin 👋
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.88rem', margin: '6px 0 0 0', maxWidth: '640px' }}>
            Today is <strong style={{ color: '#ffffff' }}>{todayDate}</strong>. All 32 classes are currently in session with 94.7% attendance. Term 1 Assessments begin in 3 weeks.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', position: 'relative', zIndex: 2 }}>
          <button
            onClick={() => showToast('Exported Executive Dashboard Summary (PDF)', undefined, 'success')}
            className="bca-btn"
            style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.25)', padding: '8px 14px', fontSize: '0.84rem' }}
          >
            <Download size={15} />
            <span>Export Summary</span>
          </button>
          <button
            onClick={() => onNavigate('admissions')}
            className="bca-btn bca-btn-red"
            style={{ padding: '8px 16px', fontSize: '0.84rem' }}
          >
            <UserPlus size={15} />
            <span>Review Admissions</span>
          </button>
        </div>
      </div>

      {/* 8 Statistics Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        <StatCard
          label="Total Students"
          value="1,248"
          change="+4.2%"
          isPositive={true}
          trendText="vs last term"
          icon={<Users size={22} />}
          iconBg="#eff6ff"
          iconColor="#0B3974"
          sparklineData={[1120, 1150, 1180, 1210, 1230, 1248]}
          onClick={() => onNavigate('students')}
        />

        <StatCard
          label="Teachers & Staff"
          value="86"
          change="+2"
          isPositive={true}
          trendText="new faculty"
          icon={<GraduationCap size={22} />}
          iconBg="#fff9c4"
          iconColor="#8c6800"
          sparklineData={[80, 81, 82, 84, 85, 86]}
          onClick={() => onNavigate('teachers')}
        />

        <StatCard
          label="Active Classes"
          value="32"
          change="100%"
          isPositive={true}
          trendText="capacity"
          icon={<BookOpen size={22} />}
          iconBg="#eff6ff"
          iconColor="#0B3974"
          sparklineData={[30, 30, 31, 32, 32, 32]}
          onClick={() => onNavigate('classes-subjects')}
        />

        <StatCard
          label="Today's Attendance"
          value="94.7%"
          change="+1.3%"
          isPositive={true}
          trendText="1,182 present"
          icon={<CheckSquare size={22} />}
          iconBg="#e8f5e9"
          iconColor="#4CAF50"
          sparklineData={[92, 93.5, 94.1, 93.8, 94.7]}
          onClick={() => onNavigate('attendance')}
        />

        <StatCard
          label="Fee Collection"
          value="Rs. 2.4M"
          change="92%"
          isPositive={true}
          trendText="September dues"
          icon={<Receipt size={22} />}
          iconBg="#eff6ff"
          iconColor="#0B3974"
          sparklineData={[1.8, 2.1, 2.3, 2.4]}
          onClick={() => onNavigate('fees')}
        />

        <StatCard
          label="Pending Fees"
          value="Rs. 340K"
          change="-14%"
          isPositive={true}
          trendText="decreasing"
          icon={<AlertTriangle size={22} />}
          iconBg="#fff9c4"
          iconColor="#b8860b"
          sparklineData={[520, 480, 410, 370, 340]}
          onClick={() => onNavigate('fees')}
        />

        <StatCard
          label="New Admissions"
          value="18"
          change="+6"
          isPositive={true}
          trendText="this week"
          icon={<UserPlus size={22} />}
          iconBg="#feecec"
          iconColor="#E62929"
          sparklineData={[4, 7, 9, 12, 18]}
          onClick={() => onNavigate('admissions')}
        />

        <StatCard
          label="Net Profit"
          value="Rs. 1.38M"
          change="+18.4%"
          isPositive={true}
          trendText="fiscal surplus"
          icon={<DollarSign size={22} />}
          iconBg="#e8f5e9"
          iconColor="#4CAF50"
          sparklineData={[0.9, 1.05, 1.2, 1.38]}
          onClick={() => onNavigate('accounts')}
        />
      </div>

      {/* 4 Interactive Charts Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '18px',
          marginBottom: '24px'
        }}
      >
        {/* Chart 1: Income vs Expenses */}
        <div className="bca-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Income vs Expenses</h3>
              <p style={{ fontSize: '0.76rem', color: '#64748b', margin: '2px 0 0' }}>Monthly financial trend (Jan – Dec 2026)</p>
            </div>
            <button
              onClick={() => onNavigate('accounts')}
              className="bca-btn bca-btn-secondary"
              style={{ padding: '4px 10px', fontSize: '0.76rem' }}
            >
              Details
            </button>
          </div>
          <div style={{ height: '220px' }}>
            <Bar data={incomeVsExpenseData} options={chartOptions} />
          </div>
        </div>

        {/* Chart 2: Student Attendance Trend */}
        <div className="bca-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Student Attendance Trend</h3>
              <p style={{ fontSize: '0.76rem', color: '#64748b', margin: '2px 0 0' }}>Weekly attendance rate across all grades</p>
            </div>
            <button
              onClick={() => onNavigate('attendance')}
              className="bca-btn bca-btn-secondary"
              style={{ padding: '4px 10px', fontSize: '0.76rem' }}
            >
              Daily Register
            </button>
          </div>
          <div style={{ height: '220px' }}>
            <Line data={attendanceTrendData} options={chartOptions} />
          </div>
        </div>

        {/* Chart 3: Fee Collection vs Target */}
        <div className="bca-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Fee Recovery & Target</h3>
              <p style={{ fontSize: '0.76rem', color: '#64748b', margin: '2px 0 0' }}>Past 6 months collection milestones</p>
            </div>
            <button
              onClick={() => onNavigate('fees')}
              className="bca-btn bca-btn-secondary"
              style={{ padding: '4px 10px', fontSize: '0.76rem' }}
            >
              Vouchers
            </button>
          </div>
          <div style={{ height: '220px' }}>
            <Bar data={feeCollectionData} options={chartOptions} />
          </div>
        </div>

        {/* Chart 4: Subject Performance */}
        <div className="bca-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Subject-wise Performance</h3>
              <p style={{ fontSize: '0.76rem', color: '#64748b', margin: '2px 0 0' }}>Mean assessment scores in major subjects</p>
            </div>
            <button
              onClick={() => onNavigate('exams-results')}
              className="bca-btn bca-btn-secondary"
              style={{ padding: '4px 10px', fontSize: '0.76rem' }}
            >
              Exams
            </button>
          </div>
          <div style={{ height: '220px' }}>
            <Bar data={subjectPerformanceData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* 6 Dashboard Sections Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '18px'
        }}
      >
        {/* Section 1: Recent Admissions */}
        <div className="bca-card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Recent Admissions</h3>
            <button onClick={() => onNavigate('admissions')} className="bca-btn bca-btn-outline" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
              View All
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {MOCK_ADMISSIONS.slice(0, 4).map((adm) => (
              <div
                key={adm.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #f1f5f9'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>
                    {adm.studentName}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                    Applied: <strong style={{ color: '#2563eb' }}>{adm.appliedClass}</strong> • {adm.applicationDate}
                  </div>
                </div>
                <span className={`bca-badge bca-badge-${adm.status.toLowerCase().replace(' ', '-')}`}>
                  {adm.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Recent Fee Payments */}
        <div className="bca-card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Recent Fee Payments</h3>
            <button onClick={() => onNavigate('fees')} className="bca-btn bca-btn-outline" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
              Fee Ledger
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {MOCK_FEE_VOUCHERS.filter(f => f.status === 'Paid').slice(0, 4).map((fee) => (
              <div
                key={fee.voucherNo}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #f1f5f9'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>
                    {fee.studentName}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                    {fee.class} • Paid via {fee.paymentMethod}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#059669' }}>
                    Rs. {fee.totalAmount.toLocaleString()}
                  </div>
                  <span className="bca-badge bca-badge-paid">Paid</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Pending Fee Vouchers */}
        <div className="bca-card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Pending Fee Dues</h3>
            <button onClick={() => onNavigate('fees')} className="bca-btn bca-btn-outline" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
              Defaulters List
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {MOCK_FEE_VOUCHERS.filter(f => f.status !== 'Paid').slice(0, 4).map((fee) => (
              <div
                key={fee.voucherNo}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  backgroundColor: '#fffbeb',
                  border: '1px solid #fef3c7'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#92400e' }}>
                    {fee.studentName} ({fee.class}-{fee.section})
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#b45309' }}>
                    Due: {fee.dueDate} • Voucher: {fee.voucherNo}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#b45309' }}>
                    Rs. {fee.totalAmount.toLocaleString()}
                  </div>
                  <span className={`bca-badge bca-badge-${fee.status.toLowerCase()}`}>
                    {fee.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Upcoming Events */}
        <div className="bca-card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Upcoming School Events</h3>
            <button onClick={() => onNavigate('events')} className="bca-btn bca-btn-outline" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
              Calendar
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {MOCK_EVENTS.slice(0, 3).map((evt) => (
              <div
                key={evt.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #f1f5f9'
                }}
              >
                <div
                  style={{
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    minWidth: '54px'
                  }}
                >
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    {new Date(evt.date).toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                    {new Date(evt.date).getDate()}
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {evt.title}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                    {evt.time} • {evt.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Recent Notices */}
        <div className="bca-card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Recent Notices & Circulars</h3>
            <button onClick={() => onNavigate('notices')} className="bca-btn bca-btn-outline" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
              Notice Board
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {MOCK_NOTICES.slice(0, 3).map((notice) => (
              <div
                key={notice.id}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #f1f5f9'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span className={`bca-badge bca-badge-${notice.priority === 'Urgent' ? 'overdue' : notice.priority === 'High' ? 'pending' : 'primary'}`}>
                    {notice.category} • {notice.priority}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{notice.date}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>
                  {notice.title}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 6: Top Performing Students */}
        <div className="bca-card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Top Performing Students</h3>
            <button onClick={() => onNavigate('student-progress')} className="bca-btn bca-btn-outline" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
              Analytics
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {MOCK_STUDENTS.slice(0, 4).map((student, idx) => (
              <div
                key={student.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #f1f5f9'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: idx === 0 ? '#facc15' : idx === 1 ? '#cbd5e1' : '#f97316',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.75rem'
                    }}
                  >
                    {idx + 1}
                  </div>
                  <img
                    src={student.avatar}
                    alt={student.name}
                    style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.86rem', color: '#0f172a' }}>
                      {student.name}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                      {student.class} • Attendance {student.attendancePct}%
                    </div>
                  </div>
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#059669', fontWeight: 700, fontSize: '0.84rem' }}>
                  <Award size={15} /> Grade A+
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
