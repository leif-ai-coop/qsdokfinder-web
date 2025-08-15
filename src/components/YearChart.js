import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
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
import { getDocuments } from '../api';

const YearChart = ({ qsv, onYearClick }) => {
  const [yearData, setYearData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jahrTypFilter, setJahrTypFilter] = useState(null); // null = all, 'AJ', 'EJ', 'SJ'
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!qsv) {
      setYearData([]);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all documents for the selected QS-Verfahren
        const result = await getDocuments({ qsv });
        const documents = result.documents || [];
        
        // Group documents by year and year type
        const yearGroups = {};
        
        documents.forEach(doc => {
          const jahr = doc.Jahr;
          const jahrTyp = doc.Jahr_typ;
          
          if (!jahr) return; // Skip documents without year
          
          if (!yearGroups[jahr]) {
            yearGroups[jahr] = { AJ: 0, EJ: 0, SJ: 0, total: 0 };
          }
          
          yearGroups[jahr].total++;
          if (jahrTyp && ['AJ', 'EJ', 'SJ'].includes(jahrTyp)) {
            yearGroups[jahr][jahrTyp]++;
          }
        });
        
        // Convert to chart data format
        const chartData = Object.entries(yearGroups)
          .map(([jahr, counts]) => {
            if (jahrTypFilter && jahrTypFilter !== null) {
              return {
                Jahr: parseInt(jahr),
                count: counts[jahrTypFilter] || 0,
                jahrTyp: jahrTypFilter
              };
            } else {
              return {
                Jahr: parseInt(jahr),
                count: counts.total,
                jahrTyp: 'Alle'
              };
            }
          })
          .filter(item => item.count > 0) // Only show years with data
          .sort((a, b) => a.Jahr - b.Jahr); // Sort by year
        
        setYearData(chartData);
      } catch (err) {
        console.error('Error fetching year statistics:', err);
        setError('Fehler beim Laden der Jahr-Statistiken');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [qsv, jahrTypFilter]);

  const handleJahrTypChange = (event, newJahrTyp) => {
    setJahrTypFilter(newJahrTyp);
  };

  const handleBarClick = (data) => {
    if (data && data.Jahr && onYearClick) {
      onYearClick(String(data.Jahr));
    }
  };

  if (!qsv) {
    return null;
  }

  if (error) {
    return (
      <Paper sx={{ p: 2, width: '100%' }}>
        <Typography variant="body2" color="error">{error}</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2, width: '100%', minHeight: 300 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Jahr-Übersicht für {qsv}
        </Typography>
        
        <ToggleButtonGroup
          value={jahrTypFilter}
          exclusive
          onChange={handleJahrTypChange}
          size="small"
          sx={{ mb: 2 }}
        >
          <ToggleButton value={null}>Alle</ToggleButton>
          <ToggleButton value="AJ">AJ</ToggleButton>
          <ToggleButton value="EJ">EJ</ToggleButton>
          <ToggleButton value="SJ">SJ</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {loading ? (
        <Box sx={{ height: 200 }}>
          <Skeleton variant="rectangular" height="100%" />
        </Box>
      ) : (
        <Box sx={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={yearData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="Jahr" 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
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
                cursor="pointer"
                onClick={handleBarClick}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}

      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        Klicken Sie auf einen Balken, um das Jahr zu filtern • 
        Zeigt echte Dokumentzahlen für {qsv}
      </Typography>
    </Paper>
  );
};

export default YearChart;
