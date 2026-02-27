import { NoteI, NotesContainerEditRequestI, NotesContainerI } from '../../interfaces';
import { NotesList } from '../notes/NotesList';
import { NotesContainerNavbar } from './NotesContainerNavbar';
import { NotesContainersGrid } from './NotesContainersGrid';
import { useEffect, useState } from 'react';
import { selectDidEditNotes, selectDidEnterOrExitNotesContainer } from '../../selectors/initialInitialappStateSelectors';
import { useAppSelector } from '../../store';
import { Container, Div } from '../../styles/GlobalStyles';

export const NotesContainer = ({ notesContainer }: { notesContainer: NotesContainerI }) => {
  const [hasEditedNotes, setHasEditedNotes] = useState(false);
  const [hasReorderedNotesContainers, setHasReorderedNotesContainers] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isEditingNotesContainers, setIsEditingNotesContainers] = useState(false);
  const [noteEditErrors, setNoteEditErrors] = useState<Set<string>>(new Set());
  const [notesContainerEditRequests, setNotesContainerEditRequests] = useState<NotesContainerEditRequestI[]>([]);
  const [notesContainerEditErrors, setNotesContainerEditErrors] = useState<Set<string>>(new Set());
  const [editedNotes, setEditedNotes] = useState(notesContainer.notes);
  const [noteIdToNewHTML, setNoteIdToNewHTML] = useState(
    notesContainer.notes.reduce((accum: { [key: string]: string }, note: NoteI) => {
      accum[note.noteId] = note.html;
      return accum;
    }, {})
  );
  const [notesContainerNames, setNotesContainerNames] = useState(
    notesContainer.childNotesContainers.reduce((accum: { [key: string]: string }, notesContainer: NotesContainerI) => {
      accum[notesContainer.notesContainerId] = notesContainer.name;
      return accum;
    }, {})
  );
  const isRootNotesContainer = !notesContainer.notesContainerId;
  const [currentTab, setCurrentTab] = useState(isRootNotesContainer ? 'notesContainers' : 'notes');
  const didEditNotes = useAppSelector(selectDidEditNotes);
  const didEnterOrExitNotesContainer = useAppSelector(selectDidEnterOrExitNotesContainer);

  useEffect(() => setCurrentTab(isRootNotesContainer ? 'notesContainers' : 'notes'), [isRootNotesContainer]);

  useEffect(() => {
    if (didEnterOrExitNotesContainer) {
      setCurrentTab(isRootNotesContainer ? 'notesContainers' : 'notes');
      setEditedNotes(notesContainer.notes);
      setNoteIdToNewHTML(
        notesContainer.notes.reduce((accum: { [key: string]: string }, note: NoteI) => {
          accum[note.noteId] = note.html;
          return accum;
        }, {})
      );
    }
  }, [didEnterOrExitNotesContainer, isRootNotesContainer, notesContainer.notes]);

  useEffect(() => {
    if (didEditNotes) {
      setEditedNotes(notesContainer.notes);
      setNoteIdToNewHTML(
        notesContainer.notes.reduce((accum: { [key: string]: string }, note: NoteI) => {
          accum[note.noteId] = note.html;
          return accum;
        }, {})
      );
    }
  }, [didEditNotes, notesContainer.notes]);

  return (
    <>
      <NotesContainerNavbar
        currentTab={currentTab}
        hasEditedNotes={hasEditedNotes}
        hasReorderedNotesContainers={hasReorderedNotesContainers}
        isEditingNotes={isEditingNotes}
        isEditingNotesContainers={isEditingNotesContainers}
        setCurrentTab={setCurrentTab}
        setHasEditedNotes={setHasEditedNotes}
        setHasReorderedNotesContainers={setHasReorderedNotesContainers}
        setIsEditingNotes={setIsEditingNotes}
        setIsEditingNotesContainers={setIsEditingNotesContainers}
        setNotesContainerEditRequests={setNotesContainerEditRequests}
        setNotesContainerNames={setNotesContainerNames}
        noteEditErrors={noteEditErrors}
        noteIdToNewHTML={noteIdToNewHTML}
        notes={editedNotes}
        notesContainerEditErrors={notesContainerEditErrors}
        notesContainerEditRequests={notesContainerEditRequests}
        notesContainerName={notesContainer.name}
        notesContainers={notesContainer.childNotesContainers}
      />
      <Container>
        {currentTab === 'notes' ? (
          <NotesList
            hasEditedNotes={hasEditedNotes}
            isEditingNotes={isEditingNotes}
            setHasEditedNotes={setHasEditedNotes}
            setNoteEditErrors={setNoteEditErrors}
            setNoteIdToNewHTML={setNoteIdToNewHTML}
            setNotes={setEditedNotes}
            noteIdToNewHTML={noteIdToNewHTML}
            notes={editedNotes}
            notesContainerId={notesContainer.notesContainerId}
          />
        ) : !notesContainer.childNotesContainers.length && !isEditingNotesContainers && isRootNotesContainer ? (
          <Div $f="1.2rem" $w="80%">
            Click "Add / Edit / Delete NotesContainers" in the top right corner to create your first notesContainer.
          </Div>
        ) : (
          <NotesContainersGrid
            isEditingNotesContainers={isEditingNotesContainers}
            parentNotesContainerId={notesContainer.notesContainerId}
            setHasReorderedNotesContainers={setHasReorderedNotesContainers}
            setNotesContainerEditErrors={setNotesContainerEditErrors}
            setNotesContainerEditRequests={setNotesContainerEditRequests}
            setNotesContainerNames={setNotesContainerNames}
            notesContainerNames={notesContainerNames}
            notesContainers={notesContainer.childNotesContainers}
          />
        )}
      </Container>
    </>
  );
};