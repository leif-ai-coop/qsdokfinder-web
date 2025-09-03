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
import FilterListIcon from '@mui/icons-material/FilterList';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { grey } from '@mui/material/colors';
import { getStand, getYears, getQsv, getInhaltstypen, getModules, getDocuments } from './api';
import { formatVerfahren } from './utils';
import Header from './components/Header';
import Footer from './components/Footer';
import DocumentsTable from './components/DocumentsTable';
import FiltersPanel from './components/FiltersPanel';
import AlternativeFiltersPanel from './components/AlternativeFiltersPanel';
import InfoHelp from './components/InfoHelp';

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
  
  // Use alternative filter GUI by default
  const [useAlternativeFilters, setUseAlternativeFilters] = useState(() => {
    const saved = localStorage.getItem('useAlternativeFilters');
    return saved !== null ? saved === 'true' : true; // Default to true (alternative GUI)
  });
  const [columnFilters, setColumnFilters] = useState({});
  const [showColumnFilters, setShowColumnFilters] = useState(false);

  const [stand, setStand] = useState(null);
  const [years, setYears] = useState([]);
  const [qsvList, setQsvList] = useState([]);
  const [inhaltstypen, setInhaltstypen] = useState([]);
  const [modules, setModules] = useState([]);
  const [modulesLoading, setModulesLoading] = useState(false);
  const [docs, setDocs] = useState({ total: 0, documents: [] });

  const toggleColorMode = () => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', next);
      return next;
    });
  };

  const toggleFilterGUI = () => {
    setUseAlternativeFilters((prev) => {
      const next = !prev;
      localStorage.setItem('useAlternativeFilters', next);
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
    // Load modules only when a Verfahren (qsv) is selected to avoid flashing global list
    if (query.qsv) {
      setModulesLoading(true);
      setModules([]); // clear to prevent flash of stale data
      getModules(query.qsv)
        .then((d) => setModules(d.modules))
        .finally(() => setModulesLoading(false));
    } else {
      setModules([]);
      setModulesLoading(false);
    }
  }, [query.qsv]);

  useEffect(() => {
    // If a module is selected without a qsv, find the qsv and set it
    if (query.modul && !query.qsv) {
      getDocuments({ modul: query.modul, limit: 1 }).then(result => {
        if (result.documents && result.documents.length > 0) {
          const doc = result.documents[0];
          if (doc.QSV) {
            setQuery(s => ({ ...s, qsv: doc.QSV }));
          }
        }
      });
    } else {
      getDocuments(query).then(setDocs);
    }
  }, [query, setQuery]);
  
  useEffect(() => {
    if (query.qsv) {
      getDocuments(query).then(setDocs);
    }
  }, [query]);

  const activeChips = [];
  if (query.year) activeChips.push(['year', `Jahr: ${query.year}`]);
  if (query.qsv) activeChips.push(['qsv', `QS-Verfahren: ${query.qsv}`]);
  if (query.inhaltstyp) {
    const label = query.inhaltstyp === '1' ? 'Neueste: Letzte 7 Tage' : `Inhaltstyp: ${query.inhaltstyp}`;
    activeChips.push(['inhaltstyp', label]);
  }
  if (query.modul) activeChips.push(['modul', `Modul: ${query.modul}`]);
  if (query.jahr_typ) activeChips.push(['jahr_typ', `AJ/EJ/SJ: ${query.jahr_typ}`]);

  const setOrToggle = (key, value) => {
    setQuery((s) => {
      const n = { ...s };
      if (!value || s[key] === value) delete n[key]; else n[key] = value;
      if (key !== 'modul') delete n['modul'];
      return n;
    });
  };

  const clearFilter = (key) => setQuery((s) => { const n = { ...s }; delete n[key]; return n; });
  const resetAll = () => {
    setQuery({});
    setColumnFilters({});
  };
  
  const handleColumnFilterChange = (column, value) => {
    setColumnFilters(prev => ({ ...prev, [column]: value }));
  };

  // Limit handling (results per page)
  const limitFromQuery = (() => {
    const raw = query.limit ?? '30';
    if (raw === 'all') return 'all';
    const v = parseInt(raw, 10);
    return Number.isFinite(v) ? String(v) : '30';
  })();
  const numericLimit = limitFromQuery === 'all' ? Infinity : parseInt(limitFromQuery, 10);
  const filteredDocsByJahrTyp = query.jahr_typ ? (docs.documents || []).filter((d) => d.Jahr_typ === query.jahr_typ) : (docs.documents || []);
  
  const columnToPropertyMap = {
    'QS-Verfahren': ['QSV', 'Verfahrensnummer'],
    'Inhaltstyp': ['Inhaltstyp'],
    'Modul (EM/AM)': ['Modul_EM_AM'],
    'Jahr': ['Jahr'],
    'AJ/EJ/SJ': ['Jahr_typ'],
    'Version': ['Version'],
    'Zusatzinfo': ['Zusatzinfo'],
  };

  const documentsAfterColumnFilters = filteredDocsByJahrTyp.filter(doc => {
    return Object.entries(columnFilters).every(([column, filterValue]) => {
      const properties = columnToPropertyMap[column];
      if (!properties || !filterValue) return true;
      
      const lowerCaseFilterValue = filterValue.toLowerCase();

      // Special handling for the formatted 'QS-Verfahren' column
      if (column === 'QS-Verfahren') {
        const formatted = formatVerfahren(doc.QSV, doc.Verfahrensnummer).toLowerCase();
        return formatted.includes(lowerCaseFilterValue);
      }

      // Check if any of the associated properties match the filter
      return properties.some(prop => {
        const docValue = doc[prop];
        if (docValue === null || docValue === undefined) return false;
        return String(docValue).toLowerCase().includes(lowerCaseFilterValue);
      });
    });
  });

  // Default: alphabetically by formatted QS-Verfahren; stable fallbacks
  documentsAfterColumnFilters.sort((a, b) => {
    const labelA = (formatVerfahren(a.QSV, a.Verfahrensnummer) || '').trim();
    const labelB = (formatVerfahren(b.QSV, b.Verfahrensnummer) || '').trim();
    // Empty labels go to the end
    const aEmpty = labelA.length === 0;
    const bEmpty = labelB.length === 0;
    if (aEmpty && !bEmpty) return 1;
    if (!aEmpty && bEmpty) return -1;

    const cmp = labelA.localeCompare(labelB, 'de', { sensitivity: 'base' });
    if (cmp !== 0) return cmp;
    // Fallback: Jahr desc, Version desc
    if (a.Jahr !== b.Jahr) {
      return (b.Jahr || 0) - (a.Jahr || 0);
    }
    const versionA = parseInt((a.Version || '').replace('v', ''), 10) || 0;
    const versionB = parseInt((b.Version || '').replace('v', ''), 10) || 0;
    return versionB - versionA;
  });

  const totalToShow = documentsAfterColumnFilters.length;
  const displayedDocuments = Number.isFinite(numericLimit) ? documentsAfterColumnFilters.slice(0, numericLimit) : documentsAfterColumnFilters;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: theme.palette.background.default }}>
        <Header 
          toggleColorMode={toggleColorMode} 
          toggleFilterGUI={toggleFilterGUI}
          useAlternativeFilters={useAlternativeFilters}
        />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1 }}>
          <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 2, background: theme.palette.background.paper }}>
            <Typography variant="h4" align="center" gutterBottom>QS-Dokumente</Typography>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" sx={{ mb: 1 }}>
              <Typography variant="body2">Anzahl Treffer: {totalToShow}</Typography>
              <Tooltip title="Spaltenfilter ein-/ausblenden">
                <IconButton size="small" onClick={() => setShowColumnFilters(!showColumnFilters)} color={showColumnFilters ? 'primary' : 'default'}>
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
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
              <InfoHelp />
            </Stack>

            {activeChips.length > 0 && (
              <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                {activeChips.map(([k, label]) => (
                  <Chip key={k} label={label} color="primary" onClick={() => clearFilter(k)} />
                ))}
                <Button
                  variant="text"
                  size="small"
                  onClick={resetAll}
                  startIcon={<RestartAltIcon />}
                  sx={{ ml: 1, color: 'text.secondary' }}
                >
                  Alle zurücksetzen
                </Button>
              </Stack>
            )}

          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              md={3}
              lg={3}
              sx={{
                position: { md: 'sticky' },
                top: '88px',
                alignSelf: 'flex-start',
              }}
            >
              {useAlternativeFilters ? (
                <AlternativeFiltersPanel
                  qsvList={qsvList}
                  inhaltstypen={inhaltstypen}
                  years={years}
                  modules={modules}
                  modulesLoading={modulesLoading}
                  documents={docs.documents}
                  query={query}
                  onSet={setOrToggle}
                  onReset={resetAll}
                />
              ) : (
                <FiltersPanel
                  qsvList={qsvList}
                  inhaltstypen={inhaltstypen}
                  years={years}
                  modules={modules}
                  modulesLoading={modulesLoading}
                  query={query}
                  onSet={setOrToggle}
                  onReset={resetAll}
                />
              )}
            </Grid>
            <Grid item xs={12} md={9} lg={9}>
              <Paper sx={{ p: 1 }}>
                <Box sx={{ overflowX: 'auto' }}>
                  <DocumentsTable 
                    documents={displayedDocuments} 
                    columnFilters={columnFilters}
                    onColumnFilterChange={handleColumnFilterChange}
                    showColumnFilters={showColumnFilters}
                  />
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


