import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './authContext';
import { getUserPhotoByEmail } from '../utils/graphHelper';

const ProfilePhotoContext = createContext();

export const ProfilePhotoProvider = ({ children }) => {
  const { user } = useAuth();
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    const fetchPhoto = async () => {
      if (!user?.username) return;
      try {
        const url = await getUserPhotoByEmail(user.username);
        setPhotoUrl(url);
      } catch (err) {
        console.error('Error loading profile photo:', err);
      }
    };

    fetchPhoto();
  }, [user?.username]);

  return (
    <ProfilePhotoContext.Provider value={{ photoUrl, setPhotoUrl }}>
      {children}
    </ProfilePhotoContext.Provider>
  );
};

export const useProfilePhoto = () => useContext(ProfilePhotoContext);
