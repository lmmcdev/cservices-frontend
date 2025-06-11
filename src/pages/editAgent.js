import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  Box, Paper, Grid, Card, CardContent, Typography,
  TextField, Checkbox, FormControlLabel, Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import ProfilePic from '../components/components/profilePic';
import DepartmentSelect from '../components/components/departmentSelect';
import RolSelect from '../components/components/rolSelect';
import AlertSnackbar from '../components/auxiliars/alertSnackbar';
import { useLoading } from '../providers/loadingProvider';
import { editAgent } from '../utils/api';
import { useGraphEmailCheck } from '../utils/useGraphEmailCheck';
import { useAuth } from '../context/authContext';
import { useAgents } from '../context/agentsContext';


// Validación con Yup
const AgentSchema = Yup.object().shape({
  displayName: Yup.string().required('Required'),
  department: Yup.string().required('Required'),
  location: Yup.string(),
  role: Yup.string().required('Required'),
  accessLevel: Yup.string(),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string(),
  isRemote: Yup.boolean(),
  isDisable: Yup.boolean(),
});

export default function EditAgent() {
    const { verifyEmailExists } = useGraphEmailCheck();
    const navigate = useNavigate();
    //user logueado desde el contexto
    const { user } = useAuth();
    const supEmail = user.username;
    const { agent_email } = useParams();
    
    
    //const [, dispatch] = useReducer(ticketReducer, initialState);
    const { setLoading } = useLoading();

    const [errorOpen, setErrorOpen] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    

    //const { agentEmail } = useParams();
    const {state: agentsAll, dispatch } = useAgents();
    const agents = agentsAll.agents
    const agent = agents.find(a => a.agent_email === agent_email);
    const agent_id = agent.id;

    const initialValues = {
      displayName: agent?.agent_name || '',
      department: agent?.agent_department || '',
      location: '', // No disponible en state, lo puedes adaptar
      role: agent?.agent_rol || '',
      accessLevel: '', // Adaptar según tu modelo
      email: agent?.agent_email || '',
      isRemote: agent?.remote_agent || false,
      isDisable: agent?.disable_agent || false
    };

  const handleSubmit = async (values) => {
    //console.log(values)
    const exists = await verifyEmailExists(values.email);
    if (!exists) {
      setErrorMessage(`Email ${values.email} not found in Office365`);
      setErrorOpen(true);
      return;
    }
    let form = {...values, agent_id, supEmail }
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
    //console.log(agent.id)
    // Aquí puedes llamar tu Azure Function o API para actualizar el agente


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
                      <ProfilePic email={values.email}/>
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
                        name="role"
                        label="Role"
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
                      error={touched.location && Boolean(errors.location)}
                      helperText={touched.location && errors.location}
                      sx={{ mb: 2 }}
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
                  </CardContent>
                </Card>
              </Grid>

              {/* Panel derecho */}
              <Grid item xs={8} md={8}>
                <Box display="flex" flexDirection="column" gap={2}>
                  {/* Credenciales */}
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

                  {/* Remote Agent */}
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

                  {/* Status Agent */}
                  <Card variant="outlined">
                    <CardContent>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="isDisable"
                            checked={values.disable_agent}
                            onChange={handleChange}
                          />
                        }
                        label="Disabled agent"
                      />
                    </CardContent>
                  </Card>

                  {/* Botones */}
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

    {/* Snackbars */}
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
