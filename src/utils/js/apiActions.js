// utils/providersActions.js
import { useCallback } from "react";
import { getTicketsByPatientId, searchPatients } from "../apiPatients";
import { getDailyStats, getTicketsByIds } from "../apiStats";
import { getProviders } from "../apiProviders";
import { pickUpdatedEntity } from "../apiActionHelper";
import { useApiActionRunner } from "../../components/hooks/useApiActionRunner";
//import { pickUpdatedTicket } from "../../utils/tickets/ticketActionHelper";

export function useApiHandlers() {
  const run = useApiActionRunner();

  const handleGetTicketsByPatient = useCallback(async (patient) => {
      const res = await run({
        fn: getTicketsByPatientId,
        args: [patient],
        //actionType: 'UPD_PATIENT',
        getUpdatedEntity: (res) => pickUpdatedEntity(res, 'patient'),
      });
      return res;
    }, [run]);


    const searchPatientsHandler = useCallback(async (query, filter, pageNumber, PAGE_SIZE) => {
      const res = await run({
        fn: searchPatients,
        args: [query, filter, pageNumber, PAGE_SIZE],
        //actionType: 'UPD_PATIENT',
        getUpdatedEntity: (res) => pickUpdatedEntity(res, 'patient'),
      });
      return res;
    }, [run]);


    const getDailyStatsHandler = useCallback(async (date) => {
      const res = await run({
        fn: getDailyStats,
        args: [date],
        getUpdatedEntity: (res) => pickUpdatedEntity(res, 'stats'),
      });
      return res;
    }, [run]);


    const getTicketsByIdHandler = useCallback(async (id) => {
      const res = await run({
        fn: getTicketsByIds,
        args: [id],
        getUpdatedEntity: (res) => pickUpdatedEntity(res, 'stats'),
      });
      return res;
    }, [run]);


    const getProvidersHandler = useCallback(async (query, filter, pageNumber, PAGE_SIZE) => {
      const res = await run({
        fn: getProviders,
        args: [query, filter, pageNumber, PAGE_SIZE],
        getUpdatedEntity: (res) => pickUpdatedEntity(res, 'stats'),
      });
      return res;
    }, [run]);



    return {
      handleGetTicketsByPatient,
      searchPatientsHandler,
      getDailyStatsHandler,
      getTicketsByIdHandler,
      getProvidersHandler
    };
  }
