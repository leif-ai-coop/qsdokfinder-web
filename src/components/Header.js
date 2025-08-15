import React from 'react';
import { AppBar, Toolbar, Typography, Box, useMediaQuery, useTheme, Button, Stack } from '@mui/material';
import { ViewList, ViewModule } from '@mui/icons-material';
import ThemeToggle from './ThemeToggle';

const Header = ({ toggleColorMode, toggleFilterGUI, useAlternativeFilters }) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	return (
		<AppBar
			position="sticky"
			sx={{
				backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.85)' : 'primary.main',
				boxShadow: 3,
				mb: 3,
			}}
		>
			<Toolbar>
				<Typography variant={isMobile ? 'h6' : 'h5'} component="h1" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
					QS‑Dokumente
				</Typography>
				<Box>
					<Stack direction="row" spacing={1} alignItems="center">
						<Button
							variant="outlined"
							size="small"
							startIcon={useAlternativeFilters ? <ViewModule /> : <ViewList />}
							onClick={toggleFilterGUI}
							sx={{
								color: 'white',
								borderColor: 'rgba(255, 255, 255, 0.5)',
								'&:hover': {
									borderColor: 'white',
									backgroundColor: 'rgba(255, 255, 255, 0.1)',
								},
								textTransform: 'none',
								fontSize: isMobile ? '0.75rem' : '0.875rem',
							}}
						>
							{useAlternativeFilters ? 'Neue Filter-GUI' : 'Klassische Filter'}
						</Button>
						<ThemeToggle toggleColorMode={toggleColorMode} />
					</Stack>
				</Box>
			</Toolbar>
		</AppBar>
	);
};

export default Header;


