import React from 'react';
import {
  Box, Paper, Grid, Card, CardContent, Typography,
  TextField, Checkbox, FormControlLabel, Button,
  Divider
} from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import ProfilePic from '../components/components/profilePic';
import DepartmentSelect from '../components/components/departmentSelect';
import RolSelect from '../components/components/rolSelect';

// Validación con Yup
const AgentSchema = Yup.object().shape({
  displayName: Yup.string().required('Required'),
  department: Yup.string().required('Required'),
  location: Yup.string().required('Required'),
  role: Yup.string().required('Required'),
  accessLevel: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string(),
  isRemote: Yup.boolean(),
});

export default function EditAgent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { agentEmail } = useParams();

  const agent = location.state?.agents;

  const initialValues = {
    displayName: agent?.agent_name || '',
    department: agent?.agent_department || '',
    location: '', // No disponible en state, lo puedes adaptar
    role: agent?.agent_rol || '',
    accessLevel: '', // Adaptar según tu modelo
    email: agent?.agent_email || '',
    isRemote: agent?.remote_agent || false,
  };

  const handleSubmit = async (values) => {
    console.log("Submitting agent:", values);
    // Aquí puedes llamar tu Azure Function o API para actualizar el agente
  };

  return (
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
                      <ProfilePic email={agentEmail}/>
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
  );
}
