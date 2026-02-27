import { CLEAR_EDIT_NOTES_MESSAGES } from '../actions/noteActions';
import { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import {
  selectDeletingNoteSuccessMessage,
  selectEditingNotesErrorMessage,
  selectEditingNotesSuccessMessage,
  selectIsEditingNotes,
} from '../../selectors/noteSelectors';
import { useAppDispatch, useAppSelector } from '../../store';
import { AlertDiv } from '../../styles/GlobalStyles';

export const NotesListAlert = () => {
  const dispatch = useAppDispatch();
  const deletingNoteSuccessMessage = useAppSelector(selectDeletingNoteSuccessMessage);
  const editingNotesErrorMessage = useAppSelector(selectEditingNotesErrorMessage);
  const editingNotesSuccessMessage = useAppSelector(selectEditingNotesSuccessMessage);
  const isSavingChanges = useAppSelector(selectIsEditingNotes);

  const [showDeletedNoteSuccessAlert, setShowDeletedNoteSuccessAlert] = useState(!!deletingNoteSuccessMessage);
  const [showEditingErrorAlert, setShowEditingErrorAlert] = useState(!!editingNotesErrorMessage);
  const [showSavingChangesAlert, setShowSavingChangesAlert] = useState(!!isSavingChanges);
  const [showEditingSuccessAlert, setShowEditingSuccessAlert] = useState(!!editingNotesSuccessMessage);

  useEffect(() => {
    if (!!editingNotesErrorMessage) {
      setShowEditingErrorAlert(true);
    }
  }, [editingNotesErrorMessage]);

  useEffect(() => {
    setShowSavingChangesAlert(!!isSavingChanges);
  }, [isSavingChanges]);

  useEffect(() => {
    setShowDeletedNoteSuccessAlert(!!deletingNoteSuccessMessage);
    const timer = setTimeout(() => {
      setShowDeletedNoteSuccessAlert(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, [deletingNoteSuccessMessage]);

  useEffect(() => {
    setShowEditingSuccessAlert(!!editingNotesSuccessMessage);
    const timer = setTimeout(() => {
      setShowEditingSuccessAlert(false);
      dispatch(CLEAR_EDIT_NOTES_MESSAGES());
    }, 1800);
    return () => clearTimeout(timer);
  }, [dispatch, editingNotesSuccessMessage]);

  return (
    <AlertDiv>
      <Alert
        dismissible
        onClose={() => setShowDeletedNoteSuccessAlert(false)}
        show={showEditingSuccessAlert || showSavingChangesAlert}
        variant="info"
      >
        {showEditingSuccessAlert
          ? editingNotesSuccessMessage
          : showSavingChangesAlert && 'Saving note changes...'}
      </Alert>
      <Alert dismissible onClose={() => setShowEditingErrorAlert(false)} show={showEditingErrorAlert} variant="danger">
        {editingNotesErrorMessage}
      </Alert>
      <Alert
        dismissible
        onClose={() => setShowDeletedNoteSuccessAlert(false)}
        show={showDeletedNoteSuccessAlert}
        variant="info"
      >
        {deletingNoteSuccessMessage}
      </Alert>
    </AlertDiv>
  );
};