import React, { lazy, Suspense, useState, useCallback, useMemo, memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Grid, Card, CardContent, TextField, IconButton, Backdrop, CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import TicketStatusBar from '../components/auxiliars/tickets/ticketStatusBar.jsx';
import AlertSnackbar from '../components/auxiliars/alertSnackbar';
import { useLoading } from '../providers/loadingProvider';
import TicketNotes from '../components/auxiliars/tickets/ticketNotes.jsx';
import TicketCollaborators from '../components/auxiliars/tickets/ticketCollaborators.jsx';
import TicketAudio from '../components/auxiliars/tickets/ticketAudio.jsx';
import TicketAssignee from '../components/auxiliars/tickets/ticketAssignee.jsx';
import Tooltip from '@mui/material/Tooltip';
import { useTicketWorkTimer } from '../components/hooks/useWorkTimer.jsx';
//import { useWorkTimer } from '../components/hooks/useWorkTimer.jsx';
import TicketWorkTime from '../components/auxiliars/tickets/ticketWorkTime.js';
import { useAgents } from '../context/agentsContext';
import { useAuth } from '../context/authContext';
import { useTickets } from '../context/ticketsContext.js';
import { TicketIndicators } from '../components/auxiliars/tickets/ticketIndicators.jsx';
import TicketLinkOptions from '../components/auxiliars/tickets/ticketLinkOptions.jsx';
import { useEditTicketLocalActions } from './editTicketLocal/useEditTicketLocalActions.js';
import { useEditTicketLocalUi } from './editTicketLocal/useEditTicketLocalUI.js';
import { toInputDate } from '../utils/js/date.js';
import PhoneCallLink from '../components/auxiliars/tickets/phoneCallLink.jsx';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import { getStatusColor } from '../utils/js/statusColors.js';

/** ========= Envolturas MEMO para hijos pesados ========= */
const TicketNotesMemo = memo(TicketNotes);
const TicketCollaboratorsMemo = memo(TicketCollaborators);
const TicketAudioMemo = memo(TicketAudio);
const TicketAssigneeMemo = memo(TicketAssignee);
const TicketWorkTimeMemo = memo(TicketWorkTime);
const TicketIndicatorsMemo = memo(TicketIndicators);

// ✅ versiones lazy
const AddNoteDialog          = lazy(() => import('../components/dialogs/addNotesDialog'));
const AgentSelectorDialog    = lazy(() => import('../components/dialogs/agentSelectorDialog'));
const ChangeAgentModal       = lazy(() => import('../components/dialogs/changeAgentModal'));
const ChangeDepartmentModal  = lazy(() => import('../components/dialogs/changeDepartmentModal'));
const ChangeCenterModal      = lazy(() => import('../components/dialogs/changeCenterModal'));
const RelateTicketModal      = lazy(() => import('../components/dialogs/relateTicketModal.jsx'));
const PatientProfileDialog   = lazy(() => import('../components/dialogs/patientProfileDialog'));
const ConfirmDialog          = lazy(() => import('../components/dialogs/confirmDialog'));


export default function EditTicketLocal() {
  const location = useLocation();
  const { state } = location;
  //constants 
  const { dispatch } = useTickets();
  const [ticket, ] = useState(state.row)
  //const tickets = ticketsAll.tickets;
  const { setLoading } = useLoading();
  const navigate = useNavigate();
  const ticketId = ticket?.id;
  
  //const ticket = useTicketById(ticketId);
  
  const [ agentAssigned, setAgentAssigned ] = useState(ticket?.agent_assigned || '');
  const { state: agentsState } = useAgents();
  const agents = agentsState.agents;
  const { user } = useAuth();
  const agentEmail = user.username;

 
  //statuses
  const [status, setStatus] = useState(ticket?.status || '');
  const [notes, setNotes] = useState(ticket?.notes || []);
  const [collaborators, setCollaborators] = useState(ticket?.collaborators || []);
  const [patientName, setPatientName] = useState(ticket?.patient_name || '');
  const [linked_patient_snapshot, setLinkedPatientSnapshot] = useState(ticket?.linked_patient_snapshot ?? null);

  // Patient data
  const [patientDob, setPatientDob] = useState(toInputDate(ticket?.patient_dob));
  const [callbakNumber, setCallbackNumber] = useState(ticket?.callback_number || '');
  const [ patientPhone, ] = useState(ticket?.phone || '')

  //state status
  const [errorOpen, setErrorOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [editField, setEditField] = useState(null); 
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Dialogs
  const [openNoteDialog, setOpenNoteDialog] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [agentDialogOpen, setAgentDialogOpen] = useState(false);
  const [openReassignAgentModal, setOpenReassignAgentModal] = useState(false);
  const [openChangeDepartmentModal, setOpenChangeDepartmentModal] = useState(false);
  const [openCenterModal, setOpenCenterModal] = useState(false);
  const [openRelateModal, setOpenRelateModal] = useState(false);
  const [relateTicketAction, setRelateTicketAction] = useState('relateCurrent');
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [pendingPatient, setPendingPatient] = useState(null);

  const [openPatientDialog, setOpenPatientDialog] = useState(false);
  
  //tiempo de trabajo
  const { flushNow } = useTicketWorkTimer({
    ticketId: ticket.id,
    statusProvider: () => status, // se normaliza a snake_case dentro del hook
    sendIntervalMs: 60000,     // opcional: envía cada 60s acumulados
    includeAgentEmail: false,      // ponlo en false si tu endpoint no lo necesita
  });

  // Ejemplo: flushear manualmente al guardar/cerrar
  const handleClose = async () => {
    await flushNow('manual');
    navigate(-1);
    // luego navegas/cierra modal
  };


 
  /** ========= Callbacks ESTABLES para diálogos y acciones pequeñas ========= */
  const openNoteDialogCb = useCallback(() => setOpenNoteDialog(true), []);
  const closeNoteDialogCb = useCallback(() => setOpenNoteDialog(false), []);
  //const openAgentDialogCb = useCallback(() => setAgentDialogOpen(true), []);
  const closeAgentDialogCb = useCallback(() => setAgentDialogOpen(false), []);
  const openReassignModalCb = useCallback(() => setOpenReassignAgentModal(true), []);
  const closeReassignModalCb = useCallback(() => setOpenReassignAgentModal(false), []);
  const openChangeDeptModalCb = useCallback(() => setOpenChangeDepartmentModal(true), []);
  const closeChangeDeptModalCb = useCallback(() => setOpenChangeDepartmentModal(false), []);
  const openCenterModalCb = useCallback(() => setOpenCenterModal(true), []);
  const closeCenterModalCb = useCallback(() => setOpenCenterModal(false), []);
  //const openRelateModalCb = useCallback(() => setOpenRelateModal(true), []);
  const closeRelateModalCb = useCallback(() => setOpenRelateModal(false), []);
  const openPatientDialogCb = useCallback(() => setOpenPatientDialog(true), []);
  const closePatientDialogCb = useCallback(() => setOpenPatientDialog(false), []);
  const closeConfirmDialogCb = useCallback(() => setOpenConfirmDialog(false), []);
  const onAddNoteCb = openNoteDialogCb;

  const {
  handleStatusChangeUI, handleAddNote, onAddCollaboratorCb, handleRemoveCollaborator, handleChangeDepartment, updatePatientNameUI, updatePatientDobUI, updateCallbackNumberUI, ticketAssigneeUI,
  //handleCenterHandlerUI, 
  handleRelateCurrentTicket, handleRelateAllPastTickets, handleRelateFutureTickets, handleUnlinkTicket,
  } = useEditTicketLocalActions({
    dispatch, setLoading, ticketId, agentEmail, navigate, setStatus, setNotes, setNoteContent, setOpenNoteDialog, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen,
    collaborators, setCollaborators, setEditField, setAgentAssigned, setLinkedPatientSnapshot, noteContent,
  });

  const {
    handleAddCollaboratorClick, handleModalTicket, showActions, handleRelateAllActions, closeEditTicket, onChangeCenterCb, onReassignAgentCb, onAgentSelectorAddCb,
  } = useEditTicketLocalUi({
    ticket, relateTicketAction, pendingPatient, setAgentDialogOpen, setRelateTicketAction, setOpenRelateModal, setPendingPatient, setOpenConfirmDialog, navigate, handleRelateCurrentTicket, 
    handleRelateAllPastTickets, handleRelateFutureTickets, 
    //handleCenterHandlerUI, 
    ticketAssigneeUI, onAddCollaboratorCb,
  });

  const onRelateCurrent = useCallback(() => handleModalTicket('relateCurrent'), [handleModalTicket]);
  const onRelatePast    = useCallback(() => handleModalTicket('relateAllPast'), [handleModalTicket]);
  const onRelateFuture  = useCallback(() => handleModalTicket('relateFuture'),   [handleModalTicket]);



  /** ========= Props/valores MEMO para pasar a hijos ========= */
  const indicatorsData = useMemo(() => ticket?.aiClassification, [ticket?.aiClassification]);
  const workTimeData   = useMemo(() => ticket?.work_time,        [ticket?.work_time]);
  const audioUrl       = useMemo(() => ticket?.url_audio,        [ticket?.url_audio]);
  const notesStable         = useMemo(() => notes,         [notes]);
  const collaboratorsStable = useMemo(() => collaborators, [collaborators]);


  // Formatea a MM/DD/YYYY en UTC
  const formatDateMMDDYYYY = (value) => {
    if (!value) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const d = new Date(`${value}T00:00:00Z`);
      return isNaN(d) ? value : d.toLocaleDateString('en-US', { timeZone: 'UTC' });
    }
    const d = new Date(value);
    if (!isNaN(d)) return d.toLocaleDateString('en-US', { timeZone: 'UTC' });
    const m = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
    return m ? `${m[2]}/${m[3]}/${m[1]}` : value;
  };

  // Tel válido (>=10 dígitos)
  const isDialable = (value) => {
    if (!value) return false;
    const digits = (String(value).match(/\d/g) || []).join('');
    return digits.length >= 10;
  };

  if (!ticket) return <Typography>Ticket not found</Typography>;

  return (
    <>
      <Card
        sx={{
          borderRadius: 4,
          position: 'fixed',
          top: 150,
          left: 'calc(var(--drawer-width, 80px) + var(--content-gap))', // 👈 se mueve con el sidebar
          right: 39,
          bottom: 39,
          transition: 'left .3s ease',                    // 👈 animación suave
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0px 8px 24px rgba(239, 241, 246, 1)',
          backgroundColor: '#fff',
        }}
      >
        {/* Row 1: Flechas y X a la derecha */}
        <Box
          sx={{
            position: 'absolute',
            top: 18,
            right: 0,
            display: 'flex',
            justifyContent: 'flex-end',
            pr: 3,
            gap: 1,
          }}
        >
          
          {/* Ir hacia atrás */}
          <Tooltip title="Previous case">
            <IconButton
              onClick={handleClose}
              sx={{
                '&:hover': {
                  color: '#00a1ff',
                  backgroundColor: 'transparent',
                  transition: '0.2s',
                },
              }}
            >
              <i className="fa fa-arrow-left" style={{ fontSize: 17 }} />
            </IconButton>
          </Tooltip>

          {/* Ir hacia adelante */}
          <Tooltip title="Next case">
            <IconButton
              onClick={() => navigate(1)}
              sx={{
                '&:hover': {
                  color: '#00a1ff',
                  backgroundColor: 'transparent',
                  transition: '0.2s',
                },
              }}
            >
              <i className="fa fa-arrow-right" style={{ fontSize: 17 }} />
            </IconButton>
          </Tooltip>

          {/* Volver a tableTickets */}
          <Tooltip title="Close">
            <IconButton
              onClick={closeEditTicket}
              sx={{
                '&:hover': {
                  color: '#B0200C',
                  backgroundColor: 'transparent',
                  transition: '0.2s',
                },
              }}
            >
              <i className="fa fa-close" style={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Row 2: StatusBar */}
        <Box sx={{ mt: 3, mb: 2 }}>
          <TicketStatusBar currentStatus={status} onStatusChange={handleStatusChangeUI} />
        </Box>

        {/* Row 3: Centered Container for the three columns */}
        <Grid container justifyContent="center" spacing={2}>
          <Grid item>
            <Box display="flex" flexDirection="column" gap={2} sx={{ width: '540px' }}>
              {/* Patient Information */}
              <Card variant="outlined">
                <CardContent sx={{ p: '20px 25px 25px 30px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 24,
                          borderRadius: 10,
                          backgroundColor: getStatusColor(status, 'text') || '#00a1ff',
                        }}
                      />
                      <Grid container alignItems="center" justifyContent="space-between">
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: getStatusColor(status, 'text') || '#00a1ff' }}>
                          Patient Information
                        </Typography>
                        <TicketLinkOptions />
                      </Grid>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Tooltip title="View Profile">
                        <IconButton onClick={openPatientDialogCb} size="small" sx={{ color: '#00a1ff' }}>
                          <i className="fa fa-id-card" />
                        </IconButton>
                      </Tooltip>

                      <TicketLinkOptions
                        ticket={ticket}
                        onRelateCurrentTicket={onRelateCurrent}
                        onRelateAllPastTickets={onRelatePast}
                        onRelateFutureTickets={onRelateFuture}
                        onUnlinkTicket={handleUnlinkTicket}
                        handleAllActions={handleRelateAllActions}
                      />
                    </Box>
                  </Box>

                  {/* --- Nueva lógica --- */}
                  <Typography sx={{ mb: 2.5 }}>
                    <strong>Patient Name:</strong><br />
                    {linked_patient_snapshot?.Name ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <InsertLinkIcon color="success" />
                        <Typography
                          variant="subtitle1"
                          component="span"
                          sx={{ color: '#2e7d32', fontWeight: 600 }}
                        >
                          {linked_patient_snapshot.Name}
                        </Typography>
                      </Box>
                    ) : (
                      <Box component="span">
                        {editField === 'name' ? (
                          <Box display="flex" alignItems="center" gap={1}>
                            <TextField
                              value={patientName}
                              onChange={(e) => setPatientName(e.target.value)}
                              size="small"
                              fullWidth
                            />
                            <IconButton
                              onClick={async () => {
                                await updatePatientNameUI(patientName);
                                setEditField(null);
                              }}
                            >
                              <SaveIcon />
                            </IconButton>
                            <IconButton onClick={() => setEditField(null)}>
                              <i className="fa fa-close" />
                            </IconButton>
                          </Box>
                        ) : (
                          <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Typography component="span">{patientName}</Typography>
                            <IconButton onClick={() => setEditField('name')}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        )}
                      </Box>
                    )}
                  </Typography>

                  <Typography sx={{ mb: 2.5 }}>
                    <strong>Patient DOB:</strong><br />
                    {linked_patient_snapshot?.DOB ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <InsertLinkIcon color="success" />
                        <Typography
                          variant="subtitle1"
                          component="span"
                          sx={{ color: '#2e7d32', fontWeight: 600 }}
                        >
                          {formatDateMMDDYYYY(linked_patient_snapshot.DOB)}
                        </Typography>
                      </Box>
                    ) : (
                      <Box component="span">
                        {editField === 'dob' ? (
                          <Box display="flex" alignItems="center" gap={1}>
                            <TextField
                              type="date"
                              value={patientDob}
                              onChange={(e) => setPatientDob(e.target.value)}
                              size="small"
                              fullWidth
                              InputLabelProps={{ shrink: true }}
                            />
                            <IconButton
                              onClick={async () => {
                                await updatePatientDobUI(patientDob);
                                setEditField(null);
                              }}
                            >
                              <SaveIcon />
                            </IconButton>
                            <IconButton onClick={() => setEditField(null)}>
                              <i className="fa fa-close" />
                            </IconButton>
                          </Box>
                        ) : (
                          <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Typography component="span">
                              {formatDateMMDDYYYY(patientDob)}
                            </Typography>
                            <IconButton onClick={() => setEditField('dob')}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        )}
                      </Box>
                    )}
                  </Typography>

                  {/**make a component for phone number */}
                  <Typography sx={{ mb: 2.5 }}>
                    <strong>Phone:</strong><br />
                    <Box component="span">
                      {isDialable(ticket.phone) ? (
                        <PhoneCallLink
                          phoneRaw={ticket.phone}
                          contactName={linked_patient_snapshot?.Name || patientName || 'this patient'}
                          underline="always"
                          withIcon={false}
                          color="#6c757d"
                          fontSize="inherit"
                          sx={{ fontWeight: 'inherit', lineHeight: 'inherit' }}
                        />
                      ) : (
                        <>{ticket.phone || 'N/A'}</>
                      )}
                    </Box>
                  </Typography>

                  <Typography sx={{ mb: 2.5 }}>
                    <strong>Callback Number:</strong><br />
                    <Box component="span">
                      {editField === 'phone' ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TextField
                            value={callbakNumber}
                            onChange={(e) => setCallbackNumber(e.target.value)}
                            size="small"
                            fullWidth
                          />
                          <IconButton
                            onClick={async () => {
                              await updateCallbackNumberUI(callbakNumber);
                              setEditField(null);
                            }}
                          >
                            <SaveIcon />
                          </IconButton>
                          <IconButton onClick={() => setEditField(null)}>
                            <i className="fa fa-close" />
                          </IconButton>
                        </Box>
                      ) : (
                        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                          {isDialable(callbakNumber) ? (
                            <PhoneCallLink
                              phoneRaw={callbakNumber}
                              contactName={linked_patient_snapshot?.Name || patientName || 'this patient'}
                              underline="always"
                              withIcon={false}
                              color="#6c757d"
                              fontSize="inherit"
                              sx={{ fontWeight: 'inherit', lineHeight: 'inherit' }}
                            />
                          ) : (
                            <Typography component="span">{callbakNumber || 'N/A'}</Typography>
                          )}
                          <IconButton onClick={() => setEditField('phone')}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      )}
                    </Box>
                  </Typography>
                </CardContent>
              </Card>

              <TicketNotesMemo
                notes={notesStable}
                onAddNote={onAddNoteCb}
                status={status}
              />
            </Box>
          </Grid>

          <Grid item>
            <Box display="flex" flexDirection="column" gap={2} sx={{ width: '540px' }}>
              {/* Call Information */}
              <Card variant="outlined">
                <CardContent sx={{ p: '20px 25px 25px 30px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 24,
                          borderRadius: 10,
                          backgroundColor: getStatusColor(status, 'text') || '#00a1ff',
                        }}
                      />
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 'bold', color: getStatusColor(status, 'text') || '#00a1ff' }}
                      >
                        Call Information
                      </Typography>
                    </Box>

                    {/* Iconos: Priority / Risk / Category */}
                    <TicketIndicatorsMemo ai_data={indicatorsData} showTooltip iconsOnly />
                  </Box>

                  <Typography sx={{ mb: 2.5 }}>
                    <strong>Caller ID:</strong><br /> {ticket.caller_id}
                  </Typography>
                  <Typography sx={{ mb: 2.5 }}>
                    <strong>Caller Name:</strong><br /> {ticket.caller_Name}
                  </Typography>
                  <Typography sx={{ mb: 2.5 }}>
                    <strong>Call Reason:</strong><br /> {ticket.call_reason}
                  </Typography>
                  <Typography sx={{ mb: 2.5 }}>
                    <strong>Summary:</strong><br /> {ticket.summary}
                  </Typography>
                  <Typography>
                    <strong>Creation Date:</strong><br /> {new Date(ticket.creation_date).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>

              <TicketAudioMemo
                audioUrl={audioUrl}
                title="Audio"
                status={status}
              />
            </Box>
          </Grid>

          <Grid item>
            <Box display="flex" flexDirection="column" gap={2} sx={{ width: '380px', minWidth: '380px' }}>
              <TicketAssigneeMemo
                assigneeEmail={agentAssigned}
                status={status}
                onReassign={openReassignModalCb}
                onChangeDepartment={openChangeDeptModalCb}
                onChangeCenter={openCenterModalCb}
              />
              <TicketCollaboratorsMemo
                collaborators={collaboratorsStable}
                onAddCollaborator={handleAddCollaboratorClick}
                onRemoveCollaborator={handleRemoveCollaborator}
                status={status}
              />
            </Box>

            <Card variant="outlined" sx={{ mt: 2, width: '100%' }}>
              <CardContent sx={{ p: '20px 25px 25px 30px' }}>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Box
                    sx={{
                      width: 8,
                      height: 24,
                      borderRadius: 10,
                      backgroundColor: getStatusColor(status, 'text') || '#00a1ff',
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 'bold', color: getStatusColor(status, 'text') || '#00a1ff' }}
                  >
                    Time on Task
                  </Typography>
                </Box>
                <Box sx={{ width: '100%', minWidth: '280px' }}>
                  { <TicketWorkTimeMemo workTimeData={workTimeData} /> }
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Card>

      {/* Dialog para agregar nota */}
      <LazyModal open={openNoteDialog}>
        <AddNoteDialog
          open={openNoteDialog}
          onClose={closeNoteDialogCb}
          onSubmit={handleAddNote}
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
        />
      </LazyModal>

     {/* Agent Selector */}
    <LazyModal open={agentDialogOpen}>
      <AgentSelectorDialog
        open={agentDialogOpen}
        onClose={closeAgentDialogCb}
        onAdd={onAgentSelectorAddCb}
        agents={agents}
        initialSelected={ticket?.collaborators}
        assigneeEmail={agentAssigned}            
        existingCollaborators={collaborators}
      />
    </LazyModal>

    {/* Reassign Agent */}
    <LazyModal open={openReassignAgentModal}>
      <ChangeAgentModal
        open={openReassignAgentModal}
        onClose={closeReassignModalCb}
        onReassignAgent={onReassignAgentCb}
        agents={agents}
      />
    </LazyModal>

    {/* Change Department */}
    <LazyModal open={openChangeDepartmentModal}>
      <ChangeDepartmentModal
        open={openChangeDepartmentModal}
        onClose={closeChangeDeptModalCb}
        onChangeDepartment={handleChangeDepartment}
      />
    </LazyModal>

    {/* Dialog para transferir caso */}
    <LazyModal open={openCenterModal}>
      <ChangeCenterModal
        open={openCenterModal}
        onClose={closeCenterModalCb}
        onChangeCenter={onChangeCenterCb}
      />
    </LazyModal>

    {/* Relate Ticket */}
    <LazyModal open={openRelateModal}>
      <RelateTicketModal
        open={openRelateModal}
        onClose={closeRelateModalCb}
        relateTicketAction={relateTicketAction}
        onSelect={showActions}
      />
    </LazyModal>

    {/* Confirm Dialog */}
    <LazyModal open={openConfirmDialog}>
      <ConfirmDialog
        open={openConfirmDialog}
        title="Confirm Action"
        content="Are you sure?"
        onCancel={closeConfirmDialogCb}
        onConfirm={handleRelateAllActions}
      />
    </LazyModal>

    {/* Patient Profile */}
    <LazyModal open={openPatientDialog}>
      <PatientProfileDialog
        open={openPatientDialog}
        onClose={closePatientDialogCb}
        patientName={patientName}
        patientDob={patientDob}
        patientPhone={patientPhone}
        currentTicket={ticket}  
      />
    </LazyModal>

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

//fallback Lazy modals
function LazyModal({ open, children }) {
  if (!open) return null;
  return (
    <Suspense
      fallback={
        <Backdrop open sx={{ color: '#fff', zIndex: (t) => t.zIndex.modal + 1 }}>
          <CircularProgress />
        </Backdrop>
      }
    >
      {children}
    </Suspense>
  );
}