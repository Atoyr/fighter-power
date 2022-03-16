import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import { useAuthContext } from 'context/AuthProvider'
import { useUserContext } from 'context/UserProvider'
import SiteLogo from 'components/SiteLogo';
import { setGoalSheet, newGoalSheet } from 'data/goalSheet';
import { newGoal } from 'data/goal';
import { newGoalResult } from 'data/goalResult';
import { useGoalSheets } from 'hook/useGoalSheets';

export default function Home() {
  let authContext = useAuthContext();
  let userContext = useUserContext();
  let goalSheets = useGoalSheets(userContext?.id ?? "");
  const displayName = userContext ? userContext.displayName : "";

  const handleSubmit = () => {
    let id =userContext.id as string;
    let gs = newGoalSheet("title!", "note");
    // let g1 = newGoal("goal1", 1);
    // let g2 = newGoal("goal2", 2);
    // let r1 = newGoalResult("result1", 1, "note");
    // gs.goals = [g1, g2];
    // gs.results = [r1];

    let result = setGoalSheet(id, gs);
    console.log(result);
  };
  return (
    <Container maxWidth="xl" 
    sx={{
      mt: { xs: 1, sm: 10 }
    }}>
    <h2>目標シート</h2>
    <Box>
      <Button variant="outlined" fullWidth 
        sx={{
          m:1,
          p:1,
          width: { sm: 250 },
          height : { xs : 50, sm: 200 }
        }}>
        目標シートを追加
      </Button>

      { goalSheets ? 
      goalSheets.map((goalSheet) => {
        const href = `goalsheet/${goalSheet.id}`;
        return (
        <Button variant="outlined" fullWidth 
          key={goalSheet.id}
          sx={{
            m:1,
            p:1,
            width: { sm: 250 },
            height : { xs : 200 },
          }}
          href={href}>
          {goalSheet.title}
        </Button>
        );
      })
      : 
      <Stack spacing={1}>
        <Skeleton variant="text" />
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="rectangular" width={210} height={118} />
      </Stack>
      }
    </Box>
  </Container>
  );
}
