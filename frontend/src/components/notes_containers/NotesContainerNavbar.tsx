import { CLEAR_ADD_NOTE_MESSAGES, CLEAR_DELETE_NOTE_MESSAGES, CLEAR_EDIT_NOTES_MESSAGES, editNotes } from '../actions/noteActions';
import {
  CLEAR_ADD_NOTES_CONTAINER_MESSAGES,
  CLEAR_DELETE_NOTES_CONTAINER_MESSAGES,
  CLEAR_EDIT_NOTES_CONTAINERS_MESSAGES,
  editNotesContainers,
  exitNotesContainer,
  reorderNotesContainers,
} from '../actions/notesContainerActions';
import { MAX_PARENT_NOTES_CONTAINER_NAME_CHARS, NAV_BUTTON_WIDTH } from '../../constants';
import { NoteI, NotesContainerEditRequestI, NotesContainerI } from '../../interfaces';
import { Dispatch, SetStateAction } from 'react';
import { selectParentNotesContainerNames } from '../../selectors/initialInitialappStateSelectors';
import { selectIsEditingNotes } from '../../selectors/noteSelectors';
import { selectIsEditingNotesContainers } from '../../selectors/notesContainerSelectors';
import { useAppDispatch, useAppSelector } from '../../store';
import { Button, Div } from '../../styles/GlobalStyles';
import { NotesContainerNav, NotesContainerNavDivider, NotesContainerNavLink, NotesContainerNavTitle, NotesContainerNavTitleDiv } from '../../styles/NotesStyles';

