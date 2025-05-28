// components/Header.js
import React from "react";
import { Avatar, Box } from "@mui/material";
import { useAuth } from "../../utils/authContext";

const ProfilePic = () => {
  const { user, profilePhoto } = useAuth();

  return (
    <Box display="flex" alignItems="center" gap={2}>
      {profilePhoto ? (
        <Avatar src={profilePhoto} alt={user?.name || "Usuario"} sx={{
    width: { xs: 40, sm: 56, md: 72 },
    height: { xs: 40, sm: 56, md: 72 },
  }}/>
      ) : (
        <Avatar>{user?.name?.[0]}</Avatar> // Fallback
      )}
    </Box>
  );
};

export default ProfilePic;
