import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

const selectNotesContainerState = (state: RootState) => state.notesContainer;

export const selectAddingNotesContainerErrorMessage = createSelector(
  [selectNotesContainerState],
  (state) => state.addingNotesContainerErrorMessage
);

export const selectAddingNotesContainerSuccessMessage = createSelector(
  [selectNotesContainerState],
  (state) => state.addingNotesContainerSuccessMessage
);

export const selectDeletingNotesContainerErrorMessage = createSelector(
  [selectNotesContainerState],
  (state) => state.deletingNotesContainerErrorMessage
);

export const selectDeletingNotesContainerSuccessMessage = createSelector(
  [selectNotesContainerState],
  (state) => state.deletingNotesContainerSuccessMessage
);

export const selectIsAddingNotesContainer = createSelector([selectNotesContainerState], (state) => state.isAddingNotesContainer);

export const selectIsDeletingNotesContainer = createSelector([selectNotesContainerState], (state) => state.isDeletingNotesContainer);

export const selectEditingNotesContainersErrorMessage = createSelector(
  [selectNotesContainerState],
  (state) => state.editingNotesContainersErrorMessage
);

export const selectEditingNotesContainersSuccessMessage = createSelector(
  [selectNotesContainerState],
  (state) => state.editingNotesContainersSuccessMessage
);

export const selectIsEditingNotesContainers = createSelector([selectNotesContainerState], (state) => state.isEditingNotesContainers);