import React, { useState } from 'react';
import { Avatar, Box } from "@mui/material";
import { useProfilePhoto } from '../../context/profilePhotoContext';
import { useAuth } from '../../context/authContext';

const ProfilePic = ({ size = 40 }) => {
  const { photoUrl } = useProfilePhoto(); //const photoUrl = null; //to test null image
  const { user } = useAuth();
  const [imgError, setImgError] = useState(false);

  const userInitial = user?.username?.[0]?.toUpperCase() || '?';

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