'use client';

import React, { useState } from 'react';
import { TargetProfile, QuantecSession } from '../src/types/quantec';
import { generateQuantecReport } from '../src/utils/quantecEngine';
import { AnamnesisForm } from '../src/components/AnamnesisForm';
import { ReportView } from '../src/components/ReportView';
import { EmissionPlayer } from '../src/components/EmissionPlayer';

type ViewMode = 'FORM' | 'REPORT' | 'HISTORY';

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>('FORM');
  const [currentSession, setCurrentSession] = useState<QuantecSession | null>(
    null
  );
  const [isEmitting, setIsEmitting] = useState(false);

  const handleFormSubmit = (target: TargetProfile) => {
    const newSession = generateQuantecReport(target);

    try {
      const rawHistory = localStorage.getItem('vibraquant_history');
      const history = rawHistory ? JSON.parse(rawHistory) : [];
      localStorage.setItem(
        'vibraquant_history',
        JSON.stringify([newSession, ...history])
      );
    } catch (err) {
      console.error('Erro ao salvar histórico:', err);
    }

    setCurrentSession(newSession);
    setViewMode('REPORT');
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 flex flex-col items-center justify-center relative">
      {/* Menu Superior */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => setViewMode('FORM')}
          className="px-3 py-1.5 bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-lg hover:border-emerald-500/40 transition cursor-pointer"
        >
          Nova Análise
        </button>
        <button
          onClick={() => setViewMode('HISTORY')}
          className="px-3 py-1.5 bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-lg hover:border-emerald-500/40 transition cursor-pointer"
        >
          📋 Histórico
        </button>
      </div>

      {/* Renderização das Telas */}
      {viewMode === 'FORM' && <AnamnesisForm onSubmit={handleFormSubmit} />}

      {viewMode === 'REPORT' && currentSession && (
        <ReportView
          session={currentSession}
          onStartEmission={() => setIsEmitting(true)}
          onBack={() => setViewMode('FORM')}
        />
      )}

      {viewMode === 'HISTORY' && (
        <HistoryPanel
          onSelectSession={(session) => {
            setCurrentSession(session);
            setViewMode('REPORT');
          }}
          onBack={() => setViewMode('FORM')}
        />
      )}

      {/* Modal do Player de Emissão */}
      {isEmitting && currentSession && (
        <EmissionPlayer
          session={currentSession}
          onClose={() => setIsEmitting(false)}
        />
      )}
    </main>
  );
}
