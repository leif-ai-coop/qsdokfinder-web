import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  ToggleButtonGroup,
  ToggleButton,
  Skeleton
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const YearChart = ({ qsv, documents, onYearClick, jahrTyp, onJahrTypChange }) => {
  const [yearData, setYearData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jahrTypFilter, setJahrTypFilter] = useState(jahrTyp ?? null);

  useEffect(() => {
    setJahrTypFilter(jahrTyp ?? null);
  }, [jahrTyp]);

  useEffect(() => {
    if (!documents) {
      setLoading(true);
      return;
    }
    setLoading(true);

    const yearGroups = {};
    documents.forEach(doc => {
      const jahr = doc.Jahr;
      const jahrTypVal = doc.Jahr_typ;
      if (!jahr) return;
      if (!yearGroups[jahr]) {
        yearGroups[jahr] = { AJ: 0, EJ: 0, SJ: 0, total: 0 };
      }
      yearGroups[jahr].total++;
      if (jahrTypVal && ['AJ', 'EJ', 'SJ'].includes(jahrTypVal)) {
        yearGroups[jahr][jahrTypVal]++;
      }
    });

    const chartData = Object.entries(yearGroups)
      .map(([jahr, counts]) => {
        const count = jahrTypFilter ? counts[jahrTypFilter] || 0 : counts.total;
        return {
          Jahr: parseInt(jahr),
          count: count,
          jahrTyp: jahrTypFilter || 'Alle'
        };
      })
      .filter(item => item.count > 0)
      .sort((a, b) => a.Jahr - b.Jahr);
    
    setYearData(chartData);
    setLoading(false);
  }, [documents, jahrTypFilter]);

  const handleJahrTypChange = (event, newJahrTyp) => {
    setJahrTypFilter(newJahrTyp);
    if (onJahrTypChange) onJahrTypChange(newJahrTyp);
  };

  const handleBarClick = (data) => {
    if (data && data.Jahr && onYearClick) {
      onYearClick(String(data.Jahr));
    }
  };

  return (
    <Box sx={{ width: '100%', minHeight: 220 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Jahr-Übersicht {qsv ? `für ${qsv}` : '(alle Verfahren)'}
        </Typography>
        
        <ToggleButtonGroup
          value={jahrTypFilter}
          exclusive
          onChange={handleJahrTypChange}
          size="small"
        >
          <ToggleButton value={null}>Alle</ToggleButton>
          <ToggleButton value="AJ">AJ</ToggleButton>
          <ToggleButton value="EJ">EJ</ToggleButton>
          <ToggleButton value="SJ">SJ</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {loading ? (
        <Box sx={{ height: 160 }}>
          <Skeleton variant="rectangular" height="100%" />
        </Box>
      ) : (
        <Box sx={{ height: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={yearData}
              margin={{ top: 2, right: 10, left: -30, bottom: 2 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="Jahr" 
                tick={{ fontSize: 11 }}
              />
              <YAxis 
                tick={{ fontSize: 11 }}
              />
              <Tooltip 
                formatter={(value, name) => [
                  value, 
                  `Anzahl Dokumente${jahrTypFilter ? ` (${jahrTypFilter})` : ' (Alle Jahrestypen)'}`
                ]}
                labelFormatter={(label) => `Jahr: ${label}`}
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
              <Bar 
                dataKey="count" 
                fill="#6B9FA1"
                barSize={20}
                cursor="pointer"
                onClick={handleBarClick}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}

      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        Klicken Sie auf einen Balken, um das Jahr zu filtern.
      </Typography>
    </Box>
  );
};

export default YearChart;
