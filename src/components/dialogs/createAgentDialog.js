import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Typography, Stack,
  MenuItem, Box, FormControlLabel, Checkbox
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DepartmentSelect from '../components/departmentSelect';

const roles = ['Agent', 'Supervisor', 'Admin'];

const validationSchema = Yup.object({
  agentName: Yup.string().required('Display name is required'),
  agentEmail: Yup.string().email('Enter a valid email').required('Email is required'),
  agentRol: Yup.string().required('Role is required'),
  agentDepartment: Yup.string().required('Department is required'),
  agentExtension: Yup.string()
    .matches(/^\d{3,6}$/, 'Extension must be 3 to 6 digits')
    .nullable(),
});

export default function CreateAgentDialog({ open, onClose, handleOnSubmit }) {
  const formik = useFormik({
    initialValues: {
      agentName: '',
      agentEmail: '',
      agentRol: '',
      agentDepartment: '',
      remoteAgent: false,
      agentExtension: '',
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      handleOnSubmit(values);
      resetForm();
      onClose();
    },
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>New Agent</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          <Stack spacing={2}>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
              <Box sx={{ width: 8, height: 24, borderRadius: 10, backgroundColor: '#00a1ff' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#00a1ff' }}>Agent Information</Typography>
            </Box>

            <TextField
              size="small"
              label="Display Name"
              fullWidth
              name="agentName"
              value={formik.values.agentName}
              onChange={formik.handleChange}
              error={formik.touched.agentName && Boolean(formik.errors.agentName)}
              helperText={formik.touched.agentName && formik.errors.agentName}
            />

            <TextField
              size="small"
              label="Email"
              fullWidth
              name="agentEmail"
              value={formik.values.agentEmail}
              onChange={formik.handleChange}
              error={formik.touched.agentEmail && Boolean(formik.errors.agentEmail)}
              helperText={formik.touched.agentEmail && formik.errors.agentEmail}
            />

            <TextField
              size="small"
              label="Role"
              select
              fullWidth
              name="agentRol"
              value={formik.values.agentRol}
              onChange={formik.handleChange}
              error={formik.touched.agentRol && Boolean(formik.errors.agentRol)}
              helperText={formik.touched.agentRol && formik.errors.agentRol}
            >
              {roles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </TextField>

            <DepartmentSelect
              value={formik.values.agentDepartment}
              onChange={(val) => formik.setFieldValue('agentDepartment', val)}
              error={formik.touched.agentDepartment && Boolean(formik.errors.agentDepartment)}
              helperText={formik.touched.agentDepartment && formik.errors.agentDepartment}
            />

            <TextField
              size="small"
              label="Extension"
              fullWidth
              name="agentExtension"
              value={formik.values.agentExtension}
              onChange={formik.handleChange}
              error={formik.touched.agentExtension && Boolean(formik.errors.agentExtension)}
              helperText={formik.touched.agentExtension && formik.errors.agentExtension}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formik.values.remoteAgent}
                  onChange={(e) =>
                    formik.setFieldValue('remoteAgent', e.target.checked)
                  }
                />
              }
              label="Remote Agent"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Create</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
