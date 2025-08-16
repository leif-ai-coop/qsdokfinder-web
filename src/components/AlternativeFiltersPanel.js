import React, { useState, useEffect } from 'react';
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
  Stack,
  Grid,
  IconButton,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import EditIcon from '@mui/icons-material/Edit';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { formatVerfahren } from '../utils';
import YearChart from './YearChart';

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
  documents,
  query, 
  onSet, 
  onReset 
}) {
  // Navigation state: 'qsverfahren' | 'erfassungsmodule' | 'auswertungsmodule'
  const [activeView, setActiveView] = useState('qsverfahren');

  // Automatically switch to the 'qsverfahren' view when a qsv is selected
  useEffect(() => {
    if (query.qsv) {
      setActiveView('qsverfahren');
    }
  }, [query.qsv]);

  // Filter modules by type
  const erfassungsmodule = modules.filter(m => m.Modulart === 'EM');
  const auswertungsmodule = modules.filter(m => m.Modulart === 'AM');
  const chipSx = { '& .MuiChip-label': { maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis' } };

  const handleViewChange = (newView) => {
    setActiveView(newView);
    // Clear module filter when switching views
    if (query.modul) {
      onSet('modul', null);
    }
  };

  const renderQSVerfahrenView = () => {
    // If a QS-Verfahren is selected, show module overview instead
    if (query.qsv) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {/* Static Top Part: Header and Chart */}
          <Box sx={{ flexShrink: 0, mb: 2 }}>
            <Paper sx={{ p: 1.5 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  Ausgewähltes Verfahren:
                </Typography>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Typography variant="h6" component="h3">
                    {query.qsv}
                  </Typography>
                  <Tooltip title="Verfahren ändern">
                    <IconButton size="small" onClick={() => onSet('qsv', null)}>
                      <EditIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>
              <YearChart 
                qsv={query.qsv}
                documents={documents}
                jahrTyp={query.jahr_typ ?? null}
                onJahrTypChange={(jt) => onSet('jahr_typ', jt)}
                onYearClick={(year) => onSet('year', year)}
              />
            </Paper>
          </Box>

          {/* Scrollable Bottom Part: All other filters */}
          <Box sx={{ pr: 1 }}>
            <Paper sx={{ p: 1.5, mb: 2 }}>
              <Box>
                <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ mb: 0 }}>Inhaltstyp</Typography>
                  <Tooltip title="Fahren Sie mit der Maus über einen Button, um eine Beschreibung des Inhaltstyps anzuzeigen.">
                    <InfoOutlinedIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                  </Tooltip>
                </Stack>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {inhaltstypen.map((t) => (
                    <Tooltip key={t} title={inhaltstypDescriptions[t] || ''}>
                      <Chip 
                        label={t}
                        color={query.inhaltstyp === t ? 'primary' : 'default'}
                        onClick={() => onSet('inhaltstyp', t)} 
                        size="small"
                      />
                    </Tooltip>
                  ))}
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>
                  {erfassungsmodule.length === 1 ? 'Erfassungsmodul:' : 'Erfassungsmodule:'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {erfassungsmodule.map(m => (
                    <Chip 
                      key={`EM-${m.Modul}`} 
                      label={`${m.Modul} (EM)`}
                      color={query.modul === m.Modul ? 'primary' : 'default'}
                      onClick={() => onSet('modul', m.Modul)}
                      size="small"
                      sx={chipSx}
                    />
                  ))}
                  {erfassungsmodule.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      Keine Erfassungsmodule verfügbar
                    </Typography>
                  )}
                </Box>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="secondary" sx={{ mb: 1 }}>
                  {auswertungsmodule.length === 1 ? 'Auswertungsmodul:' : 'Auswertungsmodule:'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {auswertungsmodule.map(m => (
                    <Chip 
                      key={`AM-${m.Modul}`} 
                      label={`${m.Modul} (AM)`}
                      color={query.modul === m.Modul ? 'primary' : 'default'}
                      onClick={() => onSet('modul', m.Modul)}
                      size="small"
                      sx={chipSx}
                    />
                  ))}
                  {auswertungsmodule.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      Keine Auswertungsmodule verfügbar
                    </Typography>
                  )}
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      );
    }

    // Default QS-Verfahren selection view
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>QS-Verfahren auswählen:</Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {qsvList.map(({ qsv, verfahrensnummer }) => (
              <Chip 
                key={qsv}
                label={formatVerfahren(qsv, verfahrensnummer)}
                color={query.qsv === qsv ? 'primary' : 'default'}
                onClick={() => onSet('qsv', qsv)}
                sx={{ mb: 1 }}
              />
            ))}
          </Box>
        </Paper>
        <Paper sx={{ p: 1.5 }}>
          <YearChart 
            qsv={null}
            documents={documents}
            jahrTyp={query.jahr_typ ?? null}
            onJahrTypChange={(jt) => onSet('jahr_typ', jt)}
            onYearClick={(year) => onSet('year', year)}
          />
        </Paper>
      </Box>
    );
  };

  const renderErfassungsmoduleView = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Paper sx={{ p: 1.5 }}>
        <Typography variant="h6" gutterBottom>{erfassungsmodule.length === 1 ? 'Erfassungsmodul' : 'Erfassungsmodule'}</Typography>
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

      {query.modul ? (
        <>
          <Paper sx={{ p: 1.5 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={query.qsv ? 7 : 12}>
                <Typography variant="subtitle1" gutterBottom>QS-Verfahren</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  {qsvList.map(({ qsv, verfahrensnummer }) => (
                    <Chip 
                      key={qsv}
                      label={`${qsv} (${verfahrensnummer ?? '-'})`}
                      color={query.qsv === qsv ? 'primary' : 'default'}
                      onClick={() => onSet('qsv', qsv)} 
                      size="small"
                    />
                  ))}
                </Box>

              </Grid>

              {query.qsv && (
                <Grid item xs={12} md={5}>
                  <YearChart 
                    qsv={query.qsv}
                    documents={documents}
                    jahrTyp={query.jahr_typ ?? null}
                    onJahrTypChange={(jt) => onSet('jahr_typ', jt)}
                    onYearClick={(year) => onSet('year', year)}
                  />
                </Grid>
              )}
            </Grid>
          </Paper>
        </>
      ) : (
        <Paper sx={{ p: 1.5 }}>
          <YearChart 
            qsv={null}
            documents={documents}
            jahrTyp={query.jahr_typ ?? null}
            onJahrTypChange={(jt) => onSet('jahr_typ', jt)}
            onYearClick={(year) => onSet('year', year)}
          />
        </Paper>
      )}
    </Box>
  );

  const renderAuswertungsmoduleView = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Paper sx={{ p: 1.5 }}>
        <Typography variant="h6" gutterBottom>{auswertungsmodule.length === 1 ? 'Auswertungsmodul' : 'Auswertungsmodule'}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Wählen Sie ein Auswertungsmodul, um Rechenregeln und Berichte zu finden:
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

      {query.modul ? (
        <>
          <Paper sx={{ p: 1.5 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={query.qsv ? 7 : 12}>
                <Typography variant="subtitle1" gutterBottom>QS-Verfahren</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  {qsvList.map(({ qsv, verfahrensnummer }) => (
                    <Chip 
                      key={qsv}
                      label={`${qsv} (${verfahrensnummer ?? '-'})`}
                      color={query.qsv === qsv ? 'primary' : 'default'}
                      onClick={() => onSet('qsv', qsv)} 
                      size="small"
                    />
                  ))}
                </Box>

              </Grid>

              {query.qsv && (
                <Grid item xs={12} md={5}>
                  <YearChart 
                    qsv={query.qsv}
                    documents={documents}
                    jahrTyp={query.jahr_typ ?? null}
                    onJahrTypChange={(jt) => onSet('jahr_typ', jt)}
                    onYearClick={(year) => onSet('year', year)}
                  />
                </Grid>
              )}
            </Grid>
          </Paper>
        </>
      ) : (
        <Paper sx={{ p: 1.5 }}>
          <YearChart 
            qsv={null}
            documents={documents}
            jahrTyp={query.jahr_typ ?? null}
            onJahrTypChange={(jt) => onSet('jahr_typ', jt)}
            onYearClick={(year) => onSet('year', year)}
          />
        </Paper>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Navigation Buttons - Conditionally Rendered */}
      {!query.qsv && !query.modul && (
        <Paper sx={{ p: 2 }}>
          <Stack direction="column" spacing={1.5} sx={{ mb: 2 }}>
            <Button
              fullWidth
              variant={activeView === 'qsverfahren' ? 'contained' : 'outlined'}
              onClick={() => handleViewChange('qsverfahren')}
              size="small"
            >
              QS-Verfahren
            </Button>
            <Button
              fullWidth
              variant={activeView === 'erfassungsmodule' ? 'contained' : 'outlined'}
              onClick={() => handleViewChange('erfassungsmodule')}
              size="small"
            >
              Erfassungsmodule
            </Button>
            <Button
              fullWidth
              variant={activeView === 'auswertungsmodule' ? 'contained' : 'outlined'}
              onClick={() => handleViewChange('auswertungsmodule')}
              size="small"
            >
              Auswertungsmodule
            </Button>
          </Stack>
          <Divider />
        </Paper>
      )}

      {/* Dynamic Content Based on Active View */}
      {activeView === 'qsverfahren' && renderQSVerfahrenView()}
      {activeView === 'erfassungsmodule' && renderErfassungsmoduleView()}
      {activeView === 'auswertungsmodule' && renderAuswertungsmoduleView()}
    </Box>
  );
}
