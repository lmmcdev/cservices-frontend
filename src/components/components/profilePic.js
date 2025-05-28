// components/Header.js
import React from "react";
import { Avatar, Box } from "@mui/material";
import { useAuth } from "../../utils/authContext";

const ProfilePic = () => {
  const { user, profilePhoto } = useAuth();

  return (
    <Box display="flex" alignItems="center" gap={2}>
      {profilePhoto ? (
        <Avatar src={profilePhoto} alt={user?.name || "Usuario"} />
      ) : (
        <Avatar>{user?.name?.[0]}</Avatar> // Fallback
      )}
    </Box>
  );
};

export default ProfilePic;
