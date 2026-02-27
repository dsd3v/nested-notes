import { addNotesContainer, CLEAR_ADD_NOTES_CONTAINER_MESSAGES } from '../actions/notesContainerActions';
import {
  IMAGE_FILE_ERROR_MESSAGE,
  REQUIRED_ERROR_MESSAGE,
  NOTES_CONTAINER_NAME_EXISTS_ERROR_MESSAGE
} from '../../constants';
import defaultNotesContainerImgUrl from '../images/notesContainerPic.jpg';
import { Dispatch, SetStateAction, useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { selectUserId } from '../../selectors/userSelectors';
import {
  selectAddingNotesContainerErrorMessage,
  selectAddingNotesContainerSuccessMessage,
  selectIsAddingNotesContainer,
} from '../../selectors/notesContainerSelectors';
import { useAppDispatch, useAppSelector } from '../../store';
import { ErrorMessage2, SuccessMessage2 } from '../../styles/FormStyles';
import { Button, Div, EmptySpan, FileInput, NameInputField } from '../../styles/GlobalStyles';
import { EditNotesContainerCell, EditNotesContainerImage, EmptyNotesContainerImage, NotesContainerImageText } from '../../styles/NotesStyles';

const defaultFormValues = {
  didNewNotesContainerNameChange: false,
  newNotesContainerImgFile: null,
  newNotesContainerName: '',
} as {
  didNewNotesContainerNameChange: boolean;
  newNotesContainerImgFile: File | null;
  newNotesContainerName: string;
};

export const NewNotesContainerForm = ({
  parentNotesContainerId,
  setNotesContainerNames,
  notesContainerNames,
}: {
  parentNotesContainerId: string;
  setNotesContainerNames: Dispatch<SetStateAction<{ [key: string]: string }>>;
  notesContainerNames: { [key: string]: string };
}) => {
  const {
    formState: { dirtyFields, errors },
    handleSubmit,
    register,
    setValue,
    watch,
  } = useForm({
    defaultValues: defaultFormValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const dispatch = useAppDispatch();
  const addingNotesContainerErrorMessage = useAppSelector(selectAddingNotesContainerErrorMessage);
  const addingNotesContainerSuccessMessage = useAppSelector(selectAddingNotesContainerSuccessMessage);
  const isAddingNotesContainer = useAppSelector(selectIsAddingNotesContainer);
  const userId = useAppSelector(selectUserId);

  const [defaultNotesContainerImageFile, setDefaultNotesContainerImageFile] = useState({} as File);
  const [newNotesContainerImageErrorMessage, setNewNotesContainerImageErrorMessage] = useState('');
  const [addedNotesContainerName, setAddedNotesContainerName] = useState('');

  const isAddNewNotesContainerDisabled = isAddingNotesContainer || !!Object.keys(errors).length || !Object.keys(dirtyFields).length;
  const newNotesContainerName = watch('newNotesContainerName');
  const didNewNotesContainerNameChange = watch('didNewNotesContainerNameChange');

  useLayoutEffect(() => {
    (async () => {
      const response = await fetch(defaultNotesContainerImgUrl);
      const blob = await response.blob();
      const file = new File([blob], defaultNotesContainerImgUrl, { type: blob.type });
      setDefaultNotesContainerImageFile(file);
      setValue('newNotesContainerImgFile', file);
    })();
  }, [setValue]);

  const clearNewNotesContainerMessages = useCallback(() => {
    if (addingNotesContainerErrorMessage || addingNotesContainerSuccessMessage) {
      dispatch(CLEAR_ADD_NOTES_CONTAINER_MESSAGES());
    }
  }, [addingNotesContainerErrorMessage, addingNotesContainerSuccessMessage, dispatch]);

  useEffect(() => {
    if (!!addingNotesContainerSuccessMessage && newNotesContainerName === addedNotesContainerName) {
      setValue('newNotesContainerName', '');
    }
    if (didNewNotesContainerNameChange && (!!addingNotesContainerErrorMessage || !!addingNotesContainerSuccessMessage)) {
      clearNewNotesContainerMessages();
    }
  }, [
    addedNotesContainerName,
    addingNotesContainerErrorMessage,
    addingNotesContainerSuccessMessage,
    clearNewNotesContainerMessages,
    didNewNotesContainerNameChange,
    newNotesContainerName,
    setValue,
  ]);

  useEffect(() => {
    if (newNotesContainerName) {
      setValue('didNewNotesContainerNameChange', true);
    }
  }, [newNotesContainerName, setValue]);

  const handleAddNewNotesContainerClicked = handleSubmit(
    async ({ newNotesContainerImgFile, newNotesContainerName }: { newNotesContainerImgFile: File | null; newNotesContainerName: string }) => {
      if (isAddNewNotesContainerDisabled) {
        return;
      }
      setValue('didNewNotesContainerNameChange', false);
      setAddedNotesContainerName(newNotesContainerName);
      dispatch(
        addNotesContainer({
          newNotesContainerImgFile,
          newNotesContainerName,
          orderIndex: Object.keys(notesContainerNames).length - 1,
          parentNotesContainerId,
          setNotesContainerNames,
          userId,
        })
      );
    }
  );

  const handleInputChange = ({ target: { value } }: { target: { value: string } }) =>
    setNotesContainerNames((prevNotesContainerNames: { [key: string]: string }) => ({
      ...prevNotesContainerNames,
      newNotesContainer: value,
    }));

  const handleUploadFile = ({ target: { files } }: { target: { files: FileList | null } }) => {
    if (!(files![0].type.slice(0, 5) === 'image')) {
      setNewNotesContainerImageErrorMessage(IMAGE_FILE_ERROR_MESSAGE);
    } else {
      setNewNotesContainerImageErrorMessage('');
      setValue('newNotesContainerImgFile', files![0]);
      clearNewNotesContainerMessages();
    }
  };

  return (
    <EditNotesContainerCell>
      <Div $d="column">
        <NameInputField
          {...register('newNotesContainerName', {
            onChange: handleInputChange,
            required: {
              message: REQUIRED_ERROR_MESSAGE,
              value: true,
            },
            validate: (value: string) =>
              !(Object.values(notesContainerNames).includes(value) && notesContainerNames.newNotesContainer !== value) ||
              NOTES_CONTAINER_NAME_EXISTS_ERROR_MESSAGE,
          })}
          placeholder={'New NotesContainer Name (Required)'}
        />
        <ErrorMessage2>
          {errors.newNotesContainerName ? errors.newNotesContainerName.message : <EmptySpan>&nbsp;</EmptySpan>}
        </ErrorMessage2>
        {watch('newNotesContainerImgFile') ? (
          <EditNotesContainerImage src={URL.createObjectURL(watch('newNotesContainerImgFile')!)} />
        ) : (
          <EmptyNotesContainerImage />
        )}
        <FileInput accept="image/*" onChange={handleUploadFile} type="file" />
      </Div>
      <Div>
        <NotesContainerImageText
          onClick={() => {
            setNewNotesContainerImageErrorMessage('');
            setValue('newNotesContainerImgFile', null);
            clearNewNotesContainerMessages();
          }}
        >
          Remove
        </NotesContainerImageText>
        <NotesContainerImageText
          onClick={() => {
            setNewNotesContainerImageErrorMessage('');
            setValue('newNotesContainerImgFile', defaultNotesContainerImageFile);
            clearNewNotesContainerMessages();
          }}
        >
          Use Default
        </NotesContainerImageText>
      </Div>
      <Div>
        {newNotesContainerImageErrorMessage ? (
          <ErrorMessage2>{newNotesContainerImageErrorMessage}</ErrorMessage2>
        ) : (
          <EmptySpan>&nbsp;</EmptySpan>
        )}
      </Div>
      <Div $d="column">
        <Div>
          <Button
            $isDisabled={isAddNewNotesContainerDisabled}
            onClick={isAddNewNotesContainerDisabled ? () => { } : handleAddNewNotesContainerClicked}
          >
            {isAddingNotesContainer ? 'Adding New NotesContainer...' : 'Add New NotesContainer'}
          </Button>
        </Div>
        {addingNotesContainerErrorMessage && !addingNotesContainerSuccessMessage ? (
          <ErrorMessage2>{addingNotesContainerErrorMessage}</ErrorMessage2>
        ) : addingNotesContainerSuccessMessage && !addingNotesContainerErrorMessage ? (
          <SuccessMessage2>{addingNotesContainerSuccessMessage}</SuccessMessage2>
        ) : (
          <SuccessMessage2>
            <EmptySpan>&nbsp;</EmptySpan>
          </SuccessMessage2>
        )}
      </Div>
    </EditNotesContainerCell>
  );
};