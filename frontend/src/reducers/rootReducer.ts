import { appStateReducer } from './appStateReducer';
import { noteReducer } from './noteReducer';
import { notesContainerReducer } from './notesContainerReducer';
import { combineReducers } from 'redux';
import { userReducer } from './userReducer';

export const rootReducer = combineReducers({
  appState: appStateReducer,
  note: noteReducer,
  user: userReducer,
  notesContainer: notesContainerReducer,
});