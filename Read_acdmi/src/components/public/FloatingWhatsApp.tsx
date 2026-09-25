import React, { useState } from 'react';
import { X, Send, MessageSquare, Sparkles } from 'lucide-react';
import { WhatsAppIcon } from '../common/WhatsAppButton';
import { openWhatsApp, SCHOOL_WHATSAPP_NUMBER } from '../../utils/whatsapp';

export const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const quickPrompts = [
    'I want to inquire about Admission for the upcoming session.',
    'Please share the Fee Structure and scholarship details.',
    'I would like to schedule a guided campus tour.',
    'I want to check the status of my admission application.'
  ];

  const handleStartChat = (messageText: string) => {
    const finalMsg = messageText.trim() || 'Assalam-o-Alaikum! I want to inquire about Read Academy Sahiwal.';
    openWhatsApp(SCHOOL_WHATSAPP_NUMBER, finalMsg);
    setIsOpen(false);
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, fontFamily: 'inherit' }}>
      {/* Chat Popup Box */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: '70px',
            right: '0',
            width: '330px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.25)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            animation: 'fadeInUp 0.25s ease-out',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: '#075E54',
              color: '#ffffff',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#128C7E',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <WhatsAppIcon size={22} color="#ffffff" />
                </div>
                <span
                  style={{
                    position: 'absolute',
                    bottom: '1px',
                    right: '1px',
                    width: '10px',
                    height: '10px',
                    backgroundColor: '#25D366',
                    border: '2px solid #075E54',
                    borderRadius: '50%'
                  }}
                />
              </div>

              <div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#ffffff' }}>
                  Read Academy Sahiwal
                </div>
                <div style={{ fontSize: '0.72rem', color: '#bbf7d0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>Online</span> • <span>Admissions Desk</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Chat Body */}
          <div
            style={{
              padding: '16px',
              backgroundColor: '#efeae2',
              backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
              backgroundSize: '16px 16px',
              maxHeight: '320px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            {/* School Greeting Bubble */}
            <div
              style={{
                backgroundColor: '#ffffff',
                padding: '12px 14px',
                borderRadius: '0 12px 12px 12px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                fontSize: '0.82rem',
                color: '#1e293b',
                lineHeight: 1.45,
                maxWidth: '92%'
              }}
            >
              <strong>Assalam-o-Alaikum!</strong> 👋<br />
              Welcome to Read Academy Sahiwal. How can we assist you today? Select a quick topic or type your message below.
            </div>

            {/* Quick Prompts */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Quick Inquiries:
              </div>
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleStartChat(prompt)}
                  style={{
                    textAlign: 'left',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    backgroundColor: '#ffffff',
                    fontSize: '0.76rem',
                    color: '#334155',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#ecfdf5';
                    e.currentTarget.style.borderColor = '#25D366';
                    e.currentTarget.style.color = '#065f46';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.color = '#334155';
                  }}
                >
                  <Sparkles size={12} color="#059669" style={{ flexShrink: 0 }} />
                  <span>{prompt}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer Input */}
          <div style={{ padding: '12px', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input
                type="text"
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder="Type your question..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleStartChat(customMsg);
                }}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '20px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.82rem',
                  outline: 'none'
                }}
              />
              <button
                type="button"
                onClick={() => handleStartChat(customMsg)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: '#25D366',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
                title="Send via WhatsApp"
              >
                <Send size={15} />
              </button>
            </div>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', textAlign: 'center', marginTop: '6px' }}>
              Opens WhatsApp chat directly (0321-6909047)
            </div>
          </div>
        </div>
      )}

      {/* Main Floating Round Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '58px',
          height: '58px',
          borderRadius: '50%',
          backgroundColor: '#25D366',
          color: '#ffffff',
          border: 'none',
          boxShadow: '0 8px 24px rgba(37, 211, 102, 0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          position: 'relative'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        title="Chat with Read Academy on WhatsApp"
      >
        <WhatsAppIcon size={30} color="#ffffff" />

        {/* Pulsing Notification Badge */}
        {!isOpen && (
          <span
            style={{
              position: 'absolute',
              top: '0px',
              right: '0px',
              width: '14px',
              height: '14px',
              backgroundColor: '#ef4444',
              borderRadius: '50%',
              border: '2px solid #ffffff'
            }}
          />
        )}
      </button>
    </div>
  );
};
