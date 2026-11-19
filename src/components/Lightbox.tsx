'use client';

import React from 'react';

interface LightboxProps {
  src: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ src, title, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="lightbox-modal open" onClick={onClose}>
      <button className="lightbox-btn-close" onClick={onClose} aria-label="Yopish">
        ✕
      </button>
      <div className="lightbox-body" onClick={(e) => e.stopPropagation()}>
        <img src={src} alt={title} />
        <div className="lightbox-caption">{title}</div>
      </div>
    </div>
  );
};
