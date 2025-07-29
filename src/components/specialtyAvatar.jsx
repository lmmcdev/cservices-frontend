import React from 'react';
import { Avatar } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HearingIcon from '@mui/icons-material/Hearing';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CoronavirusIcon from '@mui/icons-material/Coronavirus';
import FaceIcon from '@mui/icons-material/Face';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import WcIcon from '@mui/icons-material/Wc';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices'; // para diente
import HealingIcon from '@mui/icons-material/Healing';
import RestaurantIcon from '@mui/icons-material/Restaurant';

const getSpecialtyIcon = (taxonomyDesc = '') => {
  const t = taxonomyDesc?.toString().toLowerCase().trim(); // 👈 evita errores

  console.log('🧪 Taxonomy received:', t); // DEBUG: te ayudará a ver si entra y qué evalúa

  if (!t) return <LocalHospitalIcon />;

  if (t.includes('dentist')) return <MedicalServicesIcon />;
  if (t.includes('cardio')) return <FavoriteIcon />;
  if (t.includes('audiologist')) return <HearingIcon />;
  if (t.includes('allergy') || t.includes('immunology')) return <>🤧</>;
  if (t.includes('ophthalmology')) return <VisibilityIcon />;
  if (t.includes('otolaryngology') || t.includes('ent')) return <FaceIcon />;
  if (t.includes('gastro')) return <RestaurantIcon />;
  if (t.includes('pulmonary') || t.includes('lung')) return <CoronavirusIcon />;
  if (t.includes('gynecol')) return <WcIcon />;
  if (t.includes('pain')) return <HealingIcon />;

  return <LocalHospitalIcon />;
};

const SpecialtyAvatar = ({ taxonomy }) => {
  const icon = getSpecialtyIcon(taxonomy);
  return (
    <Avatar sx={{ bgcolor: '#DFF3FF', color: '#00A1FF' }}>
      {icon}
    </Avatar>
  );
};

export default SpecialtyAvatar;