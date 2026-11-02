import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Download,
  Lock,
  Unlock,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Key,
  Layers,
  Sparkles,
} from 'lucide-react';

export const FileEncryptionLab: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [password, setPassword] = useState<string>('MasterclassSecurePass2026!');
  const [isProcessing, setIsProcessing] = useState(false);
  const [encryptedBlob, setEncryptedBlob] = useState<Blob | null>(null);
  const [encryptedFileName, setEncryptedFileName] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  // Decryption state
  const [decryptFile, setDecryptFile] = useState<File | null>(null);
  const [decryptPassword, setDecryptPassword] = useState<string>('MasterclassSecurePass2026!');
  const [tamperSimulate, setTamperSimulate] = useState<boolean>(false);
  const [decryptedFileUrl, setDecryptedFileUrl] = useState<string | null>(null);
  const [decryptedFileName, setDecryptedFileName] = useState<string>('');
  const [decryptStatus, setDecryptStatus] = useState<string>('');
  const [decryptSuccess, setDecryptSuccess] = useState<boolean | null>(null);

  // Key derivation helper using PBKDF2
  const deriveKeyFromPassword = async (
    passwordStr: string,
    saltBytes: Uint8Array
  ): Promise<CryptoKey> => {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      enc.encode(passwordStr),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: saltBytes,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  };

  // Encrypt local file with AES-GCM
  const handleEncryptFile = async () => {
    if (!selectedFile) {
      setStatusMessage('Please select a file to encrypt.');
      setIsSuccess(false);
      return;
    }

    if (!password) {
      setStatusMessage('Please enter a password for key derivation.');
      setIsSuccess(false);
      return;
    }

    setIsProcessing(true);
    setStatusMessage('Reading file and deriving 256-bit AES-GCM key via PBKDF2 (100,000 rounds)...');

    try {
      const fileBuffer = await selectedFile.arrayBuffer();

      // 1. Generate unique 16-byte random salt
      const salt = window.crypto.getRandomValues(new Uint8Array(16));

      // 2. Generate unique 12-byte (96-bit) IV / nonce
      const iv = window.crypto.getRandomValues(new Uint8Array(12));

      // 3. Derive key
      const key = await deriveKeyFromPassword(password, salt);

      // 4. Encrypt using AES-GCM
      const ciphertextBuffer = await window.crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv,
          tagLength: 128, // 16-byte authentication tag
        },
        key,
        fileBuffer
      );

      // 5. Package into .crypto format: [16 bytes salt] [12 bytes iv] [ciphertext + auth tag]
      const combined = new Uint8Array(16 + 12 + ciphertextBuffer.byteLength);
      combined.set(salt, 0);
      combined.set(iv, 16);
      combined.set(new Uint8Array(ciphertextBuffer), 28);

      const blob = new Blob([combined], { type: 'application/octet-stream' });
      setEncryptedBlob(blob);
      setEncryptedFileName(`${selectedFile.name}.crypto`);

      setStatusMessage(
        `✅ Encrypted successfully! Output size: ${combined.byteLength} bytes (includes 16-byte salt + 12-byte IV + 16-byte GCM Auth Tag).`
      );
      setIsSuccess(true);
    } catch (err: any) {
      setStatusMessage(`❌ Encryption failed: ${err.message}`);
      setIsSuccess(false);
    } finally {
      setIsProcessing(false);
    }
  };

  // Decrypt file with AES-GCM and verify authentication tag
  const handleDecryptFile = async () => {
    if (!decryptFile) {
      setDecryptStatus('Please select a .crypto file to decrypt.');
      setDecryptSuccess(false);
      return;
    }

    setIsProcessing(true);
    setDecryptStatus('Unpacking salt & IV, deriving key, and verifying AES-GCM authentication tag...');

    try {
      const buffer = await decryptFile.arrayBuffer();
      if (buffer.byteLength < 28 + 16) {
        throw new Error('File is too small to be a valid .crypto container.');
      }

      const salt = new Uint8Array(buffer.slice(0, 16));
      const iv = new Uint8Array(buffer.slice(16, 28));
      let ciphertextBytes = new Uint8Array(buffer.slice(28));

      // Simulate tampering if requested
      if (tamperSimulate) {
        ciphertextBytes = new Uint8Array(ciphertextBytes);
        ciphertextBytes[0] ^= 0xff; // Flip a single byte!
      }

      const key = await deriveKeyFromPassword(decryptPassword, salt);

      // Decrypt and verify tag
      const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv,
          tagLength: 128,
        },
        key,
        ciphertextBytes
      );

      const restoredBlob = new Blob([decryptedBuffer]);
      const restoredUrl = URL.createObjectURL(restoredBlob);
      const originalName = decryptFile.name.endsWith('.crypto')
        ? decryptFile.name.slice(0, -7)
        : `decrypted_${decryptFile.name}`;

      setDecryptedFileUrl(restoredUrl);
      setDecryptedFileName(originalName);
      setDecryptStatus('✅ Authentication and decryption succeeded! File restored with 100% integrity.');
      setDecryptSuccess(true);
    } catch (err: any) {
      setDecryptSuccess(false);
      if (err.name === 'OperationError' || err.message?.includes('operation')) {
        setDecryptStatus(
          `❌ Authentication Failed (OperationError)! Either the password is wrong or the ciphertext was tampered with. AES-GCM prevented unauthorized decryption.`
        );
      } else {
        setDecryptStatus(`❌ Decryption failed: ${err.message}`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Educational Banner */}
      <div className="bg-[#101016] border border-[#262626] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div>
            <span className="text-[10px] font-mono-code uppercase tracking-wider text-[#FF3E00] font-bold">
              Authenticated Encryption with Associated Data (AEAD)
            </span>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Production File Encryption Laboratory (AES-256-GCM)
            </h3>
          </div>
          <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono-code rounded-lg">
            Client-Side Web Crypto API
          </span>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-xs font-mono-code text-amber-200 leading-relaxed">
          <strong>Security Principle:</strong> Educational ciphers (Caesar, Affine, DES, ECB) are mathematically vulnerable and MUST NEVER be used for file security. This laboratory utilizes the browser's hardware-accelerated <code>window.crypto.subtle</code> executing <strong>AES-256-GCM</strong> with <strong>PBKDF2 key derivation (100,000 iterations)</strong>, a unique 128-bit random salt, and a unique 96-bit random IV per operation.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ------------------------------------------------ */}
        {/* ENCRYPT SECTION */}
        {/* ------------------------------------------------ */}
        <div className="bg-[#121218] border border-[#262626] rounded-2xl p-6 shadow-lg space-y-5 font-mono-code text-xs">
          <div className="flex items-center gap-2 text-white font-bold text-base border-b border-zinc-800 pb-3">
            <Lock className="w-4 h-4 text-[#FF3E00]" />
            <span>Encrypt Local File</span>
          </div>

          <div>
            <label className="text-zinc-400 block mb-1.5">Select File (Text, Image, PDF, Code)</label>
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="w-full text-zinc-300 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-mono-code file:bg-[#1E1E2C] file:text-white hover:file:bg-[#FF3E00] file:cursor-pointer"
            />
            {selectedFile && (
              <div className="mt-2 text-zinc-400 text-[11px]">
                Selected: <span className="text-white font-bold">{selectedFile.name}</span> (
                {Math.round(selectedFile.size / 1024)} KB)
              </div>
            )}
          </div>

          <div>
            <label className="text-zinc-400 block mb-1.5">Encryption Password (PBKDF2 Secret)</label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0E0E14] border border-zinc-700 rounded-xl p-3 text-white outline-none focus:border-[#FF3E00]"
            />
          </div>

          <button
            onClick={handleEncryptFile}
            disabled={isProcessing || !selectedFile}
            className="w-full py-3 bg-[#FF3E00] hover:bg-[#E03700] disabled:opacity-40 text-white font-bold rounded-xl transition-all shadow-md shadow-[#FF3E00]/25 flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            <span>{isProcessing ? 'Deriving & Encrypting...' : 'Encrypt File (AES-256-GCM)'}</span>
          </button>

          {statusMessage && (
            <div
              className={`p-3.5 rounded-xl border leading-relaxed ${
                isSuccess
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-red-500/10 border-red-500/30 text-red-300'
              }`}
            >
              {statusMessage}
            </div>
          )}

          {encryptedBlob && (
            <div className="pt-2">
              <a
                href={URL.createObjectURL(encryptedBlob)}
                download={encryptedFileName}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Download {encryptedFileName}</span>
              </a>
            </div>
          )}
        </div>

        {/* ------------------------------------------------ */}
        {/* DECRYPT SECTION */}
        {/* ------------------------------------------------ */}
        <div className="bg-[#121218] border border-[#262626] rounded-2xl p-6 shadow-lg space-y-5 font-mono-code text-xs">
          <div className="flex items-center gap-2 text-white font-bold text-base border-b border-zinc-800 pb-3">
            <Unlock className="w-4 h-4 text-emerald-400" />
            <span>Decrypt & Verify Integrity</span>
          </div>

          <div>
            <label className="text-zinc-400 block mb-1.5">Select .crypto File</label>
            <input
              type="file"
              onChange={(e) => setDecryptFile(e.target.files?.[0] || null)}
              className="w-full text-zinc-300 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-mono-code file:bg-[#1E1E2C] file:text-white hover:file:bg-emerald-600 file:cursor-pointer"
            />
            {decryptFile && (
              <div className="mt-2 text-zinc-400 text-[11px]">
                Selected: <span className="text-white font-bold">{decryptFile.name}</span> (
                {Math.round(decryptFile.size / 1024)} KB)
              </div>
            )}
          </div>

          <div>
            <label className="text-zinc-400 block mb-1.5">Decryption Password</label>
            <input
              type="text"
              value={decryptPassword}
              onChange={(e) => setDecryptPassword(e.target.value)}
              className="w-full bg-[#0E0E14] border border-zinc-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500"
            />
          </div>

          <label className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl cursor-pointer text-red-300">
            <input
              type="checkbox"
              checked={tamperSimulate}
              onChange={(e) => setTamperSimulate(e.target.checked)}
              className="accent-red-500"
            />
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
            <span>
              Simulate Active Tampering (Deliberately flip 1 byte to test AEAD authentication failure)
            </span>
          </label>

          <button
            onClick={handleDecryptFile}
            disabled={isProcessing || !decryptFile}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2"
          >
            <Unlock className="w-4 h-4" />
            <span>{isProcessing ? 'Verifying & Decrypting...' : 'Decrypt & Verify Authenticity'}</span>
          </button>

          {decryptStatus && (
            <div
              className={`p-3.5 rounded-xl border leading-relaxed ${
                decryptSuccess
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-red-500/10 border-red-500/30 text-red-300'
              }`}
            >
              {decryptStatus}
            </div>
          )}

          {decryptedFileUrl && (
            <div className="pt-2">
              <a
                href={decryptedFileUrl}
                download={decryptedFileName}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Save Restored File ({decryptedFileName})</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
