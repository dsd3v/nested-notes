import { bucket, imageUrlRoot } from '../aws';
import axios from 'axios';
import { NotesContainerEditRequestI, NotesContainerI } from '../interfaces';
import { Dispatch as ReactDispatch, SetStateAction } from 'react';
import { createAction, Dispatch } from '@reduxjs/toolkit';

export const ADD_NOTES_CONTAINER_FAILED = createAction('ADD_NOTES_CONTAINER_FAILED', ({ errorMessage }: { errorMessage: string }) => ({
  payload: { errorMessage },
}));
export const ADD_NOTES_CONTAINER_STARTED = createAction('ADD_NOTES_CONTAINER_STARTED');
export const ADD_NOTES_CONTAINER_SUCCEEDED = createAction(
  'ADD_NOTES_CONTAINER_SUCCEEDED',
  ({ newNotesContainer, successMessage }: { newNotesContainer: NotesContainerI; successMessage: string }) => ({
    payload: { newNotesContainer, successMessage },
  })
);

export const CLEAR_ADD_NOTES_CONTAINER_MESSAGES = createAction('CLEAR_ADD_NOTES_CONTAINER_MESSAGES');
export const CLEAR_DELETE_NOTES_CONTAINER_MESSAGES = createAction('CLEAR_DELETE_NOTES_CONTAINER_MESSAGES');
export const CLEAR_EDIT_NOTES_CONTAINERS_MESSAGES = createAction('CLEAR_EDIT_NOTES_CONTAINERS_MESSAGES');
export const CLEAR_REORDER_NOTES_CONTAINERS_MESSAGES = createAction('CLEAR_REORDER_NOTES_CONTAINERS_MESSAGES');

export const DELETE_NOTES_CONTAINER_FAILED = createAction(
  'DELETE_NOTES_CONTAINER_FAILED',
  ({ errorMessage }: { errorMessage: string }) => ({
    payload: { errorMessage },
  })
);
export const DELETE_NOTES_CONTAINER_STARTED = createAction('DELETE_NOTES_CONTAINER_STARTED');
export const DELETE_NOTES_CONTAINER_SUCCEEDED = createAction(
  'DELETE_NOTES_CONTAINER_SUCCEEDED',
  ({ deletedNotesContainerId, successMessage }: { deletedNotesContainerId: string; successMessage: string }) => ({
    payload: { deletedNotesContainerId, successMessage },
  })
);

export const EDIT_NOTES_CONTAINERS_FAILED = createAction('EDIT_NOTES_CONTAINERS_FAILED', ({ errorMessage }: { errorMessage: string }) => ({
  payload: { errorMessage },
}));
export const EDIT_NOTES_CONTAINERS_STARTED = createAction('EDIT_NOTES_CONTAINERS_STARTED');
export const EDIT_NOTES_CONTAINERS_SUCCEEDED = createAction(
  'EDIT_NOTES_CONTAINERS_SUCCEEDED',
  ({ successMessage, notesContainerEditRequests }: { successMessage: string; notesContainerEditRequests: NotesContainerEditRequestI[] }) => ({
    payload: { successMessage, notesContainerEditRequests },
  })
);

export const ENTER_ROOT_NOTES_CONTAINER = createAction('ENTER_ROOT_NOTES_CONTAINER');
export const ENTER_NOTES_CONTAINER = createAction('ENTER_NOTES_CONTAINER', ({ notesContainerToEnter }) => ({
  payload: { notesContainerToEnter },
}));
export const EXIT_NOTES_CONTAINER = createAction('EXIT_NOTES_CONTAINER');

export const REORDER_NOTES_CONTAINERS_FAILED = createAction(
  'REORDER_NOTES_CONTAINERS_FAILED',
  ({ errorMessage }: { errorMessage: string }) => ({
    payload: { errorMessage },
  })
);
export const REORDER_NOTES_CONTAINERS_IN_STATE = createAction(
  'REORDER_NOTES_CONTAINERS_IN_STATE',
  ({ newIndex, oldIndex }: { newIndex: number; oldIndex: number }) => ({
    payload: { newIndex, oldIndex },
  })
);
export const REORDER_NOTES_CONTAINERS_STARTED = createAction('REORDER_NOTES_CONTAINERS_STARTED');
export const REORDER_NOTES_CONTAINERS_SUCCEEDED = createAction('REORDER_NOTES_CONTAINERS_SUCCEEDED');

