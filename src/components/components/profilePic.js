// components/Header.js
import React, { useEffect, useState } from 'react';
import { Avatar, Box } from "@mui/material";
import { useAuth } from "../../utils/authContext";
import { getUserPhotoByEmail } from '../../utils/graphHelper';


const ProfilePic = ({email}) => {
  const { user, } = useAuth();
  const finalEmail = email || user?.username || '';
  const [photos, setPhotos] = useState({});

  useEffect(() => {
    const results = {};
    const fetchPhotos = async () => {
        try {
          const url = await getUserPhotoByEmail(finalEmail);
          if (url) results[email] = url;
          setPhotos(results);
        } catch (err) {
          console.error('Error al obtener fotos de colaboradores:', err);
        }
      };
  
      fetchPhotos();
    }, [finalEmail, email]);

    return (
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar 
          src={photos[email]}
          alt={finalEmail || "Usuario"} sx={{
            width: 40,
            height: 40,
            border: '2px solid #00a1ff',
          }}
        />
      </Box>
    );
};

export default ProfilePic;