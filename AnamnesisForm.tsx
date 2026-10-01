'use client';

import React, { useState } from 'react';
import { TargetProfile } from '../types/quantec';

interface AnamnesisFormProps {
  onSubmit: (target: TargetProfile) => void;
}

export function AnamnesisForm({ onSubmit }: AnamnesisFormProps) {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [objective, setObjective] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');

  // Processa o arquivo de imagem do computador/celular
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !objective || !photoUrl) {
      alert(
        'Por favor, preencha todos os campos obrigatórios, incluindo a foto.'
      );
      return;
    }

    onSubmit({
      name,
      birthDate: birthDate || 'Não informada',
      objective,
      photoUrl,
    });
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="relative bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-emerald-500/30 p-8 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.12)] backdrop-blur-2xl">
        {/* Status Badge */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-950 border border-emerald-500/40 px-4 py-1 rounded-full flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-300 uppercase">
            SISTEMA BIOCOMUNICACIONAL ATIVO
          </span>
        </div>

        <div className="text-center mt-2 mb-8">
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-400">
            VIBRAQUANT
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Mapeamento de Campo Informacional & Harmonização Frequencial
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nome Completo */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Nome Completo <span className="text-emerald-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do alvo para conexão de campo"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition"
            />
          </div>

          {/* Data de Nascimento */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Data de Nascimento
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition"
            />
          </div>

          {/* Intenção */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Intenção Principal / Desbloqueio Alvo{' '}
              <span className="text-emerald-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="Descreva o objetivo (ex: desobstrução financeira, saúde física, harmonia familiar)..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition resize-none"
            />
          </div>

          {/* Upload de Foto */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Foto <span className="text-emerald-400">*</span>
              </label>

              {/* Abas para Alternar Modo de Envio */}
              <div className="flex bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setUploadMode('file')}
                  className={`px-2.5 py-1 rounded-md transition ${
                    uploadMode === 'file'
                      ? 'bg-emerald-500 text-slate-950 font-extrabold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  📁 Arquivo
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('url')}
                  className={`px-2.5 py-1 rounded-md transition ${
                    uploadMode === 'url'
                      ? 'bg-emerald-500 text-slate-950 font-extrabold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🔗 Link URL
                </button>
              </div>
            </div>

            {uploadMode === 'file' ? (
              <div className="relative border-2 border-dashed border-slate-800 hover:border-emerald-500/50 bg-slate-950/60 rounded-xl p-4 text-center transition">
                <input
                  type="file"
                  accept="image/*"
                  required={!photoUrl}
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                {photoUrl ? (
                  <div className="flex items-center gap-4 text-left">
                    <img
                      src={photoUrl}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-xl border border-emerald-500/40 shadow-md"
                    />
                    <div>
                      <span className="text-xs font-bold text-emerald-400 block">
                        ✓ Foto Carregada
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Clique para substituir a imagem
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1 py-2">
                    <span className="text-2xl block">📸</span>
                    <p className="text-xs font-bold text-slate-300">
                      Clique aqui para selecionar a foto
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Suporta JPG, PNG, WEBP
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <input
                type="url"
                required={!photoUrl}
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://exemplo.com/foto.jpg"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition"
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm uppercase tracking-wider rounded-xl transition shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] cursor-pointer"
          >
            ⚡ Iniciar Varredura Quântica de Campo
          </button>
        </form>

        {/* Gatilhos de Venda / Autoridade */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center text-[10px] text-slate-400 font-medium">
          <div className="flex flex-col items-center gap-1">
            <span className="text-emerald-400 text-sm">🔒</span>
            <span>Entropia Quântica Nativa</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-emerald-400 text-sm">🎯</span>
            <span>Análise de Ressonância</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-emerald-400 text-sm">📡</span>
            <span>Emissão Multissensorial</span>
          </div>
        </div>
      </div>
    </div>
  );
}
