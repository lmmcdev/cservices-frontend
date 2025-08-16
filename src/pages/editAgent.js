import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Grid, Card, CardContent, Typography,
  TextField, Button,
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import ProfilePic from '../components/auxiliars/tickets/profilePic';
import RolSelect from '../components/fields/rolSelect';

import { useAgents } from '../context/agentsContext';

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
    const { state } = useAgents();

    const agent = state.agents.find(a => a.id === id );

    
    //const { open } = useSidebar();

    const agentEmail = agent.agent_email;
    console.log(agent)

    const initialValues = {
      displayName: agent?.agent_name || '',
      department: agent?.agent_department || '',
      location: '', // No disponible en state, lo puedes adaptar
      role: agent?.agent_rol || '',
      accessLevel: agent.group_display_name, // Adaptar según tu modelo
      email: agent?.agent_email || '',
      isRemote: agent?.remote_agent || false,
       isDisable: agent.accountEnabled || false,
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
                              disabled={true}
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
                              name="department"
                              label="Department"
                              fullWidth
                              value={values.department}
                              onChange={handleChange}
                            
                              disabled={true}
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
                              value={values.city}
                              InputLabelProps={{ shrink: true }}
                              disabled={true}
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
                              disabled={true}
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
                          disabled={true}
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
                          </Box>

                          {/* Estado visual debajo */}
                          <Box display="flex" alignItems="center" gap={1} mt={1} ml={'15px'}>
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                backgroundColor: values.isDisable ? 'success.main' : 'error.main',
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{ color: values.isDisable ? 'success.main' : 'error.main', fontWeight: 'bold' }}
                            >
                              {values.isDisable ? 'Enabled' : 'Disabled'}
                            </Typography>
                          </Box>                        </Box>
                      </CardContent>
                    </Card>

                    {/* Botones */}
                    <Box display="flex" justifyContent="flex-end" gap={2} sx={{ width: '100%' }}>
                      
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
                        Back
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


     
    </>
  );
}