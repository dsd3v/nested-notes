import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

const selectAppState = (state: RootState) => state.appState;

export const selectDidEditNotes = createSelector([selectAppState], (state) => state.didEditNotes);

export const selectDidEnterOrExitNotesContainer = createSelector([selectAppState], (state) => state.didEnterOrExitNotesContainer);

export const selectCurrentNotesContainer = createSelector(
  [selectAppState],
  (state) => state.notesContainerStack[state.notesContainerStack.length - 1]
);

export const selectAppStateErrorMessage = createSelector([selectAppState], (state) => state.errorMessage);

export const selectAppStateIsLoading = createSelector([selectAppState], (state) => state.isLoading);

export const selectParentNotesContainerNames = createSelector([selectAppState], (state) => {
  const notesContainerNames = state.notesContainerStack.map((notesContainer) => notesContainer.name);
  return notesContainerNames.slice(0, notesContainerNames.length - 1);
});