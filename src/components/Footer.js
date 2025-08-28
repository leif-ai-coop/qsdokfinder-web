import React from 'react';
import { Box, Typography, Link, useTheme } from '@mui/material';

const Footer = () => {
	const theme = useTheme();
	const year = new Date().getFullYear();
	return (
		<Box
			component="footer"
			sx={{
				py: 3,
				mt: 'auto',
				textAlign: 'center',
				backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0.05)',
			}}
		>
			<Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
				© {year} QS‑Dokumente
			</Typography>
			<Typography variant="body2" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
				<Link href="https://qs.leifwarming.de/nutzungsbedingungen.html" sx={{ mx: 2, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>Nutzungsbedingungen</Link>
				<Link href="https://qs.leifwarming.de/datenschutz.html" sx={{ mx: 2, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>Datenschutzerklärung</Link>
				<Link href="https://qs.leifwarming.de/impressum.html" sx={{ mx: 2, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>Impressum</Link>
			</Typography>
		</Box>
	);
};

export default Footer;


