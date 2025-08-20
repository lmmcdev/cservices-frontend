import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import MergeIcon from "@mui/icons-material/Merge";
import { toMMDDYYYY } from "../../utils/js/formatDateToMMDDYYY";

const ICON_W = 28;

const DOBCell = React.memo(function DOBCell({
  snapshot,
  fallbackName,
  onOpenProfile,
}) {
  const hasIcon = Boolean(snapshot?.DOB);
  const raw = snapshot?.DOB ?? fallbackName ?? "";
  const dob = raw ? toMMDDYYYY(String(raw).slice(0, 10)) : "—";

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
            aria-label="Open patient profile"
          >
            <MergeIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ) : (
        <Box sx={{ width: ICON_W, height: ICON_W }} />
      )}

      <Box component="span">{dob}</Box>
    </Box>
  );
});

export default DOBCell;
