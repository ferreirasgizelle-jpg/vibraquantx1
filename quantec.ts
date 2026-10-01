export interface TargetProfile {
  name: string;
  birthDate: string;
  objective: string;
  photoUrl: string;
}

export interface QuantecReportItem {
  id: string;
  category: string;
  name: string;
  percentage: number;
  potency: string;
  frequency: number;
  systemicPhrase: string;
  blockage: string; // Ex: Autossabotagem, crença de escassez, medo do sucesso, etc.
}

export interface QuantecSession {
  id: string;
  createdAt: string;
  target: TargetProfile;
  reportItems: QuantecReportItem[];
  recommendedFrequency: number;
}
