import React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Container from '@mui/material/Container';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { GoalResult, newGoalResult } from 'data/goalResult';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export interface InputGoalResultDialogProps {
  title: string;
  open: boolean;
  inputGoalResult: GoalResult | null,
  goalCount: number,
  onClose: (value: GoalResult | null, isCancel: boolean) => void;
}

export function newInputGoalResultDialogProps() : InputGoalResultDialogProps {
  return {
    title: "",
    open: false,
    inputGoalResult: null,
    goalCount: 0,
    onClose: () => {}
  };
}

interface DialogState {
  type: string,
  goalAchives: string[],
}

export function InputGoalResultDialog(props: InputGoalResultDialogProps) {
  const { title, open, inputGoalResult, goalCount, onClose } = props;

  const [resultTitle, setResultTitle] = React.useState<string>(inputGoalResult?.title ?? "");
  const [type, setType] = React.useState<string>(inputGoalResult?.type ?? "");
  const [goalAchives, setGoalAchives] = React.useState<string[]>([]);
  const [note, setNote] = React.useState<string>(inputGoalResult?.note ?? "");
  const [errorParam, setErrorParam] = React.useState<{error: boolean, message: string}>({error: false, message: ""});
  

  useEffect(() => {
    let tempGoalAchives: string[] = [];
    for (var i = 0; i < goalCount; i++) {
      if (inputGoalResult != null && inputGoalResult.goalAchives && inputGoalResult.goalAchives[i]) {
        tempGoalAchives.push(inputGoalResult.goalAchives[i])
      } else {
        tempGoalAchives.push("");
      }
    }
    setGoalAchives([...tempGoalAchives]);
    setResultTitle(inputGoalResult?.title ?? "");
    setType(inputGoalResult?.type ?? "");
    setNote(inputGoalResult?.note ?? "");
    }, [open]);

  const changeTitle = (value: string) => {
    setResultTitle(value);
    setErrorParam({error: false, message: ""});
  };

  const changeType = (value: string)  => {
    setType(value);
    setErrorParam({error: false, message: ""});
  };

  const changeGoalAchive = (value: string, index: number) => {
    let tempGoalAchives: string[] = [...goalAchives];
    tempGoalAchives[index] = value;
    setGoalAchives(tempGoalAchives);
    setErrorParam({error: false, message: ""});
  };

  const changeNote = (value: string)  => {
    setNote(value);
    setErrorParam({error: false, message: ""});
  };


  const handleSave = async () => {
    if ( resultTitle == "" ) {
      setErrorParam({error: true, message: "???????????????????????????"});
      return;
    }
    if ( type == "" ) {
      setErrorParam({error: true, message: "?????????????????????????????????????????????"});
      return;
    }
    const goalResult = (inputGoalResult == null) ?
    { 
      ...newGoalResult("",0,""),
      title: resultTitle,
      note: note,
      goalAchives: [...goalAchives],
      type: type,
    }
    :{
      ...inputGoalResult,
      title: resultTitle,
      note: note,
      goalAchives: [...goalAchives],
      type: type,
    } as GoalResult;
    await onClose(goalResult, false);
    setResultTitle("");
    setNote("");
  };

  const handleCancelClose = async () => {
    await onClose(null, true);
    setResultTitle("");
    setNote("");
  };

  const alateSx = () => {
    const disp = errorParam.error ? "flex" : "none";
    return {
      my : 1,
      display: disp,
    };
  }

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleCancelClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleCancelClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {title}
          </Typography>
          <Button autoFocus color="inherit" onClick={handleSave}>
            ??????
          </Button>
        </Toolbar>
      </AppBar>
      <Box 
      sx={{
        textAlign: "left",
        mx: 2,
      }}>
        
        
        <Alert severity="error" sx={alateSx()}>
          <AlertTitle>Error</AlertTitle>
          {errorParam.message}
        </Alert>
        <Box
          sx={{
            display: "flex",
            flexDirection: 'row',
            textAlign: "center",
          }}>
          <TextField
            autoFocus
            margin="dense"
            label="????????????"
            type="text"
            variant="standard"
            onChange={(e) => changeTitle(e.target.value)}
            value={resultTitle}
            sx={{
              flexGrow: 1
            }}
            />
          <ToggleButtonGroup
            color="primary"
            value={type}
            exclusive
            onChange={(e,v) => changeType(v)}
            sx={{
              m: 1,
              flexGrow: 0
            }}>
              <ToggleButton value="battle">??????</ToggleButton>
              <ToggleButton value="training">?????????</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box
          sx={{
            textAlign: "left",
            mt: 2,
            display: "flex",
            flexDirection: 'column',
          }}>
            { goalAchives.map((goal, index) => {
            return (
              <Box
                key={`goalResult${index}`}
                sx={{
                  display: "flex",
                  flexDirection: 'row',
                  textAlign: "center",
                }}>
                  <Typography sx={{ ml: 2, my: 'auto', flexGrow: 1, minWidth: 70, textAlign: "center" }} variant="h6" component="h6">
                    ??????{index + 1}
                  </Typography>
                <ToggleButtonGroup
                  color="primary"
                  value={goal}
                  exclusive
                  fullWidth
                  size="small"
                  onChange={(e,v) => changeGoalAchive(v, index)}
                  sx={{
                    m: 1,
                    flexGrow: 1
                  }}>
                    <ToggleButton value="success">??????</ToggleButton>
                    <ToggleButton value="failure">??????</ToggleButton>
                    <ToggleButton value="outside">?????????</ToggleButton>
                    <ToggleButton value="nochance">?????????</ToggleButton>
                </ToggleButtonGroup>
              </Box>
            );})}
        </Box>
        <Box
          sx={{
            textAlign: "left",
            mt: 2,
          }}>
          <TextField
            id="note"
            label="??????"
            multiline
            rows={2}
            onChange={(e) => changeNote(e.target.value)}
            value={note}
            sx={{ width: "100%" }}
          />
        </Box>
      </Box>
    </Dialog>
  );
};

