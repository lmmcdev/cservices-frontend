import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

// 📍 Listas de ejemplo para FL
const floridaCities = ['Miami', 'Orlando', 'Tampa', 'Jacksonville'];
const floridaCounties = ['Miami‑Dade County', 'Orange County', 'Hillsborough County', 'Duval County'];
const zipCodesByCounty = {
  'Miami‑Dade County': ['33135', '33136', '33137'],
  'Orange County': ['32801', '32803', '32804'],
  'Hillsborough County': ['33602', '33603'],
  'Duval County': ['32202', '32203'],
};

const ProviderEditSchema = Yup.object().shape({
  ProvidOrg: Yup.string(),
  firstName: Yup.string().required('Requerido'),
  lastName: Yup.string().required('Requerido'),
  title: Yup.string(),
  effectiveTo: Yup.date().nullable(),
  providerName: Yup.string().required('Requerido'),
  officeAddress: Yup.string().required('Requerido'),
  officeCity: Yup.string().required('Requerido'),
  officeState: Yup.string().oneOf(['FL']).required('Requerido'),
  officeCounty: Yup.string().required('Requerido'),
  officeZip: Yup.string().required('Requerido'),
  officePhone: Yup.string().matches(/^\d+$/, 'Solo dígitos').required('Requerido'),
  officeFax: Yup.string().matches(/^\d*$/, 'Solo dígitos'),
  email: Yup.string().email('Email inválido'),
  inHouse: Yup.boolean(),
  taxonomyCode: Yup.string().required('Requerido'),
  taxonomyDesc: Yup.string().required('Requerido'),
  billingName: Yup.string(),
  billingOrg: Yup.string(),
  billingAddress1: Yup.string(),
  billingAddress2: Yup.string(),
  billingCity: Yup.string(),
  billingState: Yup.string().oneOf(['FL']),
  billingZip: Yup.string(),
  billingCounty: Yup.string(),
});

