import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Typography,
  Box, FormControlLabel, Checkbox,
  Card, CardContent
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import DepartmentSelect from '../auxiliars/departmentSelect';
import { useGraphEmailCheck } from '../../utils/useGraphEmailCheck';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import RolSelect from '../components/rolSelect';

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
  const { verifyEmailExists } = useGraphEmailCheck();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      sx={{
        '& .MuiDialog-paper': {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '900px',
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
          <PersonAddIcon sx={{ color: '#00A1FF' }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#00A1FF' }}>
            Add New Agent
          </Typography>
        </Box>
      </DialogTitle>
      <Formik
        initialValues={{
          agentName: '',
          agentEmail: '',
          agentRol: '',
          agentDepartment: '',
          remoteAgent: false,
          agentExtension: '',
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm, setFieldError }) => {
          const exists = await verifyEmailExists(values.agentEmail);
          if (!exists) {
            setFieldError('agentEmail', 'Email not found in Microsoft 365');
            return;
          }
          handleOnSubmit(values);
          resetForm();
          onClose();
        }}
      >
        {({ values, touched, errors, setFieldValue, handleChange }) => (
          <Form>
            <DialogContent dividers>
              <Box display="flex" gap={4}>
                <Card variant="outlined" sx={{ width: '400px' }}>
                  <CardContent sx={{ p: '20px 25px 25px 30px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Box sx={{ width: 8, height: 24, borderRadius: 10, backgroundColor: '#00A1FF' }} />
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#00A1FF' }}>
                        Agent Profile
                      </Typography>
                    </Box>
                    <Box display="flex" flexDirection="column" gap={2}>
                      <TextField
                        size="small"
                        label="Display Name"
                        fullWidth
                        name="agentName"
                        value={values.agentName}
                        onChange={handleChange}
                        error={touched.agentName && Boolean(errors.agentName)}
                        helperText={touched.agentName && errors.agentName}
                        InputLabelProps={{ shrink: true }}
                        sx={{
                          width: '340px',
                          '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                              borderColor: '#00A1FF',
                            },
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#aaa',
                          },
                        }}
                      />
                      <RolSelect
                        name="role"
                        label="Role"
                        value={values.agentRol}
                        onChange={(val) => setFieldValue('agentRol', val)}
                        error={touched.agentRol && Boolean(errors.agentRol)}
                        helperText={touched.agentRol && errors.agentRol}
                        sx={{
                          width: '340px',
                          '& .MuiInputLabel-root': {
                            fontSize: '16px',
                          },
                          '& .MuiSelect-select': {
                            fontSize: '16px',
                            padding: '10px',
                          },
                          height: '40px',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#aaa',
                          },
                        }}
                      />
                      <DepartmentSelect
                        value={values.agentDepartment}
                        onChange={(val) => setFieldValue('agentDepartment', val)}
                        error={touched.agentDepartment && Boolean(errors.agentDepartment)}
                        helperText={touched.agentDepartment && errors.agentDepartment}
                        sx={{
                          width: '340px',
                          '& .MuiInputLabel-root': {
                            fontSize: '16px',
                          },
                          '& .MuiSelect-select': {
                            fontSize: '16px',
                            padding: '10px',
                          },
                          height: '40px',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#aaa',
                          },
                        }}
                      />
                      <TextField
                        size="small"
                        label="Extension"
                        fullWidth
                        name="agentExtension"
                        value={values.agentExtension}
                        onChange={handleChange}
                        error={touched.agentExtension && Boolean(errors.agentExtension)}
                        helperText={touched.agentExtension && errors.agentExtension}
                        InputLabelProps={{ shrink: true }}
                        sx={{
                          width: '340px',
                          '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                              borderColor: '#00A1FF',
                            },
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#aaa',
                          },
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
                <Box flex={1} display="flex" flexDirection="column" gap={3}>
                  <Card variant="outlined" sx={{ width: '400px' }}>
                    <CardContent sx={{ p: '20px 25px 25px 30px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Box sx={{ width: 8, height: 24, borderRadius: 10, backgroundColor: '#00A1FF' }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#00A1FF' }}>
                          Account Credentials
                        </Typography>
                      </Box>
                      <TextField
                        size="small"
                        label="Email"
                        fullWidth
                        name="agentEmail"
                        value={values.agentEmail}
                        onChange={handleChange}
                        error={touched.agentEmail && Boolean(errors.agentEmail)}
                        helperText={touched.agentEmail && errors.agentEmail}
                        InputLabelProps={{ shrink: true }}
                        sx={{
                          width: '340px',
                          '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                              borderColor: '#00A1FF',
                            },
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#aaa',
                          },
                        }}
                      />
                    </CardContent>
                  </Card>
                  <Card variant="outlined" sx={{ width: '400px' }}>
                    <CardContent sx={{ p: '25px 25px 25px 30px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Box sx={{ width: 8, height: 24, borderRadius: 10, backgroundColor: '#00A1FF' }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#00A1FF' }}>
                          Work Arrangement
                        </Typography>
                      </Box>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={values.remoteAgent}
                            onChange={(e) =>
                              setFieldValue('remoteAgent', e.target.checked)
                            }
                          />
                        }
                        label="Remote Agent"
                      />
                    </CardContent>
                  </Card>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'flex-end', padding: '16px 24px' }}>
              <Button
                type="submit"
                sx={{
                  width: '120px',
                  height: '44px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#00A1FF',
                  backgroundColor: '#DFF3FF',
                  border: '2px solid #00A1FF',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#00A1FF',
                    color: '#FFFFFF',
                  },
                }}
              >
                Create
              </Button>
              <Button
                onClick={onClose}
                sx={{
                  width: '120px',
                  height: '44px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#000',
                  backgroundColor: '#eeeff0',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#B0200C',
                    color: '#FFFFFF',
                  },
                }}
              >
                Cancel
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}