import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';

import { 
  Button, 
  Container, 
  TextField, 
  Typography, 
  } from '@mui/material';

import { useAuth } from '@/hooks';
import { MainContainerStyle } from '@/styles';

import { getKeyResult, getObjective, setKeyResult } from '../api';
import { InputKeyResult, KeyResultNotFound, ObjectiveNotFound } from '../components';
import { createKeyResult } from '../functions';

export const KeyResult = () => {
  const { objectiveId } = useParams<"objectiveId">();
  const { keyResultId } = useParams<"keyResultId">();
  const navigate = useNavigate();
  const authState = useAuth();

  const { data: objective } = useQuery([ "objective", authState.user.uid, objectiveId], () => getObjective(authState.user.uid, objectiveId));
  const { data: keyResult } = keyResultId === "new" ? { data: null } : useQuery([ "key-result", authState.user.uid, objectiveId, keyResultId], () => getKeyResult(authState.user.uid, objectiveId, keyResultId));

  const [ keyResultTitle, setKeyResultTitle] = useState(keyResult?.title ?? "");
  const [ keyResultRank, setKeyResultRank] = useState(keyResult?.rank ?? 3);
  const [ keyResultMemo, setKeyResultMemo] = useState(keyResult?.memo ?? "");
  const [ isEdit, setIsEdit] = useState(false);

  const onSave = async () => {
    const kr = KeyResult ?? createKeyResult();
    kr.title = keyResultTitle;
    kr.rank = keyResultRank;
    kr.memo = keyResultMemo;
    const result = await setKeyResult(authState.user.uid, objectiveId, kr);
    if(result.isSuccess()) { 
      navigate(`../${objectiveId}`);
    } else {
      // TODO Error
      console.log(result.value);
    }
  };

  const onCancel = () => {
    setKeyResultTitle(keyResult?.title ?? "");
    setKeyResultRank(keyResult?.rank ?? 3);
    setKeyResultMemo(keyResult?.memo ?? "")
  }

  if (objective === null) {
    // Objectiveが取得できない場合
    return (
      <Container maxWidth="xl" sx={MainContainerStyle}>
        <ObjectiveNotFound />
      </Container>);
  } else if (keyResultId !== "new" && keyResult === null ) {
    return (
      <Container maxWidth="xl" sx={MainContainerStyle}>
        <KeyResultNotFound />
      </Container>);
  } else {
    const readOnly = objective.status ?? "open" !== "open";

    return (
      <Container maxWidth="xl" sx={MainContainerStyle}>
        <Typography variant="h3" noWrap component="h3">
        {objective.title}
        </Typography>
        <InputKeyResult 
          title={keyResultTitle}
          rank={keyResultRank}
          memo={keyResultMemo}
          onChangeTitle={(newValue) => setKeyResultTitle(newValue)}
          onChangeMemo={(newValue) => setKeyResultMemo(newValue)}
          onChangeRank={(newValue) => setKeyResultRank(newValue)}
          readOnly={readOnly}
        />
        <Button onClick={onSave}>決定</Button>
        <Button onClick={onCancel}>キャンセル</Button>
      </Container>);
  }
};

