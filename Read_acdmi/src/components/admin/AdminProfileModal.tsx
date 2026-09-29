import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Shield,
  Briefcase,
  Building,
  Lock,
  Save,
  CheckCircle,
  KeyRound,
  AlertCircle,
  Upload,
  Trash2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';
import { ButtonSpinner } from '../common/Spinner';
import { isValidPKPhone, handlePKPhoneInput, pkPhoneBorderColor } from '../../utils/pkPhone';

interface AdminProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminProfileModal: React.FC<AdminProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');

  // Password fields
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
        showToast('Profile Photo Selected', 'Click "Save Changes" to apply your profile photo', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (user && isOpen) {
      setFullName(user.fullName || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAvatarUrl(user.avatarUrl || '');
      setImgError(false);
      setDesignation(user.admin?.designation || '');
      setDepartment(user.admin?.department || '');
      setEmergencyContact(user.admin?.emergencyContact || '');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

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
        onClose();
      }
    } catch (err: any) {
      console.error('Failed to update admin profile:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 1050,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(to right, #f8fafc, #f1f5f9)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(37, 99, 235, 0.1)'
              }}
            >
              <Shield size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>
                Admin Profile & Account Settings
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                Manage institutional credentials, personal information, and system access
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#94a3b8',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e2e8f0';
              e.currentTarget.style.color = '#334155';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#94a3b8';
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid #e2e8f0',
            padding: '0 24px',
            backgroundColor: '#ffffff'
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            style={{
              padding: '12px 18px',
              fontSize: '0.88rem',
              fontWeight: 600,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: activeTab === 'details' ? '#2563eb' : '#64748b',
              borderBottom: activeTab === 'details' ? '2px solid #2563eb' : '2px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <User size={16} /> Personal & Academic Info
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            style={{
              padding: '12px 18px',
              fontSize: '0.88rem',
              fontWeight: 600,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: activeTab === 'security' ? '#2563eb' : '#64748b',
              borderBottom: activeTab === 'security' ? '2px solid #2563eb' : '2px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <KeyRound size={16} /> Password & Security
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
            {activeTab === 'details' ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                {/* Read-Only Account Badges */}
                <div style={{ gridColumn: 'span 2', display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 14px',
                      backgroundColor: '#eff6ff',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      color: '#1d4ed8',
                      fontWeight: 600,
                      border: '1px solid #bfdbfe'
                    }}
                  >
                    <Shield size={15} /> Role: {user?.role || 'SUPER_ADMIN'}
                  </div>
                  {user?.admin?.empId && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 14px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        color: '#475569',
                        fontWeight: 600,
                        border: '1px solid #e2e8f0'
                      }}
                    >
                      <Briefcase size={15} /> Staff ID: {user.admin.empId}
                    </div>
                  )}
                </div>

                {/* Full Name */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Full Name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      placeholder="e.g. Dr. Muhammad Tariq"
                      style={{
                        width: '100%',
                        padding: '9px 12px 9px 36px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        outline: 'none',
                        transition: 'border 0.2s',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                {/* Email Address (Editable) */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
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
                      style={{
                        width: '100%',
                        padding: '9px 12px 9px 36px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                    Institutional login &amp; notification email address
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Phone Number
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(handlePKPhoneInput(e.target.value))}
                      placeholder="+92 300 1234567"
                      style={{
                        width: '100%',
                        padding: '9px 12px 9px 36px',
                        border: `1.5px solid ${pkPhoneBorderColor(phone)}`,
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  {phone.length > 3 && !isValidPKPhone(phone) && (
                    <div style={{ fontSize: '0.72rem', color: '#E62929', marginTop: '3px' }}>⚠ Pakistani number required — e.g. +92 300 1234567</div>
                  )}
                </div>

                {/* Designation */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Official Designation
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Briefcase size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="text"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      placeholder="e.g. Principal / Campus Director"
                      style={{
                        width: '100%',
                        padding: '9px 12px 9px 36px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                {/* Department */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Department
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Building size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. Executive Administration"
                      style={{
                        width: '100%',
                        padding: '9px 12px 9px 36px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                {/* Emergency Contact */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Emergency Contact
                  </label>
                  <input
                    type="tel"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(handlePKPhoneInput(e.target.value))}
                    placeholder="+92 321 9876543"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      border: emergencyContact.length > 3 && !isValidPKPhone(emergencyContact) ? '1.5px solid #E62929' : '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  {emergencyContact.length > 3 && !isValidPKPhone(emergencyContact) && (
                    <div style={{ fontSize: '0.72rem', color: '#E62929', marginTop: '3px' }}>⚠ Pakistani number required — e.g. +92 321 9876543</div>
                  )}
                </div>

                {/* Profile Picture Upload */}
                <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoFileChange}
                    accept="image/png,image/jpeg,image/webp,image/jpg"
                    style={{ display: 'none' }}
                  />
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                    Profile Picture / Avatar Photo
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                    <img
                      src={(!imgError && avatarUrl) ? avatarUrl : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"}
                      alt="Profile Preview"
                      onError={() => setImgError(true)}
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid #cbd5e1',
                        backgroundColor: '#e2e8f0'
                      }}
                    />
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '7px 12px',
                            background: '#2563eb',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          <Upload size={14} /> Upload Photo
                        </button>
                        {avatarUrl && (
                          <button
                            type="button"
                            onClick={() => { setAvatarUrl(''); setImgError(false); }}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '7px 10px',
                              background: '#fff',
                              color: '#dc2626',
                              border: '1px solid #fca5a5',
                              borderRadius: '6px',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            <Trash2 size={13} /> Remove
                          </button>
                        )}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                        JPG, PNG, WEBP (Max 5 MB). Click "Save Changes" to apply.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div
                  style={{
                    backgroundColor: '#fffbeb',
                    border: '1px solid #fef3c7',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    color: '#92400e',
                    fontSize: '0.84rem'
                  }}
                >
                  <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Secure Credential Update:</strong>
                    <br />
                    To change your admin login password, provide your existing current password along with the new secure password.
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Current Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      style={{
                        width: '100%',
                        padding: '9px 12px 9px 36px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    New Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      style={{
                        width: '100%',
                        padding: '9px 12px 9px 36px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Confirm New Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-type new password"
                      style={{
                        width: '100%',
                        padding: '9px 12px 9px 36px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div
            style={{
              padding: '16px 24px',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '12px',
              backgroundColor: '#f8fafc'
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                padding: '9px 16px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#475569',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '9px 20px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '135px',
                gap: '8px'
              }}
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
  );
};
