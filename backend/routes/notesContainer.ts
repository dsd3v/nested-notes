import { Router } from 'express';
import { NotesContainer } from '../schemas/NotesContainer.js';
import { session } from '../server.js';
import stringifyObject from 'stringify-object';

const router = Router();

router.delete('/deleteNotesContainer', async (req, res) => {
  const { notesContainerId } = req.body;

  try {
    await session.run(
      `MATCH (notesContainer: NotesContainer)-[*0..]->(nodes)
       WHERE notesContainer.notesContainerId = '${notesContainerId}'
       DETACH DELETE nodes`
    );
    res.status(200).json({ message: 'Notes Container successfully deleted.' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete Notes Container.', error });
  }
});

router.patch('/editNotesContainers', async (req, res) => {
  const { notesContainerEditRequests } = req.body;

  try {
    await session.run(
      `UNWIND ${stringifyObject(notesContainerEditRequests)} as notesContainerEditRequest
       MATCH (notesContainer: NotesContainer)
       WHERE notesContainer.notesContainerId = notesContainerEditRequest.notesContainerId
       SET notesContainer.imageUrl = notesContainerEditRequest.newImage, notesContainer.name = notesContainerEditRequest.newName`
    );
    res.status(200).json({ message: 'Notes Containers successfully edited.' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to edit Notes Containers.', error });
  }
});

router.patch('/reorderNotesContainers', async (req, res) => {
  const { notesContainers } = req.body;
  const notesContainersWithIndex = notesContainers.map((notesContainer, index) => ({
    ...notesContainer,
    index: `${notesContainers.length - index - 1}`,
  }));

  try {
    await session.run(
      `UNWIND ${stringifyObject(notesContainersWithIndex)} as notesContainerWithIndex
       MATCH (notesContainer: NotesContainer)
       WHERE notesContainer.notesContainerId = notesContainerWithIndex.notesContainerId
       SET notesContainer.orderIndex = notesContainerWithIndex.index`
    );
    res.status(200).json({ message: 'Notes Containers successfully reordered.' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to reorder Notes Containers.', error });
  }
});

router.post('/addNotesContainer', async (req, res) => {
  const { imageUrl, name, orderIndex, parentNotesContainerId, userId } = req.query;
  const newNotesContainerId = userId + '-' + Date.now();
  const escapedName = name.replace(/'/g, '&apos;');

  try {
    await session.run(
      parentNotesContainerId
        ? `MATCH (notesContainer: NotesContainer)
           WHERE notesContainer.notesContainerId = '${parentNotesContainerId}'
           CREATE (newNotesContainer: NotesContainer {imageUrl: '${imageUrl}', name: '${escapedName}', orderIndex: '${orderIndex}',
                   userId: '${userId}', notesContainerId: '${newNotesContainerId}'})<-[:IS_PARENT_NOTES_CONTAINER_OF]-(notesContainer)`
        : `CREATE (notesContainer: NotesContainer {imageUrl: '${imageUrl}', name: '${escapedName}', orderIndex: '${orderIndex}',
                   userId: '${userId}', notesContainerId: '${newNotesContainerId}'})<-[:IS_PARENT_NOTES_CONTAINER_OF]-(notesContainer)`
    );
    const newNotesContainer = new NotesContainer({
      childNotesContainers: [],
      imageUrl,
      name,
      notes: [],
      notesContainerId: newNotesContainerId,
    });
    res.status(200).json({ message: 'Notes Container successfully added.', newNotesContainer });
  } catch (error) {
    res.status(400).json({ message: 'Failed to add Notes Container.', error });
  }
});

export default router;