import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import MergeIcon from "@mui/icons-material/Merge";

const ICON_W = 28; // matches IconButton size="small"

const PatientCell = React.memo(function PatientCell({
  snapshot,
  fallbackName,
  onOpenProfile,
}) {
  const hasIcon = Boolean(snapshot?.Name);
  const raw = snapshot?.Name ?? fallbackName ?? "";
  const name = raw ? String(raw).toUpperCase() : "—";

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: `${ICON_W}px 1fr`,
        alignItems: "center",
        gap: 1,
      }}
    >
      {hasIcon ? (
        <Tooltip title="MDVita patient">
          <IconButton
            size="small"
            color="success"
            onClick={onOpenProfile}
            sx={{ width: ICON_W, height: ICON_W, p: 0.5 }}
          >
            <MergeIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ) : (
        <Box sx={{ width: ICON_W, height: ICON_W }} />
      )}

      <Box component="span">{name}</Box>
    </Box>
  );
});

export default PatientCell;
