import {
  TargetProfile,
  QuantecReportItem,
  QuantecSession,
} from '../types/quantec';

// Banco de Dados Expandido de Módulos Biocomunicacionais
const QUANTUM_DATABASE = [
  {
    category: 'Florais & Essências Vibracionais',
    items: [
      {
        name: 'Rescue / Emergencial Sistêmico',
        baseFreq: 528,
        phrase:
          'Restabeleço o equilíbrio imediato e a paz interior no campo sutil.',
        blockage:
          'Sobrecarga de estresse situacional e desalinhamento repentino do campo bioenergético.',
      },
      {
        name: 'Gentian (Perseverança e Fé)',
        baseFreq: 639,
        phrase:
          'Transmuto a dúvida e a incerteza em convicção absoluta e progresso.',
        blockage:
          'Padrão inconsciente de pessimismo reflexo e estagnação diante de obstáculos.',
      },
      {
        name: 'Larch (Autoconfiança e Expressão)',
        baseFreq: 741,
        phrase:
          'Liberamo-nos do medo de falhar e assumimos nossa potência criativa.',
        blockage:
          'Crença enraizada de incapacidade pessoal e memórias de fracasso acumuladas.',
      },
    ],
  },
  {
    category: 'Frequências Rife & Solfeggio',
    items: [
      {
        name: 'Desobstrução de Fluxo Energético (Solfeggio 417 Hz)',
        baseFreq: 417,
        phrase:
          'Desfaço bloqueios energéticos cristalizados no campo informacional.',
        blockage:
          'Acúmulo de toxinas emocionais e memórias celulares estagnadas.',
      },
      {
        name: 'Regeneração & Transformação Celular (Solfeggio 528 Hz)',
        baseFreq: 528,
        phrase: 'Ativo a ressonância harmônica e a matriz original do ser.',
        blockage:
          'Dissonância na frequência de maturação celular e desgaste vital.',
      },
      {
        name: 'Harmonização de Relacionamentos (Solfeggio 639 Hz)',
        baseFreq: 639,
        phrase:
          'Alinho os vetores de atração para conexões elevadas e prósperas.',
        blockage:
          'Ruído informacional nas relações e rigidez nos laços afetivos.',
      },
    ],
  },
  {
    category: 'Mapeamento de Meridianos & Acupuntura',
    items: [
      {
        name: 'Meridiano do Fígado (Gargalo de Ação e Expressão)',
        baseFreq: 432,
        phrase:
          'Libero a estagnação e abro os canais para a fluidez de conquistas.',
        blockage:
          'Repressão de raiva inconsciente e estagnação do Qi Hepático.',
      },
      {
        name: 'Meridiano do Coração (Centro do Campo Toroidal)',
        baseFreq: 528,
        phrase: 'Fortaleço a coerência cardíaca e o magnetismo pessoal.',
        blockage:
          'Fechamento de proteção cardíaca devido a traumas afetivos pregressos.',
      },
    ],
  },
  {
    category: 'Desbloqueio Sistêmico & Informacional',
    items: [
      {
        name: 'Alinhamento com a Abundância Matriz',
        baseFreq: 852,
        phrase:
          'Conecto o campo bioinformacional à frequência da prosperidade ilimitada.',
        blockage:
          'Contratos inconscientes de escassez e lealdades invisíveis à limitação.',
      },
      {
        name: 'Dissolução de Padrões Hereditários Limitantes',
        baseFreq: 963,
        phrase:
          'Honro o passado e integro apenas a força e a expansão para o presente.',
        blockage:
          'Emaranhamento sistêmico transgeracional e repetição de padrões ancestrais.',
      },
    ],
  },
];

const POTENCIES = ['D6', 'D12', 'C30', 'C200', '1M', '10M', 'LM1', 'LM6'];

