import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export function useMobile() {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down('md'));
}

export default useMobile;