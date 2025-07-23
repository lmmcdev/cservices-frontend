import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';

export default function TicketLinkOptions({
  ticket,
  onRelateCurrentTicket,
  onRelateAllPastTickets,
  onRelateFutureTickets,
  onUnlinkTicket,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  if (!ticket) return null;

  return (
    <>
      <Tooltip title="Link Options">
        <IconButton
          size="small"
          onClick={handleOpenMenu}
          sx={{ color: '#00a1ff' }}
        >
          <LinkIcon />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem
          onClick={() => {
            handleCloseMenu();
            onRelateCurrentTicket(ticket);
          }}
        >
          Relate this ticket
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleCloseMenu();
            onRelateAllPastTickets(ticket);
          }}
        >
          Relate all past tickets (by phone)
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleCloseMenu();
            onRelateFutureTickets(ticket);
          }}
        >
          Auto-relate future tickets (by phone)
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleCloseMenu();
            onUnlinkTicket(ticket);
          }}
        >
          Unlink this ticket
        </MenuItem>
      </Menu>
    </>
  );
}
