import {
  ADD_NOTES_CONTAINER_FAILED,
  ADD_NOTES_CONTAINER_STARTED,
  ADD_NOTES_CONTAINER_SUCCEEDED,
  CLEAR_ADD_NOTES_CONTAINER_MESSAGES,
  CLEAR_DELETE_NOTES_CONTAINER_MESSAGES,
  CLEAR_EDIT_NOTES_CONTAINERS_MESSAGES,
  CLEAR_REORDER_NOTES_CONTAINERS_MESSAGES,
  DELETE_NOTES_CONTAINER_FAILED,
  DELETE_NOTES_CONTAINER_STARTED,
  DELETE_NOTES_CONTAINER_SUCCEEDED,
  EDIT_NOTES_CONTAINERS_FAILED,
  EDIT_NOTES_CONTAINERS_STARTED,
  EDIT_NOTES_CONTAINERS_SUCCEEDED,
  REORDER_NOTES_CONTAINERS_FAILED,
} from '../actions/notesContainerActions';
import { NotesContainerStateI } from '../interfaces';
import { createReducer } from '@reduxjs/toolkit';

const initialState = {
  addingNotesContainerErrorMessage: '',
  addingNotesContainerSuccessMessage: '',
  deletingNotesContainerErrorMessage: '',
  deletingNotesContainerSuccessMessage: '',
  editingNotesContainersErrorMessage: '',
  editingNotesContainersSuccessMessage: '',
  isAddingNotesContainer: false,
  isDeletingNotesContainer: false,
  isEditingNotesContainers: false,
  reorderingNotesContainersErrorMessage: '',
} as NotesContainerStateI;

export const notesContainerReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(ADD_NOTES_CONTAINER_FAILED, (state, action) => {
      const { errorMessage } = action.payload;
      state.addingNotesContainerErrorMessage = errorMessage;
      state.isAddingNotesContainer = false;
    })

    .addCase(ADD_NOTES_CONTAINER_STARTED, (state) => {
      state.addingNotesContainerErrorMessage = '';
      state.isAddingNotesContainer = true;
    })

    .addCase(ADD_NOTES_CONTAINER_SUCCEEDED, (state, action) => {
      const { successMessage } = action.payload;
      state.addingNotesContainerErrorMessage = '';
      state.addingNotesContainerSuccessMessage = successMessage;
      state.isAddingNotesContainer = false;
    })

    .addCase(CLEAR_ADD_NOTES_CONTAINER_MESSAGES, (state) => {
      state.addingNotesContainerErrorMessage = '';
      state.addingNotesContainerSuccessMessage = '';
    })

    .addCase(CLEAR_DELETE_NOTES_CONTAINER_MESSAGES, (state) => {
      state.deletingNotesContainerErrorMessage = '';
      state.deletingNotesContainerSuccessMessage = '';
    })

    .addCase(CLEAR_EDIT_NOTES_CONTAINERS_MESSAGES, (state) => {
      state.editingNotesContainersErrorMessage = '';
      state.editingNotesContainersSuccessMessage = '';
    })

    .addCase(CLEAR_REORDER_NOTES_CONTAINERS_MESSAGES, (state) => {
      state.editingNotesContainersErrorMessage = '';
    })

    .addCase(DELETE_NOTES_CONTAINER_FAILED, (state, action) => {
      const { errorMessage } = action.payload;
      state.deletingNotesContainerErrorMessage = errorMessage;
      state.isDeletingNotesContainer = false;
    })

    .addCase(DELETE_NOTES_CONTAINER_STARTED, (state) => {
      state.deletingNotesContainerErrorMessage = '';
      state.deletingNotesContainerSuccessMessage = '';
      state.isDeletingNotesContainer = true;
    })

    .addCase(DELETE_NOTES_CONTAINER_SUCCEEDED, (state, action) => {
      const { successMessage } = action.payload;
      state.deletingNotesContainerErrorMessage = '';
      state.deletingNotesContainerSuccessMessage = successMessage;
      state.isDeletingNotesContainer = false;
    })

    .addCase(EDIT_NOTES_CONTAINERS_FAILED, (state, action) => {
      const { errorMessage } = action.payload;
      state.editingNotesContainersErrorMessage = errorMessage;
      state.isEditingNotesContainers = false;
    })

    .addCase(EDIT_NOTES_CONTAINERS_STARTED, (state) => {
      state.editingNotesContainersErrorMessage = '';
      state.editingNotesContainersSuccessMessage = '';
      state.isEditingNotesContainers = true;
    })

    .addCase(EDIT_NOTES_CONTAINERS_SUCCEEDED, (state, action) => {
      const { successMessage } = action.payload;
      state.editingNotesContainersErrorMessage = '';
      state.editingNotesContainersSuccessMessage = successMessage;
      state.isEditingNotesContainers = false;
    })

    .addCase(REORDER_NOTES_CONTAINERS_FAILED, (state, action) => {
      const { errorMessage } = action.payload;
      state.reorderingNotesContainersErrorMessage = errorMessage;
    });
});