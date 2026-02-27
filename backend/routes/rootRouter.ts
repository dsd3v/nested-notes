import { Router } from 'express';
import initialAppState from './initialAppState.js';
import note from './note.js';
import notesContainer from './notesContainer.js';

export const rootRouter = Router();

rootRouter.use('/initialAppState', initialAppState);
rootRouter.use('/note', note);
rootRouter.use('/notesContainer', notesContainer);