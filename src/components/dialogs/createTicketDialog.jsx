import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, Typography, Stack,
  MenuItem, Box, Divider, TextField
} from '@mui/material';
import DepartmentSelect from '../fields/departmentSelect';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ActionButtons from '../fields/actionButtons';

const statusOptions = ['Emergency', 'In Progress', 'Pending', 'Done'];

const validationSchema = Yup.object({
  phone: Yup.string()
    .required('Phone is required')
    .matches(/^\+1\d{10}$/, 'Enter a valid US phone number'),
  patientName: Yup.string().required('Patient name is required'),
  patientDOB: Yup.date().typeError('Enter a valid date').required('Date of birth is required'),
  callDepartment: Yup.string().required('Department is required'),
  callReason: Yup.string().required('Call reason is required'),
  summary: Yup.string().required('Summary is required'),
  status: Yup.string().required('Status is required'),
  notes: Yup.string().required('Notes are required'),
});

const formatPhone = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  const parts = [];
  if (digits.length > 0) parts.push('(' + digits.slice(0, 3));
  if (digits.length >= 4) parts[0] += ') ';
  if (digits.length >= 4) parts.push(digits.slice(3, 6));
  if (digits.length >= 7) parts.push('-' + digits.slice(6, 10));
  return parts.join('');
};

export default function CreateTicketDialog({ open, onClose, handleOnSubmit, agentEmail }) {
 /* const normalizePhoneNumber = (formatted) => {
  return formatted.replace(/\D/g, '').slice(0, 10); // solo dígitos, sin +1
};*/


const formik = useFormik({
  initialValues: {
    phone: '',
    phoneFormatted: '',
    patientName: '',
    patientDOB: '',
    callDepartment: '',
    callReason: '',
    summary: '',
    status: 'In Progress',
    notes: '',
  },
  validationSchema,
    onSubmit: (values) => {
      const rawDigits = values.phoneFormatted.replace(/\D/g, '').slice(0, 10);
      const international = rawDigits.length === 10 ? `+1${rawDigits}` : '';

      handleOnSubmit({
        ...values,
        phone: international,
        createdBy: agentEmail,
        agent_assigned: agentEmail
      });
      onClose();
    }
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <i className="bi bi-telephone-plus-fill" style={{ color: '#00a1ff', fontSize: 20 }}></i>
          <Typography variant="h6" sx={{ color: '#00a1ff', fontWeight: 'bold' }}>
            New case
          </Typography>
        </Box>
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          <Stack spacing={2}>
            {/* Patient Info */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
              <Box sx={{ width: 8, height: 24, borderRadius: 10, backgroundColor: '#00a1ff' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#00a1ff' }}>
                Patient Information
              </Typography>
            </Box>

            <TextField
              size="small"
              label="Phone"
              fullWidth
              name="phone"
              value={formik.values.phoneFormatted}
              onChange={(e) => {
                const rawDigits = e.target.value.replace(/\D/g, '').slice(0, 10);
                const formatted = formatPhone(rawDigits);
                const international = rawDigits.length === 10 ? `+1${rawDigits}` : '';
                formik.setFieldValue('phone', international); // real value
                formik.setFieldValue('phoneFormatted', formatted); // visual
              }}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
              inputProps={{ maxLength: 14 }}
              InputProps={{
                startAdornment: (
                  <Typography sx={{ mr: 1, color: '#888' }}>
                    +1
                  </Typography>
                ),
              }}
            />

            <TextField
              size="small"
              label="Patient Name"
              fullWidth
              name="patientName"
              value={formik.values.patientName}
              onChange={formik.handleChange}
              error={formik.touched.patientName && Boolean(formik.errors.patientName)}
              helperText={formik.touched.patientName && formik.errors.patientName}
            />

            <TextField
              size="small"
              label="Patient DOB"
              type="date"
              fullWidth
              name="patientDOB"
              value={formik.values.patientDOB}
              onChange={formik.handleChange}
              InputLabelProps={{ shrink: true }}
              error={formik.touched.patientDOB && Boolean(formik.errors.patientDOB)}
              helperText={formik.touched.patientDOB && formik.errors.patientDOB}
            />

            <Divider />

            {/* Call Info */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
              <Box sx={{ width: 8, height: 24, borderRadius: 10, backgroundColor: '#00a1ff' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#00a1ff' }}>
                Call Information
              </Typography>
            </Box>

            <DepartmentSelect
              value={formik.values.callDepartment}
              onChange={(val) => formik.setFieldValue('callDepartment', val)}
              error={formik.touched.callDepartment && Boolean(formik.errors.callDepartment)}
              helperText={formik.touched.callDepartment && formik.errors.callDepartment}
            />

            <TextField
              label="Call Reason"
              size="small"
              fullWidth
              name="callReason"
              value={formik.values.callReason}
              onChange={formik.handleChange}
              error={formik.touched.callReason && Boolean(formik.errors.callReason)}
              helperText={formik.touched.callReason && formik.errors.callReason}
            />

            <TextField
              label="Summary"
              size="small"
              fullWidth
              multiline
              rows={2}
              name="summary"
              value={formik.values.summary}
              onChange={formik.handleChange}
              error={formik.touched.summary && Boolean(formik.errors.summary)}
              helperText={formik.touched.summary && formik.errors.summary}
            />

            <Divider />

            {/* Case Info */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
              <Box sx={{ width: 8, height: 24, borderRadius: 10, backgroundColor: '#00a1ff' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#00a1ff' }}>
                Case Information
              </Typography>
            </Box>

            <TextField
              label="Status"
              select
              fullWidth
              size="small"
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              error={formik.touched.status && Boolean(formik.errors.status)}
              helperText={formik.touched.status && formik.errors.status}
            >
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Notes"
              size="small"
              fullWidth
              multiline
              rows={2}
              name="notes"
              value={formik.values.notes}
              onChange={formik.handleChange}
              error={formik.touched.notes && Boolean(formik.errors.notes)}
              helperText={formik.touched.notes && formik.errors.notes}
            />
          </Stack>
        </DialogContent>
        <Box display="flex" gap={2} justifyContent="center" sx={{ pt: 3, px: 3 }}>
          <ActionButtons onCancel={onClose} onConfirm={formik.handleSubmit} />
        </Box>
      </form>
    </Dialog>
  );
}
