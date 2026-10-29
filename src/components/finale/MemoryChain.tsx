import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Camera,
  X,
  Heart,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Sparkle,
  UploadCloud,
  Plus,
  Trash2,
  AlertCircle,
  Edit3,
  Check,
} from 'lucide-react';
import {
  MAX_MEMORIES,
  createMemoryItem,
  INITIAL_MEMORIES,
  type MemoryItem,
} from '../../types/memory';
import { EditableText } from '../common/EditableText';
import { useWish } from '../../context/useWish';
import { compressImage } from '../../utils/imageCompressor';
import './MemoryChain.css';

interface MemoryChainProps {
  reducedMotion?: boolean;
}

export const MemoryChain: React.FC<MemoryChainProps> = ({ reducedMotion = false }) => {
  const { config, updateSection, updateMemories, isReadOnly } = useWish();

  // Memories are centrally managed in WishConfig so they are embedded directly into shareable links
  const memories: MemoryItem[] =
    config.finale.memories && config.finale.memories.length > 0
      ? config.finale.memories
      : INITIAL_MEMORIES;

  const [activeMemoryIndex, setActiveMemoryIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'chain' | 'grid'>('chain');
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [notification, setNotification] = useState<string | null>(null);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [editCaption, setEditCaption] = useState('');


  const scrollTrackRef = useRef<HTMLDivElement | null>(null);
  const singleFileInputRef = useRef<HTMLInputElement | null>(null);
  const batchFileInputRef = useRef<HTMLInputElement | null>(null);
  const appendFileInputRef = useRef<HTMLInputElement | null>(null);
  const [targetUploadId, setTargetUploadId] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('project_amma_memories_dynamic', JSON.stringify(memories));
    } catch {
      // Storage quota or disabled
    }
  }, [memories]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Handle single photo replacement with client-side compression
  const handleSinglePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !targetUploadId) return;

    try {
      showNotification('Optimizing photo for your surprise link...');
      const dataUrl = await compressImage(file, { maxDimension: 420, quality: 0.65 });
      const uploadedId = targetUploadId;
      setFailedImages((prev) => {
        const next = new Set(prev);
        next.delete(uploadedId);
        return next;
      });
      const updated = memories.map((m) => (m.id === uploadedId ? { ...m, imageSrc: dataUrl } : m));
      updateMemories(updated);
      setTargetUploadId(null);
      showNotification('Photo saved into your surprise link!');
    } catch (err) {
      console.error('Photo optimization failed', err);
      showNotification('Could not process this image. Please choose another.');
    }
    e.target.value = '';
  };

  // Handle batch selection: dynamically sets photo count to exactly how many were picked (max 25)
  const handleBatchPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const totalSelected = files.length;
    const allowedFiles = Array.from(files).slice(0, MAX_MEMORIES);

    if (totalSelected > MAX_MEMORIES) {
      showNotification(`Maximum limit is ${MAX_MEMORIES} photos. The first ${MAX_MEMORIES} photos were selected.`);
    } else {
      showNotification(`Optimizing ${allowedFiles.length} photo${allowedFiles.length > 1 ? 's' : ''} for your surprise link...`);
    }

    try {
      const maxDim = allowedFiles.length > 6 ? 340 : 420;
      const quality = allowedFiles.length > 6 ? 0.58 : 0.65;

      const compressedUrls = await Promise.all(
        allowedFiles.map((file) => compressImage(file, { maxDimension: maxDim, quality }))
      );

      const newMemories: MemoryItem[] = compressedUrls.map((dataUrl, idx) =>
        createMemoryItem(idx, dataUrl)
      );

      updateMemories(newMemories);
      setFailedImages(new Set());
      showNotification(`Saved ${allowedFiles.length} photo${allowedFiles.length > 1 ? 's' : ''} to ${config.meta.recipientName}'s surprise link!`);
    } catch (err) {
      console.error('Batch upload optimization failed', err);
      showNotification('Could not process some photos.');
    }

    e.target.value = '';
  };

  // Handle appending additional photos up to 25
  const handleAppendPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const currentCount = memories.length;
    const remainingSlots = MAX_MEMORIES - currentCount;

    if (remainingSlots <= 0) {
      showNotification(`Maximum limit of ${MAX_MEMORIES} photos reached.`);
      e.target.value = '';
      return;
    }

    const allowedFiles = Array.from(files).slice(0, remainingSlots);
    showNotification(`Optimizing ${allowedFiles.length} new photo${allowedFiles.length > 1 ? 's' : ''}...`);

    try {
      const maxDim = (currentCount + allowedFiles.length) > 6 ? 340 : 420;
      const quality = (currentCount + allowedFiles.length) > 6 ? 0.58 : 0.65;

      const compressedUrls = await Promise.all(
        allowedFiles.map((file) => compressImage(file, { maxDimension: maxDim, quality }))
      );

      const appendedItems: MemoryItem[] = compressedUrls.map((dataUrl, idx) =>
        createMemoryItem(currentCount + idx, dataUrl)
      );

      updateMemories([...memories, ...appendedItems]);
      showNotification(`Added ${allowedFiles.length} new photo${allowedFiles.length > 1 ? 's' : ''} to surprise link!`);
    } catch (err) {
      console.error('Append upload optimization failed', err);
      showNotification('Could not process some photos.');
    }

    e.target.value = '';
  };

  const removePhoto = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (memories.length <= 1) {
      showNotification('At least one memory photo must remain on the chain.');
      return;
    }
    const filtered = memories.filter((m) => m.id !== id);
    updateMemories(filtered);
    if (activeMemoryIndex !== null && activeMemoryIndex >= memories.length - 1) {
      setActiveMemoryIndex(Math.max(0, memories.length - 2));
    }
  };

  const triggerSingleUpload = (memoryId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setTargetUploadId(memoryId);
    singleFileInputRef.current?.click();
  };

  const scrollTrack = (direction: 'left' | 'right') => {
    if (!scrollTrackRef.current) return;
    const scrollAmount = direction === 'left' ? -380 : 380;
    scrollTrackRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeMemoryIndex === null) return;
      if (e.key === 'ArrowRight') {
        setActiveMemoryIndex((prev) => (prev !== null ? (prev + 1) % memories.length : 0));
        setIsEditingNote(false);
      } else if (e.key === 'ArrowLeft') {
        setActiveMemoryIndex((prev) =>
          prev !== null ? (prev - 1 + memories.length) % memories.length : 0
        );
        setIsEditingNote(false);
      } else if (e.key === 'Escape') {
        setActiveMemoryIndex(null);
        setIsEditingNote(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeMemoryIndex, memories.length]);

  const activeMemory = activeMemoryIndex !== null ? memories[activeMemoryIndex] : null;

  const handleStartEditingNote = () => {
    if (!activeMemory) return;
    setEditTitle(activeMemory.title);
    setEditSubtitle(activeMemory.subtitle);
    setEditCaption(activeMemory.caption);
    setIsEditingNote(true);
  };

  const handleSaveMemoryNote = () => {
    if (!activeMemory) return;
    const updated = memories.map((m) =>
      m.id === activeMemory.id
        ? { ...m, title: editTitle, subtitle: editSubtitle, caption: editCaption }
        : m
    );
    updateMemories(updated);
    setIsEditingNote(false);
    showNotification('Memory note updated and saved to link!');
  };

  return (
    <section className="memory-chain-section" aria-label="A chain of cherished memories">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={singleFileInputRef}
        onChange={handleSinglePhotoUpload}
        accept="image/*"
        style={{ display: 'none' }}
        aria-hidden="true"
      />
      <input
        type="file"
        ref={batchFileInputRef}
        onChange={handleBatchPhotoUpload}
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        aria-hidden="true"
      />
      <input
        type="file"
        ref={appendFileInputRef}
        onChange={handleAppendPhotoUpload}
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        aria-hidden="true"
      />

      {/* Floating notification */}
      {notification && (
        <div className="memory-notice-banner" role="status" aria-live="polite">
          <AlertCircle size={15} />
          <span>{notification}</span>
          <button
            type="button"
            className="notice-dismiss-btn"
            onClick={() => setNotification(null)}
          >
            ✕
          </button>
        </div>
      )}

      {/* Header & Dynamic Counts */}
      <div className="memory-chain-header">
        <div className="memory-chain-badge">
          <Sparkles size={12} />
          <span>A Chain of {memories.length} Cherished Moment{memories.length === 1 ? '' : 's'}</span>
        </div>
        <h2 className="memory-chain-title">
          <EditableText
            value={config.finale.memorySectionTitlePrefix}
            onChange={(val) => updateSection('finale', { memorySectionTitlePrefix: val })}
            placeholder="Timeless"
          />{' '}
          <em>
            <EditableText
              value={config.finale.memorySectionTitleAccent}
              onChange={(val) => updateSection('finale', { memorySectionTitleAccent: val })}
              placeholder="Memories"
            />
          </em>{' '}
          <EditableText
            value={config.finale.memorySectionTitleSuffix}
            onChange={(val) => updateSection('finale', { memorySectionTitleSuffix: val })}
            placeholder="With Ammachi mon"
          />
        </h2>
        <p className="memory-chain-hint">
          {memories.length} moment{memories.length === 1 ? '' : 's'}{' '}
          <EditableText
            value={config.finale.memorySectionHint}
            onChange={(val) => updateSection('finale', { memorySectionHint: val })}
            placeholder="woven in golden thread..."
          />
        </p>


        {/* Action Bar: View Switcher, Batch Upload, and Add More Button */}
        <div className="memory-controls-bar">
          <div className="view-mode-toggle">
            <button
              type="button"
              className={`toggle-btn ${viewMode === 'chain' ? 'is-active' : ''}`}
              onClick={() => setViewMode('chain')}
              aria-label="Hanging chain ribbon view"
            >
              <Sparkle size={13} />
              <span>Hanging Ribbon</span>
            </button>
            <button
              type="button"
              className={`toggle-btn ${viewMode === 'grid' ? 'is-active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Gallery wall grid view"
            >
              <LayoutGrid size={13} />
              <span>Gallery Wall</span>
            </button>
          </div>

          {/* Dynamic Photo Count Pill */}
          <div className="memory-capacity-pill">
            <span>{memories.length} / {MAX_MEMORIES} Photos</span>
          </div>

          {/* Select Photos (Batch) - Hidden on generated surprise link */}
          {!isReadOnly && (
            <button
              type="button"
              className="batch-upload-pill-btn"
              onClick={() => batchFileInputRef.current?.click()}
              title={`Select photos from your device (up to ${MAX_MEMORIES})`}
            >
              <UploadCloud size={14} />
              <span>Select Photos (Max {MAX_MEMORIES})</span>
            </button>
          )}

          {/* Add More Photos (if under 25) - Hidden on generated surprise link */}
          {!isReadOnly && memories.length < MAX_MEMORIES && (
            <button
              type="button"
              className="append-photo-pill-btn"
              onClick={() => appendFileInputRef.current?.click()}
              title="Add more photos up to 25"
            >
              <Plus size={14} />
              <span>Add Photos</span>
            </button>
          )}
        </div>
      </div>

      {/* CHAIN VIEW (Horizontal hanging ribbon with chain curve) */}
      {viewMode === 'chain' && (
        <div className="chain-view-container">
          {/* Scroll Navigation Arrows */}
          <button
            type="button"
            className="chain-arrow-btn chain-arrow-left"
            onClick={() => scrollTrack('left')}
            aria-label="Scroll left through memories"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            type="button"
            className="chain-arrow-btn chain-arrow-right"
            onClick={() => scrollTrack('right')}
            aria-label="Scroll right through memories"
          >
            <ChevronRight size={20} />
          </button>

          {/* Golden Chain Line SVG */}
          <div className="golden-chain-line-wrapper" aria-hidden="true">
            <svg viewBox="0 0 1000 60" className="golden-chain-svg" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chainGoldDynamic" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(212, 175, 55, 0.4)" />
                  <stop offset="25%" stopColor="#ffd470" />
                  <stop offset="50%" stopColor="#d4af37" />
                  <stop offset="75%" stopColor="#ffd470" />
                  <stop offset="100%" stopColor="rgba(212, 175, 55, 0.4)" />
                </linearGradient>
              </defs>
              <path
                d="M 10 20 Q 500 55 990 20"
                stroke="url(#chainGoldDynamic)"
                strokeWidth="2.5"
                strokeDasharray="4 4"
                fill="none"
              />
            </svg>
          </div>

          {/* Hanging Polaroid Photos Track */}
          <div className="memory-photos-track" ref={scrollTrackRef}>
            {memories.map((memory, index) => (
              <div
                key={memory.id}
                className="memory-card-hanger"
                style={{
                  transform: reducedMotion ? 'none' : `rotate(${memory.rotation}deg)`,
                }}
              >
                {/* Golden Clip / Clothespin */}
                <div className="memory-chain-clip" aria-hidden="true">
                  <span className="clip-numeral">{index + 1}</span>
                </div>

                {/* Polaroid Frame */}
                <motion.div
                  className="memory-photo-frame"
                  onClick={() => setActiveMemoryIndex(index)}
                  whileHover={reducedMotion ? {} : { scale: 1.05, y: -6 }}
                  whileTap={reducedMotion ? {} : { scale: 0.98 }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveMemoryIndex(index);
                    }
                  }}
                  aria-label={`View memory ${index + 1} of ${memories.length}: ${memory.title}`}
                >
                  {/* Photo Area */}
                  <div className="memory-image-box">
                    {memory.imageSrc && !failedImages.has(memory.id) ? (
                      <img
                        src={memory.imageSrc}
                        alt={memory.title}
                        className="memory-real-image"
                        onError={() => {
                          setFailedImages((prev) => new Set(prev).add(memory.id));
                        }}
                      />
                    ) : (
                      <div className="memory-svg-art">
                        <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(212, 175, 55, 0.25)" strokeDasharray="3 3" />
                          <circle cx="60" cy="50" r="16" fill="#f4728f" opacity="0.8" />
                          <path
                            d="M 38 88 C 42 70 78 70 82 88"
                            stroke="#d4af37"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            fill="none"
                          />
                          <Heart size={14} fill="#a61238" color="#a61238" x="53" y="70" />
                        </svg>
                      </div>
                    )}

                    {/* Quick Action Icons: Upload & Remove (Hidden on generated surprise link) */}
                    {!isReadOnly && (
                      <div className="memory-photo-actions">
                        <button
                          type="button"
                          className="memory-upload-btn"
                          onClick={(e) => triggerSingleUpload(memory.id, e)}
                          title="Upload or change photo"
                          aria-label={`Upload photo for ${memory.title}`}
                        >
                          <Camera size={13} />
                        </button>
                        {memories.length > 1 && (
                          <button
                            type="button"
                            className="memory-delete-btn"
                            onClick={(e) => removePhoto(memory.id, e)}
                            title="Remove this photo"
                            aria-label={`Remove photo ${index + 1}`}
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Text */}
                  <div className="memory-card-caption-group">
                    <span className="memory-index-badge">#{index + 1} of {memories.length}</span>
                    <h3 className="memory-card-title">{memory.title}</h3>
                    <p className="memory-card-subtitle">{memory.subtitle}</p>
                    <p className="memory-card-quote">"{memory.caption}"</p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GALLERY WALL GRID VIEW */}
      {viewMode === 'grid' && (
        <div className="memory-gallery-grid">
          {memories.map((memory, index) => (
            <motion.div
              key={memory.id}
              className="gallery-grid-card"
              onClick={() => setActiveMemoryIndex(index)}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02, duration: 0.4 }}
              whileHover={reducedMotion ? {} : { scale: 1.04, y: -4 }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveMemoryIndex(index);
                }
              }}
              aria-label={`View memory ${index + 1} of ${memories.length}: ${memory.title}`}
            >
              <div className="gallery-card-img-box">
                {memory.imageSrc && !failedImages.has(memory.id) ? (
                  <img
                    src={memory.imageSrc}
                    alt={memory.title}
                    className="gallery-real-img"
                    onError={() => {
                      setFailedImages((prev) => new Set(prev).add(memory.id));
                    }}
                  />
                ) : (
                  <div className="gallery-placeholder-svg">
                    <Heart size={20} fill="#a61238" color="#a61238" />
                  </div>
                )}
                <span className="gallery-photo-num">#{index + 1}</span>
                {/* Gallery actions overlay (Hidden on generated surprise link) */}
                {!isReadOnly && (
                  <div className="gallery-actions-overlay">
                    <button
                      type="button"
                      className="gallery-quick-cam"
                      onClick={(e) => triggerSingleUpload(memory.id, e)}
                      title="Upload photo"
                      aria-label="Upload photo"
                    >
                      <Camera size={12} />
                    </button>
                    {memories.length > 1 && (
                      <button
                        type="button"
                        className="gallery-quick-del"
                        onClick={(e) => removePhoto(memory.id, e)}
                        title="Remove photo"
                        aria-label="Remove photo"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                )}
              </div>
              <h4 className="gallery-card-title">{memory.title}</h4>
              <p className="gallery-card-sub">{memory.subtitle}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* LIGHTBOX MODAL WITH FULL-SCREEN PREVIEW AND PREV / NEXT NAVIGATION */}
      <AnimatePresence>
        {activeMemory && activeMemoryIndex !== null && (
          <div
            className="memory-modal-backdrop"
            onClick={() => setActiveMemoryIndex(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="active-memory-title"
          >
            {/* Previous Photo Button */}
            <button
              type="button"
              className="modal-nav-arrow modal-nav-prev"
              onClick={(e) => {
                e.stopPropagation();
                setActiveMemoryIndex((activeMemoryIndex - 1 + memories.length) % memories.length);
              }}
              aria-label="Previous memory"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Next Photo Button */}
            <button
              type="button"
              className="modal-nav-arrow modal-nav-next"
              onClick={(e) => {
                e.stopPropagation();
                setActiveMemoryIndex((activeMemoryIndex + 1) % memories.length);
              }}
              aria-label="Next memory"
            >
              <ChevronRight size={24} />
            </button>

            <motion.div
              className="memory-modal-content"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.94 }}
              transition={{ duration: 0.3 }}
            >
              <button
                type="button"
                className="memory-modal-close-btn"
                onClick={() => setActiveMemoryIndex(null)}
                aria-label="Close memory modal"
              >
                <X size={18} />
              </button>

              <div className="memory-modal-counter">
                Photo {activeMemoryIndex + 1} of {memories.length}
              </div>

              <div className="memory-modal-img-wrapper">
                {activeMemory.imageSrc && !failedImages.has(activeMemory.id) ? (
                  <img
                    src={activeMemory.imageSrc}
                    alt={activeMemory.title}
                    className="memory-modal-img"
                    onError={() => {
                      setFailedImages((prev) => new Set(prev).add(activeMemory.id));
                    }}
                  />
                ) : (
                  <div className="memory-svg-art" style={{ height: 260 }}>
                    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" style={{ width: 140, height: 140 }}>
                      <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(212, 175, 55, 0.4)" strokeDasharray="3 3" />
                      <circle cx="60" cy="50" r="18" fill="#f4728f" opacity="0.9" />
                      <path
                        d="M 36 92 C 40 70 80 70 84 92"
                        stroke="#d4af37"
                        strokeWidth="3"
                        strokeLinecap="round"
                        fill="none"
                      />
                      <Heart size={18} fill="#a61238" color="#a61238" x="51" y="72" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Memory Note Content (View or Edit mode) */}
              {!isReadOnly && isEditingNote ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', maxWidth: 420, margin: '0 auto 1rem' }}>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Memory Title"
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(212,175,55,0.3)',
                      color: '#fff',
                      padding: '0.45rem 0.65rem',
                      borderRadius: 6,
                      fontFamily: 'inherit',
                      fontSize: '0.9rem',
                    }}
                  />
                  <input
                    type="text"
                    value={editSubtitle}
                    onChange={(e) => setEditSubtitle(e.target.value)}
                    placeholder="Subtitle (e.g. Special Moment)"
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(212,175,55,0.2)',
                      color: '#ffd470',
                      padding: '0.4rem 0.65rem',
                      borderRadius: 6,
                      fontFamily: 'inherit',
                      fontSize: '0.8rem',
                    }}
                  />
                  <textarea
                    rows={2}
                    value={editCaption}
                    onChange={(e) => setEditCaption(e.target.value)}
                    placeholder="Heartfelt memory caption..."
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(212,175,55,0.2)',
                      color: '#fdfbf7',
                      padding: '0.45rem 0.65rem',
                      borderRadius: 6,
                      fontFamily: 'inherit',
                      fontSize: '0.82rem',
                      resize: 'none',
                    }}
                  />
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '0.25rem' }}>
                    <button
                      type="button"
                      className="memory-modal-upload-action"
                      onClick={handleSaveMemoryNote}
                      style={{ background: '#a61238' }}
                    >
                      <Check size={14} />
                      <span>Save Note</span>
                    </button>
                    <button
                      type="button"
                      className="memory-modal-delete-action"
                      onClick={() => setIsEditingNote(false)}
                    >
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 id="active-memory-title" className="memory-modal-title">
                    {activeMemory.title}
                  </h3>
                  <p className="memory-modal-subtitle">{activeMemory.subtitle}</p>
                  <p className="memory-modal-caption">"{activeMemory.caption}"</p>
                </>
              )}

              {/* Action buttons (Hidden on generated surprise link) */}
              {!isReadOnly && (
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <button
                    type="button"
                    className="memory-modal-upload-action"
                    onClick={() => triggerSingleUpload(activeMemory.id)}
                  >
                    <Camera size={14} />
                    <span>{activeMemory.imageSrc && !failedImages.has(activeMemory.id) ? 'Replace This Photo' : 'Upload Your Photo Here'}</span>
                  </button>

                  {!isEditingNote && (
                    <button
                      type="button"
                      className="memory-modal-upload-action"
                      onClick={handleStartEditingNote}
                      style={{ background: 'rgba(212, 175, 55, 0.15)', borderColor: 'rgba(212, 175, 55, 0.4)' }}
                    >
                      <Edit3 size={14} />
                      <span>Edit Note</span>
                    </button>
                  )}

                  {memories.length > 1 && (
                    <button
                      type="button"
                      className="memory-modal-delete-action"
                      onClick={() => {
                        removePhoto(activeMemory.id);
                      }}
                    >
                      <Trash2 size={14} />
                      <span>Remove Photo</span>
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
