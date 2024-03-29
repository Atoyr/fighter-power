import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';

export const Loading = () => {
  return(
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

