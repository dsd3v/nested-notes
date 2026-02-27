import { enterNotesContainer, REORDER_NOTES_CONTAINERS_IN_STATE } from '../actions/notesContainerActions';
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
import { SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { EditNotesContainerForm } from './EditNotesContainerForm';
import { NotesContainerEditRequestI, NotesContainerI } from '../../interfaces';
import { NewNotesContainerForm } from './NewNotesContainerForm';
import { NotesContainersGridAlert } from './NotesContainersGridAlert';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useAppDispatch } from '../../store';
import { EmptyNotesContainerImage, NotesContainerCell, NotesContainerImage, NotesContainersGridContainer, NotesContainerTitle } from '../../styles/NotesStyles';

export const NotesContainersGrid = ({
  isEditingNotesContainers: isEditing,
  parentNotesContainerId,
  setHasReorderedNotesContainers,
  setNotesContainerEditErrors,
  setNotesContainerEditRequests,
  setNotesContainerNames,
  notesContainerNames,
  notesContainers,
}: {
  isEditingNotesContainers: boolean;
  parentNotesContainerId: string;
  setHasReorderedNotesContainers: Dispatch<SetStateAction<boolean>>;
  setNotesContainerEditErrors: Dispatch<SetStateAction<Set<string>>>;
  setNotesContainerEditRequests: Dispatch<SetStateAction<NotesContainerEditRequestI[]>>;
  setNotesContainerNames: Dispatch<SetStateAction<{ [key: string]: string }>>;
  notesContainerNames: { [key: string]: string };
  notesContainers: NotesContainerI[];
}) => {
  const dispatch = useAppDispatch();
  const [sortableItems, setSortableItems] = useState(notesContainers.map((notesContainer) => notesContainer.notesContainerId));
  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(MouseSensor),
    useSensor(PointerSensor),
    useSensor(TouchSensor)
  );

  useEffect(() => {
    setSortableItems(notesContainers.map((notesContainer) => notesContainer.notesContainerId));
  }, [notesContainers]);

  const handleDragEnd = (evt: any) => {
    setActiveId(null);
    const { active, over } = evt;
    if (active.id !== over.id) {
      const newIndex = sortableItems.indexOf(over.id);
      const oldIndex = sortableItems.indexOf(active.id);
      dispatch(REORDER_NOTES_CONTAINERS_IN_STATE({ newIndex, oldIndex }));
      setHasReorderedNotesContainers(true);
    }
  };

  const handleDragStart = (evt: any) => {
    const { active } = evt;
    setActiveId(active.id);
  };

  return (
    <NotesContainersGridContainer>
      <NotesContainersGridAlert />
      {isEditing ? (
        <>
          <NewNotesContainerForm parentNotesContainerId={parentNotesContainerId} setNotesContainerNames={setNotesContainerNames} notesContainerNames={notesContainerNames} />
          <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart} sensors={sensors}>
            <SortableContext items={sortableItems}>
              {notesContainers.map((notesContainer) => (
                <EditNotesContainerForm
                  handle={true}
                  isActive={activeId === notesContainer.notesContainerId}
                  key={notesContainer.notesContainerId}
                  setEditErrors={setNotesContainerEditErrors}
                  setNotesContainerEditRequests={setNotesContainerEditRequests}
                  setNotesContainerNames={setNotesContainerNames}
                  notesContainer={notesContainer}
                  notesContainerNames={notesContainerNames}
                />
              ))}
              <DragOverlay>
                {!!activeId ? (
                  <EditNotesContainerForm
                    handle={true}
                    id={activeId}
                    setEditErrors={setNotesContainerEditErrors}
                    setNotesContainerEditRequests={setNotesContainerEditRequests}
                    setNotesContainerNames={setNotesContainerNames}
                    notesContainer={notesContainers.find((notesContainer) => notesContainer.notesContainerId === activeId)!}
                    notesContainerNames={notesContainerNames}
                  />
                ) : null}
              </DragOverlay>
            </SortableContext>
          </DndContext>
        </>
      ) : (
        <>
          {notesContainers.map((notesContainer: NotesContainerI) => (
            <NotesContainerCell key={notesContainer.notesContainerId} onClick={() => dispatch(enterNotesContainer({ notesContainerToEnter: notesContainer }))}>
              <NotesContainerTitle>{notesContainer.name}</NotesContainerTitle>
              {!!notesContainer.imageUrl ? <NotesContainerImage src={notesContainer.imageUrl} /> : <EmptyNotesContainerImage />}
            </NotesContainerCell>
          ))}
        </>
      )}
    </NotesContainersGridContainer>
  );
};