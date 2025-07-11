import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import { useDailyStatsState } from '../context/dailyStatsContext';

const COLORS = ['#00b8a3', '#00a1ff', '#ffb900', '#ff6692', '#6f42c1', '#34c38f', '#f46a6a', '#556ee6'];

export default function TicketCategoriesChart({ onCategoryClick }) {
  const { daily_statistics } = useDailyStatsState();
  const categories = daily_statistics?.aiClassificationStats?.category || {};
  const risks = daily_statistics?.aiClassificationStats?.risk || {};

  // 🔹 DATOS CATEGORÍAS
  const totalCategories = Object.values(categories).reduce((acc, cat) => acc + cat.count, 0);
  const dataCategories = Object.entries(categories).map(([name, obj], index) => ({
    name,
    value: obj.count,
    percent: totalCategories > 0 ? (obj.count / totalCategories) * 100 : 0,
    fill: COLORS[index % COLORS.length],
    ticketIds: obj.ticketIds,
  }));

  // 🔹 DATOS RISKS (EXCLUYENDO 'none')
  const risksFiltered = Object.entries(risks).filter(([risk]) => risk.toLowerCase() !== 'none');
  const totalRisks = risksFiltered.reduce((acc, [_, obj]) => acc + obj.count, 0);
  const dataRisks = risksFiltered.map(([name, obj], index) => ({
    name,
    value: obj.count,
    percent: totalRisks > 0 ? (obj.count / totalRisks) * 100 : 0,
    fill: COLORS[index % COLORS.length],
    ticketIds: obj.ticketIds,
  }));

  // 🔹 HANDLERS
  const handleCategoryClick = (data) => {
    if (data?.ticketIds) {
      onCategoryClick({
        category: data.name,
        ticketIds: data.ticketIds,
      });
    }
  };

  const handleRiskClick = (data) => {
    if (data?.ticketIds) {
      onCategoryClick({
        category: data.name,
        ticketIds: data.ticketIds,
      });
    }
  };

  return (
    <Box>
      {/* 📌 Gráfico de Categorías */}
      <Card
        sx={{
          borderRadius: 3,
          mb: 4,
          overflow: 'hidden',
          backgroundColor: '#fff',
          boxShadow: '0px 8px 24px rgba(239, 241, 246, 1)',
        }}
      >
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Ticket Categories Breakdown
          </Typography>

          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              layout="vertical"
              data={dataCategories}
              margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
            >
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" />
              <Tooltip formatter={(value, name, props) => [`${value} Tickets`]} />
              <Legend />
              <Bar dataKey="value" onClick={handleCategoryClick}>
                {dataCategories.map((entry, index) => (
                  <Cell key={`cell-cat-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 📌 Gráfico de Riesgos */}
      <Card
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          backgroundColor: '#fff',
          boxShadow: '0px 8px 24px rgba(239, 241, 246, 1)',
        }}
      >
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Ticket Risks Breakdown
          </Typography>

          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              layout="vertical"
              data={dataRisks}
              margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
            >
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" />
              <Tooltip formatter={(value, name, props) => [`${value} Tickets`]} />
              <Legend />
              <Bar dataKey="value" onClick={handleRiskClick}>
                {dataRisks.map((entry, index) => (
                  <Cell key={`cell-risk-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
