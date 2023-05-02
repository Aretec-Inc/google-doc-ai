import React from 'react'
import Editor from '@monaco-editor/react'

const options = {
  readOnly: true,
  wordWrap: 'on',
  automaticLayout: true,
  highlightActiveIndentGuide: true
}

const CodeEditorForJSON = ({ json }) => {
  return (
    <Editor
      height={document?.body?.offsetHeight / 1.2}
      language='json'
      theme='dark'
      options={options}
      value={json}
    />
  )
}

export default CodeEditorForJSON
