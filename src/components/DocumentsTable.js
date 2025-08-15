import React from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Link as MuiLink,
	Paper,
} from '@mui/material';

const headerCells = [
	'QS-Verfahren',
	'Inhaltstyp',
	'Modul (EM/AM)',
	'Jahr',
	'AJ/EJ/SJ',
	'Version',
	'Zusatzinfo',
	'Download',
];

export default function DocumentsTable({ documents }) {
	return (
		<TableContainer component={Paper} sx={{ boxShadow: 0 }}>
			<Table size="small" stickyHeader>
				<TableHead>
					<TableRow>
						{headerCells.map((h) => (
							<TableCell key={h} sx={{ fontWeight: 600, whiteSpace: 'nowrap', p: 1 }}>{h}</TableCell>
						))}
					</TableRow>
				</TableHead>
				<TableBody>
					{documents.map((row, idx) => {
						const isOther = !row.Inhaltstyp || row.Inhaltstyp === '';
						return (
							<TableRow key={idx} hover sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}>
								{isOther ? (
									<>
										<TableCell colSpan={7} sx={{ whiteSpace: 'nowrap', p: 1 }}>Sonstige Einträge...</TableCell>
										<TableCell>
											<MuiLink href={row.url} target="_blank" rel="noreferrer">Link</MuiLink>
										</TableCell>
									</>
								) : (
									<>
										<TableCell sx={{ whiteSpace: 'nowrap', p: 1 }}>{`${row.QSV || ''} (${row.Verfahrensnummer || ''})`}</TableCell>
										<TableCell sx={{ whiteSpace: 'nowrap', p: 1 }}>{row.Inhaltstyp || ''}</TableCell>
										<TableCell sx={{ whiteSpace: 'nowrap', p: 1 }}>{row.Modul_EM_AM || ''}</TableCell>
										<TableCell sx={{ whiteSpace: 'nowrap', p: 1 }}>{row.Jahr || ''}</TableCell>
										<TableCell sx={{ whiteSpace: 'nowrap', p: 1 }}>{row.Jahr_typ || ''}</TableCell>
										<TableCell sx={{ whiteSpace: 'nowrap', p: 1 }}>{row.Version || ''}</TableCell>
										<TableCell sx={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', p: 1 }}>{row.Zusatzinfo || ''}</TableCell>
										<TableCell>
											<MuiLink href={row.url} target="_blank" rel="noreferrer">Link</MuiLink>
										</TableCell>
									</>
								)}
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</TableContainer>
	);
}


