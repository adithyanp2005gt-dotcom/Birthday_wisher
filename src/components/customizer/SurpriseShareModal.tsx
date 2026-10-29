import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  Copy,
  Check,
  QrCode,
  ExternalLink,
  MessageCircle,
  Mail,
  RotateCcw,
  Download,
  Upload,
} from 'lucide-react';
import { useWish } from '../../context/useWish';
import {
  getWhatsAppShareUrl,
  getTelegramShareUrl,
  getSmsShareUrl,
  getQrCodeImageUrl,
} from '../../services/emailService';
import './SurpriseShareModal.css';

interface SurpriseShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SurpriseShareModal: React.FC<SurpriseShareModalProps> = ({ isOpen, onClose }) => {
  const {
    config,
    getShareableUrl,
    resetToDefault,
    exportAsJson,
    importFromJson,
    showToast,
    toastMessage,
  } = useWish();

  const [copiedLink, setCopiedLink] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [showJsonImportBox, setShowJsonImportBox] = useState(false);
  const [jsonInput, setJsonInput] = useState('');

  if (!isOpen) return null;

  const currentSurpriseUrl = getShareableUrl();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentSurpriseUrl);
      setCopiedLink(true);
      showToast('🔗 Surprise link copied to clipboard! Send it to your loved one.');
      setTimeout(() => setCopiedLink(false), 3000);
    } catch {
      showToast('Could not auto-copy. Please copy link manually.');
    }
  };

  const handleExportJson = () => {
    const jsonStr = exportAsJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `surprise-${config.meta.recipientName.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('💾 Surprise configuration saved as JSON!');
  };

  const handleImportJson = () => {
    if (!jsonInput.trim()) {
      showToast('Please paste a JSON configuration first.');
      return;
    }
    const success = importFromJson(jsonInput);
    if (success) {
      setShowJsonImportBox(false);
      setJsonInput('');
    }
  };

  return (
    <AnimatePresence>
      <div className="share-modal-backdrop" onClick={onClose}>
        <motion.div
          className="share-modal-dialog"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.94, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 25 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-dialog-title"
        >
          {/* Header */}
          <div className="share-modal-header">
            <div>
              <div className="share-modal-badge">
                <Sparkles size={13} />
                <span>Your Surprise Experience Is Ready</span>
              </div>
              <h2 id="share-dialog-title" className="share-modal-title">
                Generate &amp; Forward Surprise Link
              </h2>
              <p className="share-modal-subtitle">
                All your in-place edits are saved into your link. The recipient will experience a pristine, celebration-ready surprise with all editing disabled!
              </p>
            </div>

            <button
              type="button"
              className="btn-share-modal-close"
              onClick={onClose}
              aria-label="Close share modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Toast Notification */}
          {toastMessage && (
            <div className="share-modal-toast" role="status">
              <Sparkles size={14} />
              <span>{toastMessage}</span>
            </div>
          )}

          <div className="share-modal-body">
            {/* HERO LINK FORWARDING CARD */}
            <div className="share-hero-card">
              <div className="hero-link-label-row">
                <span className="hero-link-tag">🔒 Generated Link (Non-Editable for Recipient):</span>
                <span className="hero-recipient-tag">For: {config.meta.recipientName}</span>
              </div>

              <div className="hero-url-row">
                <input
                  type="text"
                  readOnly
                  value={currentSurpriseUrl}
                  className="hero-url-input"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <button
                  type="button"
                  className="btn-copy-gold"
                  onClick={handleCopyLink}
                >
                  {copiedLink ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>

              {/* Multi-Channel Quick Forwarding */}
              <div className="channel-share-row">
                <a
                  href={getWhatsAppShareUrl(config.meta.recipientName, currentSurpriseUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="channel-share-pill btn-whatsapp"
                >
                  <MessageCircle size={15} />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={getTelegramShareUrl(config.meta.recipientName, currentSurpriseUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="channel-share-pill btn-telegram"
                >
                  <Mail size={14} />
                  <span>Telegram</span>
                </a>

                <a
                  href={getSmsShareUrl(config.meta.recipientName, currentSurpriseUrl)}
                  className="channel-share-pill btn-sms"
                >
                  <Mail size={14} />
                  <span>SMS</span>
                </a>

                <button
                  type="button"
                  className="channel-share-pill btn-qr"
                  onClick={() => setShowQrCode(!showQrCode)}
                >
                  <QrCode size={14} />
                  <span>{showQrCode ? 'Hide QR Code' : 'Scan QR Code'}</span>
                </button>

                <a
                  href={currentSurpriseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="channel-share-pill btn-test"
                >
                  <ExternalLink size={14} />
                  <span>Test Link</span>
                </a>
              </div>

              {/* Scannable QR Code */}
              {showQrCode && (
                <div className="share-qr-card">
                  <p className="qr-hint">Scan with any phone camera to open the surprise:</p>
                  <div className="qr-box">
                    <img
                      src={getQrCodeImageUrl(currentSurpriseUrl)}
                      alt="Scannable QR Code for Surprise Link"
                      className="qr-img"
                    />
                  </div>
                  <span className="qr-name">For {config.meta.recipientName}</span>
                </div>
              )}
            </div>

            {/* BACKUP & RESTORE */}
            <div className="share-backup-grid">
              <div className="backup-item">
                <h5>Download JSON Backup</h5>
                <p>Save all your in-place edits to a file on your device.</p>
                <button type="button" className="btn-backup-opt" onClick={handleExportJson}>
                  <Download size={14} />
                  <span>Export JSON</span>
                </button>
              </div>

              <div className="backup-item">
                <h5>Import JSON Wish</h5>
                <p>Load another saved surprise configuration.</p>
                <button
                  type="button"
                  className="btn-backup-opt"
                  onClick={() => setShowJsonImportBox(!showJsonImportBox)}
                >
                  <Upload size={14} />
                  <span>{showJsonImportBox ? 'Cancel' : 'Paste & Load JSON'}</span>
                </button>
              </div>
            </div>

            {showJsonImportBox && (
              <div className="json-box-wrapper">
                <textarea
                  rows={4}
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder='{"meta": {"recipientName": "Mom", ...}}'
                  className="json-textarea"
                />
                <button type="button" className="btn-apply-json" onClick={handleImportJson}>
                  <Check size={14} />
                  <span>Apply JSON</span>
                </button>
              </div>
            )}

            {/* RESET CONTENT */}
            <div className="share-reset-box">
              <div>
                <h5>Reset to Original Content</h5>
                <p>Restore the original "Ammachi mon" / "Mone" default text.</p>
              </div>
              <button
                type="button"
                className="btn-share-reset"
                onClick={() => {
                  if (
                    window.confirm(
                      'Restore original Ammachi mon default content and wipe all local changes?'
                    )
                  ) {
                    resetToDefault();
                  }
                }}
              >
                <RotateCcw size={14} />
                <span>Reset Content</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
