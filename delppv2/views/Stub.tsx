import React from 'react';
import { Card, SectionTitle } from '../components/ui/Card';
import { Construction } from 'lucide-react';

interface Props { title: string; xsdRef?: string; }

export const Stub: React.FC<Props> = ({ title, xsdRef }) => (
  <div className="animate-fade-in">
    <Card>
      <SectionTitle icon={<Construction size={22} className="text-amber-500" />} separator>
        {title}
      </SectionTitle>
      <div className="text-center py-12 text-gray-400">
        <Construction size={40} className="mx-auto mb-3 text-amber-300" />
        <p className="text-sm font-medium text-gray-500">Section en cours de développement</p>
        {xsdRef && (
          <p className="text-xs mt-2 text-gray-400 font-mono">XSD : {xsdRef}</p>
        )}
      </div>
    </Card>
  </div>
);
