import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { NoteI } from '../../interfaces';
import { NewNoteForm } from './NewNoteForm';
import { Note } from './Note';
import { NotesListAlert } from './NotesListAlert';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { TailSpin } from 'react-loader-spinner';
import { RichTextEditor } from './RichTextEditor';
import { Div } from '../../styles/GlobalStyles';
import { NoteDiv, NotesListContainer } from '../../styles/NotesStyles';

export const NotesList = ({
  hasEditedNotes,
  isEditingNotes,
  setHasEditedNotes,
  setNoteEditErrors,
  setNoteIdToNewHTML,
  setNotes,
  noteIdToNewHTML,
  notes,
  notesContainerId,
}: {
  hasEditedNotes: boolean;
  isEditingNotes: boolean;
  setHasEditedNotes: Dispatch<SetStateAction<boolean>>;
  setNoteEditErrors: Dispatch<SetStateAction<Set<string>>>;
  setNoteIdToNewHTML: Dispatch<SetStateAction<{ [key: string]: string }>>;
  setNotes: Dispatch<SetStateAction<NoteI[]>>;
  noteIdToNewHTML: { [key: string]: string };
  notes: NoteI[];
  notesContainerId: string;
}) => {
  const [isFirstEditorInitialized, setIsFirstEditorInitialized] = useState(false);
  const [sortableItems, setSortableItems] = useState(notes.map((note) => note.noteId));
  const [activeId, setActiveId] = useState(null);
  const [editorKeys, setEditorKeys] = useState(notes.map((_, idx) => idx));
  const sensors = useSensors(
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(MouseSensor),
    useSensor(PointerSensor),
    useSensor(TouchSensor)
  );

  useEffect(() => {
    setSortableItems(notes.map((note) => note.noteId));
    if (notes.length > editorKeys.length) {
      editorKeys.push(!editorKeys.length ? 0 : editorKeys[editorKeys.length - 1] + 1);
    }
  }, [editorKeys, notes]);

  const handleDragEnd = (event: any) => {
    setActiveId(null);
    const { active, over } = event;
    if (!!active && !!over && active.id !== over.id) {
      const newIndex = sortableItems.indexOf(over.id);
      const oldIndex = sortableItems.indexOf(active.id);
      if (!hasEditedNotes) {
        setHasEditedNotes(true);
      }
      setNotes((prevNotes) => arrayMove(prevNotes, oldIndex, newIndex));
    }
    setEditorKeys((prevEditorKeys) => prevEditorKeys.map((editorKey) => editorKey + 1));
  };

  const handleDragStart = (event: any) => {
    const { active } = event;
    setNotes!((prevNotes) =>
      prevNotes.map((note) => ({
        ...note,
        html: noteIdToNewHTML[note.noteId],
      }))
    );
    setActiveId(active.id);
  };

  return (
    <NotesListContainer>
      <NotesListAlert />
      {!!notes.length && !isFirstEditorInitialized && (
        <Div $d="column" $f="1.1rem">
          <span style={{ paddingBottom: '15px' }}>Loading notes...</span>
          <TailSpin color="#00BFFF" height={50} width={50} />
        </Div>
      )}
      {isEditingNotes && ((!!notes.length && isFirstEditorInitialized) || !notes.length) ? (
        <>
          <NewNoteForm
            newNoteIndex={notes.length}
            setIsFirstEditorInitialized={setIsFirstEditorInitialized}
            setNoteIdToNewHTML={setNoteIdToNewHTML}
            setNotes={setNotes}
            noteIdToNewHTML={noteIdToNewHTML}
            notesContainerId={notesContainerId}
          />
          <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart} sensors={sensors}>
            <SortableContext items={sortableItems}>
              {notes.map((note, idx) => (
                <NoteDiv $isInitialized={isFirstEditorInitialized} key={note.noteId}>
                  <RichTextEditor
                    editorKey={editorKeys[idx]}
                    handle={true}
                    hasEditedNotes={hasEditedNotes}
                    initialValue={note.html}
                    isActive={activeId === note.noteId}
                    setHasEditedNotes={setHasEditedNotes}
                    setIsFirstEditorInitialized={setIsFirstEditorInitialized}
                    setNoteEditErrors={setNoteEditErrors}
                    setNoteIdToNewHTML={setNoteIdToNewHTML}
                    setNotes={setNotes}
                    noteId={note.noteId}
                    noteIdToNewHTML={noteIdToNewHTML}
                  />
                </NoteDiv>
              ))}
              <DragOverlay>
                {!!activeId ? (
                  <RichTextEditor
                    handle={true}
                    id={activeId}
                    initialValue={notes.find((note) => note.noteId === activeId)!.html}
                    setIsFirstEditorInitialized={setIsFirstEditorInitialized}
                    setNoteEditErrors={setNoteEditErrors}
                    setNotes={setNotes}
                    noteId={activeId!}
                  />
                ) : null}
              </DragOverlay>
            </SortableContext>
          </DndContext>
        </>
      ) : (
        <>
          {notes.map((note) => (
            <Note
              html={note.html}
              isFirstEditorInitialized={isFirstEditorInitialized}
              key={note.noteId}
              setIsFirstEditorInitialized={setIsFirstEditorInitialized}
            />
          ))}
        </>
      )}
    </NotesListContainer>
  );
};