import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CakeIcon from '@mui/icons-material/Cake';
import RingVolumeIcon from '@mui/icons-material/RingVolume';
import FmdGoodIcon from '@mui/icons-material/FmdGood';

const SearchPatientUI = () => {
  const [activeFilters, setActiveFilters] = useState([]);

  const searchOptions = [
    { label: 'Date of Birth', value: 'dob', icon: <CakeIcon /> },
    { label: 'Phone', value: 'phone', icon: <RingVolumeIcon /> },
    { label: 'Location', value: 'location', icon: <FmdGoodIcon /> },
  ];

  const toggleFilter = (value) => {
    setActiveFilters((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const hasFilters = activeFilters.length > 0;

  return (
    <Box sx={{ px: 3, pt: 2 }}>
      {/* Header */}
      <Typography variant="h5" fontWeight="bold" mb={1}>
        Search for patients
      </Typography>
      <Typography variant="body1" color="#5B5F7B" mb={3}>
        Start with first and last name. Use the buttons below to search by date of birth, phone, or location if necessary.
      </Typography>

      {/* Name fields and search button */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: hasFilters ? 2.2 : 2.2 }}>
        <TextField
          placeholder="First Name"
          variant="outlined"
          fullWidth
          InputProps={{
            sx: {
              bgcolor: '#f9f9f7',
              borderRadius: 2,
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#00A1FF',
              },
              '&:hover:not(.Mui-focused) .MuiOutlinedInput-notchedOutline': {
                borderColor: '#999999',
              },
            },
          }}
        />
        <TextField
          placeholder="Last Name"
          variant="outlined"
          fullWidth
          InputProps={{
            sx: {
              bgcolor: '#f9f9f7',
              borderRadius: 2,
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#00A1FF',
              },
              '&:hover:not(.Mui-focused) .MuiOutlinedInput-notchedOutline': {
                borderColor: '#999999',
              },
            },
          }}
        />
        <Button
          startIcon={<SearchIcon sx={{ mr: '-5px' }} />}
          sx={{
            width: '250px',
            height: '40px',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#00A1FF',
            backgroundColor: '#DFF3FF',
            border: '2px solid #00A1FF',
            textTransform: 'none',
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: '#00A1FF',
              color: '#FFFFFF',
            },
          }}
        >
          Search
        </Button>
      </Box>

      {/* Extra filter fields */}
      {hasFilters && (
        <>
          {/* DOB y Phone */}
          {(activeFilters.includes('dob') || activeFilters.includes('phone')) && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 2,
                mb: 2,
                flexWrap: 'wrap',
              }}
            >
              {activeFilters.includes('dob') && (
                <TextField
                  type="date"
                  label="Date of Birth"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  sx={{ flex: 1 }}
                  InputProps={{
                    sx: {
                      bgcolor: '#f9f9f7',
                      borderRadius: 2,
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#00A1FF',
                      },
                      '&:hover:not(.Mui-focused) .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#999999',
                      },
                    },
                  }}
                />
              )}
              {activeFilters.includes('phone') && (
                <TextField
                  label="Phone Number"
                  placeholder="e.g. (123) 456-7890"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  sx={{ flex: 1 }}
                  InputProps={{
                    sx: {
                      bgcolor: '#f9f9f7',
                      borderRadius: 2,
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#00A1FF',
                      },
                      '&:hover:not(.Mui-focused) .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#999999',
                      },
                    },
                  }}
                />
              )}
            </Box>
          )}

          {/* Location debajo */}
          {activeFilters.includes('location') && (
            <Box sx={{ mb: 2 }}>
              <TextField
                label="Location"
                placeholder="City, zip code, etc."
                InputLabelProps={{ shrink: true }}
                fullWidth
                InputProps={{
                  sx: {
                    bgcolor: '#f9f9f7',
                    borderRadius: 2,
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#00A1FF',
                    },
                    '&:hover:not(.Mui-focused) .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#999999',
                    },
                  },
                }}
              />
            </Box>
          )}
        </>
      )}

      {/* Chips to toggle filters */}
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        {searchOptions.map((option) => {
          const isActive = activeFilters.includes(option.value);
          return (
            <Chip
              key={option.value}
              onClick={() => toggleFilter(option.value)}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  {React.cloneElement(option.icon, {
                    sx: { fontSize: 18, color: isActive ? '#00A1FF' : '#666' },
                  })}
                  <span style={{ position: 'relative', top: '1px' }}>{option.label}</span>
                </Box>
              }
              sx={{
                borderRadius: '999px',
                border: `1px solid ${isActive ? '#00A1FF' : '#d6d6d6'}`,
                fontWeight: 500,
                backgroundColor: isActive ? '#DFF3FF' : '#fff',
                color: isActive ? '#00A1FF' : '#333',
                px: 1,
                py: 0.5,
                '&:hover': {
                  backgroundColor: '#DFF3FF',
                  borderColor: '#00A1FF',
                  color: '#00A1FF',
                  '& svg': {
                    color: '#00A1FF',
                  },
                },
              }}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default SearchPatientUI;
