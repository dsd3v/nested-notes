import { deleteNote } from '../actions/noteActions';
import { bucket, imageUrlRoot } from '../../aws';
import { RTE_CONTENT_STYLE, RTE_HEIGHT, NOTE_CONTENT_REQUIRED } from '../../constants';
import { DeleteModal } from './DeleteModal';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NoteI } from '../../interfaces';
import { Dispatch, SetStateAction, useState } from 'react';
import { selectDeletingNoteErrorMessage, selectIsDeletingNote } from '../../selectors/noteSelectors';
import { useAppDispatch, useAppSelector } from '../../store';
import { ErrorMessage2 } from '../../styles/FormStyles';
import { Div, EmptySpan, X } from '../../styles/GlobalStyles';
import '../styles/richTextEditorSkin.css';
import { InnerNoteDiv } from '../../styles/NotesStyles';
import { Editor } from '@tinymce/tinymce-react';

export const RichTextEditor = ({
  editorKey,
  hasEditedNotes,
  initialValue,
  isActive,
  isForNewNote,
  onNewNoteChange,
  setHasEditedNotes,
  setIsFirstEditorInitialized,
  setIsNewNoteEditorInitialized,
  setNoteEditErrors,
  setNoteIdToNewHTML,
  setNotes,
  noteId,
  noteIdToNewHTML,
}: {
  editorKey?: number;
  handle?: boolean;
  hasEditedNotes?: boolean;
  id?: null | string;
  initialValue: string;
  isActive?: boolean;
  isForNewNote?: boolean;
  isOver?: boolean;
  onNewNoteChange?: ({ newHTML }: { newHTML: string }) => void;
  setHasEditedNotes?: Dispatch<SetStateAction<boolean>>;
  setIsFirstEditorInitialized: Dispatch<SetStateAction<boolean>>;
  setIsNewNoteEditorInitialized?: Dispatch<SetStateAction<boolean>>;
  setNoteEditErrors?: Dispatch<SetStateAction<Set<string>>>;
  setNoteIdToNewHTML?: Dispatch<SetStateAction<{ [key: string]: string }>>;
  setNotes: Dispatch<SetStateAction<NoteI[]>>;
  noteId: string;
  noteIdToNewHTML?: { [key: string]: string };
}) => {
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: noteId,
  });
  const dispatch = useAppDispatch();
  const deletingNoteErrorMessage = useAppSelector(selectDeletingNoteErrorMessage);
  const isDeletingNote = useAppSelector(selectIsDeletingNote);

  const [editorContent, setEditorContent] = useState(initialValue);
  const [hasMadeChange, setHasMadeChange] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditorInitialized, setIsEditorInitialized] = useState(false);

  const handleCloseDeleteModal = () => setIsDeleteModalOpen(false);
  const handleOpenDeleteModal = () => setIsDeleteModalOpen(true);

  const handleChange = (newHTML: string) => {
    setEditorContent(newHTML);
    if (!hasMadeChange) {
      setHasMadeChange(true);
    }
    if (isForNewNote) {
      onNewNoteChange!({ newHTML });
    } else {
      setNoteEditErrors!((prevEditErrors) => {
        const editErrors = new Set(prevEditErrors);
        if (!newHTML) {
          editErrors.add(noteId);
        } else {
          editErrors.delete(noteId);
        }
        return editErrors;
      });
      setNoteIdToNewHTML!((prevNoteIdToNewHTML: { [key: string]: string }) => ({
        ...prevNoteIdToNewHTML,
        [noteId]: newHTML,
      }));
      if (!hasEditedNotes) {
        setHasEditedNotes!(true);
      }
    }
  };

  const handleDeleteNote = () => {
    if (isDeletingNote) {
      return;
    }
    dispatch(
      deleteNote({
        setNotes,
        noteIdToNewHTML: noteIdToNewHTML || {},
        noteToDeleteId: noteId,
      })
    );
  };

  const handleImageUpload = (blobInfo: any, success: any) => {
    const imageFile = new File([blobInfo.blob()], blobInfo.filename());
    bucket
      .putObject({
        Body: imageFile,
        Bucket: process.env.REACT_APP_S3_BUCKET || '',
        Key: imageFile.name,
      })
      .on('httpUploadProgress', async ({ loaded, total }: { loaded: number; total: number }) => {
        if (Math.round((loaded / total) * 100) === 100) {
          const imageUrl = imageUrlRoot + imageFile.name;
          success(imageUrl);
        }
      })
      .send((error) => {
        if (error) {
          console.error(error);
        }
      });
  };

  const handleInit = () => {
    if (isForNewNote) {
      setIsNewNoteEditorInitialized!(true);
    }
    setIsFirstEditorInitialized(true);
    setIsEditorInitialized(true);
  };

  return (
    <InnerNoteDiv
      $isActive={isActive}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: 'none',
      }}
    >
      <DeleteModal
        bodyText="Are you sure you want to delete this note? This action cannot be undone."
        deleteText={isDeletingNote ? 'Deleting Note...' : 'Delete'}
        errorMessage={deletingNoteErrorMessage}
        onClose={handleCloseDeleteModal}
        onDelete={handleDeleteNote}
        shouldShow={isDeleteModalOpen}
        title={editorContent.replace(/<[^>]+>/g, '')}
      />
      <Div $m="5px 0">
        {!isForNewNote && isEditorInitialized && (
          <Div $j="space-between" $m="-5px 0 0 0" $p="0 8px">
            <FontAwesomeIcon {...attributes} {...listeners} className="dragIcon" icon={faGripVertical} size="2x" />
            <X onClick={handleOpenDeleteModal}>X</X>
          </Div>
        )}
      </Div>
      <Editor
        init={{
          automatic_uploads: true,
          block_unsupported_drop: false,
          branding: false,
          content_style: RTE_CONTENT_STYLE,
          contextmenu: false,
          images_upload_handler: handleImageUpload,
          elementpath: false,
          file_picker_types: 'image',
          font_formats:
            'Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif;' +
            'Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino;' +
            'Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier;' +
            'Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago;' +
            'Lato Black=lato; Roboto=roboto; Symbol=symbol; Tahoma=tahoma,arial,' +
            'helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times' +
            'new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva;' +
            'Webdings=webdings; Wingdings=wingdings,zapf dingbats',
          fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt 48pt 72pt',
          height: RTE_HEIGHT,
          menubar: false,
          placeholder: 'Enter note content here.',
          plugins: [
            'anchor advlist autolink charmap code fullscreen image insertdatetime',
            'link lists media paste print preview searchreplace table visualblocks',
          ],
          skin: 'oxide-dark',
          resize: 'both',
          toolbar:
            'fontselect fontsizeselect | bold italic underline strikethrough |' +
            'forecolor backcolor | link image | alignleft aligncenter ' +
            'alignright alignjustify | lineheight | bullist numlist | outdent indent | removeformat',
        }}
        initialValue={initialValue}
        key={editorKey}
        onEditorChange={handleChange}
        onInit={handleInit}
      />
      <Div>
        <ErrorMessage2>
          {hasMadeChange && !editorContent ? NOTE_CONTENT_REQUIRED : <EmptySpan>&nbsp;</EmptySpan>}
        </ErrorMessage2>
      </Div>
    </InnerNoteDiv>
  );
};