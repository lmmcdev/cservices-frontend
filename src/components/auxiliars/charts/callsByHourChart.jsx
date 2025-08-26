// src/components/auxiliars/charts/CallsByHourChart.jsx
import React, { memo } from 'react';
import CallsByHourChartBase from './chartbases/callsByHourChartBase';
import { useDailyStatsState } from '../../../context/dailyStatsContext';
import { useHistoricalStats } from '../../../context/historicalStatsContext';

console.log("call by hours")
// Wrapper para Daily
export const DailyCallsByHour = memo(function DailyCallsByHour() {
  const { daily_statistics } = useDailyStatsState();
  return <CallsByHourChartBase stats={daily_statistics || {}} />;
});

// Wrapper para Historical
export const HistoricalCallsByHour = memo(function HistoricalCallsByHour() {
  const { stateStats } = useHistoricalStats();
  return <CallsByHourChartBase stats={stateStats.historic_daily_stats || {}} />;
});
