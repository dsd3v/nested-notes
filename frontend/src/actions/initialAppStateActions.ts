import axios from 'axios';
import { createAction, Dispatch } from '@reduxjs/toolkit';

export const GET_INITIAL_APP_STATE_STARTED = createAction('GET_INITIAL_APP_STATE_STARTED');
export const GET_INITIAL_APP_STATE_SUCCEEDED = createAction('GET_INITIAL_APP_STATE_SUCCEEDED', ({ initialAppState }) => ({
  payload: { initialAppState },
}));
export const GET_INITIAL_APP_STATE_FAILED = createAction('GET_INITIAL_APP_STATE_FAILED', ({ errorMessage }) => ({
  payload: { errorMessage },
}));

export const getInitialAppState =
  ({ userId }: { userId: string }) =>
    async (dispatch: Dispatch) => {
      dispatch(GET_INITIAL_APP_STATE_STARTED());
      try {
        const {
          data: { initialInitialappState },
        } = await axios.get('/initialAppState/initialAppState', { params: { userId } });
        dispatch(GET_INITIAL_APP_STATE_SUCCEEDED({ initialAppState }));
      } catch (error) {
        console.error(error);
        dispatch(GET_INITIAL_APP_STATE_FAILED({ errorMessage: 'Failed to get Notes Containers from database.' }));
      }
    };