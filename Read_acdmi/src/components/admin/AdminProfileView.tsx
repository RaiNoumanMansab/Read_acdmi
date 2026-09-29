import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Mail,
  Phone,
  Shield,
  Briefcase,
  Building,
  Lock,
  Save,
  KeyRound,
  AlertCircle,
  CheckCircle,
  Camera,
  Edit3,
  ChevronRight,
  Upload,
  Trash2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';
import { ButtonSpinner } from '../common/Spinner';
import { isValidPKPhone, handlePKPhoneInput, pkPhoneBorderColor } from '../../utils/pkPhone';

export const AdminProfileView: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'security'>('details');
  const [imgError, setImgError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Invalid File Type', 'Please select an image file (PNG, JPG, JPEG, WEBP)', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('File Too Large', 'Please select a profile picture under 5 MB', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setAvatarUrl(result);
        setImgError(false);
        showToast('Profile Photo Selected', 'Click "Save Changes" to apply your new profile photo to database', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAvatarUrl(user.avatarUrl || '');
      setDesignation(user.admin?.designation || '');
      setDepartment(user.admin?.department || '');
      setEmergencyContact(user.admin?.emergencyContact || '');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      showToast('Validation Error', 'Full Name is required', 'error');
      return;
    }

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email.trim())) {
      showToast('Validation Error', 'A valid email address is required', 'error');
      return;
    }

    if (phone && !isValidPKPhone(phone)) {
      showToast('Invalid Phone Number', 'Please enter a valid Pakistani mobile number (e.g. +92 300 1234567)', 'error');
      return;
    }

    if (emergencyContact && !isValidPKPhone(emergencyContact)) {
      showToast('Invalid Emergency Contact', 'Please enter a valid Pakistani mobile number for emergency contact (e.g. +92 300 1234567)', 'error');
      return;
    }

    if (newPassword) {
      if (!currentPassword) {
        showToast('Security Error', 'Please enter your current password to set a new password', 'error');
        setActiveTab('security');
        return;
      }
      if (newPassword.length < 6) {
        showToast('Password Error', 'New password must be at least 6 characters long', 'error');
        setActiveTab('security');
        return;
      }
      if (newPassword !== confirmPassword) {
        showToast('Password Error', 'New passwords do not match', 'error');
        setActiveTab('security');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const payload: any = {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        avatarUrl: avatarUrl.trim(),
        designation: designation.trim(),
        department: department.trim(),
        emergencyContact: emergencyContact.trim()
      };

      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const success = await updateProfile(payload);
      if (success) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        showToast('Profile Updated', 'Your profile has been saved successfully', 'success');
      }
    } catch (err: any) {
      console.error('Failed to update admin profile:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px 10px 38px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '0.92rem',
    outline: 'none',
    transition: 'border 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
    backgroundColor: '#fff',
    color: '#0f172a'
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.82rem',
    fontWeight: 700,
    color: '#475569',
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  };

  const tabBtnStyle = (active: boolean): React.CSSProperties => ({
    padding: '10px 22px',
    fontSize: '0.9rem',
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s',
    backgroundColor: active ? '#2563eb' : 'transparent',
    color: active ? '#ffffff' : '#64748b'
  });

  const defaultAvatar = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80";
  const avatarSrc = (!imgError && avatarUrl) ? avatarUrl : defaultAvatar;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 8px 40px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '8px' }}>
          <span>Admin</span>
          <ChevronRight size={14} />
          <span style={{ color: '#2563eb', fontWeight: 600 }}>My Profile</span>
        </div>
        <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          Admin Profile
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '4px 0 0' }}>
          Manage your personal information, credentials, and account security
        </p>
      </div>

      {/* Profile Card + Form */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px', alignItems: 'start' }}>

        {/* Left: Profile Card */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            overflow: 'hidden'
          }}
        >
          {/* Blue banner */}
          <div style={{ height: '80px', background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%)' }} />

          {/* Avatar */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 20px 24px', marginTop: '-44px' }}>
            <div
              style={{ position: 'relative', cursor: 'pointer' }}
              onClick={() => fileInputRef.current?.click()}
              title="Click to upload profile photo"
            >
              <img
                src={avatarSrc}
                alt={user?.fullName || 'Admin'}
                onError={() => setImgError(true)}
                style={{
                  width: '88px',
                  height: '88px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '4px solid #ffffff',
                  boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
                  background: '#e2e8f0'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '4px',
                  right: '4px',
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #fff',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                }}
                title="Upload profile picture"
              >
                <Camera size={13} color="#fff" />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '20px',
                  color: '#1d4ed8',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <Upload size={12} /> {avatarUrl ? 'Change Photo' : 'Upload Photo'}
              </button>
              {avatarUrl && (
                <button
                  type="button"
                  onClick={() => { setAvatarUrl(''); setImgError(false); }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '5px 9px',
                    background: '#fef2f2',
                    border: '1px solid #fecdd3',
                    borderRadius: '20px',
                    color: '#dc2626',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                  title="Remove profile picture"
                >
                  <Trash2 size={11} /> Remove
                </button>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handlePhotoFileChange}
            />

            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>
                {user?.fullName || 'Admin User'}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                {user?.admin?.designation || 'Administrator'}
              </div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginTop: '8px',
                  fontSize: '0.72rem',
                  color: '#1d4ed8',
                  background: '#eff6ff',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  fontWeight: 700,
                  border: '1px solid #bfdbfe'
                }}
              >
                <Shield size={11} />
                {user?.role === 'SUPER_ADMIN' ? 'Super Admin' : (user?.role || 'Admin')}
              </div>
            </div>

            <div style={{ width: '100%', marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { icon: <Mail size={14} />, label: 'Email', value: email || user?.email || '—' },
                { icon: <Phone size={14} />, label: 'Phone', value: phone || user?.phone || '—' },
                { icon: <Briefcase size={14} />, label: 'Dept', value: department || user?.admin?.department || '—' },
                ...(user?.admin?.empId ? [{ icon: <Shield size={14} />, label: 'Staff ID', value: user.admin.empId }] : [])
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.8rem' }}>
                  <span style={{ color: '#94a3b8', marginTop: '1px', flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <div style={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase' }}>{item.label}</div>
                    <div style={{ color: '#334155', fontWeight: 500, wordBreak: 'break-all' }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Edit Form */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            overflow: 'hidden'
          }}
        >
          {/* Tab Bar */}
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '8px', backgroundColor: '#f8fafc' }}>
            <button type="button" onClick={() => setActiveTab('details')} style={tabBtnStyle(activeTab === 'details')}>
              <User size={16} /> Personal Info
            </button>
            <button type="button" onClick={() => setActiveTab('security')} style={tabBtnStyle(activeTab === 'security')}>
              <KeyRound size={16} /> Password & Security
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ padding: '28px 28px 0' }}>
            {activeTab === 'details' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

                {/* Full Name */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={labelStyle}>Full Name <span style={{ color: '#ef4444' }}>*</span></label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      placeholder="e.g. Dr. Muhammad Tariq"
                      style={inputStyle}
                      onFocus={(e) => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                </div>

                {/* Email Address (Editable) */}
                <div>
                  <label style={labelStyle}>
                    Email Address <span style={{ color: '#E62929' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@readacademy.edu.pk"
                      style={inputStyle}
                      onFocus={(e) => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                    Institutional login &amp; notification email address
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label style={labelStyle}>Phone Number</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(handlePKPhoneInput(e.target.value))}
                      placeholder="+92 300 1234567"
                      style={{
                        ...inputStyle,
                        borderColor: phone && phone.length > 3 ? pkPhoneBorderColor(phone) : '#e2e8f0'
                      }}
                      onFocus={(e) => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }}
                      onBlur={(e) => { e.target.style.borderColor = phone && phone.length > 3 ? pkPhoneBorderColor(phone) : '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                  {phone && phone.length > 3 && !isValidPKPhone(phone) && (
                    <div style={{ fontSize: '0.72rem', color: '#E62929', marginTop: '3px' }}>⚠ Pakistani number required — e.g. +92 300 1234567</div>
                  )}
                </div>

                {/* Designation */}
                <div>
                  <label style={labelStyle}>Official Designation</label>
                  <div style={{ position: 'relative' }}>
                    <Briefcase size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="text"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      placeholder="e.g. Principal / Campus Director"
                      style={inputStyle}
                      onFocus={(e) => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                </div>

                {/* Department */}
                <div>
                  <label style={labelStyle}>Department</label>
                  <div style={{ position: 'relative' }}>
                    <Building size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. Executive Administration"
                      style={inputStyle}
                      onFocus={(e) => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                </div>

                {/* Emergency Contact */}
                <div>
                  <label style={labelStyle}>Emergency Contact</label>
                  <input
                    type="tel"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(handlePKPhoneInput(e.target.value))}
                    placeholder="+92 321 9876543"
                    style={{
                      ...inputStyle,
                      paddingLeft: '12px',
                      borderColor: emergencyContact && emergencyContact.length > 3 ? (isValidPKPhone(emergencyContact) ? '#16a34a' : '#E62929') : '#e2e8f0'
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }}
                    onBlur={(e) => { e.target.style.borderColor = emergencyContact && emergencyContact.length > 3 ? (isValidPKPhone(emergencyContact) ? '#16a34a' : '#E62929') : '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                  />
                  {emergencyContact && emergencyContact.length > 3 && !isValidPKPhone(emergencyContact) && (
                    <div style={{ fontSize: '0.72rem', color: '#E62929', marginTop: '3px' }}>⚠ Pakistani number required — e.g. +92 321 9876543</div>
                  )}
                </div>

              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Security warning */}
                <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', padding: '14px 16px', borderRadius: '10px', display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#92400e', fontSize: '0.85rem' }}>
                  <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '1px' }} />
                  <div>
                    <strong>Secure Credential Update:</strong>
                    <br />
                    To change your admin login password, enter your current password first, then set the new one.
                  </div>
                </div>

                {[
                  { label: 'Current Password', value: currentPassword, setter: setCurrentPassword, placeholder: 'Enter current password' },
                  { label: 'New Password', value: newPassword, setter: setNewPassword, placeholder: 'Minimum 6 characters' },
                  { label: 'Confirm New Password', value: confirmPassword, setter: setConfirmPassword, placeholder: 'Re-type new password' }
                ].map((field, i) => (
                  <div key={i}>
                    <label style={labelStyle}>{field.label}</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                      <input
                        type="password"
                        value={field.value}
                        onChange={(e) => field.setter(e.target.value)}
                        placeholder={field.placeholder}
                        style={inputStyle}
                        onFocus={(e) => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }}
                        onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                    {i === 2 && newPassword && confirmPassword && newPassword !== confirmPassword && (
                      <div style={{ fontSize: '0.78rem', color: '#ef4444', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <AlertCircle size={13} /> Passwords do not match
                      </div>
                    )}
                    {i === 2 && newPassword && confirmPassword && newPassword === confirmPassword && (
                      <div style={{ fontSize: '0.78rem', color: '#10b981', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle size={13} /> Passwords match
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Footer Save Button */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                padding: '24px 0 28px',
                marginTop: '8px',
                borderTop: '1px solid #f1f5f9'
              }}
            >
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  padding: '10px 28px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.7 : 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '160px',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => { if (!isSubmitting) e.currentTarget.style.backgroundColor = '#1d4ed8'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#2563eb'; }}
              >
                {isSubmitting ? (
                  <ButtonSpinner color="white" />
                ) : (
                  <>
                    <Save size={16} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
