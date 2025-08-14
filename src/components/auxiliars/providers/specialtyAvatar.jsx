import React from 'react';
import { Avatar } from '@mui/material';
import { Iconify } from '../icons';

const pickIconNamess = (taxonomyDesc = '') => {
  const t = taxonomyDesc?.toString().toLowerCase().trim();
  if (!t) return 'material-symbols:medical-services';

  // Mapeo con íconos reales (Material Symbols + MDI via Iconify)
  if (t.includes('dentist') || t.includes('dental')) return 'mdi:tooth-outline';
  if (t.includes('cardio')) return 'mdi:heart-pulse';
  if (t.includes('ophthalmolog') || t.includes('optometr')) return 'mdi:eye-outline';
  if (t.includes('pulmon') || t.includes('lung')) return 'mdi:lungs';
  if (t.includes('gastro') || t.includes('gi')) return 'mdi:stomach';
  if (t.includes('gynecol') || t.includes('obstet')) return 'mdi:gender-female';
  if (t.includes('urolog')) return 'mdi:human-male';
  if (t.includes('neuro')) return 'mdi:brain';
  if (t.includes('dermatolog') || t.includes('skin')) return 'mdi:allergy';
  if (t.includes('endocrin')) return 'material-symbols:science';
  if (t.includes('rheumatolog')) return 'mdi:bone';
  if (t.includes('nephrol')) return 'mdi:kidney';
  if (t.includes('hematolog') || t.includes('oncolog') || t.includes('hemonc')) return 'mdi:microscope';
  if (t.includes('psych') || t.includes('behavioral')) return 'material-symbols:psychology';
  if (t.includes('allergy') || t.includes('immunolog')) return 'mdi:allergy';
  if (t.includes('infect')) return 'mdi:virus';
  if (t.includes('otolaryngolog') || t.includes('ent') || t.includes('audiolog')) return 'mdi:ear-hearing';
  if (t.includes('orthop') || t.includes('ortho')) return 'mdi:bone';
  if (t.includes('pain')) return 'material-symbols:healing';
  if (t.includes('radiolog') || t.includes('imaging')) return 'material-symbols:biotech';
  if (t.includes('patholog')) return 'mdi:microscope';
  if (t.includes('family') || t.includes('internal med') || t.includes('primary care')) return 'material-symbols:medical-services';
  if (t.includes('pediatric')) return 'mdi:baby-face-outline';
  if (t.includes('geriatr')) return 'material-symbols:elderly';
  if (t.includes('urgent') || t.includes('emergency') || t.includes('er')) return 'mdi:ambulance';
  if (t.includes('telemed') || t.includes('telehealth')) return 'mdi:video';
  if (t.includes('nutrition') || t.includes('diet')) return 'mdi:food-apple-outline';
  if (t.includes('pharm')) return 'mdi:pill';
  if (t.includes('physical therapy') || t.includes('physiother') || t.includes('pt ')) return 'mdi:arm-flex-outline';
  if (t.includes('occupational therapy') || t.includes('ot ')) return 'mdi:hand-back-right-outline';
  if (t.includes('speech') || t.includes('slp')) return 'mdi:account-voice';

  return 'material-symbols:medical-services'; // fallback
};

const SpecialtyAvatar = ({ taxonomy }) => {
  const iconName = pickIconNamess(taxonomy);
  return (
    <Avatar sx={{ bgcolor: '#DFF3FF', color: '#00A1FF' }}>
      <Iconify icon={iconName} width="20" height="20" style={{ color: 'inherit' }} />
    </Avatar>
  );
};

export default SpecialtyAvatar;
