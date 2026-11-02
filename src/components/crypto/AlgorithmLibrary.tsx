import React, { useState } from 'react';
import {
  Search,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Layers,
  Box,
  KeyRound,
  Hash,
  Sparkles,
} from 'lucide-react';
import { CipherMethod, CipherCategory } from '../../types';
import { ALGORITHM_CATALOG, AlgorithmMetadata } from './AlgorithmCatalog';

interface AlgorithmLibraryProps {
  onSelectAlgorithm: (method: CipherMethod) => void;
}

export const AlgorithmLibrary: React.FC<AlgorithmLibraryProps> = ({ onSelectAlgorithm }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Algorithms' },
    { id: 'monoalphabetic', label: 'Monoalphabetic' },
    { id: 'polyalphabetic', label: 'Polyalphabetic' },
    { id: 'block', label: 'Block Ciphers & Modes' },
    { id: 'modern', label: 'Modern AES' },
    { id: 'asymmetric', label: 'Asymmetric' },
    { id: 'hashing', label: 'Hashing & MAC' },
  ];

  const filteredAlgorithms = Object.values(ALGORITHM_CATALOG).filter((alg) => {
    const matchesSearch =
      alg.name.toLowerCase().includes(search.toLowerCase()) ||
      alg.formula.toLowerCase().includes(search.toLowerCase()) ||
      alg.shortDesc.toLowerCase().includes(search.toLowerCase());

    if (selectedCategory === 'all') return matchesSearch;
    return matchesSearch && alg.category === selectedCategory;
  });

  return (
    <div data-tour="algorithms-library" className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-[#E4E2EE] rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-[#8855C7]">
              Comprehensive Cryptographic Repository
            </span>
            <h1 className="text-3xl font-serif-display font-bold text-zinc-900">
              Algorithm Library
            </h1>
            <p className="text-sm text-zinc-600">
              Explore 21 classical, modern, asymmetric, and hashing algorithms with dedicated interactive workbenches and trace players.
            </p>
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search algorithm, formula..."
              className="w-full bg-[#F4F3F8] border border-[#E2DFED] rounded-xl pl-10 pr-4 py-2 text-xs font-mono-code text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-[#8855C7]"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-zinc-100">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono-code font-semibold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#8855C7] text-white shadow-xs'
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Black Container Boxes on the White Canvas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAlgorithms.map((alg) => (
          <div
            key={alg.id}
            onClick={() => onSelectAlgorithm(alg.id)}
            className="group bg-[#13121F] hover:bg-[#181627] border border-[#26243A] hover:border-[#8855C7]/60 rounded-2xl p-5 text-white shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-[#B58AE8]">
                  {alg.categoryLabel}
                </span>
                <span
                  className="px-2 py-0.5 rounded-md text-[10px] font-mono-code font-bold text-white uppercase"
                  style={{ backgroundColor: alg.securityColor }}
                >
                  {alg.securityRating}
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-[#EDE1FF] transition-colors">
                {alg.name}
              </h3>

              <div className="bg-[#0C0B16] border border-[#24223A] rounded-lg p-2 font-mono-code text-[11px] text-[#C4B5FD] truncate">
                {alg.formula}
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                {alg.shortDesc}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-[#232135] flex items-center justify-between text-xs font-mono-code">
              <span className="text-zinc-400 text-[11px]">Key: {alg.keySpace}</span>
              <span className="flex items-center gap-1 text-[#C4B5FD] font-semibold group-hover:translate-x-1 transition-transform">
                <span>Launch</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
