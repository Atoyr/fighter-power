import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

import { LeftArea } from './LeftArea';
import { CenterArea } from './CenterArea';
import { RightArea } from './RightArea';

type ApplicationBarProps = {
  children: React.ReactNode
}

export const ApplicationBar = ({ children }: ApplicationBarProps) => {
  return (
    <Box>
      <AppBar position="fixed" 
        sx={{
          minHeight: 56,
          height: 56
        }}>
          <Toolbar disableGutters
            sx={{
              minHeight: { xs:56, sm:56 },
              height: { xs:56, sm: 56 }
            }}>
            <LeftArea />
            <CenterArea />
            <RightArea />
          </Toolbar>
      </AppBar>
      <Toolbar />
      {children}
    </Box>
  );
};
