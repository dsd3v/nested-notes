import { Router } from 'express';
import { Note } from '../schemas/Note.js';
import { session } from '../server.js';
import stringifyObject from 'stringify-object';

const router = Router();

router.delete('/deleteNote', async (req, res) => {
  const { noteId } = req.body;

  try {
    await session.run(
      `MATCH (note: Note)
       WHERE note.noteId = '${noteId}'
       DETACH DELETE note`
    );
    res.status(200).json({ message: 'Note successfully deleted.' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete note.', error });
  }
});

router.patch('/editNotes', async (req, res) => {
  const { notes } = req.body;
  const notesWithIndex = notes.map((note, index) => ({
    ...note,
    index: `${notes.length - index - 1}`,
  }));

  try {
    await session.run(
      `UNWIND ${stringifyObject(notesWithIndex)} as changedNote
       MATCH (note: Note)
       WHERE note.noteId = changedNote.noteId
       SET note.html = changedNote.html, note.orderIndex = changedNote.index`
    );
    res.status(200).json({ message: 'Notes successfully edited.' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to edit notes.', error });
  }
});

router.post('/addNote', async (req, res) => {
  const { newNoteHTML, orderIndex, userId, notesContainerId } = req.query;
  const newNoteId = userId + '-' + Date.now();

  try {
    await session.run(
      `MATCH (notesContainer:NotesContainer)
       WHERE notesContainer.notesContainerId = '${notesContainerId}'
       CREATE (note: Note {html: '${newNoteHTML.replace(/'/g, '&apos;')}', orderIndex: '${orderIndex}',
               noteId: '${newNoteId}'})<-[:CONTAINS_NOTE]-(notesContainer)`
    );
    const newNote = new Note({
      html: newNoteHTML,
      noteId: newNoteId,
    });
    res.status(200).json({ message: 'Note successfully added.', newNote });
  } catch (error) {
    res.status(400).json({ message: 'Failed to add note.', error });
  }
});

export default router;