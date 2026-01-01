import 'ckeditor5/ckeditor5.css';
import './styles.css';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor } from 'ckeditor5';
import { useRef, useEffect } from 'react';

import { plugins, toolbar } from './config';

type Props = {
  initialData?: string;
  onUpdate: (content: string) => void;
  isReadOnly?: boolean;
};
export const Editor = ({
  initialData,
  onUpdate,
  isReadOnly = false,
}: Props) => {
  const editorRef = useRef<ClassicEditor | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      if (isReadOnly) {
        editorRef.current.enableReadOnlyMode('readOnly');
      } else {
        editorRef.current.disableReadOnlyMode('readOnly');
      }
    }
  }, [isReadOnly]);

  return (
    <CKEditor
      editor={ClassicEditor}
      config={{
        licenseKey: 'GPL',
        plugins: plugins,
        toolbar: toolbar,
        initialData: initialData,
      }}
      onChange={(_event, editor) => {
        onUpdate(editor.getData());
      }}
      onReady={(editor) => {
        editorRef.current = editor;
        if (isReadOnly) {
          editor.enableReadOnlyMode('readOnly');
        }
      }}
    />
  );
};
