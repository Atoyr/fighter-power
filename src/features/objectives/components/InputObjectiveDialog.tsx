import { useRecoilState, useResetRecoilState } from 'recoil';

import { InputDialogErrorState } from '../stores';

export type InputObjectiveDialogProps = {
  open: boolean;
  onClose: (goalSheetTitle: string, goalTitle: string, isCancel: boolean) => void;
}

export const InputObjectiveDialog = (props: InputObjectiveDialogProps) => {

  const [ errorProps, setErrorProps] = useRecoilState(InputDialogErrorState);
  const resetErrorProps = useResetRecoilState(InputDialogErrorState);
  const { open, onClose } = props;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetErrorProps();

    const formData = new FormData(event.currentTarget);
    const objectiveTitle = formData.get('objective_title') as string;
    const keyResultTitle = formData.get('key_result_title') as string;

    if ( objectiveTitle == "") {
      const objectiveTitleError = "空白です";
    }
    if ( keyResultTitle == "") {
      const keyResultTitleError = "空白です";
    }

    if (!objectiveTitle || !keyResultTitle)
    {
      setErrorProps({ objectiveTitle, keyResultTitle} );
      return;
    }
    await onClose(objectiveTitle, keyResultTitle, false);
  };

  const handleCancel = async () => {
    resetErrorProps();
    await onClose("", "", true);
  };

  return (
    <Dialog open={open} onClose={handleCancel} >
      <DialogTitle>目標を追加</DialogTitle>
      <form onSubmit={handleSubmit}>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="objective_title"
          id="objective_title"
          label="目標シート タイトル"
          error={errorProps.objectiveTitleErrorMessage}
          helperText={errorProps.objectiveTitleErrorMessage}
          type="text"
          fullWidth
          variant="standard"
          />
        <TextField
          margin="dense"
          name="key_result_title"
          id="key_result_title"
          label="目標1"
          error={errorProps.keyResultTitleErrorMessage}
          helperText={errorProps.keyResultTitleErrorMessage}
          type="text"
          fullWidth
          variant="standard"
          />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>キャンセル</Button>
        <Button type="submit">決定</Button>
      </DialogActions>
      </form>
    </Dialog> 
  );
}
