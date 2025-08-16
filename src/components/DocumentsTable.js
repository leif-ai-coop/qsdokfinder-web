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
	TextField,
} from '@mui/material';
import { formatVerfahren } from '../utils';

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

export default function DocumentsTable({ documents, columnFilters, onColumnFilterChange, showColumnFilters }) {
	return (
		<TableContainer component={Paper} sx={{ boxShadow: 0 }}>
			<Table size="small" stickyHeader>
				<TableHead>
					<TableRow>
						{headerCells.map((h) => (
							<TableCell key={h} sx={{ fontWeight: 600, whiteSpace: 'nowrap', p: 1 }}>{h}</TableCell>
						))}
					</TableRow>
					{showColumnFilters && (
            <TableRow>
              {headerCells.map((h) => (
                <TableCell key={`${h}-filter`} sx={{ p: 0.5 }}>
                  {h !== 'Download' ? (
                    <TextField
                      variant="outlined"
                      size="small"
                      fullWidth
                      placeholder={`Filter...`}
                      value={columnFilters[h] || ''}
                      onChange={(e) => onColumnFilterChange(h, e.target.value)}
                      sx={{
                        '& .MuiInputBase-root': {
                          fontSize: '0.75rem',
                          padding: '2px 8px',
                        },
                      }}
                    />
                  ) : null}
                </TableCell>
              ))}
            </TableRow>
          )}
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
										<TableCell sx={{ whiteSpace: 'nowrap', p: 1 }}>{formatVerfahren(row.QSV, row.Verfahrensnummer)}</TableCell>
										<TableCell sx={{ whiteSpace: 'nowrap', p: 1 }}>{row.Inhaltstyp || ''}</TableCell>
										<TableCell sx={{ whiteSpace: 'nowrap', p: 1 }}>{(row.Modul_EM_AM || '').replace('()', '-').trim()}</TableCell>
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


