import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';

import { 
  Button, 
  Container, 
  TextField, 
  Typography, 
  } from '@mui/material';

import { BreadcrumbsSetter } from '@/components/Breadcrumbs';
import { Title } from '@/components/Title';

import { useAuth, useErrorSnackbar, useInfoSnackbar } from '@/hooks';
import { MainContainerStyle } from '@/styles';

import { getKeyResult, getObjective, setKeyResult } from '../api';
import { InputKeyResult, KeyResultNotFound, ObjectiveNotFound } from '../components';
import { createKeyResult } from '../functions';

export const KeyResult = () => {
  const { objectiveId } = useParams<"objectiveId">();
  const { keyResultId } = useParams<"keyResultId">();
  const navigate = useNavigate();
  const authState = useAuth();
  const showErrorSnackbar = useErrorSnackbar();
  const showInfoSnackbar = useInfoSnackbar();

  const { data: objective } = useQuery([ "objective", authState.user.uid, objectiveId], () => getObjective(authState.user.uid, objectiveId));
  const { data: keyResult } = keyResultId === "new" ? { data: null } : useQuery([ "key-result", authState.user.uid, objectiveId, keyResultId], () => getKeyResult(authState.user.uid, objectiveId, keyResultId));
  const { mutate: updateKeyResultMutate } = useMutation(({userId, objectiveId, keyResult}) => setKeyResult(userId, objectiveId, keyResult), 
  {
    onSuccess: (id) => {
      navigate(`../${objectiveId}`);
    }
  });

  const [ keyResultTitle, setKeyResultTitle] = useState(keyResult?.title ?? "");
  const [ keyResultRank, setKeyResultRank] = useState(keyResult?.rank ?? 3);
  const [ keyResultMemo, setKeyResultMemo] = useState(keyResult?.memo ?? "");
  const [ isEdit, setIsEdit] = useState(false);

  const onSave = async () => {
    if(keyResultTitle === "") {
      showErrorSnackbar("目標に向けてやること (指標)が空白です");
      return;
    }
    const kr = keyResult ?? createKeyResult();
    kr.title = keyResultTitle;
    kr.rank = keyResultRank;
    kr.memo = keyResultMemo;
    updateKeyResultMutate({userId: authState.user.uid, objectiveId: objectiveId, keyResult: kr});
  };

  const onCancel = () => {
    setKeyResultTitle(keyResult?.title ?? "");
    setKeyResultRank(keyResult?.rank ?? 3);
    setKeyResultMemo(keyResult?.memo ?? "")
    showInfoSnackbar("キャンセルしました")
  }

  if (objective === null) {
    // Objectiveが取得できない場合
    return (
      <Container maxWidth="xl" sx={MainContainerStyle}>
        <Title title="指標入力" />
        <ObjectiveNotFound />
      </Container>);
  } else if (keyResultId !== "new" && keyResult === null ) {
    return (
      <Container maxWidth="xl" sx={MainContainerStyle}>
        <Title title="指標入力" />
        <KeyResultNotFound />
      </Container>);
  } else {
    const readOnly = (objective.status ?? "open") !== "open";
    const breadcrumbs = [
      { path: '/app/objectives', name: '目標一覧' },
      { path: `/app/objectives/${objectiveId}`, name: objective.title }, 
      { path: `/app/objectives/${objectiveId}/key-results/${keyResultId}`, name: keyResult?.title ?? "新規" }, 
    ];

    return (
      <Container maxWidth="xl" sx={MainContainerStyle}>
        <Title title={keyResultTitle} />
        <BreadcrumbsSetter breadcrumbs={breadcrumbs} />
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

