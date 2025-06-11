// context/profilePhotoContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './authContext';
import { getUserPhotoByEmail } from '../utils/graphHelper';

const ProfilePhotoContext = createContext();

export const ProfilePhotoProvider = ({ children }) => {
  const { user } = useAuth();
  const [photoUrl, setPhotoUrl] = useState(null);

  const loadPhoto = async (email) => {
    if (!email) return;
    try {
      const url = await getUserPhotoByEmail(email);
      setPhotoUrl(url);
    } catch (err) {
      console.error('Error loading profile photo:', err);
    }
  };

  useEffect(() => {
    loadPhoto(user?.username);
  }, [user?.username]);

  return (
    <ProfilePhotoContext.Provider value={{ photoUrl, setPhotoUrl, loadPhoto }}>
      {children}
    </ProfilePhotoContext.Provider>
  );
};

export const useProfilePhoto = () => useContext(ProfilePhotoContext);

