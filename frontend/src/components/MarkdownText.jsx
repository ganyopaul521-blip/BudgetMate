function parseInlineBold(text, keyPrefix) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={`${keyPrefix}-${i}`} className="font-semibold">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={`${keyPrefix}-${i}`}>{part}</span>
    )
  )
}

/** Lightweight renderer for the small markdown subset the AI assistant tends to use:
 * **bold**, "- "/"* " bullets, "1. " numbered items, and simple indentation. */
export default function MarkdownText({ text }) {
  const lines = text.split('\n')

  return (
    <div className="space-y-1">
      {lines.map((line, idx) => {
        if (line.trim() === '') return null

        const indentLevel = Math.floor((line.match(/^(\s*)/)?.[1].length || 0) / 2)
        const ordered = line.match(/^\s*(\d+)\.\s+(.*)/)
        const bullet = line.match(/^\s*[*-]\s+(.*)/)

        if (ordered) {
          return (
            <div key={idx} className="flex gap-1.5" style={{ marginLeft: indentLevel * 12 }}>
              <span className="shrink-0 font-medium">{ordered[1]}.</span>
              <span>{parseInlineBold(ordered[2], `o${idx}`)}</span>
            </div>
          )
        }

        if (bullet) {
          return (
            <div key={idx} className="flex gap-1.5" style={{ marginLeft: indentLevel * 12 + 8 }}>
              <span className="shrink-0" aria-hidden="true">
                &bull;
              </span>
              <span>{parseInlineBold(bullet[1], `b${idx}`)}</span>
            </div>
          )
        }

        return <p key={idx}>{parseInlineBold(line, `p${idx}`)}</p>
      })}
    </div>
  )
}