export default function ProviderEditForm({ initialData, onSubmit }) {
  const [counties, setCounties] = useState([]);
  const [zips, setZips] = useState([]);
  const [selectedCounty, setSelectedCounty] = useState(initialData['Office County Name'] || '');

  console.log(initialData)
  useEffect(() => {
    setCounties(floridaCounties);
    if (initialData['Office County Name']) {
      const arr = zipCodesByCounty[initialData['Office County Name']] || [];
      setZips(arr);
    }
  }, [initialData]);

  useEffect(() => {
    const arr = zipCodesByCounty[selectedCounty] || [];
    setZips(arr);
  }, [selectedCounty]);

  return (
    <Formik
      initialValues={{
        ProvidOrg: initialData.ProvidOrg || '',
        firstName: initialData['First Name'] || '',
        lastName: initialData['Last Name'] || '',
        title: initialData.Title || '',
        effectiveTo: initialData['Effective To'] || '',
        providerName: initialData['Provider Name'] || '',
        officeAddress: initialData['Office Address'] || '',
        officeCity: initialData['Office City'] || '',
        officeState: 'FL',
        officeCounty: initialData['Office County Name'] || '',
        officeZip: initialData['Office Zip'] ? String(initialData['Office Zip']) : '',
        officePhone: initialData['Office Phone'] ? String(initialData['Office Phone']) : '',
        officeFax: initialData['Office Fax'] ? String(initialData['Office Fax']) : '',
        email: initialData.Email || '',
        inHouse: initialData.InHouse === 'TRUE',
        taxonomyCode: initialData['Taxonomy Code'] || '',
        taxonomyDesc: initialData['Taxonomy Description'] || '',
        billingName: initialData['Billing Pay To Name'] || '',
        billingOrg: initialData['Billing Pay To Organization'] || '',
        billingAddress1: initialData['Billing Pay To Address1'] || '',
        billingAddress2: initialData['Billing Pay To Address2'] || '',
        billingCity: initialData['Billing Pay To City'] || '',
        billingState: initialData['Billing Pay To State'] || 'FL',
        billingZip: initialData['Billing Pay To Zip'] || '',
        billingCounty: initialData['Billing Pay To County'] || '',
      }}
      validationSchema={ProviderEditSchema}
      onSubmit={(values) => onSubmit(values)}
      enableReinitialize={true}
    >
      {({ values, errors, touched, handleChange, setFieldValue }) => (
        <Form>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField name="ProvidOrg" label="Org" value={values.ProvidOrg} onChange={handleChange} />
            <TextField name="firstName" label="First Name" value={values.firstName} onChange={handleChange}
              error={touched.firstName && !!errors.firstName} helperText={errors.firstName} />

            <TextField name="lastName" label="Last Name" value={values.lastName} onChange={handleChange}
              error={touched.lastName && !!errors.lastName} helperText={errors.lastName} />

            <TextField name="title" label="Title" value={values.title} onChange={handleChange} />

            <FormControl error={touched.effectiveTo && !!errors.effectiveTo}>
              <TextField type="date" name="effectiveTo" label="Effective To" value={values.effectiveTo}
                InputLabelProps={{ shrink: true }} onChange={handleChange}
                helperText={errors.effectiveTo} />
            </FormControl>

            <TextField name="providerName" label="Provider Name" value={values.providerName} onChange={handleChange}
              error={touched.providerName && !!errors.providerName} helperText={errors.providerName}
            />

            <TextField name="officeAddress" label="Office Address" value={values.officeAddress} onChange={handleChange}
              error={touched.officeAddress && !!errors.officeAddress} helperText={errors.officeAddress} />

            <FormControl error={touched.officeCity && !!errors.officeCity}>
              <InputLabel>CITY</InputLabel>
              <Select name="officeCity" value={values.officeCity} onChange={handleChange} label="CITY">
                {floridaCities.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </Select>
              <FormHelperText>{errors.officeCity}</FormHelperText>
            </FormControl>

            <FormControl disabled>
              <InputLabel>State</InputLabel>
              <Select name="officeState" value="FL" label="State">
                <MenuItem value="FL">Florida</MenuItem>
              </Select>
            </FormControl>

            <FormControl error={touched.officeCounty && !!errors.officeCounty}>
              <InputLabel>County</InputLabel>
              <Select
                name="officeCounty"
                value={values.officeCounty}
                onChange={(e) => {
                  handleChange(e);
                  setSelectedCounty(e.target.value);
                  setFieldValue('officeZip', ''); // Resetea el ZIP cuando cambia el county
                }}
                label="County"
              >
                {counties.map(ct => <MenuItem key={ct} value={ct}>{ct}</MenuItem>)}
              </Select>
              <FormHelperText>{errors.officeCounty}</FormHelperText>
            </FormControl>

            <FormControl error={touched.officeZip && !!errors.officeZip}>
              <InputLabel>Zip Code</InputLabel>
              <Select name="officeZip" value={values.officeZip} onChange={handleChange} label="Zip Code">
                {zips.map(zc => <MenuItem key={zc} value={zc}>{zc}</MenuItem>)}
              </Select>
              <FormHelperText>{errors.officeZip}</FormHelperText>
            </FormControl>

            <TextField name="officePhone" label="Office Phone" value={values.officePhone} onChange={handleChange}
              error={touched.officePhone && !!errors.officePhone} helperText={errors.officePhone} />

            <TextField name="officeFax" label="Office Fax" value={values.officeFax} onChange={handleChange}
              error={touched.officeFax && !!errors.officeFax} helperText={errors.officeFax} />

            <TextField name="email" label="Email" type="email" value={values.email} onChange={handleChange}
              error={touched.email && !!errors.email} helperText={errors.email} />

            <FormControl>
              <InputLabel>In House?</InputLabel>
              <Select name="inHouse" value={values.inHouse ? 'true' : 'false'} onChange={e => setFieldValue('inHouse', e.target.value === 'true')}
                label="In House">
                <MenuItem value="true">TRUE</MenuItem>
                <MenuItem value="false">FALSE</MenuItem>
              </Select>
            </FormControl>

            <TextField name="taxonomyCode" label="Taxonomy Code" value={values.taxonomyCode} onChange={handleChange}
              error={touched.taxonomyCode && !!errors.taxonomyCode} helperText={errors.taxonomyCode} />

            <TextField name="taxonomyDesc" label="Taxonomy Description" fullWidth
              value={values.taxonomyDesc} onChange={handleChange}
              error={touched.taxonomyDesc && !!errors.taxonomyDesc} helperText={errors.taxonomyDesc} />

            {/* Billing fields similares */}
            <TextField name="billingName" label="Billing Pay To Name" value={values.billingName} onChange={handleChange} />
            <TextField name="billingOrg" label="Billing Pay To Org" value={values.billingOrg} onChange={handleChange} />
            <TextField name="billingAddress1" label="Billing Address1" value={values.billingAddress1} onChange={handleChange} />
            <TextField name="billingAddress2" label="Billing Address2" value={values.billingAddress2} onChange={handleChange} />
            <TextField name="billingCity" label="Billing City" value={values.billingCity} onChange={handleChange} />
            <TextField name="billingState" label="Billing State" value="FL" disabled />
            <TextField name="billingZip" label="Billing Zip" value={values.billingZip} onChange={handleChange} />
            <TextField name="billingCounty" label="Billing County" value={values.billingCounty} onChange={handleChange} />

            <Box sx={{ gridColumn: 'span 2', textAlign: 'right', mt: 2 }}>
              <Button type="submit" variant="contained">Guardar</Button>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
}
