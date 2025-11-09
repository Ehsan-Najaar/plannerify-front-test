'use client'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import { useRef } from 'react'

export default function CKEditorHtml({ value, onChange, placeholder }) {
  const editorRef = useRef(null)

  return (
    <div className="rounded-md border text-black min-h-[500px]">
      <style jsx global>{`
        .ck-editor__editable[role='textbox'] {
          min-height: 500px;
        }
      `}</style>

      <CKEditor
        editor={ClassicEditor}
        data={value} // فقط مقدار اولیه
        onReady={(editor) => {
          editorRef.current = editor
        }}
        onChange={(_, editor) => onChange(editor.getData())}
        config={{
          licenseKey: 'GPL',
          placeholder: placeholder || 'Write your About content…',
          toolbar: [
            'heading',
            '|',
            'bold',
            'italic',
            'underline',
            'link',
            '|',
            'undo',
            'redo',
          ],
          table: {
            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
          },
        }}
      />
    </div>
  )
}
