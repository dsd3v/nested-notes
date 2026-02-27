import { RTE_CONTENT_STYLE, RTE_HEIGHT } from '../../constants';
import { Dispatch, SetStateAction } from 'react';
import '../styles/richTextEditorSkin.css';
import { NoteDiv } from '../../styles/NotesStyles';
import { Editor } from '@tinymce/tinymce-react';

export const Note = ({
  html,
  isFirstEditorInitialized,
  setIsFirstEditorInitialized,
}: {
  html: string;
  isFirstEditorInitialized: boolean;
  setIsFirstEditorInitialized: Dispatch<SetStateAction<boolean>>;
}) => (
  <NoteDiv $isInitialized={isFirstEditorInitialized}>
    <Editor
      disabled={true}
      init={{
        content_style: RTE_CONTENT_STYLE,
        contextmenu: false,
        height: RTE_HEIGHT,
        menubar: false,
        statusbar: false,
        toolbar: false,
        width: '100%',
      }}
      initialValue={html}
      onInit={() => setIsFirstEditorInitialized(true)}
    />
  </NoteDiv>
);