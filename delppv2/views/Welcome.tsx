import React from 'react';
import { FileText, Shield, Clock, CheckCircle } from 'lucide-react';

interface Props { onStart: () => void; }

export const Welcome: React.FC<Props> = ({ onStart }) => (
  <div className="flex flex-col items-center justify-center min-h-[70vh] text-center animate-fade-in px-4">
    <div className="bg-red-600 text-white px-4 py-2 rounded-lg mb-6 shadow">
      <span className="font-bold text-xl tracking-tight">ACD</span>
      <span className="ml-2 text-sm font-light">Administration des Contributions Directes</span>
    </div>

    <h1 className="text-3xl font-bold text-gray-800 mb-2">
      Déclaration d'impôt 2025
    </h1>
    <p className="text-lg text-gray-500 mb-8">
      Assistant pour le Modèle 100 — Personnes physiques
    </p>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 max-w-2xl w-full">
      {[
        { icon: Clock, title: '30 min environ', desc: 'Selon votre situation' },
        { icon: Shield, title: 'Données sécurisées', desc: 'Tout reste sur votre appareil' },
        { icon: CheckCircle, title: 'Guidé pas à pas', desc: 'Seules vos rubriques vous sont présentées' },
      ].map(({ icon: Icon, title, desc }) => (
        <div key={title} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex flex-col items-center gap-2">
          <Icon className="text-blue-500" size={24} />
          <p className="font-semibold text-gray-700 text-sm">{title}</p>
          <p className="text-xs text-gray-500">{desc}</p>
        </div>
      ))}
    </div>

    <button
      onClick={onStart}
      className="group bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-3 transform hover:-translate-y-0.5"
    >
      <FileText size={20} />
      Commencer ma déclaration
    </button>

    <p className="mt-6 text-xs text-gray-400">
      Modèle 100 · Année d'imposition 2025 · Version eCDF 2025
    </p>
  </div>
);