// Captura micro-flutuações do processador para simular o ruído branco do diodo
function captureHardwareJitterEntropy(): number {
  const samples: number[] = [];
  for (let i = 0; i < 100; i++) {
    const start = performance.now();
    let sum = 0;
    for (let j = 0; j < 500; j++) sum += Math.sqrt(j);
    const end = performance.now();
    samples.push((end - start) * 100000);
  }
  return samples.reduce((a, b) => a + b, 0) % 1000000;
}

// Gera Hash SHA-256 único do alvo (Assinatura Biométrica)
async function generateBiometricHash(
  target: TargetProfile
): Promise<Uint8Array> {
  const encoder = new TextEncoder();
  const rawData = `${target.name.trim().toLowerCase()}_${
    target.birthDate
  }_${target.objective.trim()}`;
  const data = encoder.encode(rawData);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return new Uint8Array(hashBuffer);
}

// Motor de Varredura Quântica Assíncrono Principal
export async function runQuantumScan(
  target: TargetProfile
): Promise<QuantecSession> {
  const biometricHash = await generateBiometricHash(target);
  const jitterValue = captureHardwareJitterEntropy();

  // Entropia Criptográfica Nativa
  const cryptoRandomValues = new Uint8Array(16);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(cryptoRandomValues);
  } else {
    for (let i = 0; i < 16; i++) {
      cryptoRandomValues[i] = Math.floor(Math.random() * 256);
    }
  }

  const reportItems: QuantecReportItem[] = [];

  QUANTUM_DATABASE.forEach((group, gIdx) => {
    const itemIdx =
      (biometricHash[gIdx] + Math.floor(jitterValue)) % group.items.length;
    const item = group.items[itemIdx];

    // Cálculo da porcentagem de ressonância (80% a 99%)
    const rawResonance =
      85 + ((biometricHash[gIdx + 4] + cryptoRandomValues[gIdx]) % 15);

    // Escolha da Potência Radionica
    const potencyIdx =
      (biometricHash[gIdx + 8] + cryptoRandomValues[gIdx + 2]) %
      POTENCIES.length;

    reportItems.push({
      id: `item-${gIdx}-${Date.now()}`,
      category: group.category,
      name: item.name,
      percentage: rawResonance,
      potency: POTENCIES[potencyIdx],
      frequency: item.baseFreq,
      systemicPhrase: item.phrase,
      blockage: item.blockage,
    });
  });

  // Ordena por maior porcentagem de ressonância
  reportItems.sort((a, b) => b.percentage - a.percentage);

  const primaryFrequency = reportItems[0]?.frequency || 528;

  return {
    id: `session-${Date.now()}`,
    createdAt: new Date().toISOString(),
    target,
    reportItems,
    recommendedFrequency: primaryFrequency,
  };
}

// Função de compatibilidade síncrona (resolve chamadas diretas em app/page.tsx)
export function generateQuantecReport(target: TargetProfile): QuantecSession {
  const jitterValue = captureHardwareJitterEntropy();
  const reportItems: QuantecReportItem[] = [];

  QUANTUM_DATABASE.forEach((group, gIdx) => {
    const charSum = target.name
      .split('')
      .reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const itemIdx =
      Math.abs(charSum + Math.floor(jitterValue) + gIdx) % group.items.length;
    const item = group.items[itemIdx];

    const rawResonance = 85 + (Math.floor(jitterValue * (gIdx + 1)) % 15);
    const potencyIdx = (charSum + gIdx) % POTENCIES.length;

    reportItems.push({
      id: `item-${gIdx}-${Date.now()}`,
      category: group.category,
      name: item.name,
      percentage: rawResonance,
      potency: POTENCIES[potencyIdx],
      frequency: item.baseFreq,
      systemicPhrase: item.phrase,
      blockage: item.blockage,
    });
  });

  reportItems.sort((a, b) => b.percentage - a.percentage);
  const primaryFrequency = reportItems[0]?.frequency || 528;

  return {
    id: `session-${Date.now()}`,
    createdAt: new Date().toISOString(),
    target,
    reportItems,
    recommendedFrequency: primaryFrequency,
  };
}

// Exportação Padrão por compatibilidade
export default generateQuantecReport;
