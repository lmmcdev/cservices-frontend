// src/components/auxiliars/charts/TicketRiskChart.jsx
import React, { memo } from 'react';
import TicketRiskChartBase from './chartbases/ticketsRiskChartBase';
import { useDailyStatsState } from '../../../context/dailyStatsContext';
import { useHistoricalStats } from '../../../context/historicalStatsContext';

console.log('tickets risk')

// Wrapper para Daily
export const DailyTicketRiskChart = memo(function DailyTicketRiskChart({ onCategoryClick }) {
  const { daily_statistics } = useDailyStatsState();
  return <TicketRiskChartBase stats={daily_statistics || {}} onCategoryClick={onCategoryClick} />;
});

// Wrapper para Historical
export const HistoricalTicketRiskChart = memo(function HistoricalTicketRiskChart({ onCategoryClick }) {
  const { stateStats } = useHistoricalStats();
  return <TicketRiskChartBase stats={stateStats.historic_daily_stats || {}} onCategoryClick={onCategoryClick} />;
});
