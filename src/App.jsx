import React, { useState } from 'react';
import {
  Sprout, LayoutDashboard, Activity, Droplets,
  Settings, Bell, CloudRain, AlertTriangle,
  CheckCircle, Zap, FileText, Send, X, TrendingUp, History, Download, Power, Clock, Mail
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area,
  BarChart, Bar, Legend
} from 'recharts';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import emailjs from '@emailjs/browser';

// Mock Data
const soilHistoryData = [
  { time: '08:00', nitrogen: 45, phosphorus: 30, potassium: 50, moisture: 60 },
  { time: '09:00', nitrogen: 42, phosphorus: 28, potassium: 48, moisture: 58 },
  { time: '10:00', nitrogen: 38, phosphorus: 25, potassium: 45, moisture: 55 },
  { time: '11:00', nitrogen: 35, phosphorus: 23, potassium: 42, moisture: 48 },
  { time: '12:00', nitrogen: 32, phosphorus: 20, potassium: 40, moisture: 42 },
  { time: '13:00', nitrogen: 30, phosphorus: 18, potassium: 38, moisture: 35 },
  { time: '14:00', nitrogen: 40, phosphorus: 25, potassium: 45, moisture: 65 },
];

const weeklyData = [
  { day: 'Mon', yield: 85, waterUsed: 120 },
  { day: 'Tue', yield: 86, waterUsed: 100 },
  { day: 'Wed', yield: 88, waterUsed: 130 },
  { day: 'Thu', yield: 87, waterUsed: 90 },
  { day: 'Fri', yield: 90, waterUsed: 110 },
  { day: 'Sat', yield: 92, waterUsed: 95 },
  { day: 'Sun', yield: 92, waterUsed: 105 },
];

const initialInsights = [
  {
    id: 1,
    type: 'warning',
    title: 'Low Nitrogen Detected',
    message: 'Nitrogen levels dropped below 35mg/kg. Crop yield may decrease by 15% if untreated.',
    icon: <AlertTriangle size={20} />,
    actionable: true,
    actionText: 'Send Detailed Report & Fix'
  },
  {
    id: 2,
    type: 'action',
    title: 'Irrigation Scheduled',
    message: 'Moisture reached critical 35%. Automated irrigation system pumped for 15 mins.',
    icon: <Zap size={20} />,
    actionable: false
  },
  {
    id: 3,
    type: 'success',
    title: 'Optimal Phosphorus',
    message: 'Phosphorus levels are stable. No action required.',
    icon: <CheckCircle size={20} />,
    actionable: false
  }
];

