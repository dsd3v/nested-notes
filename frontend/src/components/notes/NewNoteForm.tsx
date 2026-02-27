import { addNote, CLEAR_ADD_NOTE_MESSAGES } from '../actions/noteActions';
import { NoteI } from '../../interfaces';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { RichTextEditor } from './RichTextEditor';
import {
  selectAddingNoteErrorMessage,
  selectAddingNoteSuccessMessage,
  selectDeletingNoteSuccessMessage,
  selectIsAddingNote,
} from '../../selectors/noteSelectors';
import { selectUserId } from '../../selectors/userSelectors';
import { useAppDispatch, useAppSelector } from '../../store';
import { ErrorMessage2, SuccessMessage2 } from '../../styles/FormStyles';
import { Button, Div, EmptySpan } from '../../styles/GlobalStyles';
import { NoteDiv } from '../../styles/NotesStyles';

export const NewNoteForm = ({
  newNoteIndex,
  setIsFirstEditorInitialized,
  setNoteIdToNewHTML,
  setNotes,
  noteIdToNewHTML,
  notesContainerId,
}: {
  newNoteIndex: number;
  setIsFirstEditorInitialized: Dispatch<SetStateAction<boolean>>;
  setNoteIdToNewHTML: Dispatch<SetStateAction<{ [key: string]: string }>>;
  setNotes: Dispatch<SetStateAction<NoteI[]>>;
  noteIdToNewHTML: { [key: string]: string };
  notesContainerId: string;
}) => {
  const dispatch = useAppDispatch();
  const addingNoteErrorMessage = useAppSelector(selectAddingNoteErrorMessage);
  const addingNoteSuccessMessage = useAppSelector(selectAddingNoteSuccessMessage);
  const deletingNoteSuccessMessage = useAppSelector(selectDeletingNoteSuccessMessage);
  const isAddingNote = useAppSelector(selectIsAddingNote);
  const userId = useAppSelector(selectUserId);

  const [isNewNoteEditorInitialized, setIsNewNoteEditorInitialized] = useState(false);
  const [newNoteHTML, setNewNoteHTML] = useState('');
  const [editorKey, setEditorKey] = useState(0);

  const isAddNewNoteDisabled = isAddingNote || !newNoteHTML;

  useEffect(() => {
    if (!!addingNoteSuccessMessage) {
      setEditorKey((prevEditorKey: number) => prevEditorKey + 1);
    }
  }, [addingNoteSuccessMessage]);

  useEffect(() => {
    if (!!deletingNoteSuccessMessage) {
      dispatch(CLEAR_ADD_NOTE_MESSAGES());
    }
  }, [deletingNoteSuccessMessage, dispatch]);

  const handleAddNewNoteClicked = () =>
    dispatch(
      addNote({
        newNoteHTML,
        orderIndex: newNoteIndex,
        setNoteIdToNewHTML,
        setNotes,
        noteIdToNewHTML,
        userId,
        notesContainerId,
      })
    );

  const handleChange = ({ newHTML }: { newHTML: string }) => {
    setNewNoteHTML(newHTML);
    if (!!addingNoteErrorMessage || !!addingNoteSuccessMessage) {
      dispatch(CLEAR_ADD_NOTE_MESSAGES());
    }
  };

  return (
    <NoteDiv $isInitialized={isNewNoteEditorInitialized}>
      <RichTextEditor
        editorKey={editorKey}
        initialValue=""
        isForNewNote={true}
        onNewNoteChange={handleChange}
        setIsFirstEditorInitialized={setIsFirstEditorInitialized}
        setIsNewNoteEditorInitialized={setIsNewNoteEditorInitialized}
        setNotes={setNotes}
        noteId=""
        noteIdToNewHTML={noteIdToNewHTML}
      />
      {isNewNoteEditorInitialized && (
        <Div $d="column">
          <Div $m="8px 0 0 0">
            <Button
              $isDisabled={isAddNewNoteDisabled}
              onClick={isAddNewNoteDisabled ? () => { } : handleAddNewNoteClicked}
            >
              {isAddingNote ? 'Adding Note...' : 'Add Note'}
            </Button>
          </Div>
          {addingNoteErrorMessage && !addingNoteSuccessMessage ? (
            <ErrorMessage2>{addingNoteErrorMessage}</ErrorMessage2>
          ) : addingNoteSuccessMessage && !addingNoteErrorMessage ? (
            <SuccessMessage2>{addingNoteSuccessMessage}</SuccessMessage2>
          ) : (
            <SuccessMessage2>
              <EmptySpan>&nbsp;</EmptySpan>
            </SuccessMessage2>
          )}
        </Div>
      )}
    </NoteDiv>
  );
};