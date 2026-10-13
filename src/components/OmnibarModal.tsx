import React, { useEffect } from 'react';
import { CryptoOmnibar } from './CryptoOmnibar';
import { GraphNode } from './CryptoKnowledgeGraph';
import { X } from 'lucide-react';

interface OmnibarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNode: (node: GraphNode) => void;
}

export const OmnibarModal: React.FC<OmnibarModalProps> = ({ isOpen, onClose, onSelectNode }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl">
        <button
          onClick={onClose}
          className="absolute -top-9 right-1 p-1 text-zinc-400 hover:text-white transition-colors flex items-center gap-1 text-xs font-mono"
          title="Close search"
        >
          <span>ESC to close</span>
          <X className="w-4 h-4" />
        </button>
        <CryptoOmnibar
          autoFocus
          onSelectNode={(node) => {
            onSelectNode(node);
            onClose();
          }}
        />
      </div>
    </div>
  );
};
