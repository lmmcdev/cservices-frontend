import React, { useReducer, useState } from 'react';
import {
  Box, Paper, Grid, Card, CardContent, Typography,
  TextField, Checkbox, FormControlLabel, Button
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import ProfilePic from '../components/components/profilePic';
import DepartmentSelect from '../components/components/departmentSelect';
import RolSelect from '../components/components/rolSelect';
import AlertSnackbar from '../components/auxiliars/alertSnackbar';
import { ticketReducer, initialState } from '../store/ticketsReducer';
import { useLoading } from '../providers/loadingProvider';
import { editAgent } from '../utils/api';
import { useGraphEmailCheck } from '../utils/useGraphEmailCheck';
import { useAuth } from '../context/authContext';

const AgentSchema = Yup.object().shape({
  displayName: Yup.string().required('Required'),
  department: Yup.string().required('Required'),
  location: Yup.string(),
  role: Yup.string().required('Required'),
  accessLevel: Yup.string(),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string(),
  isRemote: Yup.boolean(),
});

export default function EditAgent() {
  const { verifyEmailExists } = useGraphEmailCheck();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const supEmail = user.username;

  const [, dispatch] = useReducer(ticketReducer, initialState);
  const { setLoading } = useLoading();

  const [errorOpen, setErrorOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const agent = location.state?.agents;
  const agent_id = agent.id;
  const agentEmail = agent.agent_email;

  const initialValues = {
    displayName: agent?.agent_name || '',
    department: agent?.agent_department || '',
    location: '',
    role: agent?.agent_rol || '',
    accessLevel: '',
    email: agent?.agent_email || '',
    isRemote: agent?.remote_agent || false,
  };

  const handleSubmit = async (values) => {
    const exists = await verifyEmailExists(values.email);
    if (!exists) {
      setErrorMessage(`Email ${values.email} not found in Office365`);
      setErrorOpen(true);
      return;
    }
    let form = { ...values, agent_id, supEmail };
    setLoading(true);
    const result = await editAgent(dispatch, setLoading, form);
    if (result.success) {
      setSuccessMessage(result.message);
      setSuccessOpen(true);
    } else {
      setErrorMessage(result.message);
      setErrorOpen(true);
    }
  };

  return (
    <>
      <Card
        sx={{
          borderRadius: 4,
          position: 'fixed',
          top: 150,
          left: 200,
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
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <Formik
          initialValues={initialValues}
          validationSchema={AgentSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, setFieldValue }) => (
            <Form>
              <Grid container spacing={3}>
                {/* Columna Izquierda */}
                <Grid item xs={8} md={4}>
                  <Box display="flex" flexDirection="column" gap={2} alignItems="center">
                    {/* Perfil */}
                    <Card variant="outlined">
                      <CardContent sx={{ p: '20px 25px 25px 30px' }}>
                        {/* Header visual */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <Box
                            sx={{
                              width: 8,
                              height: 24,
                              borderRadius: 10,
                              backgroundColor: '#00A1FF',
                            }}
                          />
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#00A1FF' }}>
                            Agent Profile
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                          {/* Avatar a la izquierda */}
                          <Box sx={{ minWidth: 80 }}>
                            <ProfilePic email={agentEmail} size={80} />
                          </Box>

                          {/* Campos a la derecha */}
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '540px' }}>
                            <TextField
                              name="displayName"
                              label="Display Name"
                              fullWidth
                              value={values.displayName}
                              onChange={handleChange}
                              error={touched.displayName && Boolean(errors.displayName)}
                              helperText={touched.displayName && errors.displayName}
                            />

                            <DepartmentSelect
                              value={values.department}
                              onChange={(val) => setFieldValue('department', val)}
                              error={touched.department && Boolean(errors.department)}
                              helperText={touched.department && errors.department}
                              sx={{ width: '540px' }}
                            />

                            <RolSelect
                              name="role"
                              label="Role"
                              value={values.role}
                              onChange={(val) => setFieldValue('role', val)}
                              error={touched.role && Boolean(errors.role)}
                              helperText={touched.role && errors.role}
                              sx={{ width: '540px' }}
                            />

                            <TextField
                              name="location"
                              label="Location"
                              fullWidth
                              value={values.location}
                              onChange={handleChange}
                              error={touched.location && Boolean(errors.location)}
                              helperText={touched.location && errors.location}
                            />

                            <TextField
                              name="accessLevel"
                              label="Access Level"
                              fullWidth
                              value={values.accessLevel}
                              onChange={handleChange}
                              error={touched.accessLevel && Boolean(errors.accessLevel)}
                              helperText={touched.accessLevel && errors.accessLevel}
                            />
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                </Grid>

                {/* Columna Derecha */}
                <Grid item xs={8} md={8}>
                  <Box display="flex" flexDirection="column" gap={2} alignItems="center">
                    {/* Credenciales */}
                    <Card variant="outlined">
                      <CardContent sx={{ p: '20px 25px 25px 30px' }}>
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                          <Box
                            sx={{
                              width: 8,
                              height: 24,
                              borderRadius: 10,
                              backgroundColor: '#00A1FF',
                            }}
                          />
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
                        />
                      </CardContent>
                    </Card>

                    {/* Remote Status */}
                    <Card variant="outlined">
                      <CardContent sx={{ p: '20px 25px 25px 30px' }}>
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                          <Box
                            sx={{
                              width: 8,
                              height: 24,
                              borderRadius: 10,
                              backgroundColor: '#00A1FF',
                            }}
                          />
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

                    {/* Botones */}
                    <Box display="flex" justifyContent="flex-end" gap={2}>
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
