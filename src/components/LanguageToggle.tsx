import React from 'react';
import { Languages } from 'lucide-react';
import { Button } from './ui/button';
import { useLanguage } from '../contexts/LanguageContext';
const LanguageToggle = () => {
  const {
    language,
    toggleLanguage
  } = useLanguage();
  return <Button onClick={toggleLanguage} variant="outline" size="sm" className="border-purple-500 text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 mx-[28px]">
      <Languages className="w-4 h-4 mr-2" />
      {language === 'ar' ? 'EN' : 'عر'}
    </Button>;
};
export default LanguageToggle;