
import { Box, CircularProgress } from '@mui/material';

const PageLoader = () => (
  <Box
    sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
       background:
          "radial-gradient(circle at top left, #e5e7ee 0%, #cfd9e2 45%, #f5f3ff 100%)",
    }}
  >
    <CircularProgress size={36} thickness={10} />
  </Box>
);

export default PageLoader;