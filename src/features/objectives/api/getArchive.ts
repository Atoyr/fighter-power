import { 
  doc,
  getDoc,
  Transaction,
} from 'firebase/firestore'

import { store } from '@/lib/firebase';
import { Result, Success, Failure } from '@/types';

import { ArchiveConverter } from './Converter';
import { Archive } from '../types';

export const getArchive = async (
  userId: string, 
  objectiveId: string, 
  keyResultId: string, 
  archiveId: string, 
  transaction?: Transaction): Promise<Result<(Archive | null), Error>> => {
  if (userId === "") {
    return new Failure(new RangeError("userId is empty."));
  }
  if (objectiveId === "") {
    return new Failure(new RangeError("objectiveId is empty."));
  }
  if (keyResultId === "") {
    return new Failure(new RangeError("keyResultId is empty."));
  }
  if (archiveId === "") {
    return new Failure(new RangeError("archiveId is empty."));
  }

  const ref = doc(store, `users/${userId}/objectives/${objectiveId}/keyResults/${keyResultId}/archives/${archiveId}`, objectiveId).withConverter(KeyResultConverter);
  const snapshot = await (transaction ? transaction.get(ref) : getDoc(ref));
  return new Success(snapshot.exists() ? snapshot.data() : null);
};
