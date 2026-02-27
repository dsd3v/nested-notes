import {
  ADD_NOTE_FAILED,
  ADD_NOTE_STARTED,
  ADD_NOTE_SUCCEEDED,
  CLEAR_ADD_NOTE_MESSAGES,
  CLEAR_DELETE_NOTE_MESSAGES,
  CLEAR_EDIT_NOTES_MESSAGES,
  DELETE_NOTE_FAILED,
  DELETE_NOTE_STARTED,
  DELETE_NOTE_SUCCEEDED,
  EDIT_NOTES_FAILED,
  EDIT_NOTES_STARTED,
  EDIT_NOTES_SUCCEEDED,
} from '../actions/noteActions';
import { NoteStateI } from '../interfaces';
import { createReducer } from '@reduxjs/toolkit';

const initialState = {
  addingNoteErrorMessage: '',
  addingNoteSuccessMessage: '',
  deletingNoteErrorMessage: '',
  deletingNoteSuccessMessage: '',
  editingNotesErrorMessage: '',
  editingNotesSuccessMessage: '',
  isAddingNote: false,
  isDeletingNote: false,
  isEditingNotes: false,
} as NoteStateI;

export const noteReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(ADD_NOTE_FAILED, (state, action) => {
      const { errorMessage } = action.payload;
      state.addingNoteErrorMessage = errorMessage;
      state.isAddingNote = false;
    })

    .addCase(ADD_NOTE_STARTED, (state) => {
      state.addingNoteErrorMessage = '';
      state.addingNoteSuccessMessage = '';
      state.isAddingNote = true;
    })

    .addCase(ADD_NOTE_SUCCEEDED, (state, action) => {
      const { successMessage } = action.payload;
      state.addingNoteErrorMessage = '';
      state.addingNoteSuccessMessage = successMessage;
      state.isAddingNote = false;
    })

    .addCase(CLEAR_ADD_NOTE_MESSAGES, (state) => {
      state.addingNoteErrorMessage = '';
      state.addingNoteSuccessMessage = '';
    })

    .addCase(CLEAR_DELETE_NOTE_MESSAGES, (state) => {
      state.deletingNoteErrorMessage = '';
      state.deletingNoteSuccessMessage = '';
    })

    .addCase(CLEAR_EDIT_NOTES_MESSAGES, (state) => {
      state.editingNotesErrorMessage = '';
      state.editingNotesSuccessMessage = '';
    })

    .addCase(DELETE_NOTE_FAILED, (state, action) => {
      const { errorMessage } = action.payload;
      state.deletingNoteErrorMessage = errorMessage;
      state.isDeletingNote = false;
    })

    .addCase(DELETE_NOTE_STARTED, (state) => {
      state.deletingNoteErrorMessage = '';
      state.deletingNoteSuccessMessage = '';
      state.isDeletingNote = true;
    })

    .addCase(DELETE_NOTE_SUCCEEDED, (state, action) => {
      const { successMessage } = action.payload;
      state.deletingNoteErrorMessage = '';
      state.deletingNoteSuccessMessage = successMessage;
      state.isDeletingNote = false;
    })

    .addCase(EDIT_NOTES_FAILED, (state, action) => {
      const { errorMessage } = action.payload;
      state.editingNotesErrorMessage = errorMessage;
      state.isEditingNotes = false;
    })

    .addCase(EDIT_NOTES_STARTED, (state) => {
      state.editingNotesErrorMessage = '';
      state.isEditingNotes = true;
    })

    .addCase(EDIT_NOTES_SUCCEEDED, (state, action) => {
      const { successMessage } = action.payload;
      state.editingNotesErrorMessage = '';
      state.editingNotesSuccessMessage = successMessage;
      state.isEditingNotes = false;
    });
});