const addNotesContainerFailedMessage = 'Failed to add new Notes Container.';
const addNotesContainerImageFailedMessage = 'Failed to add new Notes Container: there was en error with the uploaded image.';
const addNotesContainerSucceededMessage = 'Notes Container added.';

const deleteNotesContainerFailedMessage = 'Failed to delete Notes Container: an error occurred.';
const deleteNotesContainerSucceededMessage = 'Notes Container deleted.';

const editNotesContainersFailedMessage = 'Failed to save Notes Container changes: an error occurred.';
const editNotesContainersSucceededMessage = 'Notes Container changes saved.';

const reorderNotesContainersFailedMessage = 'Failed to reorder Notes Containers: an error occured.';

export const addNotesContainer =
  ({
    newNotesContainerImgFile,
    newNotesContainerName,
    orderIndex,
    parentNotesContainerId,
    setNotesContainerNames,
    userId,
  }: {
    newNotesContainerImgFile: File | null;
    newNotesContainerName: string;
    orderIndex: number;
    parentNotesContainerId: string;
    setNotesContainerNames: ReactDispatch<SetStateAction<{ [key: string]: string }>>;
    userId: string;
  }) =>
    async (dispatch: Dispatch) => {
      dispatch(ADD_NOTES_CONTAINER_STARTED());
      try {
        if (newNotesContainerImgFile) {
          bucket
            .putObject({
              Body: newNotesContainerImgFile,
              Bucket: process.env.REACT_APP_S3_BUCKET || '',
              Key: newNotesContainerImgFile.name,
            })
            .on('httpUploadProgress', async ({ loaded, total }: { loaded: number; total: number }) => {
              if (Math.round((loaded / total) * 100) === 100) {
                const imageUrl = imageUrlRoot + newNotesContainerImgFile.name;
                try {
                  const {
                    data: { newNotesContainer },
                  } = await axios.post('/notesContainer/addNotesContainer', null, {
                    params: {
                      imageUrl,
                      name: newNotesContainerName,
                      orderIndex,
                      parentNotesContainerId,
                      userId,
                    },
                  });
                  setNotesContainerNames((prevNotesContainerNames: { [key: string]: string }) => ({
                    ...prevNotesContainerNames,
                    [newNotesContainer.notesContainerId]: newNotesContainer.name,
                  }));
                  dispatch(
                    ADD_NOTES_CONTAINER_SUCCEEDED({
                      newNotesContainer,
                      successMessage: addNotesContainerSucceededMessage,
                    })
                  );
                } catch (error) {
                  console.error(error);
                  dispatch(
                    ADD_NOTES_CONTAINER_FAILED({
                      errorMessage: addNotesContainerFailedMessage,
                    })
                  );
                }
              }
            })
            .send((error) => {
              if (error) {
                console.error(error);
                dispatch(
                  ADD_NOTES_CONTAINER_FAILED({
                    errorMessage: addNotesContainerImageFailedMessage,
                  })
                );
              }
            });
        } else {
          try {
            const {
              data: { newNotesContainer },
            } = await axios.post('/notesContainer/addNotesContainer', null, {
              params: {
                imageUrl: '',
                name: newNotesContainerName,
                orderIndex,
                parentNotesContainerId,
                userId,
              },
            });
            dispatch(
              ADD_NOTES_CONTAINER_SUCCEEDED({
                newNotesContainer,
                successMessage: addNotesContainerSucceededMessage,
              })
            );
            setNotesContainerNames((prevNotesContainerNames: { [key: string]: string }) => ({
              ...prevNotesContainerNames,
              [newNotesContainer.notesContainerId]: newNotesContainer.name,
            }));
          } catch (error) {
            console.error(error);
            dispatch(ADD_NOTES_CONTAINER_FAILED({ errorMessage: addNotesContainerFailedMessage }));
          }
        }
      } catch (error) {
        console.error(error);
        dispatch(ADD_NOTES_CONTAINER_FAILED({ errorMessage: addNotesContainerFailedMessage }));
      }
    };

