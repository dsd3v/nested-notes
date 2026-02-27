import axios from 'axios';
import { NoteI } from '../interfaces';
import { Dispatch as ReactDispatch, SetStateAction } from 'react';
import { createAction, Dispatch } from '@reduxjs/toolkit';

export const ADD_NOTE_FAILED = createAction('ADD_NOTE_FAILED', ({ errorMessage }: { errorMessage: string }) => ({
  payload: { errorMessage },
}));
export const ADD_NOTE_STARTED = createAction('ADD_NOTE_STARTED');
export const ADD_NOTE_SUCCEEDED = createAction(
  'ADD_NOTE_SUCCEEDED',
  ({ newNote, successMessage }: { newNote: NoteI; successMessage: string }) => ({
    payload: { newNote, successMessage },
  })
);

export const CLEAR_ADD_NOTE_MESSAGES = createAction('CLEAR_ADD_NOTE_MESSAGES');
export const CLEAR_DELETE_NOTE_MESSAGES = createAction('CLEAR_DELETE_NOTE_MESSAGES');
export const CLEAR_EDIT_NOTES_MESSAGES = createAction('CLEAR_EDIT_NOTES_MESSAGES');

export const DELETE_NOTE_FAILED = createAction(
  'DELETE_NOTE_FAILED',
  ({ errorMessage }: { errorMessage: string }) => ({
    payload: { errorMessage },
  })
);
export const DELETE_NOTE_STARTED = createAction('DELETE_NOTE_STARTED');
export const DELETE_NOTE_SUCCEEDED = createAction(
  'DELETE_NOTE_SUCCEEDED',
  ({ deletedNoteId, successMessage }: { deletedNoteId: string; successMessage: string }) => ({
    payload: { deletedNoteId, successMessage },
  })
);

export const EDIT_NOTES_FAILED = createAction(
  'EDIT_NOTES_FAILED',
  ({ errorMessage }: { errorMessage: string }) => ({
    payload: { errorMessage },
  })
);
export const EDIT_NOTES_STARTED = createAction('EDIT_NOTES_STARTED');
export const EDIT_NOTES_SUCCEEDED = createAction(
  'EDIT_NOTES_SUCCEEDED',
  ({ successMessage, notes }: { successMessage: string; notes: NoteI[] }) => ({
    payload: { successMessage, notes },
  })
);

const addNoteFailedMessage = 'Failed to add new note.';
const addNoteSucceededMessage = 'Note added.';

const deleteNoteFailedMessage = 'Failed to delete note: an error occurred.';
const deleteNoteSucceededMessage = 'Note deleted.';

const editNotesFailedMessage = 'Failed to save note changes: an error occurred.';
const editNotesSucceededMessage = 'Note changes saved.';

export const addNote =
  ({
    newNoteHTML,
    orderIndex,
    setNoteIdToNewHTML,
    setNotes,
    noteIdToNewHTML,
    userId,
    notesContainerId,
  }: {
    newNoteHTML: string;
    orderIndex: number;
    setNoteIdToNewHTML: ReactDispatch<SetStateAction<{ [key: string]: string }>>;
    setNotes: ReactDispatch<SetStateAction<NoteI[]>>;
    noteIdToNewHTML: { [key: string]: string };
    userId: string;
    notesContainerId: string;
  }) =>
    async (dispatch: Dispatch) => {
      dispatch(ADD_NOTE_STARTED());
      try {
        const {
          data: { newNote },
        } = await axios.post('/note/addNote', null, {
          maxContentLength: Infinity,
          params: {
            newNoteHTML,
            orderIndex,
            userId,
            notesContainerId,
          },
        });
        setNotes((prevNotes) => {
          let notes = prevNotes.map((note) => ({
            ...note,
            html: noteIdToNewHTML[note.noteId],
          }));
          notes.unshift(newNote);
          return notes;
        });
        setNoteIdToNewHTML((prevNoteIdToNewHTML: { [key: string]: string }) => ({
          ...prevNoteIdToNewHTML,
          [newNote.noteId]: newNoteHTML,
        }));
        dispatch(
          ADD_NOTE_SUCCEEDED({
            newNote,
            successMessage: addNoteSucceededMessage,
          })
        );
      } catch (error) {
        console.error(error);
        dispatch(
          ADD_NOTE_FAILED({
            errorMessage: addNoteFailedMessage,
          })
        );
      }
    };

export const deleteNote =
  ({
    setNotes,
    noteIdToNewHTML,
    noteToDeleteId,
  }: {
    setNotes: ReactDispatch<SetStateAction<NoteI[]>>;
    noteIdToNewHTML: { [key: string]: string };
    noteToDeleteId: string;
  }) =>
    async (dispatch: Dispatch) => {
      dispatch(DELETE_NOTE_STARTED());
      try {
        await axios.delete('/note/deleteNote', {
          data: { noteId: noteToDeleteId },
        });
        setNotes((prevNotes) =>
          prevNotes
            .filter((note) => note.noteId !== noteToDeleteId)
            .map((note) => ({
              ...note,
              html: noteIdToNewHTML[note.noteId],
            }))
        );
        dispatch(
          DELETE_NOTE_SUCCEEDED({
            deletedNoteId: noteToDeleteId,
            successMessage: deleteNoteSucceededMessage,
          })
        );
      } catch (error) {
        console.error(error);
        dispatch(DELETE_NOTE_FAILED({ errorMessage: deleteNoteFailedMessage }));
      }
    };

export const editNotes =
  ({ notes }: { notes: NoteI[] }) =>
    async (dispatch: Dispatch) => {
      dispatch(EDIT_NOTES_STARTED());
      try {
        await axios.patch('/note/editNotes', {
          notes,
        });
        dispatch(
          EDIT_NOTES_SUCCEEDED({
            successMessage: editNotesSucceededMessage,
            notes,
          })
        );
      } catch (error) {
        console.error(error);
        dispatch(
          EDIT_NOTES_FAILED({
            errorMessage: editNotesFailedMessage,
          })
        );
      }
    };