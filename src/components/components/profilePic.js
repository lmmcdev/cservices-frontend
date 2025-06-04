// components/Header.js
import React from "react";
import { Avatar, Box } from "@mui/material";
import { useAuth } from "../../utils/authContext";

const ProfilePic = ({ size = 36 }) => {
  const { user, profilePhoto } = useAuth();

  return (
    <Box display="flex" alignItems="center" gap={2}>
      {profilePhoto ? (
        <Avatar
          src={profilePhoto}
          alt={user?.name || "Usuario"}
          sx={{
            width: size,
            height: size,
            border: '2px solid #00a1ff', 
          }}
        />
      ) : (
        <Avatar
          sx={{
            width: size,
            height: size,
            border: '2px solid #00a1ff', 
          }}
        >
          {user?.name?.[0]}
        </Avatar>
      )}
    </Box>
  );
};

export default ProfilePic;