'use client';

import React, { useState, useEffect } from 'react';
import { Key, Shield, Check, X, ExternalLink } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved: (key: string) => void;
  currentKey: string;
}

export default function ApiKeyModal({
  isOpen,
  onClose,
  onKeySaved,
  currentKey,
}: ApiKeyModalProps) {
  const [keyInput, setKeyInput] = useState(currentKey);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setKeyInput(currentKey);
  }, [currentKey, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onKeySaved(keyInput.trim());
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  const handleClear = () => {
    setKeyInput('');
    onKeySaved('');
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Gemini APIキーの設定</h3>
            <p className="text-xs text-slate-400">本物のAIによる完全オリジナルクイズの無尽蔵生成</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Google AI Studio で取得したAPIキーを入力すると、あなたのブラウザに保存され、<strong>毎回100%新しい現場クイズをGeminiが自動考案</strong>してくれます。
        </p>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-slate-400">GEMINI API KEY:</label>
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full bg-slate-950 text-xs md:text-sm text-cyan-300 font-mono p-3 rounded-xl border border-slate-800 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div className="bg-slate-950 rounded-xl p-3 border border-slate-800/80 flex items-start gap-2 text-xs text-slate-400">
          <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            キーはお使いの端末のブラウザ内（LocalStorage）にのみ安全に保存され、外部サーバーに公開・収集されることはありません。
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] text-cyan-400 hover:underline"
          >
            <span>無料でAPIキーを取得</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <div className="flex items-center gap-2">
            {currentKey && (
              <button
                onClick={handleClear}
                className="text-xs text-slate-400 hover:text-rose-400 px-3 py-2 transition-colors"
              >
                削除
              </button>
            )}
            <button
              onClick={handleSave}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              {isSaved ? <Check className="w-4 h-4 text-white" /> : null}
              <span>{isSaved ? '保存しました！' : 'キーを保存'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
