import React, { useEffect, useMemo, useState } from 'react';
import {
  CssBaseline,
  Container,
  Box,
  ThemeProvider,
  createTheme,
  Chip,
  Tooltip,
  Typography,
  Button,
  Grid,
  Paper,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { getStand, getYears, getQsv, getInhaltstypen, getModules, getDocuments } from './api';

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? { primary: { main: '#2c3e50' }, background: { default: '#ffffff', paper: '#fff' } }
      : { primary: { main: '#6B9FA1' }, background: { default: '#1A3344', paper: '#1e1e1e' }, text: { primary: '#fff', secondary: grey[500] } }),
  },
});

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

function useQueryState() {
  const [state, setState] = useState(() => Object.fromEntries(new URLSearchParams(window.location.search)));
  useEffect(() => {
    const url = new URL(window.location.href);
    url.search = new URLSearchParams(state).toString();
    window.history.replaceState({}, '', url.toString());
  }, [state]);
  return [state, setState];
}

export default function App() {
  const [mode, setMode] = useState('light');
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);
  const [query, setQuery] = useQueryState();

  const [stand, setStand] = useState(null);
  const [years, setYears] = useState([]);
  const [qsvList, setQsvList] = useState([]);
  const [inhaltstypen, setInhaltstypen] = useState([]);
  const [modules, setModules] = useState([]);
  const [docs, setDocs] = useState({ total: 0, documents: [] });

  useEffect(() => {
    getStand().then((d) => setStand(d.stand));
    getYears().then((d) => setYears(d.years));
    getQsv().then((d) => setQsvList(d.qsv));
    getInhaltstypen().then((d) => setInhaltstypen(d.inhaltstypen));
  }, []);

  useEffect(() => {
    getModules(query.qsv).then((d) => setModules(d.modules));
  }, [query.qsv]);

  useEffect(() => {
    getDocuments(query).then(setDocs);
  }, [query.year, query.qsv, query.inhaltstyp, query.modul, query.recent]);

  const activeChips = [];
  if (query.year) activeChips.push(['year', `Jahr: ${query.year}`]);
  if (query.qsv) activeChips.push(['qsv', `QS-Verfahren: ${query.qsv}`]);
  if (query.inhaltstyp) {
    const label = query.inhaltstyp === '1' ? 'Neueste: Letzte 7 Tage' : `Inhaltstyp: ${query.inhaltstyp}`;
    activeChips.push(['inhaltstyp', label]);
  }
  if (query.modul) activeChips.push(['modul', `Modul: ${query.modul}`]);
  if (query.recent) {
    const map = { '1': 'Letzte 7 Tage', '2': '7-14 Tage', '3': '14-30 Tage', '4': 'Letzter Monat' };
    activeChips.push(['recent', `Neueste Aktualisierungen: ${map[query.recent]}`]);
  }

  const setOrToggle = (key, value) => {
    setQuery((s) => {
      const n = { ...s };
      if (!value || s[key] === value) delete n[key]; else n[key] = value;
      if (key !== 'modul') delete n['modul'];
      return n;
    });
  };

  const clearFilter = (key) => setQuery((s) => { const n = { ...s }; delete n[key]; return n; });
  const resetAll = () => setQuery({});

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>QS-Dokumente</Typography>
        <Typography variant="body2" align="center" gutterBottom>
          Anzahl Treffer: {docs.total} {stand ? `| Stand: ${stand}` : ''}
        </Typography>

        {activeChips.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', mb: 2 }}>
            {activeChips.map(([k, label]) => (
              <Chip key={k} label={label} color="primary" onClick={() => clearFilter(k)} />
            ))}
          </Box>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button variant="contained" onClick={resetAll}>Filter zurücksetzen</Button>

              <Paper sx={{ p: 1 }}>
                <Typography variant="subtitle2">QS-Verfahren</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {qsvList.map(({ qsv, verfahrensnummer }) => (
                    <Chip key={qsv}
                      label={`${qsv} (${verfahrensnummer ?? '-'})`}
                      color={query.qsv === qsv ? 'primary' : 'default'}
                      onClick={() => setOrToggle('qsv', qsv)} />
                  ))}
                </Box>
              </Paper>

              <Paper sx={{ p: 1 }}>
                <Typography variant="subtitle2">Inhaltstyp</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {inhaltstypen.map((t) => (
                    <Tooltip key={t} title={inhaltstypDescriptions[t] || ''}>
                      <Chip label={t}
                        color={query.inhaltstyp === t ? 'primary' : 'default'}
                        onClick={() => setOrToggle('inhaltstyp', t)} />
                    </Tooltip>
                  ))}
                </Box>
              </Paper>

              <Paper sx={{ p: 1 }}>
                <Typography variant="subtitle2">Jahr</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {years.map((y) => (
                    <Chip key={y}
                      label={y}
                      color={query.year === y ? 'primary' : 'default'}
                      onClick={() => setOrToggle('year', y)} />
                  ))}
                </Box>
              </Paper>

              <Paper sx={{ p: 1 }}>
                <Typography variant="subtitle2">Auswertungsmodule (AM)</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {modules.filter(m => m.Modulart === 'AM').map(m => (
                    <Chip key={`AM-${m.Modul}`} label={m.Modul}
                      color={query.modul === m.Modul ? 'primary' : 'default'}
                      onClick={() => setOrToggle('modul', m.Modul)} />
                  ))}
                </Box>
                <Typography variant="subtitle2" sx={{ mt: 1 }}>Erfassungsmodule (EM)</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {modules.filter(m => m.Modulart === 'EM').map(m => (
                    <Chip key={`EM-${m.Modul}`} label={m.Modul}
                      color={query.modul === m.Modul ? 'primary' : 'default'}
                      onClick={() => setOrToggle('modul', m.Modul)} />
                  ))}
                </Box>
              </Paper>

              <Paper sx={{ p: 1 }}>
                <Typography variant="subtitle2">Neueste Aktualisierungen</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {[
                    { v: '1', l: 'Letzte 7 Tage' },
                    { v: '2', l: '7-14 Tage' },
                    { v: '3', l: '14-30 Tage' },
                    { v: '4', l: 'Letzter Monat' },
                  ].map(({ v, l }) => (
                    <Chip key={v} label={l}
                      color={query.recent === v ? 'primary' : 'default'}
                      onClick={() => setOrToggle('recent', v)} />
                  ))}
                </Box>
              </Paper>
            </Box>
          </Grid>

          <Grid item xs={12} md={9}>
            <Paper sx={{ p: 1 }}>
              <Box sx={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th>QS-Verfahren</th>
                      <th>Inhaltstyp</th>
                      <th>Modul (EM/AM)</th>
                      <th>Jahr</th>
                      <th>AJ/EJ/SJ</th>
                      <th>Version</th>
                      <th>Zusatzinfo</th>
                      <th>Download</th>
                    </tr>
                  </thead>
                  <tbody>
                    {docs.documents.map((row, idx) => (
                      (!row.Inhaltstyp || row.Inhaltstyp === '') ? (
                        <tr key={idx} style={{ background: idx % 2 ? '#f2f2f2' : 'transparent' }}>
                          <td colSpan="7">Sonstige Einträge...</td>
                          <td><a href={row.url} target="_blank" rel="noreferrer">Link</a></td>
                        </tr>
                      ) : (
                        <tr key={idx} style={{ background: idx % 2 ? '#f2f2f2' : 'transparent' }}>
                          <td>{`${row.QSV || ''} (${row.Verfahrensnummer || ''})`}</td>
                          <td>{row.Inhaltstyp || ''}</td>
                          <td>{row.Modul_EM_AM || ''}</td>
                          <td>{row.Jahr || ''}</td>
                          <td>{row.Jahr_typ || ''}</td>
                          <td>{row.Version || ''}</td>
                          <td>{row.Zusatzinfo || ''}</td>
                          <td><a href={row.url} target="_blank" rel="noreferrer">Link</a></td>
                        </tr>
                      )
                    ))}
                  </tbody>
                </table>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}


