'use client';

import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

// Self-hosted (GPL) TinyMCE loaded from jsDelivr. This avoids tiny.cloud's
// API-key + approved-domain validation, so the editor works on any deployment
// domain without a NEXT_PUBLIC_TINYMCE_API_KEY.
const TINYMCE_SRC = 'https://cdn.jsdelivr.net/npm/tinymce@7/tinymce.min.js';

export default function TinyEditor({ initialValue, disabled = false, editorRef }) {
  return (
    <Editor
      tinymceScriptSrc={TINYMCE_SRC}
      licenseKey="gpl"
      onInit={(_evt, editor) => {
        editorRef.current = editor;
        if (initialValue) {
          editor.setContent(initialValue);
        }
      }}
      initialValue={initialValue || ''}
      init={{
        license_key: 'gpl',
        height: 500,
        menubar: false,
        plugins: 'anchor autolink charmap code codesample emoticons image link lists media searchreplace table visualblocks wordcount',
        toolbar:
          'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat | code',
        content_style:
          'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif; font-size: 14px; }',
        paste_as_text: false,
        valid_elements: '*[*]',
        extended_valid_elements: '*[*]',
        convert_newlines_to_brs: false,
        remove_trailing_brs: false,
      }}
      disabled={disabled}
    />
  );
}
