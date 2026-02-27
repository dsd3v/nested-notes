import { GET_INITIAL_APP_STATE_FAILED, GET_INITIAL_APP_STATE_STARTED, GET_INITIAL_APP_STATE_SUCCEEDED } from '../actions/initialAppStateActions';
import { ADD_NOTE_SUCCEEDED, DELETE_NOTE_SUCCEEDED, EDIT_NOTES_SUCCEEDED } from '../actions/noteActions';
import { SIGN_UP_SUCCEEDED } from '../actions/userActions';
import {
  ADD_NOTES_CONTAINER_SUCCEEDED,
  DELETE_NOTES_CONTAINER_SUCCEEDED,
  EDIT_NOTES_CONTAINERS_SUCCEEDED,
  ENTER_ROOT_NOTES_CONTAINER,
  ENTER_NOTES_CONTAINER,
  EXIT_NOTES_CONTAINER,
  REORDER_NOTES_CONTAINERS_IN_STATE,
} from '../actions/notesContainerActions';
import { arrayMove } from '@dnd-kit/sortable';
import { AppStateI, NoteI, NotesContainerEditRequestI, NotesContainerI } from '../interfaces';
import { createReducer } from '@reduxjs/toolkit';

const initialState = {
  didEditNotes: false,
  didEnterOrExitNotesContainer: false,
  errorMessage: '',
  isLoading: false,
  notesContainerStack: [],
} as AppStateI;

const APP_STATE_UPDATE_TYPES = {
  AddNote: 'Add Note',
  AddNotesContainer: 'Add Notes Container',
  DeleteNote: 'Delete Note',
  DeleteNotesContainer: 'Delete Notes Container',
  EditNotes: 'Edit Notes',
  EditNotesContainers: 'Edit Notes Containers',
  ReorderNotesContainers: 'Reorder Notes Containers',
};

export const appStateReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(ADD_NOTE_SUCCEEDED, (state, action) => {
      const { newNote } = action.payload;
      state.didEditNotes = false;
      state.didEnterOrExitNotesContainer = false;
      updateAppStateHelper({
        newNote,
        state,
        updateType: APP_STATE_UPDATE_TYPES.AddNote,
      });
    })

    .addCase(ADD_NOTES_CONTAINER_SUCCEEDED, (state, action) => {
      const { newNotesContainer } = action.payload;
      state.didEditNotes = false;
      state.didEnterOrExitNotesContainer = false;
      updateAppStateHelper({
        newNotesContainer,
        state,
        updateType: APP_STATE_UPDATE_TYPES.AddNotesContainer,
      });
    })

    .addCase(DELETE_NOTE_SUCCEEDED, (state, action) => {
      const { deletedNoteId } = action.payload;
      state.didEditNotes = false;
      state.didEnterOrExitNotesContainer = false;
      updateAppStateHelper({
        deletedNoteId,
        state,
        updateType: APP_STATE_UPDATE_TYPES.DeleteNote,
      });
    })

    .addCase(DELETE_NOTES_CONTAINER_SUCCEEDED, (state, action) => {
      const { deletedNotesContainerId } = action.payload;
      state.didEditNotes = false;
      state.didEnterOrExitNotesContainer = false;
      updateAppStateHelper({
        deletedNotesContainerId,
        state,
        updateType: APP_STATE_UPDATE_TYPES.DeleteNotesContainer,
      });
    })

    .addCase(EDIT_NOTES_SUCCEEDED, (state, action) => {
      const { notes } = action.payload;
      state.didEditNotes = false;
      state.didEnterOrExitNotesContainer = false;
      updateAppStateHelper({
        state,
        notes,
        updateType: APP_STATE_UPDATE_TYPES.EditNotes,
      });
    })

    .addCase(EDIT_NOTES_CONTAINERS_SUCCEEDED, (state, action) => {
      const { notesContainerEditRequests } = action.payload;
      state.didEnterOrExitNotesContainer = false;
      updateAppStateHelper({
        state,
        updateType: APP_STATE_UPDATE_TYPES.EditNotesContainers,
        notesContainerEditRequests,
      });
    })

    .addCase(ENTER_ROOT_NOTES_CONTAINER, (state) => {
      state.didEditNotes = false;
      state.didEnterOrExitNotesContainer = true;
      state.notesContainerStack = state.notesContainerStack.slice(0, 1);
    })

    .addCase(ENTER_NOTES_CONTAINER, (state, action) => {
      const { notesContainerToEnter } = action.payload;
      state.didEditNotes = false;
      state.didEnterOrExitNotesContainer = true;
      state.notesContainerStack = [...state.notesContainerStack, notesContainerToEnter];
    })

    .addCase(EXIT_NOTES_CONTAINER, (state) => {
      state.didEditNotes = false;
      state.didEnterOrExitNotesContainer = true;
      state.notesContainerStack = state.notesContainerStack.slice(0, state.notesContainerStack.length - 1);
    })

    .addCase(GET_INITIAL_APP_STATE_FAILED, (state, action) => {
      const { errorMessage } = action.payload;
      state.errorMessage = errorMessage;
      state.isLoading = false;
    })

    .addCase(GET_INITIAL_APP_STATE_STARTED, (state) => {
      state.errorMessage = '';
      state.isLoading = true;
    })

    .addCase(GET_INITIAL_APP_STATE_SUCCEEDED, (state, action) => {
      const { InitialappState } = action.payload;
      state.errorMessage = '';
      state.isLoading = false;
      state.notesContainerStack = [
        {
          childNotesContainers: InitialappState,
          imageUrl: '',
          name: '',
          notes: [],
          notesContainerId: '',
        },
      ];
    })

    .addCase(REORDER_NOTES_CONTAINERS_IN_STATE, (state, action) => {
      const { newIndex, oldIndex } = action.payload;
      state.didEditNotes = false;
      state.didEnterOrExitNotesContainer = false;
      updateAppStateHelper({
        newIndex,
        oldIndex,
        state,
        updateType: APP_STATE_UPDATE_TYPES.ReorderNotesContainers,
      });
    })

    .addCase(SIGN_UP_SUCCEEDED, (state) => {
      state.errorMessage = '';
      state.isLoading = false;
      state.notesContainerStack = [
        {
          childNotesContainers: [],
          imageUrl: '',
          name: '',
          notes: [],
          notesContainerId: '',
        },
      ];
    });
});

