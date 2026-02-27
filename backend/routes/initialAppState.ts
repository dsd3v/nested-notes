import { Router } from 'express';
import { session } from '../server.js';

const router = Router();

router.get('/initialAppState', async (req, res) => {
  const { userId } = req.query;

  try {
    const queryResult = await session.run(
      `MATCH (notesContainer: NotesContainer)-[:IS_PARENT_NOTES_CONTAINER_OF]->(childNotesContainer: NotesContainer)
      WHERE notesContainer.userId = '${userId}'
      RETURN notesContainer, childNotesContainer AS link
      ORDER BY notesContainer.orderIndex DESC, childNotesContainer.orderIndex DESC
      UNION
      MATCH (notesContainer: NotesContainer)-[:CONTAINS_NOTE]->(note: Note)
      WHERE notesContainer.userId = '${userId}'
      RETURN notesContainer, note AS link
      ORDER BY notesContainer.orderIndex DESC, note.orderIndex DESC`
    );

    const notesContainerIdToChildNotesContainerIds = {};
    const notesContainerIdToNotesContainer = {};
    let initialAppState = [];

    queryResult.records.forEach((record) => {
      const parentNotesContainer = {
        ...record._fields[0].properties,
        childNotesContainers: [],
        notes: [],
      };
      const parentNotesContainerId = parentNotesContainer.notesContainerId;

      if (record._fields[1].labels[0] === 'NotesContainer') {
        const childNotesContainer = {
          ...record._fields[1].properties,
          childNotesContainers: [],
          notes: [],
        };
        const childNotesContainerId = childNotesContainer.notesContainerId;

        if (childNotesContainerId === parentNotesContainerId) {
          initialInitialappState.push(childNotesContainer);
        } else {
          if (parentNotesContainerId in notesContainerIdToChildNotesContainerIds) {
            notesContainerIdToChildNotesContainerIds[parentNotesContainerId].push(childNotesContainerId);
          } else {
            notesContainerIdToChildNotesContainerIds[parentNotesContainerId] = [childNotesContainerId];
          }
        }
        notesContainerIdToNotesContainer[parentNotesContainerId] = parentNotesContainer;
        notesContainerIdToNotesContainer[childNotesContainerId] = childNotesContainer;
      } else {
        notesContainerIdToNotesContainer[parentNotesContainerId].notes.push(record._fields[1].properties);
      }
    });

    for (let i = 0; i < initialAppState.length; i++) {
      const notesContainerId = initialAppState[i].notesContainerId;
      initialAppState[i].notes = notesContainerIdToNotesContainer[notesContainerId].notes;
      initialAppState[i].childNotesContainers = getChildNotesContainersHelper({
        childNotesContainers: [],
        notesContainerId,
        notesContainerIdToChildNotesContainerIds,
        notesContainerIdToNotesContainer,
      });
    }
    res.status(200).json({ message: 'Successfully retrieved initial app state.', initialAppState });
  } catch (error) {
    res.status(400).json({ message: 'Failed to retrieve initial app state.', error });
  }
});

const getChildNotesContainersHelper = ({ childNotesContainers, notesContainerId, notesContainerIdToChildNotesContainerIds, notesContainerIdToNotesContainer }) => {
  (notesContainerIdToChildNotesContainerIds[notesContainerId] || []).forEach((childNotesContainerId) => {
    childNotesContainers.push(notesContainerIdToNotesContainer[childNotesContainerId]);
    childNotesContainers[childNotesContainers.length - 1].childNotesContainers = getChildNotesContainersHelper({
      childNotesContainers: [],
      notesContainerId: childNotesContainerId,
      notesContainerIdToChildNotesContainerIds,
      notesContainerIdToNotesContainer,
    });
  });
  return childNotesContainers;
};

export default router;