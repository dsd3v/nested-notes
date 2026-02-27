import { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import {
  selectDeletingNotesContainerSuccessMessage,
  selectEditingNotesContainersErrorMessage,
  selectEditingNotesContainersSuccessMessage,
  selectIsEditingNotesContainers,
} from '../../selectors/notesContainerSelectors';
import { useAppDispatch, useAppSelector } from '../../store';
import { AlertDiv } from '../../styles/GlobalStyles';

export const NotesContainersGridAlert = () => {
  const dispatch = useAppDispatch();
  const deletingNotesContainerSuccessMessage = useAppSelector(selectDeletingNotesContainerSuccessMessage);
  const editingNotesContainersErrorMessage = useAppSelector(selectEditingNotesContainersErrorMessage);
  const editingNotesContainersSuccessMessage = useAppSelector(selectEditingNotesContainersSuccessMessage);
  const isSavingChanges = useAppSelector(selectIsEditingNotesContainers);

  const [showDeletedNotesContainerSuccessAlert, setShowDeletedNotesContainerSuccessAlert] = useState(!!deletingNotesContainerSuccessMessage);
  const [showEditingErrorAlert, setShowEditingErrorAlert] = useState(!!editingNotesContainersErrorMessage);
  const [showSavingChangesAlert, setShowSavingChangesAlert] = useState(!!isSavingChanges);
  const [showEditingSuccessAlert, setShowEditingSuccessAlert] = useState(!!editingNotesContainersSuccessMessage);

  useEffect(() => {
    if (!!editingNotesContainersErrorMessage) {
      setShowEditingErrorAlert(true);
    }
  }, [editingNotesContainersErrorMessage]);

  useEffect(() => {
    setShowSavingChangesAlert(!!isSavingChanges);
  }, [isSavingChanges]);

  useEffect(() => {
    setShowDeletedNotesContainerSuccessAlert(!!deletingNotesContainerSuccessMessage);
    const timer = setTimeout(() => {
      setShowDeletedNotesContainerSuccessAlert(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, [deletingNotesContainerSuccessMessage]);

  useEffect(() => {
    setShowEditingSuccessAlert(!!editingNotesContainersSuccessMessage);
    const timer = setTimeout(() => {
      setShowEditingSuccessAlert(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, [dispatch, editingNotesContainersSuccessMessage]);

  return (
    <AlertDiv>
      <Alert
        dismissible
        onClose={() => setShowDeletedNotesContainerSuccessAlert(false)}
        show={showEditingSuccessAlert || showSavingChangesAlert}
        variant="info"
      >
        {showEditingSuccessAlert ? editingNotesContainersSuccessMessage : showSavingChangesAlert && 'Saving notesContainer changes...'}
      </Alert>
      <Alert dismissible onClose={() => setShowEditingErrorAlert(false)} show={showEditingErrorAlert} variant="danger">
        {editingNotesContainersErrorMessage}
      </Alert>
      <Alert
        dismissible
        onClose={() => setShowDeletedNotesContainerSuccessAlert(false)}
        show={showDeletedNotesContainerSuccessAlert}
        variant="info"
      >
        {deletingNotesContainerSuccessMessage}
      </Alert>
    </AlertDiv>
  );
};