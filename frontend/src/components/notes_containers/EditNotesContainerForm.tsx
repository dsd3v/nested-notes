import { deleteNotesContainer } from '../actions/notesContainerActions';
import {
  IMAGE_FILE_ERROR_MESSAGE,
  REQUIRED_ERROR_MESSAGE,
  NOTES_CONTAINER_NAME_EXISTS_ERROR_MESSAGE,
  NOTES_CONTAINER_NAME_NULL_ERROR_MESSAGE,
} from '../../constants';
import { DeleteModal } from './DeleteModal';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import defaultNotesContainerImgUrl from '../images/notesContainerPic.jpg';
import { NotesContainerEditRequestI, NotesContainerI } from '../../interfaces';
import { Dispatch, SetStateAction, useEffect, useLayoutEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { selectDeletingNotesContainerErrorMessage, selectIsDeletingNotesContainer } from '../../selectors/notesContainerSelectors';
import { useAppDispatch, useAppSelector } from '../../store';
import { ErrorMessage2 } from '../../styles/FormStyles';
import { Div, EmptySpan, FileInput, NameInputField, X } from '../../styles/GlobalStyles';
import { EditNotesContainerCell, EditNotesContainerImage, EmptyNotesContainerImage, NotesContainerImageText } from '../../styles/NotesStyles';

export const EditNotesContainerForm = ({
  isActive,
  setEditErrors,
  setNotesContainerEditRequests,
  setNotesContainerNames,
  notesContainer,
  notesContainerNames,
}: {
  handle?: boolean;
  id?: null | string;
  isActive?: boolean;
  isOver?: boolean;
  setEditErrors: Dispatch<SetStateAction<Set<string>>>;
  setNotesContainerEditRequests: Dispatch<SetStateAction<NotesContainerEditRequestI[]>>;
  setNotesContainerNames: Dispatch<SetStateAction<{ [key: string]: string }>>;
  notesContainer: NotesContainerI;
  notesContainerNames: { [key: string]: string };
}) => {
  const defaultFormValues = {
    didNotesContainerNameChange: false,
    notesContainerImage: notesContainer.imageUrl,
    notesContainerName: notesContainer.name,
  } as {
    didNotesContainerNameChange: boolean;
    notesContainerImage: File | null | string;
    notesContainerName: string;
  };
  const {
    formState: { errors },
    register,
    setValue,
    watch,
  } = useForm({
    defaultValues: defaultFormValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: notesContainer.notesContainerId,
  });
  const dispatch = useAppDispatch();
  const deletingNotesContainerErrorMessage = useAppSelector(selectDeletingNotesContainerErrorMessage);
  const isDeletingNotesContainer = useAppSelector(selectIsDeletingNotesContainer);

  const [defaultNotesContainerImageFile, setDefaultNotesContainerImageFile] = useState({} as File);
  const [notesContainerImageErrorMessage, setNotesContainerImageErrorMessage] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const numErrors = Object.keys(errors).length;
  const notesContainerImage = watch('notesContainerImage');
  const notesContainerName = watch('notesContainerName');

  const handleCloseDeleteModal = () => setIsDeleteModalOpen(false);
  const handleOpenDeleteModal = () => setIsDeleteModalOpen(true);

  useEffect(() => {
    setEditErrors((prevEditErrors) => {
      const editErrors = new Set(prevEditErrors);
      if (!numErrors) {
        editErrors.delete(notesContainer.notesContainerId);
      } else {
        editErrors.add(notesContainer.notesContainerId);
      }
      return editErrors;
    });
  }, [numErrors, setEditErrors, notesContainer.notesContainerId]);

  useLayoutEffect(() => {
    (async () => {
      const response = await fetch(defaultNotesContainerImgUrl);
      const blob = await response.blob();
      const file = new File([blob], defaultNotesContainerImgUrl, { type: blob.type });
      setDefaultNotesContainerImageFile(file);
    })();
  }, []);

  const handleDeleteNotesContainer = () => {
    if (isDeletingNotesContainer) {
      return;
    }
    dispatch(
      deleteNotesContainer({
        setNotesContainerNames,
        notesContainerToDeleteId: notesContainer.notesContainerId,
      })
    );
  };

  const handleInputChange = ({ target: { value } }: { target: { value: string } }) => {
    setNotesContainerNames((prevNotesContainerNames: { [key: string]: string }) => ({
      ...prevNotesContainerNames,
      [notesContainer.notesContainerId]: value,
    }));
    setNotesContainerEditRequests((prevNotesContainerEditRequests) => {
      const editRequests = [...prevNotesContainerEditRequests];
      const idx = editRequests.findIndex((editRequest) => editRequest.notesContainerId === notesContainer.notesContainerId);
      if (idx !== -1) {
        editRequests[idx].newName = value;
      } else {
        editRequests.push({
          newImage: notesContainer.imageUrl,
          newName: value,
          notesContainerId: notesContainer.notesContainerId,
        });
      }
      return editRequests;
    });
  };

  const uploadImageHelper = ({ newImage }: { newImage: File | null }) => {
    setNotesContainerEditRequests((prevNotesContainerEditRequests) => {
      const editRequests = [...prevNotesContainerEditRequests];
      const idx = editRequests.findIndex((editRequest) => editRequest.notesContainerId === notesContainer.notesContainerId);
      if (idx !== -1) {
        editRequests[idx].newImage = newImage;
      } else {
        editRequests.push({
          newImage,
          newName: notesContainerName,
          notesContainerId: notesContainer.notesContainerId,
        });
      }
      return editRequests;
    });
  };

  const handleUploadFile = ({ target: { files } }: { target: { files: FileList | null } }) => {
    if (!(files![0].type.slice(0, 5) === 'image')) {
      setNotesContainerImageErrorMessage(IMAGE_FILE_ERROR_MESSAGE);
    } else {
      setNotesContainerImageErrorMessage('');
      setValue('notesContainerImage', files![0]);
      uploadImageHelper({ newImage: files![0] });
    }
  };

  const handleDefaultImage = () => {
    setNotesContainerImageErrorMessage('');
    setValue('notesContainerImage', defaultNotesContainerImageFile);
    uploadImageHelper({ newImage: defaultNotesContainerImageFile });
  };

  const handleRemoveImage = () => {
    setNotesContainerImageErrorMessage('');
    setValue('notesContainerImage', null);
    uploadImageHelper({ newImage: null });
  };

  return (
    <EditNotesContainerCell
      $isActive={isActive}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: 'none',
      }}
    >
      <DeleteModal
        bodyText="Are you sure you want to delete this notesContainer? All associated notes
          and inner notesContainers will also be deleted."
        deleteText={isDeletingNotesContainer ? 'Deleting NotesContainer...' : 'Delete'}
        errorMessage={deletingNotesContainerErrorMessage}
        onClose={handleCloseDeleteModal}
        onDelete={handleDeleteNotesContainer}
        shouldShow={isDeleteModalOpen}
        title={notesContainer.name}
      />
      <Div $j="space-between" $m="-5px 0 5px 0" $p="0 6px">
        <FontAwesomeIcon {...attributes} {...listeners} className="dragIcon" icon={faGripVertical} size="2x" />
        <X onClick={handleOpenDeleteModal}>X</X>
      </Div>
      <NameInputField
        {...register('notesContainerName', {
          onChange: handleInputChange,
          required: {
            message: REQUIRED_ERROR_MESSAGE,
            value: true,
          },
          validate: {
            doesntExist: (value) =>
              !(Object.values(notesContainerNames).includes(value) && notesContainerNames.newNotesContainer !== value) ||
              NOTES_CONTAINER_NAME_EXISTS_ERROR_MESSAGE,
            isntNull: (value) => !!value.trim() || NOTES_CONTAINER_NAME_NULL_ERROR_MESSAGE,
          },
        })}
        placeholder={'New NotesContainer Name (Required)'}
      />
      <ErrorMessage2>{errors.notesContainerName ? errors.notesContainerName.message : <EmptySpan>&nbsp;</EmptySpan>}</ErrorMessage2>
      {!!notesContainerImage ? (
        <EditNotesContainerImage src={typeof notesContainerImage === 'string' ? notesContainerImage : URL.createObjectURL(notesContainerImage)} />
      ) : (
        <EmptyNotesContainerImage />
      )}
      <FileInput accept="image/*" onChange={handleUploadFile} type="file" />
      <Div>
        <NotesContainerImageText onClick={handleRemoveImage}>Remove</NotesContainerImageText>
        <NotesContainerImageText onClick={handleDefaultImage}>Use Default</NotesContainerImageText>
      </Div>
      <Div>
        {notesContainerImageErrorMessage ? (
          <ErrorMessage2>{notesContainerImageErrorMessage}</ErrorMessage2>
        ) : (
          <EmptySpan>&nbsp;</EmptySpan>
        )}
      </Div>
    </EditNotesContainerCell>
  );
};