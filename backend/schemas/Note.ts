import mongoose from 'mongoose';

const { model, Schema } = mongoose;

export const NoteSchema = new Schema();

NoteSchema.add({
  html: String,
  noteId: String,
});

export const Note = model('Note', NoteSchema);