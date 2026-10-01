'use client';

import React, { useEffect, useState, useRef } from 'react';
import { QuantecSession } from '../types/quantec';
import { audioEngine } from '../utils/audioEngine';

interface EmissionPlayerProps {
  session: QuantecSession;
  onClose: () => void;
}

export function EmissionPlayer({ session, onClose }: EmissionPlayerProps) {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const currentItem = session.reportItems[currentPhraseIndex];
  // Usa a frequência específica do módulo atual do relatório
  const activeFrequency =
    currentItem?.frequency || session.recommendedFrequency;

  // Atualiza a frequência emitida sempre que o módulo/frase muda
  useEffect(() => {
    if (isAudioActive) {
      audioEngine.startSession(activeFrequency, 6);
    }
  }, [currentPhraseIndex, isAudioActive, activeFrequency]);

  useEffect(() => {
    return () => {
      audioEngine.stopSession();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  // Timer de 60 segundos por ciclo de emissão
  useEffect(() => {
    let interval: any = null;
    if (isAudioActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isAudioActive) {
      if (currentPhraseIndex < session.reportItems.length - 1) {
        setCurrentPhraseIndex((prev) => prev + 1);
        setTimeLeft(60);
      } else {
        setIsAudioActive(false);
        audioEngine.stopSession();
      }
    }
    return () => clearInterval(interval);
  }, [isAudioActive, timeLeft, currentPhraseIndex, session.reportItems.length]);

  const toggleAudio = () => {
    if (isAudioActive) {
      audioEngine.stopSession();
      setIsAudioActive(false);
    } else {
      audioEngine.startSession(activeFrequency, 6);
      setIsAudioActive(true);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;

    const render = () => {
      angle += 0.015;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 50 + Math.sin(angle * 2) * 10;

      ctx.strokeStyle = isAudioActive
        ? 'rgba(16, 185, 129, 0.5)'
        : 'rgba(71, 85, 105, 0.3)';
      ctx.lineWidth = 1.5;

      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius + i * 16, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.strokeStyle = isAudioActive ? '#34d399' : '#64748b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const rad = angle + (i * Math.PI) / 4;
        const x = centerX + Math.cos(rad) * (radius + 12);
        const y = centerY + Math.sin(rad) * (radius + 12);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isAudioActive]);

  const speakCurrentPhrase = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (!currentItem) return;

    const utterance = new SpeechSynthesisUtterance(currentItem.systemicPhrase);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;

    utterance.onstart = () => setIsPlayingVoice(true);
    utterance.onend = () => setIsPlayingVoice(false);

    window.speechSynthesis.speak(utterance);
  };

  const progressPercentage = ((60 - timeLeft) / 60) * 100;

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-emerald-500/40 rounded-3xl p-6 md:p-8 text-center shadow-[0_0_60px_rgba(16,185,129,0.2)] relative space-y-5 my-8">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-[10px] font-mono font-bold text-emerald-300 tracking-widest uppercase">
            EMISSÃO QUÂNTICA ATIVA
          </span>
        </div>

        <div>
          <h2 className="text-2xl font-black text-slate-100">
            {session.target.name}
          </h2>
          {/* Exibe dinamicamente a frequência exata do item do laudo */}
          <div className="flex justify-center items-center gap-2 mt-2">
            <span className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold px-3 py-1 rounded-lg">
              🎯 Frequência do Módulo: {activeFrequency} Hz
            </span>
            <span className="bg-slate-900 border border-slate-800 text-slate-400 text-xs font-mono font-bold px-3 py-1 rounded-lg">
              Potência: {currentItem?.potency}
            </span>
          </div>
        </div>

        {/* Visualizador da Mandala */}
        <div className="flex justify-center relative my-1">
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={200}
              height={200}
              className="rounded-full bg-slate-950 border border-emerald-500/20 shadow-inner"
            />
            {isAudioActive && (
              <div className="absolute inset-0 rounded-full border border-emerald-500/30 animate-ping pointer-events-none"></div>
            )}
          </div>
        </div>

        {/* Contador e Barra de Progresso de 1 Minuto */}
        <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-400 font-bold uppercase">
              Tempo de Transmissão ({activeFrequency} Hz)
            </span>
            <span className="text-emerald-400 font-black">
              {timeLeft}s / 60s
            </span>
          </div>
          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 h-full transition-all duration-1000 ease-linear"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Controle Principal de Áudio */}
        <button
          onClick={toggleAudio}
          className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 ${
            isAudioActive
              ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
              : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
          }`}
        >
          {isAudioActive
            ? `🔊 EMITINDO ${activeFrequency} Hz (PAUSAR)`
            : `▶️ INICIAR EMISSÃO DE ${activeFrequency} Hz (1 MIN)`}
        </button>

        {/* Detalhes do Módulo do Relatório com Diagnóstico de Causa Raiz */}
        <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-2xl text-left space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
              {currentItem?.category} ({currentPhraseIndex + 1}/
              {session.reportItems.length})
            </span>
            <span className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              Ressonância {currentItem?.percentage}%
            </span>
          </div>

          <p className="text-xs font-bold text-slate-100">
            {currentItem?.name}
          </p>

          {/* Diagnóstico do Bloqueio Identificado */}
          {currentItem?.blockage && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                ⚠️ Bloqueio / Causa Raiz Identificada:
              </span>
              <p className="text-xs text-amber-200/90 font-medium leading-relaxed">
                {currentItem.blockage}
              </p>
            </div>
          )}

          {/* Afirmação de Reprogramação */}
          <div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
              ✨ Frequência de Harmonização:
            </span>
            <p className="text-xs italic text-slate-200 leading-relaxed font-medium">
              "{currentItem?.systemicPhrase}"
            </p>
          </div>
        </div>

        {/* Controles do Player */}
        <div className="flex gap-2">
          <button
            onClick={speakCurrentPhrase}
            className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            {isPlayingVoice ? '🗣️ Vocalizando...' : '🗣️ Vocalizar Frase'}
          </button>
          <button
            onClick={() => {
              setCurrentPhraseIndex(
                (prev) => (prev + 1) % session.reportItems.length
              );
              setTimeLeft(60);
            }}
            className="py-3 px-5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Próxima ➔
          </button>
        </div>

        <button
          onClick={() => {
            audioEngine.stopSession();
            onClose();
          }}
          className="w-full py-2 text-slate-400 hover:text-slate-200 font-bold text-xs transition cursor-pointer"
        >
          Encerrar Sessão
        </button>
      </div>
    </div>
  );
}
