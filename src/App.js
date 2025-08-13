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
  TextField,
  MenuItem,
  Stack,
  IconButton,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { getStand, getYears, getQsv, getInhaltstypen, getModules, getDocuments } from './api';
import Header from './components/Header';
import Footer from './components/Footer';
import DocumentsTable from './components/DocumentsTable';
import FiltersPanel from './components/FiltersPanel';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: { main: '#1A3344' },
          secondary: { main: '#9c27b0' },
          background: { default: '#f5f5f5', paper: '#fff' },
        }
      : {
          primary: { main: '#6B9FA1' },
          secondary: { main: '#ce93d8' },
          background: { default: '#1A3344', paper: '#1e1e1e' },
          text: { primary: '#fff', secondary: grey[500] },
        }),
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: () => ({
        body: {
          backgroundColor: mode === 'dark' ? '#1A3344' : '#f5f5f5',
          transition: 'background-color 0.3s ease',
        },
      }),
    },
    MuiPaper: {
      styleOverrides: { root: { transition: 'background-color 0.3s ease' } },
    },
    MuiAppBar: {
      styleOverrides: { root: { backgroundColor: '#1A3344' } },
    },
  },
});

// Descriptions moved into FiltersPanel

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
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem('themeMode');
    return saved || 'light';
  });
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);
  const [query, setQuery] = useQueryState();

  const [stand, setStand] = useState(null);
  const [years, setYears] = useState([]);
  const [qsvList, setQsvList] = useState([]);
  const [inhaltstypen, setInhaltstypen] = useState([]);
  const [modules, setModules] = useState([]);
  const [docs, setDocs] = useState({ total: 0, documents: [] });

  const toggleColorMode = () => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', next);
      return next;
    });
  };

  useEffect(() => {
    if (mode === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [mode]);

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

  // Limit handling (results per page)
  const limitFromQuery = (() => {
    const raw = query.limit ?? '30';
    if (raw === 'all') return 'all';
    const v = parseInt(raw, 10);
    return Number.isFinite(v) ? String(v) : '30';
  })();
  const numericLimit = limitFromQuery === 'all' ? Infinity : parseInt(limitFromQuery, 10);
  const displayedDocuments = Number.isFinite(numericLimit) ? docs.documents.slice(0, numericLimit) : docs.documents;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: theme.palette.background.default }}>
        <Header toggleColorMode={toggleColorMode} />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1 }}>
          <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 2, background: theme.palette.background.paper }}>
            <Typography variant="h4" align="center" gutterBottom>QS-Dokumente</Typography>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" sx={{ mb: 1 }}>
              <Typography variant="body2">Anzahl Treffer: {docs.total}</Typography>
              <Typography variant="body2">|</Typography>
              <Typography variant="body2">Angezeigte Treffer (max.):</Typography>
              <TextField
                select
                size="small"
                value={limitFromQuery}
                onChange={(e) => setQuery((s) => ({ ...s, limit: e.target.value }))}
                sx={{ width: 90 }}
              >
                {[30, 50, 100].map((v) => (
                  <MenuItem key={v} value={String(v)}>{v}</MenuItem>
                ))}
                <MenuItem value="all">Alle</MenuItem>
              </TextField>
              <Typography variant="body2">|</Typography>
              <Typography variant="body2">Stand: {stand ?? '-'}</Typography>
              <IconButton size="small" aria-label="Info">
                <HelpOutlineIcon fontSize="small" />
              </IconButton>
            </Stack>

            {activeChips.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', mb: 2 }}>
                {activeChips.map(([k, label]) => (
                  <Chip key={k} label={label} color="primary" onClick={() => clearFilter(k)} />
                ))}
              </Box>
            )}

          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <FiltersPanel
                qsvList={qsvList}
                inhaltstypen={inhaltstypen}
                years={years}
                modules={modules}
                query={query}
                onSet={setOrToggle}
                onReset={resetAll}
              />
            </Grid>
            <Grid item xs={12} md={9}>
              <Paper sx={{ p: 1 }}>
                <Box sx={{ overflowX: 'auto' }}>
                  <DocumentsTable documents={displayedDocuments} />
                </Box>
              </Paper>
            </Grid>
          </Grid>
          </Paper>
        </Container>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}