const actionLogs = [
  { time: '14:05 PM', action: 'Automated Irrigation Triggered (Sector A)', status: 'Success' },
  { time: '11:30 AM', action: 'Daily Diagnostics Scan Completed', status: 'Success' },
  { time: '09:15 AM', action: 'Pesticide Drone Dispatch', status: 'In Progress' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [pumpActive, setPumpActive] = useState(false);

  // Real Google Auth State
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log('Google Auth User Data:', decoded);
      setUser({
        name: decoded.name || decoded.given_name,
        email: decoded.email,
        picture: decoded.picture,
        initials: decoded.name ? decoded.name.substring(0, 2).toUpperCase() : 'US'
      });
    } catch (error) {
      console.error('Error decoding JWT:', error);
      alert('Login sequence failed, could not decode credentials.');
    }
  };

  const handleLoginError = () => {
    console.error('Google Sign In was unsuccessful');
    alert('Failed to sign in with Google.');
  };

  const handleLogout = () => {
    setUser(null);
  };

  const openActionModal = (actionType) => {
    setModalContent(actionType);
    setModalOpen(true);
  };

  const executeAction = () => {
    setIsSending(true);

    if (modalContent === 'report' || String(modalContent).startsWith('email_')) {
      const reportName = modalContent === 'report' ? 'Complete Sector A Analysis' : String(modalContent).replace('email_', '');

      const templateParams = {
        to_name: user.name,
        to_email: user.email,
        report_name: reportName,
        message: `Your requested AgriSense AI field data report (${reportName}) is verified and attached.`
      };

      // Real EmailJS Code (Notice the /* and */ are gone)
      emailjs.send(
        'service_t1s7fkk',     // <-- Paste your Service ID here
        'template_e8p60xi',    // <-- Paste your Template ID here
        templateParams,
        'pX1LnRKITf-jTnpjQ'    // <-- Paste your Public Key here
      )
        .then((response) => {
          setIsSending(false);
          setModalOpen(false);
          alert(`Success! Report emailed to ${user.email} using EmailJS.`);
        })
        .catch((error) => {
          setIsSending(false);
          console.error('Email sending failed:', error);
          alert(`Email sending failed. Reason: ${error?.text || error?.message || 'Unknown Error'}. Please verify your Service ID, Template ID, and Public Key are absolutely correct.`);
        });
      // ---------------------------------------------

    } else {
      // Logic for hardware interventions (e.g. Pump, Fix)
      setTimeout(() => {
        setIsSending(false);
        setModalOpen(false);
        if (modalContent === 'fix') {
          setNotifications(prev => Math.max(0, prev - 1));
        }
        alert('Hardware action successfully completed!');
      }, 1500);
    }
  };

  const handleEmailReport = (reportName) => {
    setModalContent(`email_${reportName}`);
    setModalOpen(true);
  };

  // Login View
  if (!user) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-color)', position: 'relative'
      }}>
        {/* Decorative background blurs specific to login */}
        <div style={{ position: 'absolute', top: '10%', right: '20%', width: '300px', height: '300px', background: 'var(--accent-primary)', filter: 'blur(100px)', opacity: 0.1, borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '10%', left: '20%', width: '300px', height: '300px', background: 'var(--accent-blue)', filter: 'blur(100px)', opacity: 0.1, borderRadius: '50%' }}></div>

        <div className="glass-card" style={{ width: '90%', maxWidth: '420px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 2rem', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Sprout size={40} color="var(--accent-primary)" />
            <h1 style={{ fontSize: '2rem' }}>AgriSense  </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '3rem' }}>
            Smart agricultural predictions and real-time dashboard analytics.
          </p>

          {/* REAL Google Auth Component */}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={handleLoginError}
              shape="rectangular"
              theme="filled_black"
              size="large"
              text="continue_with"
              useOneTap
            />
          </div>

          <p style={{ marginTop: '2rem', fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
            If the login button does not appear, ensure you have placed your Client ID in <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 4px', borderRadius: '4px' }}>main.jsx</code>.
          </p>
        </div>
      </div>
    );
  }

  // Views Dashboard
  const renderDashboard = () => (
    <div className="dashboard-grid">
      {/* NPK Metrics */}
      <div className="glass-card metric-card">
        <div className="metric-header">
          <span>Nitrogen (N)</span>
          <div className="metric-icon nitrogen"><Activity size={20} /></div>
        </div>
        <div className="metric-value">30 <span className="metric-unit">mg/kg</span></div>
        <div className="metric-trend trend-down">▼ 15% (Critical)</div>
        <div className="progress-container"><div className="progress-bar" style={{ width: '40%', background: 'var(--danger)' }}></div></div>
      </div>

      <div className="glass-card metric-card">
        <div className="metric-header">
          <span>Phosphorus (P)</span>
          <div className="metric-icon phosphorus"><Activity size={20} /></div>
        </div>
        <div className="metric-value">25 <span className="metric-unit">mg/kg</span></div>
        <div className="metric-trend trend-up">▲ 2% from baseline</div>
        <div className="progress-container"><div className="progress-bar" style={{ width: '65%', background: 'var(--accent-blue)' }}></div></div>
      </div>

      <div className="glass-card metric-card">
        <div className="metric-header">
          <span>Potassium (K)</span>
          <div className="metric-icon potassium"><Activity size={20} /></div>
        </div>
        <div className="metric-value">45 <span className="metric-unit">mg/kg</span></div>
        <div className="metric-trend trend-up">▲ Optimal status</div>
        <div className="progress-container"><div className="progress-bar" style={{ width: '85%', background: 'var(--accent-orange)' }}></div></div>
      </div>

      <div className="glass-card metric-card">
        <div className="metric-header">
          <span>Soil Moisture</span>
          <div className="metric-icon moisture"><Droplets size={20} /></div>
        </div>
        <div className="metric-value">65 <span className="metric-unit">%</span></div>
        <div className="metric-trend trend-up">▲ Recently Irrigated</div>
        <div className="progress-container"><div className="progress-bar" style={{ width: '65%', background: 'var(--accent-primary)' }}></div></div>
      </div>

      {/* AI Recommendation Banner */}
      <div className="recommendation-banner" style={{ gridColumn: 'span 8' }}>
        <div className="banner-content">
          <h3>Targeted Action Required</h3>
          <p>Predictive model indicates Nitrogen wash-out due to recent rain. Immediate application of 20kg/ha slow-release fertilizer is recommended to prevent 15% yield loss.</p>
        </div>
        <button className="btn btn-primary" onClick={() => openActionModal('fix')}>
          <Sprout size={18} /> Review & Apply Fix
        </button>
      </div>

      {/* System Logs */}
      <div className="glass-card" style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><History size={18} color="var(--accent-blue)" /> Recent Automation</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, overflowY: 'auto' }}>
          {actionLogs.map((log, i) => (
            <div key={i} style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>{log.time}</div>
              <div style={{ fontSize: '0.9rem' }}>{log.action}</div>
              <div style={{ fontSize: '0.75rem', color: log.status === 'Success' ? 'var(--accent-primary)' : 'var(--accent-orange)', marginTop: '0.2rem' }}>{log.status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chart */}
      <div className="glass-card chart-container">
        <h3 style={{ marginBottom: '1.5rem' }}>NPK & Moisture Variance (Last 24h)</h3>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={soilHistoryData}>
            <defs>
              <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorNitrogen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--danger)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--danger)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
            <XAxis dataKey="time" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
            <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)' }} />
            <Area type="monotone" dataKey="moisture" name="Moisture (%)" stroke="var(--accent-primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorMoisture)" />
            <Area type="monotone" dataKey="nitrogen" name="Nitrogen (mg/kg)" stroke="var(--danger)" strokeWidth={2} fillOpacity={1} fill="url(#colorNitrogen)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Insights / Alerts */}
      <div className="ai-insights">
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Real-Time Anomalies
          <span style={{ fontSize: '0.75rem', fontWeight: 400, background: 'var(--glass-bg)', padding: '4px 8px', borderRadius: '12px' }}>{notifications} Active</span>
        </h3>
        {initialInsights.map(insight => (
          <div key={insight.id} className="insight-card" style={{ flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div className={`insight-icon ${insight.type}`}>{insight.icon}</div>
              <div className="insight-content">
                <h4>{insight.title}</h4>
                <p>{insight.message}</p>
              </div>
            </div>
            {insight.actionable && (
              <button
                onClick={() => handleEmailReport(insight.title)}
                style={{
                  marginTop: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)',
                  color: 'var(--danger)', padding: '8px', borderRadius: '8px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  fontWeight: 600, transition: 'all 0.3s'
                }}
              >
                <Mail size={16} /> Email Detailed Report to Me
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3>Weekly Yield & Consumption</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>Comparing crop yield projection with water consumption in liters.</p>
          </div>
          <button className="btn btn-primary" onClick={() => handleEmailReport('Analytics Export')}>
            <Mail size={18} /> Email Data
          </button>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
            <XAxis dataKey="day" stroke="var(--text-secondary)" />
            <YAxis stroke="var(--text-secondary)" />
            <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--glass-border)', color: 'white' }} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar dataKey="yield" name="Yield Potential (%)" fill="var(--accent-purple)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="waterUsed" name="Water Used (Liters)" fill="var(--accent-blue)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="responsive-grid-2">
        <div className="glass-card">
          <h3>Soil Composition</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: 1.6 }}>
            Ph levels are currently at <b>6.5</b>, which is optimal for wheat. Soil organic matter is observed to be <b>3.2%</b>.
            We estimate that by the end of the month, soil degradation will be less than <b>0.1%</b> thanks to current intervention strategies.
          </p>
        </div>
        <div className="glass-card">
          <h3>Environmental Factors</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: 1.6 }}>
            UV index reached <b>7.2 (High)</b> yesterday. The upcoming cloudy days will decrease evaporation rates, minimizing the need for heavy irrigation loops for the next 48 hours.
          </p>
        </div>
      </div>
    </div>
  );

  const renderIrrigation = () => (
    <div className="responsive-grid-irg">
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ marginBottom: '0.5rem' }}>Manual Override</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>Directly control the Sector A central pivot irrigation pump.</p>

        <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '120px', height: '120px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: pumpActive ? 'var(--accent-primary)' : 'var(--bg-secondary)',
            boxShadow: pumpActive ? '0 0 30px var(--accent-glow)' : 'none',
            transition: 'all 0.5s ease', cursor: 'pointer', border: '2px solid var(--glass-border)'
          }} onClick={() => setPumpActive(!pumpActive)}>
            <Power size={48} color={pumpActive ? '#fff' : 'var(--text-secondary)'} />
          </div>
          <h2 style={{ color: pumpActive ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>{pumpActive ? 'System Active' : 'System Offline'}</h2>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
          <h4 style={{ marginBottom: '1rem' }}>Upcoming Schedule</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--glass-bg)', padding: '1rem', borderRadius: '8px' }}>
            <Clock size={20} color="var(--accent-blue)" />
            <div>
              <div style={{ fontWeight: 600 }}>Morning Sprinklers</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Today, 06:00 AM (Duration: 30m)</div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card">
        <h3>Moisture Heatmap Overview</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', marginTop: '0.5rem' }}>Live satellite vs sensor projection of soil moisture distribution.</p>
        <div style={{ width: '100%', height: '400px', background: 'linear-gradient(45deg, #0b1c14 0%, #1a3024 100%)', borderRadius: '12px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '20%', left: '30%', width: '150px', height: '150px', background: 'radial-gradient(circle, var(--accent-primary) 0%, transparent 70%)', opacity: 0.3, filter: 'blur(10px)' }}></div>
          <div style={{ position: 'absolute', top: '50%', left: '60%', width: '200px', height: '200px', background: 'radial-gradient(circle, var(--danger) 0%, transparent 70%)', opacity: 0.2, filter: 'blur(15px)' }}></div>

          <div style={{ position: 'absolute', bottom: '20px', left: '20px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '1rem', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '12px', height: '12px', background: 'var(--accent-primary)', borderRadius: '50%' }}></div> Optimal Moisture</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}><div style={{ width: '12px', height: '12px', background: 'var(--danger)', borderRadius: '50%' }}></div> Dry Zone (Requires Attention)</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2>Available Reports</h2>
        <button className="btn btn-primary" onClick={() => openActionModal('report')}>Generate New Report</button>
      </div>

      <div className="table-responsive">
        <table className="reports-table">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '1rem 0', fontWeight: 500 }}>Report Name</th>
              <th style={{ padding: '1rem 0', fontWeight: 500 }}>Date Generated</th>
              <th style={{ padding: '1rem 0', fontWeight: 500 }}>Size</th>
              <th style={{ padding: '1rem 0', fontWeight: 500 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
              <td style={{ padding: '1.5rem 0', display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 600 }}>
                <FileText color="var(--accent-blue)" /> Sector_A_NPK_Analysis_April.pdf
              </td>
              <td style={{ padding: '1.5rem 0' }}>April 7, 2026</td>
              <td style={{ padding: '1.5rem 0' }}>2.4 MB</td>
              <td style={{ padding: '1.5rem 0' }}>
                <span onClick={() => handleEmailReport('Sector_A_NPK_Analysis_April.pdf')} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 600 }}><Mail size={16} /> Email</span>
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
              <td style={{ padding: '1.5rem 0', display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 600 }}>
                <FileText color="var(--accent-blue)" /> Q1_Yield_Prediction.pdf
              </td>
              <td style={{ padding: '1.5rem 0' }}>March 30, 2026</td>
              <td style={{ padding: '1.5rem 0' }}>4.1 MB</td>
              <td style={{ padding: '1.5rem 0' }}>
                <span onClick={() => handleEmailReport('Q1_Yield_Prediction.pdf')} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 600 }}><Mail size={16} /> Email</span>
              </td>
            </tr>
            <tr>
              <td style={{ padding: '1.5rem 0', display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 600 }}>
                <FileText color="var(--accent-blue)" /> Drone_Diagnostics_Log_924.csv
              </td>
              <td style={{ padding: '1.5rem 0' }}>March 15, 2026</td>
              <td style={{ padding: '1.5rem 0' }}>820 KB</td>
              <td style={{ padding: '1.5rem 0' }}>
                <span onClick={() => handleEmailReport('Drone_Diagnostics_Log_924.csv')} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 600 }}><Mail size={16} /> Email</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <Sprout size={32} />
          <span>AgriSense </span>
        </div>

        <ul className="nav-menu">
          <li className={`nav-element ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard size={20} /> Dashboard
          </li>
          <li className={`nav-element ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
            <Activity size={20} /> Field Analytics
          </li>
          <li className={`nav-element ${activeTab === 'irrigation' ? 'active' : ''}`} onClick={() => setActiveTab('irrigation')}>
            <Droplets size={20} /> Smart Irrigation
          </li>
          <li className={`nav-element ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>
            <FileText size={20} /> Reports
          </li>
        </ul>

        <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }} onClick={handleLogout}>
          {user.picture ? (
            <img src={user.picture} alt="Profile" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <div className="avatar" style={{ width: 36, height: 36, fontSize: '0.9rem' }}>{user.initials}</div>
          )}
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Sign out</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem', textTransform: 'capitalize' }}>Hello, {user.name} 👋</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Here is what's happening in Sector A today.</p>
          </div>

          <div className="header-widgets">
            <div className="weather-widget" style={{ border: '1px solid var(--accent-purple-glow)' }}>
              <TrendingUp size={24} color="var(--accent-purple)" />
              <div>
                <span style={{ fontWeight: 600, display: 'block', color: 'var(--accent-purple)' }}>92% Predicted Yield</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>+4% vs Last Season</span>
              </div>
            </div>

            <div className="weather-widget">
              <CloudRain size={24} color="var(--accent-blue)" />
              <div>
                <span style={{ fontWeight: 600, display: 'block' }}>24°C / Rain</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Humidity: 72%</span>
              </div>
            </div>

            <div className="user-profile">
              <div className="status-indicator live-status">
                <div className="status-dot"></div> Live
              </div>
              {user.picture ? (
                <img src={user.picture} alt="Profile" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', boxShadow: '0 0 15px var(--accent-glow)' }} />
              ) : (
                <div className="avatar" style={{ cursor: 'pointer' }}>{user.initials}</div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Content Rendering */}
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'irrigation' && renderIrrigation()}
        {activeTab === 'reports' && renderReports()}

      </main>

      {/* Action Modal Overlay */}
      {modalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="glass-card" style={{ width: '90%', maxWidth: '500px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {(modalContent === 'report' || String(modalContent).startsWith('email_')) ? <Mail color="var(--accent-blue)" /> : <Sprout color="var(--accent-primary)" />}
                {(modalContent === 'report' || String(modalContent).startsWith('email_')) ? 'Send Report via Email' : 'Confirm Action'}
              </h2>
              <X size={24} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} onClick={() => setModalOpen(false)} />
            </div>

            {String(modalContent).startsWith('email_') ? (
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                You are about to email <b>{String(modalContent).replace('email_', '')}</b> directly to your registered Google account ({user.email}). Does this look correct?
              </p>
            ) : modalContent === 'report' ? (
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                A new detailed PDF report containing the latest NPK values, historical variance graphs, and crop yield forecasting will be generated and emailed to your Google account ({user.email}).
              </p>
            ) : (
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Confirm automated dispersion of 20kg/hectare Urea. The automated drone/pump systems will be active for 45 minutes in Sector A.
              </p>
            )}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setModalOpen(false)}
                style={{ padding: '0.75rem 1.5rem', background: 'transparent', border: '1px solid var(--text-secondary)', color: 'var(--text-secondary)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
              >Cancel</button>

              <button
                onClick={executeAction}
                disabled={isSending}
                className="btn btn-primary"
                style={{ minWidth: '150px', justifyContent: 'center' }}
              >
                {isSending ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Processing...
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Send size={18} /> {String(modalContent).startsWith('email_') || modalContent === 'report' ? 'Send Email' : 'Execute'}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
