import React from 'react';
import { Box, Button, Chip, Paper, Tooltip, Typography } from '@mui/material';

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

export default function FiltersPanel({ qsvList, inhaltstypen, years, modules, modulesLoading, query, onSet, onReset }) {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
			<Button variant="contained" onClick={onReset}>Filter zurücksetzen</Button>
			<Paper sx={{ p: 1 }}>
				<Typography variant="subtitle2">QS-Verfahren</Typography>
				<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
					{qsvList.map(({ qsv, verfahrensnummer }) => (
						<Chip key={qsv}
							label={`${qsv} (${verfahrensnummer ?? '-'})`}
							color={query.qsv === qsv ? 'primary' : 'default'}
							onClick={() => onSet('qsv', qsv)} />
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
								onClick={() => onSet('inhaltstyp', t)} />
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
							onClick={() => onSet('year', y)} />
					))}
				</Box>
			</Paper>

			<Paper sx={{ p: 1 }}>
				<Typography variant="subtitle2">Auswertungsmodule (AM)</Typography>
				<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
					{modulesLoading && (
						<Typography variant="body2" color="text.secondary">Lade Module…</Typography>
					)}
					{!modulesLoading && modules.filter(m => m.Modulart === 'AM').map(m => (
						<Chip key={`AM-${m.Modul}`} label={m.Modul}
							color={query.modul === m.Modul ? 'primary' : 'default'}
							onClick={() => onSet('modul', m.Modul)} />
					))}
				</Box>
				<Typography variant="subtitle2" sx={{ mt: 1 }}>Erfassungsmodule (EM)</Typography>
				<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
					{modulesLoading && (
						<Typography variant="body2" color="text.secondary">Lade Module…</Typography>
					)}
					{!modulesLoading && modules.filter(m => m.Modulart === 'EM').map(m => (
						<Chip key={`EM-${m.Modul}`} label={m.Modul}
							color={query.modul === m.Modul ? 'primary' : 'default'}
							onClick={() => onSet('modul', m.Modul)} />
					))}
				</Box>
			</Paper>
		</Box>
	);
}


