export interface AppStateI {
  didEditNotes: boolean;
  didEnterOrExitNotesContainer: boolean;
  errorMessage: string;
  isLoading: boolean;
  notesContainerStack: NotesContainerI[];
};

export interface NoteI {
  html: string;
  noteId: string;
};

export interface NoteStateI {
  addingNoteErrorMessage: string;
  addingNoteSuccessMessage: string;
  deletingNoteErrorMessage: string;
  deletingNoteSuccessMessage: string;
  editingNotesErrorMessage: string;
  editingNotesSuccessMessage: string;
  isAddingNote: boolean;
  isDeletingNote: boolean;
  isEditingNotes: boolean;
};

interface UserI {
  email: string;
  token: string;
  userId: string;
};

export interface UserStateI {
  errorMessage: string;
  isLoading: boolean;
  isSignUpLoading: boolean;
  successMessage: '';
  userData: UserI;
};

export interface NotesContainerEditRequestI {
  newImage: string | File | null;
  newName: string;
  notesContainerId: string;
};

export interface NotesContainerI {
  childNotesContainers: NotesContainerI[];
  imageUrl: string;
  name: string;
  notes: NoteI[];
  notesContainerId: string;
};

export interface NotesContainerStateI {
  addingNotesContainerErrorMessage: string;
  addingNotesContainerSuccessMessage: string;
  deletingNotesContainerErrorMessage: string;
  deletingNotesContainerSuccessMessage: string;
  editingNotesContainersErrorMessage: string;
  editingNotesContainersSuccessMessage: string;
  isAddingNotesContainer: boolean;
  isDeletingNotesContainer: boolean;
  isEditingNotesContainers: boolean;
  reorderingNotesContainersErrorMessage: string;
};