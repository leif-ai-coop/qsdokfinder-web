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
							<TableCell key={h} sx={{ fontWeight: 600 }}>{h}</TableCell>
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
										<TableCell colSpan={7}>Sonstige Einträge...</TableCell>
										<TableCell>
											<MuiLink href={row.url} target="_blank" rel="noreferrer">Link</MuiLink>
										</TableCell>
									</>
								) : (
									<>
										<TableCell>{`${row.QSV || ''} (${row.Verfahrensnummer || ''})`}</TableCell>
										<TableCell>{row.Inhaltstyp || ''}</TableCell>
										<TableCell>{row.Modul_EM_AM || ''}</TableCell>
										<TableCell>{row.Jahr || ''}</TableCell>
										<TableCell>{row.Jahr_typ || ''}</TableCell>
										<TableCell>{row.Version || ''}</TableCell>
										<TableCell>{row.Zusatzinfo || ''}</TableCell>
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