const updateAppStateHelper = ({
  deletedNoteId,
  deletedNotesContainerId,
  newIndex,
  newNote,
  newNotesContainer,
  oldIndex,
  state,
  notes,
  updateType,
  notesContainerEditRequests,
}: {
  deletedNoteId?: string;
  deletedNotesContainerId?: string;
  newIndex?: number;
  newNote?: NoteI;
  newNotesContainer?: NotesContainerI;
  oldIndex?: number;
  state: AppStateI;
  notes?: NoteI[];
  updateType: string;
  notesContainerEditRequests?: NotesContainerEditRequestI[];
}): void => {
  const notesContainerIdx = state.notesContainerStack.length - 1;

  switch (updateType) {
    case APP_STATE_UPDATE_TYPES.AddNote:
      state.notesContainerStack[notesContainerIdx].notes.unshift(newNote!);
      break;

    case APP_STATE_UPDATE_TYPES.DeleteNote:
      state.notesContainerStack[notesContainerIdx].notes = state.notesContainerStack[notesContainerIdx].notes.filter(
        (note) => note.noteId !== deletedNoteId
      );
      break;

    case APP_STATE_UPDATE_TYPES.EditNotes:
      state.notesContainerStack[notesContainerIdx].notes = notes!;
      state.didEditNotes = true;
      break;

    case APP_STATE_UPDATE_TYPES.AddNotesContainer:
      state.notesContainerStack[notesContainerIdx].childNotesContainers.unshift(newNotesContainer!);
      break;

    case APP_STATE_UPDATE_TYPES.DeleteNotesContainer:
      state.notesContainerStack[notesContainerIdx].childNotesContainers = state.notesContainerStack[notesContainerIdx].childNotesContainers.filter(
        (notesContainer) => notesContainer.notesContainerId !== deletedNotesContainerId
      );
      break;

    case APP_STATE_UPDATE_TYPES.EditNotesContainers:
      notesContainerEditRequests!.forEach((editRequest) => {
        const idx = state.notesContainerStack[notesContainerIdx].childNotesContainers.findIndex((notesContainer) => notesContainer.notesContainerId === editRequest.notesContainerId);
        state.notesContainerStack[notesContainerIdx].childNotesContainers[idx].imageUrl = editRequest.newImage as string;
        state.notesContainerStack[notesContainerIdx].childNotesContainers[idx].name = editRequest.newName;
      });
      break;

    case APP_STATE_UPDATE_TYPES.ReorderNotesContainers:
      state.notesContainerStack[notesContainerIdx].childNotesContainers = arrayMove(state.notesContainerStack[notesContainerIdx].childNotesContainers, oldIndex!, newIndex!);
      break;
  }

  for (let i = notesContainerIdx - 1; i >= 0; i--) {
    const notesContainerId = state.notesContainerStack[i + 1].notesContainerId;
    const childNotesContainerIdx = state.notesContainerStack[i].childNotesContainers.findIndex((notesContainer) => notesContainer.notesContainerId === notesContainerId);
    state.notesContainerStack[i].childNotesContainers[childNotesContainerIdx] = state.notesContainerStack[i + 1];
  }
};