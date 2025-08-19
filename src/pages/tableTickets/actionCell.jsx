import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import { icons } from "../../components/auxiliars/icons";

const ActionCell = React.memo(function ActionCell({
  isAssigned,
  onEdit,
  onAssignToMe,
}) {
  return (
    <Box display="flex" justifyContent="center" gap={1}>
      {isAssigned ? (
        <Tooltip title="Edit">
          <Box
            sx={{
              backgroundColor: "#DFF3FF",
              color: "#00A1FF",
              borderRadius: "50%",
              p: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              transition: "background-color 0.3s",
              "&:hover": {
                backgroundColor: "#00A1FF",
                color: "#fff",
                cursor: "pointer",
              },
            }}
            onClick={onEdit}
          >
            <icons.edit sx={{ fontSize: 16 }} />
          </Box>
        </Tooltip>
      ) : (
        <Tooltip title="Assign to me">
          <IconButton
            onClick={onAssignToMe}
            sx={{
              backgroundColor: "#daf8f4",
              color: "#00b8a3",
              borderRadius: "50%",
              p: 1,
              width: 32,
              height: 32,
              transition: "background-color 0.3s",
              "&:hover": { backgroundColor: "#00b8a3", color: "#fff" },
            }}
          >
            <icons.assignToMe size={16} />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
});

export default ActionCell;
