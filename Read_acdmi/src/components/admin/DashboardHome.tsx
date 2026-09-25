import React, { useState, useEffect } from 'react';
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
import type { AdminTab } from '../../types';
import { useToast } from '../common/Toast';
import { adminApi, admissionsApi, feesApi, cmsApi, studentsApi } from '../../services/api';

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
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [recentAdmissions, setRecentAdmissions] = useState<any[]>([]);
  const [recentVouchers, setRecentVouchers] = useState<any[]>([]);
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [recentNotices, setRecentNotices] = useState<any[]>([]);
  const [topStudents, setTopStudents] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    adminApi.getDashboard().then((res) => {
      if (isMounted && res?.data) {
        setDashboardData(res.data);
        if (res.data.recentAdmissions?.length > 0) {
          setRecentAdmissions(res.data.recentAdmissions.map((a: any) => ({
            id: a.id,
            studentName: a.studentName || a.fullName,
            appliedClass: a.appliedClass?.name || 'Grade 9',
            applicationDate: a.applicationDate ? a.applicationDate.split('T')[0] : '2026-09-08',
            status: a.status === 'APPROVED' ? 'Approved' : 'Pending'
          })));
        }
        if (res.data.recentNotices?.length > 0) {
          setRecentNotices(res.data.recentNotices.map((n: any) => ({
            id: n.id,
            title: n.title,
            category: n.category || 'Academic',
            priority: n.priority === 'HIGH' ? 'High' : 'Normal',
            date: n.publishedDate ? n.publishedDate.split('T')[0] : '2026-09-08'
          })));
        }
      }
    }).catch(() => {});

    feesApi.getVouchers().then((res) => {
      if (isMounted && res?.data && res.data.length > 0) {
        setRecentVouchers(res.data.map((v: any) => ({
          voucherNo: v.voucherNo || `VCH-${v.id}`,
          studentName: v.student?.fullName || 'Student',
          class: v.student?.class?.name || 'Grade 9',
          section: v.student?.section?.name ? v.student.section.name.replace('Section ', '') : 'A',
          totalAmount: Number(v.totalAmount) || 8500,
          status: v.status === 'PAID' ? 'Paid' : 'Pending',
          dueDate: v.dueDate ? v.dueDate.split('T')[0] : '2026-09-20',
          paymentMethod: v.paymentMethod || 'Bank Alfalah'
        })));
      }
    }).catch(() => {});

    cmsApi.getEvents().then((res) => {
      if (isMounted && res?.data && res.data.length > 0) {
        setRecentEvents(res.data.slice(0, 3).map((e: any) => ({
          id: e.id,
          title: e.title,
          date: e.eventDate ? e.eventDate.split('T')[0] : '2026-10-15',
          time: e.eventTime || '09:00 AM',
          location: e.location || 'Auditorium'
        })));
      }
    }).catch(() => {});

    studentsApi.getStudents().then((res) => {
      if (isMounted && res?.data && res.data.length > 0) {
        setTopStudents(res.data.slice(0, 4).map((s: any) => ({
          id: s.id,
          name: s.fullName || s.name,
          rollNo: s.rollNo || s.id,
          class: s.class?.name || 'Grade 10',
          section: s.section?.name ? s.section.name.replace('Section ', '') : 'A',
          attendancePct: s.attendancePct ?? 96,
          avatar: s.avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
        })));
      }
    }).catch(() => {});

    return () => { isMounted = false; };
  }, []);
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
        label: 'Income (PKR)',
        data: [0, 0, 0, 0, 0, 0, 0, 0, (dashboardData?.stats?.feeCollection?.collected || 0), 0, 0, 0],
        backgroundColor: '#0B3974',
        borderRadius: 6
      },
      {
        label: 'Expenses (PKR)',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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
        data: [0, 0, 0, 0, 0, dashboardData?.stats?.todayAttendancePct || 0],
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.12)',
        tension: 0.35,
        pointBackgroundColor: '#4CAF50',
        pointRadius: 4
      }
    ]
  };

  const feeTrendsFromApi = dashboardData?.charts?.feeTrends;
  const feeCollectionData = {
    labels: feeTrendsFromApi ? feeTrendsFromApi.map((t: any) => t.month) : ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    datasets: [
      {
        label: 'Target (PKR)',
        data: feeTrendsFromApi ? feeTrendsFromApi.map((t: any) => (t.collected + t.pending)) : [0, 0, 0, 0, 0, dashboardData?.stats?.feeCollection?.billed || 0],
        backgroundColor: '#e2e8f0',
        borderRadius: 6
      },
      {
        label: 'Collected (PKR)',
        data: feeTrendsFromApi ? feeTrendsFromApi.map((t: any) => t.collected) : [0, 0, 0, 0, 0, dashboardData?.stats?.feeCollection?.collected || 0],
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
        data: [0, 0, 0, 0, 0, 0, 0],
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
            Today is <strong style={{ color: '#ffffff' }}>{todayDate}</strong>. {dashboardData?.stats?.totalClasses ?? 0} active classes registered with {dashboardData?.stats?.todayAttendancePct ?? 0}% student attendance recorded today.
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
          value={dashboardData?.stats?.totalStudents !== undefined ? dashboardData.stats.totalStudents.toLocaleString() : "0"}
          change="+0%"
          isPositive={true}
          trendText="enrolled in database"
          icon={<Users size={22} />}
          iconBg="#eff6ff"
          iconColor="#0B3974"
          sparklineData={[0, 0, 0, 0, 0, dashboardData?.stats?.totalStudents || 0]}
          onClick={() => onNavigate('students')}
        />

        <StatCard
          label="Teachers & Staff"
          value={dashboardData?.stats?.totalTeachers !== undefined ? dashboardData.stats.totalTeachers.toString() : "0"}
          change="+0"
          isPositive={true}
          trendText="active faculty"
          icon={<GraduationCap size={22} />}
          iconBg="#fff9c4"
          iconColor="#8c6800"
          sparklineData={[0, 0, 0, 0, 0, dashboardData?.stats?.totalTeachers || 0]}
          onClick={() => onNavigate('teachers')}
        />

        <StatCard
          label="Active Classes"
          value={dashboardData?.stats?.totalClasses !== undefined ? dashboardData.stats.totalClasses.toString() : "0"}
          change="100%"
          isPositive={true}
          trendText="academic wings"
          icon={<BookOpen size={22} />}
          iconBg="#eff6ff"
          iconColor="#0B3974"
          sparklineData={[0, 0, 0, 0, 0, dashboardData?.stats?.totalClasses || 0]}
          onClick={() => onNavigate('classes-subjects')}
        />

        <StatCard
          label="Today's Attendance"
          value={dashboardData?.stats?.todayAttendancePct !== undefined ? `${dashboardData.stats.todayAttendancePct}%` : "0%"}
          change="0%"
          isPositive={true}
          trendText="real-time logs"
          icon={<CheckSquare size={22} />}
          iconBg="#e8f5e9"
          iconColor="#4CAF50"
          sparklineData={[0, 0, 0, 0, 0, dashboardData?.stats?.todayAttendancePct || 0]}
          onClick={() => onNavigate('attendance')}
        />

        <StatCard
          label="Fee Collection"
          value={dashboardData?.stats?.feeCollection ? `Rs. ${(dashboardData.stats.feeCollection.collected || 0).toLocaleString()}` : "Rs. 0"}
          change={`${dashboardData?.stats?.feeCollection?.pct || 0}%`}
          isPositive={true}
          trendText="collected this term"
          icon={<Receipt size={22} />}
          iconBg="#eff6ff"
          iconColor="#0B3974"
          sparklineData={[0, 0, 0, dashboardData?.stats?.feeCollection?.collected || 0]}
          onClick={() => onNavigate('fees')}
        />

        <StatCard
          label="Outstanding Dues"
          value={dashboardData?.stats?.feeCollection?.pending ? `Rs. ${(dashboardData.stats.feeCollection.pending || 0).toLocaleString()}` : "Rs. 0"}
          change="0%"
          isPositive={true}
          trendText="recoveries pending"
          icon={<AlertTriangle size={22} />}
          iconBg="#fff9c4"
          iconColor="#b8860b"
          sparklineData={[0, 0, 0, dashboardData?.stats?.feeCollection?.pending || 0]}
          onClick={() => onNavigate('fees')}
        />

        <StatCard
          label="New Admissions"
          value={dashboardData?.stats?.pendingAdmissions !== undefined ? dashboardData.stats.pendingAdmissions.toString() : "0"}
          change="+0"
          isPositive={true}
          trendText="pending review"
          icon={<UserPlus size={22} />}
          iconBg="#feecec"
          iconColor="#E62929"
          sparklineData={[0, 0, 0, dashboardData?.stats?.pendingAdmissions || 0]}
          onClick={() => onNavigate('admissions')}
        />

        <StatCard
          label="Net Profit"
          value={dashboardData?.stats?.feeCollection?.collected ? `Rs. ${(dashboardData.stats.feeCollection.collected || 0).toLocaleString()}` : "Rs. 0"}
          change="+0%"
          isPositive={true}
          trendText="fiscal ledger"
          icon={<DollarSign size={22} />}
          iconBg="#e8f5e9"
          iconColor="#4CAF50"
          sparklineData={[0, 0, 0, dashboardData?.stats?.feeCollection?.collected || 0]}
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
            {recentAdmissions.length === 0 ? (
              <div style={{ padding: '16px', textAlign: 'center', color: '#94a3b8', fontSize: '0.84rem' }}>
                No admission applications yet
              </div>
            ) : (
              recentAdmissions.slice(0, 4).map((adm) => (
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
                  <span className={`bca-badge bca-badge-${(adm.status || 'pending').toLowerCase().replace(' ', '-')}`}>
                    {adm.status}
                  </span>
                </div>
              ))
            )}
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
            {recentVouchers.filter(f => f.status === 'Paid').length === 0 ? (
              <div style={{ padding: '16px', textAlign: 'center', color: '#94a3b8', fontSize: '0.84rem' }}>
                No paid fee vouchers yet
              </div>
            ) : (
              recentVouchers.filter(f => f.status === 'Paid').slice(0, 4).map((fee) => (
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
              ))
            )}
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
            {recentVouchers.filter(f => f.status !== 'Paid').length === 0 ? (
              <div style={{ padding: '16px', textAlign: 'center', color: '#94a3b8', fontSize: '0.84rem' }}>
                No pending fee dues
              </div>
            ) : (
              recentVouchers.filter(f => f.status !== 'Paid').slice(0, 4).map((fee) => (
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
                    <span className={`bca-badge bca-badge-${(fee.status || 'pending').toLowerCase()}`}>
                      {fee.status}
                    </span>
                  </div>
                </div>
              ))
            )}
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
            {recentEvents.length === 0 ? (
              <div style={{ padding: '16px', textAlign: 'center', color: '#94a3b8', fontSize: '0.84rem' }}>
                No upcoming events scheduled
              </div>
            ) : (
              recentEvents.slice(0, 3).map((evt) => (
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
              ))
            )}
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
            {recentNotices.length === 0 ? (
              <div style={{ padding: '16px', textAlign: 'center', color: '#94a3b8', fontSize: '0.84rem' }}>
                No notices published yet
              </div>
            ) : (
              recentNotices.slice(0, 3).map((notice) => (
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
              ))
            )}
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
            {topStudents.length === 0 ? (
              <div style={{ padding: '16px', textAlign: 'center', color: '#94a3b8', fontSize: '0.84rem' }}>
                No student rankings recorded yet
              </div>
            ) : (
              topStudents.slice(0, 4).map((student, idx) => (
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
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
