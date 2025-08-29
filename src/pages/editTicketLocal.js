import React, { lazy, Suspense, useState, useCallback, useMemo, memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Grid, Card, CardContent, TextField, IconButton, Backdrop, CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import TicketStatusBar from '../components/auxiliars/tickets/ticketStatusBar.jsx';
import { useLoading } from '../providers/loadingProvider';
import TicketNotes from '../components/auxiliars/tickets/ticketNotes.jsx';
import TicketCollaborators from '../components/auxiliars/tickets/ticketCollaborators.jsx';
import TicketAudio from '../components/auxiliars/tickets/ticketAudio.jsx';
import TicketAssignee from '../components/auxiliars/tickets/ticketAssignee.jsx';
import Tooltip from '@mui/material/Tooltip';
//import { useTicketWorkTimer } from '../components/hooks/useWorkTimer.jsx';
//import TicketWorkTime from '../components/auxiliars/tickets/ticketWorkTime.js';
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

/** ========= Memo wrappers ========= */
const TicketNotesMemo = memo(TicketNotes);
const TicketCollaboratorsMemo = memo(TicketCollaborators);
const TicketAudioMemo = memo(TicketAudio);
const TicketAssigneeMemo = memo(TicketAssignee);
//const TicketWorkTimeMemo = memo(TicketWorkTime);
const TicketIndicatorsMemo = memo(TicketIndicators);

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
  const { dispatch } = useTickets();
  const [ticket, ] = useState(state.row);
  const { setLoading } = useLoading();
  const navigate = useNavigate();
  const ticketId = ticket?.id;

  const [ agentAssigned, setAgentAssigned ] = useState(ticket?.agent_assigned || '');
  const { state: agentsState } = useAgents();
  const agents = agentsState.agents;
  const { user } = useAuth();
  const agentEmail = user.username;

  const [status, setStatus] = useState(ticket?.status || '');
  const [notes, setNotes] = useState(ticket?.notes || []);
  const [collaborators, setCollaborators] = useState(ticket?.collaborators || []);
  const [patientName, setPatientName] = useState(ticket?.patient_name || '');
  const [linked_patient_snapshot, setLinkedPatientSnapshot] = useState(ticket?.linked_patient_snapshot ?? null);
  const [indicatorsData, setAiClassification] = useState(ticket?.aiClassification || {});

  const [patientDob, setPatientDob] = useState(toInputDate(ticket?.patient_dob));
  const [callbakNumber, setCallbackNumber] = useState(ticket?.callback_number || '');
  const [ patientPhone, ] = useState(ticket?.phone || '');

  const [editField, setEditField] = useState(null);

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

  /*const { flushNow } = useTicketWorkTimer({
    ticketId: ticket.id,
    statusProvider: () => status,
    sendIntervalMs: 60000,
    includeAgentEmail: false,
  });*/

  const handleClose = async () => {
    //await flushNow('manual');
    navigate(-1);
  };

  const openNoteDialogCb = useCallback(() => setOpenNoteDialog(true), []);
  const closeNoteDialogCb = useCallback(() => setOpenNoteDialog(false), []);
  const closeAgentDialogCb = useCallback(() => setAgentDialogOpen(false), []);
  const openReassignModalCb = useCallback(() => setOpenReassignAgentModal(true), []);
  const closeReassignModalCb = useCallback(() => setOpenReassignAgentModal(false), []);
  const openChangeDeptModalCb = useCallback(() => setOpenChangeDepartmentModal(true), []);
  const closeChangeDeptModalCb = useCallback(() => setOpenChangeDepartmentModal(false), []);
  const openCenterModalCb = useCallback(() => setOpenCenterModal(true), []);
  const closeCenterModalCb = useCallback(() => setOpenCenterModal(false), []);
  const closeRelateModalCb = useCallback(() => setOpenRelateModal(false), []);
  const openPatientDialogCb = useCallback(() => setOpenPatientDialog(true), []);
  const closePatientDialogCb = useCallback(() => setOpenPatientDialog(false), []);
  const closeConfirmDialogCb = useCallback(() => setOpenConfirmDialog(false), []);
  const onAddNoteCb = openNoteDialogCb;

  const {
    handleStatusChangeUI, handleAiClassificationChangeUI, handleAddNote, onAddCollaboratorCb, handleRemoveCollaborator, handleChangeDepartment, updatePatientNameUI, updatePatientDobUI, updateCallbackNumberUI, ticketAssigneeUI,
    handleRelateCurrentTicket, handleRelateAllPastTickets, handleRelateFutureTickets, handleUnlinkTicket,
  } = useEditTicketLocalActions({
    dispatch, setLoading, ticketId, agentEmail, navigate, setStatus,setNotes, setNoteContent, setOpenNoteDialog, 
    collaborators, setCollaborators, setEditField, setAgentAssigned, setLinkedPatientSnapshot, noteContent, setAiClassification
  });

  const {
    handleAddCollaboratorClick, handleModalTicket, showActions, handleRelateAllActions, closeEditTicket, onChangeCenterCb, onReassignAgentCb, onAgentSelectorAddCb,
  } = useEditTicketLocalUi({
    ticket, relateTicketAction, pendingPatient, setAgentDialogOpen, setRelateTicketAction, setOpenRelateModal, setPendingPatient, setOpenConfirmDialog, navigate, handleRelateCurrentTicket, 
    handleRelateAllPastTickets, handleRelateFutureTickets, 
    ticketAssigneeUI, onAddCollaboratorCb,
  });

  const onRelateCurrent = useCallback(() => handleModalTicket('relateCurrent'), [handleModalTicket]);
  const onRelatePast    = useCallback(() => handleModalTicket('relateAllPast'), [handleModalTicket]);
  const onRelateFuture  = useCallback(() => handleModalTicket('relateFuture'),   [handleModalTicket]);

  //const indicatorsData = useMemo(() => ticket?.aiClassification, [ticket?.aiClassification]);
  //const workTimeData   = useMemo(() => ticket?.work_time,        [ticket?.work_time]);
  const audioUrl       = useMemo(() => ticket?.url_audio,        [ticket?.url_audio]);
  const notesStable         = useMemo(() => notes,         [notes]);
  const collaboratorsStable = useMemo(() => collaborators, [collaborators]);
  // 2) Crea las variables memorizadas (debajo de tus otros useMemo)
  const summaryText    = useMemo(() => normalizeMultiline(ticket?.summary),     [ticket?.summary]);
  const callReasonText = useMemo(() => normalizeMultiline(ticket?.call_reason), [ticket?.call_reason]);


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

  const isDialable = (value) => {
    if (!value) return false;
    const digits = (String(value).match(/\d/g) || []).join('');
    return digits.length >= 10;
  };

    // 1) Añade esto junto a tus utils del componente
  const forceWrap = {
    display: 'block',
    minWidth: 0,
    maxWidth: '100%',
    whiteSpace: 'pre-wrap',     // mantiene párrafos
    overflowWrap: 'anywhere',   // rompe palabras larguísimas
    wordBreak: 'break-word',
  };

  // Normaliza el texto multi-línea: conserva párrafos, elimina saltos “duros”
  function normalizeMultiline(input) {
    if (input == null) return '';
    let s = String(input).replace(/\r\n/g, '\n');
    s = s.replace(/\n{3,}/g, '\n\n');            // colapsa 3+ saltos en doble salto
    s = s.replace(/([^\n])\n(?!\n)/g, '$1 ');    // salto simple -> espacio
    return s;
  }


  if (!ticket) return <Typography>Ticket not found</Typography>;

  return (
    <>
      <Card
        sx={{
          borderRadius: 4,
          position: 'fixed',
          top: 150,
          left: 'calc(var(--drawer-width, 80px) + var(--content-gap))',
          right: 39,
          bottom: 39,
          transition: 'left .3s ease',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0px 8px 24px rgba(239, 241, 246, 1)',
          backgroundColor: '#fff',
          overflow: 'hidden',
          minHeight: 0
        }}
      >
        {/* Header sticky para que no se solape */}
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: (t) => t.zIndex.appBar,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 1,
            p: 2,
            bgcolor: '#fff',
            borderBottom: '1px solid #eee'
          }}
        >
          <Tooltip title="Previous case">
            <IconButton
              onClick={handleClose}
              sx={{ '&:hover': { color: '#00a1ff', backgroundColor: 'transparent', transition: '0.2s' } }}
            >
              <i className="fa fa-arrow-left" style={{ fontSize: 17 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Next case">
            <IconButton
              onClick={() => navigate(1)}
              sx={{ '&:hover': { color: '#00a1ff', backgroundColor: 'transparent', transition: '0.2s' } }}
            >
              <i className="fa fa-arrow-right" style={{ fontSize: 17 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Close">
            <IconButton
              onClick={closeEditTicket}
              sx={{ '&:hover': { color: '#B0200C', backgroundColor: 'transparent', transition: '0.2s' } }}
            >
              <i className="fa fa-close" style={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Contenido scrollable */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 2, minWidth: 0 }}>
          <Box sx={{ mt: 1, mb: 2 }}>
            <TicketStatusBar currentStatus={status} onStatusChange={handleStatusChangeUI} />
          </Box>

          <Grid container justifyContent="center" spacing={2}>
            <Grid item xs={12} md="auto">
              <Box display="flex" flexDirection="column" gap={2} sx={{ width: { xs: '100%', md: '540px' }, minWidth: 0 }}>
                <Card variant="outlined">
                  {/* ⬇️ permitir shrink dentro del card */}
                  <CardContent sx={{ p: '20px 25px 25px 30px', minWidth: 0 }}>
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

            <Grid item xs={12} md="auto">
              <Box display="flex" flexDirection="column" gap={2} sx={{ width: { xs: '100%', md: '540px' }, minWidth: 0 }}>
                <Card variant="outlined">
                  {/* ⬇️ permitir shrink dentro del card */}
                  <CardContent sx={{ p: '20px 25px 25px 30px', minWidth: 0 }}>
                    <Box sx={{ mb: 2 }}>                    
                      {/* Encabezado "Call Information" — alineado a la izquierda */}
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
                      {/* Indicadores — alineados a la derecha */}
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                        <Box sx={{ width: { xs: '100%', md: 'auto' }, maxWidth: 520 }}>
                          <TicketIndicatorsMemo
                            ai_data={indicatorsData}
                            ticketId={ticket.id}
                            editable
                            showTooltip
                            onSaveAiClassification={handleAiClassificationChangeUI}
                            iconsOnly={false}
                          />
                        </Box>
                      </Box>
                    </Box>

                    <Typography sx={{ mb: 2.5 }}>
                      <strong>Caller ID:</strong><br /> {ticket.caller_id}
                    </Typography>
                    <Typography sx={{ mb: 2.5 }}>
                      <strong>Caller Name:</strong><br /> {ticket.caller_Name}
                    </Typography>

                    {/* ✅ Call Reason con wrap forzado */}
                    <Typography sx={{ mb: 2.5 }}>
                      <strong>Call Reason:</strong><br />
                      <Box component="span" sx={forceWrap}>{callReasonText}</Box>
                    </Typography>

                    {/* ✅ Summary con wrap forzado */}
                    <Typography sx={{ mb: 2.5 }}>
                      <strong>Summary:</strong><br />
                      <Box component="span" sx={forceWrap}>{summaryText}</Box>
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

            <Grid item xs={12} md="auto">
              <Box display="flex" flexDirection="column" gap={2} sx={{ width: { xs: '100%', md: '380px' }, minWidth: 0 }}>
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
                    {/* <TicketWorkTimeMemo workTimeData={workTimeData} /> */}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Card>

      <LazyModal open={openNoteDialog}>
        <AddNoteDialog
          open={openNoteDialog}
          onClose={closeNoteDialogCb}
          onSubmit={handleAddNote}
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
        />
      </LazyModal>

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

      <LazyModal open={openReassignAgentModal}>
        <ChangeAgentModal
          open={openReassignAgentModal}
          onClose={closeReassignModalCb}
          onReassignAgent={onReassignAgentCb}
          agents={agents}
        />
      </LazyModal>

      <LazyModal open={openChangeDepartmentModal}>
        <ChangeDepartmentModal
          open={openChangeDepartmentModal}
          onClose={closeChangeDeptModalCb}
          onChangeDepartment={handleChangeDepartment}
        />
      </LazyModal>

      <LazyModal open={openCenterModal}>
        <ChangeCenterModal
          open={openCenterModal}
          onClose={closeCenterModalCb}
          onChangeCenter={onChangeCenterCb}
        />
      </LazyModal>

      <LazyModal open={openRelateModal}>
        <RelateTicketModal
          open={openRelateModal}
          onClose={closeRelateModalCb}
          relateTicketAction={relateTicketAction}
          onSelect={showActions}
        />
      </LazyModal>

      <LazyModal open={openConfirmDialog}>
        <ConfirmDialog
          open={openConfirmDialog}
          title="Confirm Action"
          content="Are you sure?"
          onCancel={closeConfirmDialogCb}
          onConfirm={handleRelateAllActions}
        />
      </LazyModal>

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
    </>
  );
}

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