export const deleteNotesContainer =
  ({
    setNotesContainerNames,
    notesContainerToDeleteId,
  }: {
    setNotesContainerNames: ReactDispatch<SetStateAction<{ [key: string]: string }>>;
    notesContainerToDeleteId: string;
  }) =>
    async (dispatch: Dispatch) => {
      dispatch(DELETE_NOTES_CONTAINER_STARTED());
      try {
        await axios.delete('/notesContainer/deleteNotesContainer', {
          data: { notesContainerId: notesContainerToDeleteId },
        });
        dispatch(
          DELETE_NOTES_CONTAINER_SUCCEEDED({
            deletedNotesContainerId: notesContainerToDeleteId,
            successMessage: deleteNotesContainerSucceededMessage,
          })
        );
        setNotesContainerNames((prevNotesContainerNames: { [key: string]: string }) =>
          Object.fromEntries(Object.entries(prevNotesContainerNames).filter(([key, _]) => key !== notesContainerToDeleteId))
        );
      } catch (error) {
        console.error(error);
        dispatch(DELETE_NOTES_CONTAINER_FAILED({ errorMessage: deleteNotesContainerFailedMessage }));
      }
    };

export const editNotesContainers =
  ({ notesContainerEditRequests }: { notesContainerEditRequests: NotesContainerEditRequestI[] }) =>
    async (dispatch: Dispatch) => {
      dispatch(EDIT_NOTES_CONTAINERS_STARTED());
      const imageUploadPromises = [] as Promise<null>[];

      notesContainerEditRequests.forEach((editRequest, idx) => {
        const { newImage } = editRequest;
        if (newImage instanceof File) {
          imageUploadPromises.push(
            new Promise((resolve) => {
              bucket
                .putObject({
                  Body: newImage,
                  Bucket: process.env.REACT_APP_S3_BUCKET || '',
                  Key: newImage.name,
                })
                .on('httpUploadProgress', async ({ loaded, total }: { loaded: number; total: number }) => {
                  if (Math.round((loaded / total) * 100) === 100) {
                    const imageUrl = imageUrlRoot + newImage.name;
                    notesContainerEditRequests[idx].newImage = imageUrl;
                    resolve(null);
                  }
                })
                .send((error) => {
                  if (error) {
                    console.error(error);
                    editRequest.newImage = null;
                    resolve(null);
                  }
                });
            })
          );
        }
      });

      Promise.all(imageUploadPromises).then(async () => {
        try {
          await axios.patch('/notesContainer/editNotesContainers', {
            notesContainerEditRequests,
          });
          dispatch(
            EDIT_NOTES_CONTAINERS_SUCCEEDED({
              successMessage: editNotesContainersSucceededMessage,
              notesContainerEditRequests,
            })
          );
        } catch (error) {
          console.error(error);
          dispatch(
            EDIT_NOTES_CONTAINERS_FAILED({
              errorMessage: editNotesContainersFailedMessage,
            })
          );
        }
      });
    };

export const enterNotesContainer =
  ({ isEnteringRoot, notesContainerToEnter }: { isEnteringRoot?: boolean; notesContainerToEnter?: NotesContainerI }) =>
    async (dispatch: Dispatch) => {
      dispatch(CLEAR_ADD_NOTES_CONTAINER_MESSAGES());
      dispatch(CLEAR_DELETE_NOTES_CONTAINER_MESSAGES());
      dispatch(CLEAR_EDIT_NOTES_CONTAINERS_MESSAGES());
      dispatch(isEnteringRoot ? ENTER_ROOT_NOTES_CONTAINER() : ENTER_NOTES_CONTAINER({ notesContainerToEnter }));
    };

export const exitNotesContainer = () => async (dispatch: Dispatch) => {
  dispatch(CLEAR_ADD_NOTES_CONTAINER_MESSAGES());
  dispatch(CLEAR_DELETE_NOTES_CONTAINER_MESSAGES());
  dispatch(CLEAR_EDIT_NOTES_CONTAINERS_MESSAGES());
  dispatch(EXIT_NOTES_CONTAINER());
};

export const reorderNotesContainers =
  ({ notesContainers }: { notesContainers: NotesContainerI[] }) =>
    async (dispatch: Dispatch) => {
      dispatch(REORDER_NOTES_CONTAINERS_STARTED());
      try {
        await axios.patch('/notesContainer/reorderNotesContainers', {
          notesContainers,
        });
        dispatch(REORDER_NOTES_CONTAINERS_SUCCEEDED());
      } catch (error) {
        console.error(error);
        dispatch(
          REORDER_NOTES_CONTAINERS_FAILED({
            errorMessage: reorderNotesContainersFailedMessage,
          })
        );
      }
    };