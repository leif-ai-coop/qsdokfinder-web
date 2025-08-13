import React, { useState } from 'react';
import { IconButton, Popover, Typography, Box, Link } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const InfoHelp = () => {
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const handleOpen = (event) => setAnchorEl(event.currentTarget);
	const handleClose = () => setAnchorEl(null);

	return (
		<>
			<IconButton size="small" aria-label="Info" onClick={handleOpen}>
				<HelpOutlineIcon fontSize="small" />
			</IconButton>

			<Popover
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
				transformOrigin={{ vertical: 'top', horizontal: 'left' }}
			>
				<Box sx={{ p: 2, maxWidth: 360 }}>
					<Typography variant="body2" paragraph>
						Diese Tabelle enthält Links zu den QS‑Dokumenten zum angegebenen Stand (Updates erfolgen morgens).
					</Typography>
					<Typography variant="body2" paragraph>
						In der Spalte links lässt sich die Tabelle filtern.
					</Typography>
					<Typography variant="body2" paragraph>
						In der Tabelle sind diejenigen Dokumente aufgeführt, die auf den Unterseiten von{' '}
						<Link href="https://iqtig.org/qs-verfahren/" target="_blank" rel="noreferrer">https://iqtig.org/qs-verfahren/</Link>{' '}
						verfügbar sind.
					</Typography>
					<Typography variant="body2" paragraph>
						Achtung: Dort (und somit auch hier) sind nicht zu allen Spezifikationsinhalten, die unter{' '}
						<Link href="https://iqtig.org/spezifikationen/" target="_blank" rel="noreferrer">https://iqtig.org/spezifikationen/</Link>{' '}
						veröffentlicht sind, Dokumente zu finden.
					</Typography>
				</Box>
			</Popover>
		</>
	);
};

export default InfoHelp;


