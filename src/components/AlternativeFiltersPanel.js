import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Chip, 
  Paper, 
  Tooltip, 
  Typography, 
  Tabs, 
  Tab,
  Divider,
  Stack
} from '@mui/material';

const inhaltstypDescriptions = {
	QSF_EXP: 'QS-Filter bzw. Expormodulinformationen',
	QSD: 'QS-Dokumentationsbögen',
	AH: 'Ausfüllhinweise',
	RR: 'Rechenregeln',
	DV: 'Datenvalidierung',
	BUAW: 'Bundesauswertung',
	BQB: 'Bundesqualitätsbericht',
	Sonstige: 'Sonstige Dokumente',
};

export default function AlternativeFiltersPanel({ 
  qsvList, 
  inhaltstypen, 
  years, 
  modules, 
  query, 
  onSet, 
  onReset 
}) {
  // Navigation state: 'qsverfahren' | 'erfassungsmodule' | 'auswertungsmodule'
  const [activeView, setActiveView] = useState('qsverfahren');

  // Filter modules by type
  const erfassungsmodule = modules.filter(m => m.Modulart === 'EM');
  const auswertungsmodule = modules.filter(m => m.Modulart === 'AM');

  const handleViewChange = (newView) => {
    setActiveView(newView);
    // Clear module filter when switching views
    if (query.modul) {
      onSet('modul', null);
    }
  };

  const renderQSVerfahrenView = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>QS-Verfahren auswählen:</Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {qsvList.map(({ qsv, verfahrensnummer }) => (
            <Chip 
              key={qsv}
              label={`${qsv} (${verfahrensnummer ?? '-'})`}
              color={query.qsv === qsv ? 'primary' : 'default'}
              onClick={() => onSet('qsv', qsv)}
              sx={{ mb: 1 }}
            />
          ))}
        </Box>
      </Paper>

      {query.qsv && (
        <>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Inhaltstyp</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {inhaltstypen.map((t) => (
                <Tooltip key={t} title={inhaltstypDescriptions[t] || ''}>
                  <Chip 
                    label={t}
                    color={query.inhaltstyp === t ? 'primary' : 'default'}
                    onClick={() => onSet('inhaltstyp', t)} 
                  />
                </Tooltip>
              ))}
            </Box>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Jahr</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {years.map((y) => (
                <Chip 
                  key={y}
                  label={y}
                  color={query.year === y ? 'primary' : 'default'}
                  onClick={() => onSet('year', y)} 
                />
              ))}
            </Box>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Neueste Aktualisierungen</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {[
                { v: '1', l: 'Letzte 7 Tage' },
                { v: '2', l: '7-14 Tage' },
                { v: '3', l: '14-30 Tage' },
                { v: '4', l: 'Letzter Monat' },
              ].map(({ v, l }) => (
                <Chip 
                  key={v} 
                  label={l}
                  color={query.recent === v ? 'primary' : 'default'}
                  onClick={() => onSet('recent', v)} 
                />
              ))}
            </Box>
          </Paper>
        </>
      )}
    </Box>
  );

  const renderErfassungsmoduleView = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Spezifikationsmodule (Erfassungsmodule)</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Wählen Sie ein Erfassungsmodul, um spezifische Dokumentation zu finden:
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {erfassungsmodule.map(m => (
            <Chip 
              key={`EM-${m.Modul}`} 
              label={m.Modul}
              color={query.modul === m.Modul ? 'primary' : 'default'}
              onClick={() => onSet('modul', m.Modul)}
              sx={{ mb: 1 }}
            />
          ))}
        </Box>
      </Paper>

      {query.modul && (
        <>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>QS-Verfahren</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {qsvList.map(({ qsv, verfahrensnummer }) => (
                <Chip 
                  key={qsv}
                  label={`${qsv} (${verfahrensnummer ?? '-'})`}
                  color={query.qsv === qsv ? 'primary' : 'default'}
                  onClick={() => onSet('qsv', qsv)} 
                />
              ))}
            </Box>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Jahr</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {years.map((y) => (
                <Chip 
                  key={y}
                  label={y}
                  color={query.year === y ? 'primary' : 'default'}
                  onClick={() => onSet('year', y)} 
                />
              ))}
            </Box>
          </Paper>
        </>
      )}
    </Box>
  );

  const renderAuswertungsmoduleView = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Auswertungsmodule</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Wählen Sie ein Auswertungsmodul, um Auswertungen und Berichte zu finden:
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {auswertungsmodule.map(m => (
            <Chip 
              key={`AM-${m.Modul}`} 
              label={m.Modul}
              color={query.modul === m.Modul ? 'primary' : 'default'}
              onClick={() => onSet('modul', m.Modul)}
              sx={{ mb: 1 }}
            />
          ))}
        </Box>
      </Paper>

      {query.modul && (
        <>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>QS-Verfahren</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {qsvList.map(({ qsv, verfahrensnummer }) => (
                <Chip 
                  key={qsv}
                  label={`${qsv} (${verfahrensnummer ?? '-'})`}
                  color={query.qsv === qsv ? 'primary' : 'default'}
                  onClick={() => onSet('qsv', qsv)} 
                />
              ))}
            </Box>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Jahr</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {years.map((y) => (
                <Chip 
                  key={y}
                  label={y}
                  color={query.year === y ? 'primary' : 'default'}
                  onClick={() => onSet('year', y)} 
                />
              ))}
            </Box>
          </Paper>
        </>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Navigation Buttons */}
      <Paper sx={{ p: 2 }}>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Button
            variant={activeView === 'qsverfahren' ? 'contained' : 'outlined'}
            onClick={() => handleViewChange('qsverfahren')}
            size="small"
          >
            QS-Verfahren
          </Button>
          <Button
            variant={activeView === 'erfassungsmodule' ? 'contained' : 'outlined'}
            onClick={() => handleViewChange('erfassungsmodule')}
            size="small"
          >
            Erfassungsmodule
          </Button>
          <Button
            variant={activeView === 'auswertungsmodule' ? 'contained' : 'outlined'}
            onClick={() => handleViewChange('auswertungsmodule')}
            size="small"
          >
            Auswertungsmodule
          </Button>
        </Stack>
        <Divider />
      </Paper>

      {/* Reset Button */}
      <Button variant="outlined" onClick={onReset} sx={{ alignSelf: 'flex-start' }}>
        Alle Filter zurücksetzen
      </Button>

      {/* Dynamic Content Based on Active View */}
      {activeView === 'qsverfahren' && renderQSVerfahrenView()}
      {activeView === 'erfassungsmodule' && renderErfassungsmoduleView()}
      {activeView === 'auswertungsmodule' && renderAuswertungsmoduleView()}
    </Box>
  );
}
