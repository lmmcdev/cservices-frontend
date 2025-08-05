import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Grid, Card, CardContent, Typography,
  TextField, Checkbox, FormControlLabel, Button,
  IconButton, Tooltip
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import ProfilePic from '../components/components/profilePic';
import DepartmentSelect from '../components/components/fields/departmentSelect';
import RolSelect from '../components/components/fields/rolSelect';
import AlertSnackbar from '../components/auxiliars/alertSnackbar';

import { useLoading } from '../providers/loadingProvider';
import { useAuth } from '../context/authContext';
import { useAgents } from '../context/agentsContext';
import { useGraphEmailCheck } from '../utils/useGraphEmailCheck';

import { updateAgent } from '../utils/js/agentActions';

import PersonOffIcon from '@mui/icons-material/PersonOff';

//import { useSidebar } from '../context/sidebarContext';

const AgentSchema = Yup.object().shape({
  displayName: Yup.string().required('Required'),
  department: Yup.string().required('Required'),
  location: Yup.string(),
  role: Yup.string().required('Required'),
  accessLevel: Yup.string(),
  email: Yup.string().email('Invalid email').required('Required'),
  isRemote: Yup.boolean(),
  isDisable: Yup.boolean(),
});

export default function EditAgent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { setLoading } = useLoading();
    const { verifyEmailExists } = useGraphEmailCheck();
    const { state, dispatch } = useAgents();

    const supEmail = user?.username;
    const agent = state.agents.find(a => a.id === id );
    const agent_id = agent?.id;

    const [errorOpen, setErrorOpen] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    
    //const { open } = useSidebar();

    const agentEmail = agent.agent_email;

    const initialValues = {
      displayName: agent?.agent_name || '',
      department: agent?.agent_department || '',
      location: '', // No disponible en state, lo puedes adaptar
      role: agent?.agent_rol || '',
      accessLevel: '', // Adaptar según tu modelo
      email: agent?.agent_email || '',
      isRemote: agent?.remote_agent || false,
       isDisable: agent.is_disabled || false,
    };

  const handleSubmit = async (values) => {
    console.log(values)
    const data = {
      values,
      verifyEmailExists,
      agentId: agent_id,
      supEmail: supEmail,
      dispatch,
      setLoading,
      setSuccessMessage,
      setErrorMessage,
      setSuccessOpen,
      setErrorOpen
    };
    await updateAgent(data);
    
  };

    //console.log(agent.id)
    // Aquí puedes llamar tu Azure Function o API para actualizar el agente


  return (
    <>
      <Card
        sx={{
          borderRadius: 4,
          position: 'fixed',
          top: 150,
          left: 220,
          transition: 'left 0.3s ease',
          right: 20,
          bottom: 20,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0px 8px 24px rgba(239, 241, 246, 1)',
          backgroundColor: '#fff',
        }}
      >
        <CardContent
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ flex: 1, overflowY: 'auto', mt: 4 }}>
        <Formik
          initialValues={initialValues}
          validationSchema={AgentSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, setFieldValue }) => (
            <Form>
              <Grid
                container
                spacing={3}
                justifyContent="center"
                alignItems="flex-start"
              >
                {/* Columna Izquierda */}
                <Grid item xs={12} md={5}>
                  <Box display="flex" flexDirection="column" gap={2} alignItems="center">
                    {/* Agent Profile */}
                    <Card variant="outlined">
                      <CardContent sx={{ p: '20px 25px 25px 30px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <Box sx={{ width: 8, height: 24, borderRadius: 10, backgroundColor: '#00A1FF' }} />
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#00A1FF' }}>
                            Agent Profile
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                          <Box sx={{ minWidth: 80 }}>
                            <ProfilePic email={agentEmail} size={80} />
                          </Box>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.2, width: '540px', height: '354px' }}>
                            <TextField
                              name="displayName"
                              label="Display Name"
                              fullWidth
                              value={values.displayName}
                              onChange={handleChange}
                              error={touched.displayName && Boolean(errors.displayName)}
                              helperText={touched.displayName && errors.displayName}
                              sx={{ height: '56px',
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
                            <DepartmentSelect
                              value={values.department}
                              onChange={(val) => setFieldValue('department', val)}
                              error={touched.department && Boolean(errors.department)}
                              helperText={touched.department && errors.department}
                              sx={{
                                width: '540px',
                                '& .MuiInputLabel-root': {
                                  fontSize: '16px',
                                },
                                '& .MuiSelect-select': {
                                  fontSize: '16px',
                                  padding: '14px',
                                },
                                height: '56px'
                              }}
                            />
                            <RolSelect
                              name="role"
                              label="Role"
                              value={values.role}
                              onChange={(val) => setFieldValue('role', val)}
                              error={touched.role && Boolean(errors.role)}
                              helperText={touched.role && errors.role}
                              sx={{
                                width: '540px',
                                '& .MuiInputLabel-root': {
                                  fontSize: '16px',
                                },
                                '& .MuiSelect-select': {
                                  fontSize: '16px',
                                  padding: '14px',
                                },
                                height: '56px'
                              }}
                            />
                            <TextField
                              name="location"
                              label="Location"
                              fullWidth
                              value={values.location}
                              onChange={handleChange}
                              error={touched.location && Boolean(errors.location)}
                              helperText={touched.location && errors.location}
                              InputLabelProps={{ shrink: true }}
                              sx={{ height: '56px',
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
                            <TextField
                              name="accessLevel"
                              label="Access Level"
                              fullWidth
                              value={values.accessLevel}
                              onChange={handleChange}
                              error={touched.accessLevel && Boolean(errors.accessLevel)}
                              helperText={touched.accessLevel && errors.accessLevel}
                              InputLabelProps={{ shrink: true }}
                              sx={{ height: '56px',
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
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                </Grid>

                {/* Columna Derecha */}
                <Grid item xs={12} md={5}>
                  <Box display="flex" flexDirection="column" gap={2} alignItems="center">
                    {/* Account Credentials */}
                    <Card variant="outlined" sx={{ width: '350px' }}>
                      <CardContent sx={{ p: '20px 25px 25px 30px' }}>
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                          <Box sx={{ width: 8, height: 24, borderRadius: 10, backgroundColor: '#00A1FF' }} />
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#00A1FF' }}>
                            Account Credentials
                          </Typography>
                        </Box>
                        <TextField
                          name="email"
                          label="Email"
                          fullWidth
                          value={values.email}
                          onChange={handleChange}
                          error={touched.email && Boolean(errors.email)}
                          helperText={touched.email && errors.email}
                          sx={{ height: '56px',
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

                    {/* Work Arrangement */}
                    <Card variant="outlined" sx={{ width: '350px' }}>
                      <CardContent sx={{ p: '20px 25px 25px 30px' }}>
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                          <Box sx={{ width: 8, height: 24, borderRadius: 10, backgroundColor: '#00A1FF' }} />
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#00A1FF' }}>
                            Work Arrangement
                          </Typography>
                        </Box>
                        <FormControlLabel
                          control={
                            <Checkbox
                              name="isRemote"
                              checked={values.isRemote}
                              onChange={handleChange}
                            />
                          }
                          label="Remote Agent"
                        />
                      </CardContent>
                    </Card>

                    {/* Disabled Agent */}
                    <Card variant="outlined" sx={{ width: '350px' }}>
                      <CardContent sx={{ p: '20px 25px 25px 30px' }}>
                        <Box mb={2}>
                          {/* Header con botón alineado a la derecha */}
                          <Box display="flex" alignItems="center" justifyContent="space-between">
                            {/* Título */}
                            <Box display="flex" alignItems="center" gap={1}>
                              <Box sx={{ width: 8, height: 24, borderRadius: 10, backgroundColor: '#00A1FF' }} />
                              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#00A1FF' }}>
                                Account Status
                              </Typography>
                            </Box>

                            {/* Botón con tooltip */}
                            <Tooltip title="Deactivate">
                              <span>
                                <IconButton
                                  onClick={() => setFieldValue("isDisable", true)}
                                  disabled={!values.email}
                                  sx={{
                                    color: values.email ? '#00A1FF' : '#B0B0B0',
                                    cursor: values.email ? 'pointer' : 'not-allowed',
                                  }}
                                >
                                  <PersonOffIcon />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </Box>

                          {/* Estado visual debajo */}
                          <Box display="flex" alignItems="center" gap={1} mt={1} ml={'15px'}>
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                backgroundColor: values.email ? 'success.main' : 'error.main',
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{ color: values.email ? 'success.main' : 'error.main', fontWeight: 'bold' }}
                            >
                              {values.email ? 'Enabled' : 'Deactivated'}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>

                    {/* Botones */}
                    <Box display="flex" justifyContent="flex-end" gap={2} sx={{ width: '100%' }}>
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
                        Save
                      </Button>
                      <Button
                        onClick={() => navigate(-1)}
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
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </CardContent>
  </Card>


      <AlertSnackbar
        open={errorOpen}
        onClose={() => setErrorOpen(false)}
        severity="error"
        message={errorMessage}
      />
      <AlertSnackbar
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        severity="success"
        message={successMessage}
      />
    </>
  );
}