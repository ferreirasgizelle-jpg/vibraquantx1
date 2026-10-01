'use client';

import React, { useEffect, useState } from 'react';
import { QuantecSession } from '../types/quantec';

interface HistoryPanelProps {
  onSelectSession: (session: QuantecSession) => void;
  onBack: () => void;
}

export function HistoryPanel({ onSelectSession, onBack }: HistoryPanelProps) {
  const [history, setHistory] = useState<QuantecSession[]>([]);

  useEffect(() => {
    try {
      const rawData = localStorage.getItem('vibraquant_history');
      if (rawData) setHistory(JSON.parse(rawData));
    } catch (e) {}
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('vibraquant_history');
    setHistory([]);
  };

  return (
    <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100">
            Histórico de Sessões
          </h2>
          <p className="text-xs text-slate-400">
            Análises armazenadas localmente
          </p>
        </div>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="text-[10px] text-red-400 hover:underline"
          >
            Limpar Histórico
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="text-xs text-slate-500 text-center py-8">
          Nenhuma sessão registrada até o momento.
        </p>
      ) : (
        <div className="space-y-3">
          {history.map((session) => (
            <div
              key={session.id}
              onClick={() => onSelectSession(session)}
              className="bg-slate-950 border border-slate-800 hover:border-emerald-500/50 p-4 rounded-xl cursor-pointer transition flex justify-between items-center"
            >
              <div>
                <h3 className="text-sm font-bold text-slate-100">
                  {session.target.name}
                </h3>
                <p className="text-xs text-slate-400 truncate max-w-xs">
                  {session.target.objective}
                </p>
                <span className="text-[10px] text-slate-500">
                  {new Date(session.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                {session.recommendedFrequency} Hz
              </span>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={onBack}
        className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition"
      >
        ← Voltar ao Início
      </button>
    </div>
  );
}
