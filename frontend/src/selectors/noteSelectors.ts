import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

const selectNoteState = (state: RootState) => state.note;

export const selectAddingNoteErrorMessage = createSelector(
  [selectNoteState],
  (state) => state.addingNoteErrorMessage
);

export const selectAddingNoteSuccessMessage = createSelector(
  [selectNoteState],
  (state) => state.addingNoteSuccessMessage
);

export const selectDeletingNoteErrorMessage = createSelector(
  [selectNoteState],
  (state) => state.deletingNoteErrorMessage
);

export const selectDeletingNoteSuccessMessage = createSelector(
  [selectNoteState],
  (state) => state.deletingNoteSuccessMessage
);

export const selectIsAddingNote = createSelector([selectNoteState], (state) => state.isAddingNote);

export const selectIsDeletingNote = createSelector([selectNoteState], (state) => state.isDeletingNote);

export const selectEditingNotesErrorMessage = createSelector(
  [selectNoteState],
  (state) => state.editingNotesErrorMessage
);

export const selectEditingNotesSuccessMessage = createSelector(
  [selectNoteState],
  (state) => state.editingNotesSuccessMessage
);

export const selectIsEditingNotes = createSelector([selectNoteState], (state) => state.isEditingNotes);