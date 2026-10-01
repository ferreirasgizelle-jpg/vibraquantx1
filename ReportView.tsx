'use client';

import React from 'react';
import { QuantecSession } from '../types/quantec';

interface ReportViewProps {
  session: QuantecSession;
  onStartEmission: () => void;
  onBack: () => void;
}

export function ReportView({
  session,
  onStartEmission,
  onBack,
}: ReportViewProps) {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(16,185,129,0.1)] backdrop-blur-2xl space-y-6">
        {/* Header do Laudo */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[10px] font-mono font-bold text-emerald-300 tracking-widest uppercase">
                LAUDO BIOCOMUNICACIONAL • CONEXÃO ATIVA
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-100">
              {session.target.name}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Data de Nascimento: {session.target.birthDate}
            </p>
          </div>

          <div className="bg-slate-950/90 border border-slate-800 px-5 py-3 rounded-2xl text-right flex md:flex-col justify-between items-center md:items-end w-full md:w-auto">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
              Frequência Matriz
            </span>
            <span className="text-2xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              {session.recommendedFrequency} Hz
            </span>
          </div>
        </div>

        {/* Card do Objetivo */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 p-5 rounded-2xl shadow-inner">
          <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block mb-1">
            🎯 VETOR DE INTENÇÃO ANALISADO
          </span>
          <p className="text-sm font-medium italic text-emerald-100 leading-relaxed">
            "{session.target.objective}"
          </p>
        </div>

        {/* Lista de Módulos */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
              Mapeamento de Ressonância Radionica
            </span>
            <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
              {session.reportItems.length} Módulos Identificados
            </span>
          </div>

          {session.reportItems.map((item, idx) => (
            <div
              key={item.id}
              className="bg-slate-950/80 border border-slate-800 hover:border-emerald-500/40 p-5 rounded-2xl transition duration-300 space-y-3"
            >
              <div className="flex flex-wrap justify-between items-center gap-2">
                <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                  {item.category}
                </span>
                <div className="flex items-center gap-2">
                  <span className="bg-slate-900 text-slate-300 font-mono text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-800">
                    {item.potency}
                  </span>
                  <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 font-mono text-xs font-bold px-2.5 py-1 rounded-lg">
                    {item.frequency} Hz
                  </span>
                  <span className="bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-mono text-xs font-black px-2.5 py-1 rounded-lg shadow-sm">
                    {item.percentage}%
                  </span>
                </div>
              </div>

              <div className="text-sm font-bold text-slate-100">
                <span className="text-emerald-500 mr-2">#{idx + 1}</span>{' '}
                {item.name}
              </div>

              <div className="bg-slate-900/90 border-l-2 border-emerald-500 p-3.5 rounded-r-xl text-xs italic text-slate-300 leading-relaxed">
                "{item.systemicPhrase}"
              </div>
            </div>
          ))}
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={onBack}
            className="py-4 px-6 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-bold text-xs rounded-2xl transition cursor-pointer"
          >
            ← Nova Análise
          </button>
          <button
            onClick={onStartEmission}
            className="flex-1 py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl transition shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] cursor-pointer"
          >
            🚀 Iniciar Transmissão Frequencial & Binaural
          </button>
        </div>
      </div>
    </div>
  );
}
