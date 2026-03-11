import React from 'react'
import ReactMarkdown from 'react-markdown'

/**
 * A markdown editor that shows plain text while editing and renders markdown when unfocused.
 * Uses Tailwind Typography for beautiful markdown rendering.
 */

function Notes() {
  const [content, setContent] = React.useState('# My Notes\n\nStart typing your **markdown** here...\n\n- Item 1\n- Item 2\n\n```javascript\nconsole.log("Hello World")\n```')
  const [isEditing, setIsEditing] = React.useState(false)

  const handleFocus = () => {
    setIsEditing(true)
  }

  const handleBlur = () => {
    setIsEditing(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
  }

  return (
    <div className="w-full h-full flex flex-col">
      {isEditing ? (
        <textarea
          value={content}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="w-full h-full p-4 bg-transparent dark:text-white/90 font-mono text-sm resize-none border-none outline-none placeholder-white/50"
          placeholder="Type your markdown here..."
          autoFocus
        />
      ) : (
        <div
          onClick={handleFocus}
          className="w-full h-full p-4 cursor-text overflow-auto dark:text-white/90"
        >
          <ReactMarkdown
            components={{
              h1: ({children}) => <h1 className="text-2xl font-bold dark:text-white mb-4 border-b border-white/20 pb-2">{children}</h1>,
              h2: ({children}) => <h2 className="text-xl font-bold dark:text-white mb-3 border-b border-white/10 pb-1">{children}</h2>,
              h3: ({children}) => <h3 className="text-lg font-semibold dark:text-white mb-2">{children}</h3>,
              p: ({children}) => <p className="dark:text-white/90 mb-3 leading-relaxed">{children}</p>,
              ul: ({children}) => <ul className="list-disc list-outside ml-6 mb-3 space-y-1 dark:text-white/90">{children}</ul>,
              ol: ({children}) => <ol className="list-decimal list-outside ml-6 mb-3 space-y-1 dark:text-white/90">{children}</ol>,
              li: ({children}) => <li className="dark:text-white/90">{children}</li>,
              strong: ({children}) => <strong className="font-semibold dark:text-white">{children}</strong>,
              code: ({children}) => <code className="bg-neutral-300 dark:bg-blue-900/30 dark:text-blue-300 px-1 py-0.5 rounded text-sm font-mono">{children}</code>,
              pre: ({children}) => <pre className="bg-neutral-400 dark:bg-black/40 border border-white/10 rounded p-3 mb-3 overflow-x-auto">{children}</pre>,
              blockquote: ({children}) => <blockquote className="border-l-4 border-white/30 pl-4 italic dark:text-white/80 mb-3">{children}</blockquote>,
              a: ({children, href}) => <a href={href} className="text-blue-400 underline hover:text-blue-300">{children}</a>,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  )
}

export default Notes