export const NotesContainerNavbar = ({
  currentTab,
  hasEditedNotes,
  hasReorderedNotesContainers,
  isEditingNotes,
  isEditingNotesContainers,
  setCurrentTab,
  setHasEditedNotes,
  setHasReorderedNotesContainers,
  setIsEditingNotes,
  setIsEditingNotesContainers,
  setNotesContainerEditRequests,
  setNotesContainerNames,
  noteEditErrors,
  noteIdToNewHTML,
  notes,
  notesContainerEditErrors,
  notesContainerEditRequests,
  notesContainerName,
  notesContainers,
}: {
  currentTab: string;
  hasEditedNotes: boolean;
  hasReorderedNotesContainers: boolean;
  isEditingNotes: boolean;
  isEditingNotesContainers: boolean;
  setCurrentTab: Dispatch<SetStateAction<string>>;
  setHasEditedNotes: Dispatch<SetStateAction<boolean>>;
  setHasReorderedNotesContainers: Dispatch<SetStateAction<boolean>>;
  setIsEditingNotes: (callback: (isEditingNotes: boolean) => boolean) => void;
  setIsEditingNotesContainers: (callback: (isEditingNotesContainers: boolean) => boolean) => void;
  setNotesContainerEditRequests: Dispatch<SetStateAction<NotesContainerEditRequestI[]>>;
  setNotesContainerNames: Dispatch<SetStateAction<{ [key: string]: string }>>;
  noteEditErrors: Set<string>;
  noteIdToNewHTML: { [key: string]: string };
  notes: NoteI[];
  notesContainerEditErrors: Set<string>;
  notesContainerEditRequests: NotesContainerEditRequestI[];
  notesContainerName: string;
  notesContainers: NotesContainerI[];
}) => {
  const dispatch = useAppDispatch();
  const isSavingNoteChanges = useAppSelector(selectIsEditingNotes);
  const isSavingNotesContainerChanges = useAppSelector(selectIsEditingNotesContainers);
  const parentNotesContainerNames = useAppSelector(selectParentNotesContainerNames);

  const hasNoteErrors = !!noteEditErrors.size;
  const hasNotesContainerErrors = !!notesContainerEditErrors.size;
  const isRootNotesContainer = !parentNotesContainerNames.length;

  const truncatedParentNotesContainerName =
    (parentNotesContainerNames[parentNotesContainerNames.length - 1] || '').length > MAX_PARENT_NOTES_CONTAINER_NAME_CHARS
      ? parentNotesContainerNames[parentNotesContainerNames.length - 1].slice(0, MAX_PARENT_NOTES_CONTAINER_NAME_CHARS) + '...'
      : parentNotesContainerNames[parentNotesContainerNames.length - 1];

  const parentNotesContainerNamesString = parentNotesContainerNames
    .map((notesContainerName: string) =>
      notesContainerName.length <= MAX_PARENT_NOTES_CONTAINER_NAME_CHARS
        ? notesContainerName
        : notesContainerName.slice(0, MAX_PARENT_NOTES_CONTAINER_NAME_CHARS) + '...'
    )
    .join(' / ')
    .slice(2);

  const toggleEditingNotes = () => {
    if (!hasNoteErrors) {
      if (isEditingNotes) {
        if (!!notes.length && hasEditedNotes) {
          const newNotes = notes.map((note) => ({
            ...note,
            html: noteIdToNewHTML[note.noteId],
          }));
          dispatch(
            editNotes({
              notes: newNotes,
            })
          );
          setHasEditedNotes(false);
        }
        dispatch(CLEAR_ADD_NOTE_MESSAGES());
        dispatch(CLEAR_DELETE_NOTE_MESSAGES());
      } else {
        dispatch(CLEAR_EDIT_NOTES_MESSAGES());
      }
      setIsEditingNotes((prevState) => !prevState);
    }
  };

  const toggleEditingNotesContainers = () => {
    if (!hasNotesContainerErrors) {
      if (isEditingNotesContainers) {
        if (!!notesContainerEditRequests.length) {
          dispatch(
            editNotesContainers({
              notesContainerEditRequests,
            })
          );
          setNotesContainerEditRequests([]);
        }
        if (hasReorderedNotesContainers) {
          dispatch(reorderNotesContainers({ notesContainers }));
          setHasReorderedNotesContainers(false);
        }
        dispatch(CLEAR_ADD_NOTES_CONTAINER_MESSAGES());
        dispatch(CLEAR_DELETE_NOTES_CONTAINER_MESSAGES());
      } else {
        dispatch(CLEAR_EDIT_NOTES_CONTAINERS_MESSAGES());
        setNotesContainerNames(
          notesContainers.reduce((accum: { [key: string]: string }, notesContainer: NotesContainerI) => {
            accum[notesContainer.notesContainerId] = notesContainer.name;
            return accum;
          }, {})
        );
      }
      setIsEditingNotesContainers((prevState) => !prevState);
    }
  };

  return (
    <NotesContainerNav>
      <Div $d="column" $j="space-between">
        <Div $a="start" $j="space-between" $m="12px 0 0 0">
          {!isEditingNotes && !isEditingNotesContainers && !isRootNotesContainer ? (
            <Button $w={NAV_BUTTON_WIDTH} onClick={() => dispatch(exitNotesContainer())}>
              Return to {parentNotesContainerNames.length > 1 ? truncatedParentNotesContainerName : 'Root NotesContainers'}
            </Button>
          ) : (
            <Button $isHidden={true} $w={NAV_BUTTON_WIDTH} />
          )}
          {currentTab === 'notes' ? (
            <Button
              $isDisabled={hasNoteErrors || isSavingNoteChanges}
              $w={NAV_BUTTON_WIDTH}
              onClick={toggleEditingNotes}
            >
              {isEditingNotes ? 'Done Adding / Editing / Deleting Notes' : 'Add / Edit / Delete Notes'}
            </Button>
          ) : (
            <Button
              $isDisabled={hasNotesContainerErrors || isSavingNotesContainerChanges}
              $w={NAV_BUTTON_WIDTH}
              onClick={toggleEditingNotesContainers}
            >
              {isEditingNotesContainers
                ? isSavingNotesContainerChanges
                  ? 'Saving Changes...'
                  : 'Done Adding / Editing / Deleting NotesContainers'
                : 'Add / Edit / Delete NotesContainers'}
            </Button>
          )}
        </Div>
        <NotesContainerNavTitleDiv>
          {!isRootNotesContainer && (
            <>
              {!!parentNotesContainerNames.length && (
                <Div $f="1rem" $m="0 0 1px 0">
                  {parentNotesContainerNamesString + (!!parentNotesContainerNamesString.length ? ' / ' : '')}
                </Div>
              )}
              <NotesContainerNavTitle>{notesContainerName}</NotesContainerNavTitle>
            </>
          )}
        </NotesContainerNavTitleDiv>
        {!isRootNotesContainer && (
          <Div $m="8px 0 8px 0">
            <NotesContainerNavLink $isSelected={currentTab === 'notes'} onClick={() => setCurrentTab('notes')}>
              Notes
            </NotesContainerNavLink>
            <NotesContainerNavDivider>|</NotesContainerNavDivider>
            <NotesContainerNavLink $isSelected={currentTab === 'notesContainers'} onClick={() => setCurrentTab('notesContainers')}>
              NotesContainers
            </NotesContainerNavLink>
          </Div>
        )}
      </Div>
    </NotesContainerNav>
  );
};