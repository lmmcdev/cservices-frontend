import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Paper, Grid, Card, CardContent, Typography,
  TextField, Checkbox, FormControlLabel, Button
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import ProfilePic from '../components/components/profilePic';
import DepartmentSelect from '../components/components/departmentSelect';
import RolSelect from '../components/components/rolSelect';
import AlertSnackbar from '../components/auxiliars/alertSnackbar';

import { useLoading } from '../providers/loadingProvider';
import { useAuth } from '../context/authContext';
import { useAgents } from '../context/agentsContext';
import { useGraphEmailCheck } from '../utils/useGraphEmailCheck';

import { updateAgent } from '../utils/js/agentActions';

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
  const { agent_email } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setLoading } = useLoading();
  const { verifyEmailExists } = useGraphEmailCheck();
  const { state, dispatch } = useAgents();

  const supEmail = user?.username;
  const agent = state.agents.find(a => a.agent_email === agent_email);
  const agent_id = agent?.id;

  const [errorOpen, setErrorOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!agent) {
    return <Typography sx={{ mt: 10, ml: 10 }}>Agent not found</Typography>;
  }

  const initialValues = {
    displayName: agent.agent_name || '',
    department: agent.agent_department || '',
    location: agent.agent_location || '',
    role: agent.agent_rol || '',
    accessLevel: agent.access_level || '',
    email: agent.agent_email || '',
    isRemote: agent.remote_agent || false,
    isDisable: agent.is_disabled || false,
  };

  const handleSubmit = async (values) => {
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

  return (
    <>
      <Paper elevation={3} sx={{ p: 4, width: '100%', mx: 'auto', mt: 20, ml: 15, mr: 3 }}>
        <Formik
          initialValues={initialValues}
          validationSchema={AgentSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, setFieldValue }) => (
            <Form>
              <Grid container spacing={3}>
                {/* Panel izquierdo */}
                <Grid item xs={8} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box display="flex" justifyContent="center" mb={2}>
                        <ProfilePic email={values.email} />
                      </Box>
                      <TextField
                        name="displayName"
                        label="Display Name"
                        fullWidth
                        value={values.displayName}
                        onChange={handleChange}
                        error={touched.displayName && Boolean(errors.displayName)}
                        helperText={touched.displayName && errors.displayName}
                        sx={{ mb: 2 }}
                      />
                      <DepartmentSelect
                        value={values.department}
                        onChange={(val) => setFieldValue('department', val)}
                        error={touched.department && Boolean(errors.department)}
                        helperText={touched.department && errors.department}
                      />
                      <RolSelect
                        value={values.role}
                        onChange={(val) => setFieldValue('role', val)}
                        error={touched.role && Boolean(errors.role)}
                        helperText={touched.role && errors.role}
                      />
                      <TextField
                        name="location"
                        label="Location"
                        fullWidth
                        value={values.location}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        name="accessLevel"
                        label="Access Level"
                        fullWidth
                        value={values.accessLevel}
                        onChange={handleChange}
                      />
                    </CardContent>
                  </Card>
                </Grid>

                {/* Panel derecho */}
                <Grid item xs={8} md={8}>
                  <Box display="flex" flexDirection="column" gap={2}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                          Account Credentials
                        </Typography>
                        <TextField
                          name="email"
                          label="Email"
                          fullWidth
                          value={values.email}
                          onChange={handleChange}
                          error={touched.email && Boolean(errors.email)}
                          helperText={touched.email && errors.email}
                          sx={{ mb: 2 }}
                        />
                      </CardContent>
                    </Card>

                    <Card variant="outlined">
                      <CardContent>
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

                    <Card variant="outlined">
                      <CardContent>
                        <FormControlLabel
                          control={
                            <Checkbox
                              name="isDisable"
                              checked={values.isDisable}
                              onChange={handleChange}
                            />
                          }
                          label="Disabled agent"
                        />
                      </CardContent>
                    </Card>

                    <Box display="flex" justifyContent="flex-end" gap={2}>
                      <Button variant="contained" type="submit">
                        Guardar Cambios
                      </Button>
                      <Button variant="outlined" onClick={() => navigate(-1)}>
                        Cancelar
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Paper>

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
