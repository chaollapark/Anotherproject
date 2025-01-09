import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { Job } from '@/models/Job';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function RichTextEditor({
  jobDoc,
  onChange,
}: {
  jobDoc?: Job;
  onChange?: (html: string) => void;
}) {
  const [editorContent, setEditorContent] = useState(jobDoc?.description || '');

  const handleEditorChange = (value: string) => {
    setEditorContent(value);
    if (onChange) {
      onChange(value); // Pass the updated HTML content to the parent component
    }
  };

  const modules = {
    toolbar: [
      [{ header: [2, 3, 4, false] }], // Header styles
      ['bold', 'italic', 'underline'], // Formatting styles
      [{ list: 'ordered' }, { list: 'bullet' }], // Lists
      ['link'], // Links
      ['clean'], // Remove formatting
    ],
  };

  return (
    <div>
      <ReactQuill
        value={editorContent}
        onChange={handleEditorChange}
        modules={modules}
        theme="snow"
        placeholder="Describe the role, responsibilities, requirements, and benefits..."
        className="h-64" // Fixed height for the editor
      />
    </div>
  );
}
