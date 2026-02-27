import mongoose from 'mongoose';
import { NoteSchema } from './Note.js';

const { model, Schema } = mongoose;

const NotesContainerSchema = new Schema();

NotesContainerSchema.add({
  childNotesContainers: [NotesContainerSchema],
  imageUrl: String,
  name: String,
  notes: [NoteSchema],
  notesContainerId: String,
});

export const NotesContainer = model('NotesContainer', NotesContainerSchema);