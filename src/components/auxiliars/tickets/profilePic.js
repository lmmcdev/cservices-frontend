import React, { useEffect, useState, useRef } from 'react';
import { Avatar, Box } from '@mui/material';
import { useProfilePhoto } from '../../../context/profilePhotoContext';
import { useAuth } from '../../../context/authContext';
import { getUserPhotoByEmail } from '../../../utils/graphHelper';

const ProfilePic = ({ email, size = 40 }) => {
  const { user } = useAuth();
  const { photoUrl: contextPhotoUrl } = useProfilePhoto();

  const effectiveEmail = email || user?.username;
  const userInitial = effectiveEmail?.[0]?.toUpperCase() || '?';

  const cacheRef = useRef(new Map());
  const [photoUrl, setPhotoUrl] = useState(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadPhoto = async () => {
      if (!effectiveEmail) return;

      // Usa foto en caché si existe
      if (cacheRef.current.has(effectiveEmail)) {
        setPhotoUrl(cacheRef.current.get(effectiveEmail));
        return;
      }

      try {
        const url = await getUserPhotoByEmail(effectiveEmail);
        if (isMounted) {
          cacheRef.current.set(effectiveEmail, url);
          setPhotoUrl(url);
          setImgError(false);
        }
      } catch (err) {
        console.error(`Error loading photo for ${effectiveEmail}`, err);
        if (isMounted) {
          setImgError(true);
        }
      }
    };

    if (email) {
      loadPhoto(); // Si se pasa email explícito, carga manual
    } else {
      setPhotoUrl(contextPhotoUrl); // Si no, usa la del contexto
    }

    return () => {
      isMounted = false;
    };
  }, [effectiveEmail, email, contextPhotoUrl]);

  return (
    <Box display="flex" alignItems="center" gap={2}>
      <Avatar
        src={!imgError && photoUrl ? photoUrl : undefined}
        alt="User"
        onError={() => setImgError(true)}
        sx={{
          width: size,
          height: size,
          border: '2px solid #00a1ff',
          fontWeight: 'bold',
          fontSize: size * 0.42,
          backgroundColor: (!photoUrl || imgError) ? '#dff3ff' : 'transparent',
          color: (!photoUrl || imgError) ? '#00a1ff' : undefined,
        }}
      >
        {(!photoUrl || imgError) && userInitial}
      </Avatar>
    </Box>
  );
};

export default ProfilePic;
