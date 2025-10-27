"use client"

import type React from "react"

interface MarkdownRendererProps {
  content: string
  isStreaming?: boolean
}

export function MarkdownRenderer({ content, isStreaming = false }: MarkdownRendererProps) {
  const parseMarkdown = (text: string) => {
    const processedLines: React.ReactNode[] = []
    const lines = text.split("\n")

    let i = 0
    while (i < lines.length) {
      const line = lines[i]

      // Skip empty lines but add spacing
      if (!line.trim()) {
        processedLines.push(<div key={`spacer-${i}`} className="h-2" />)
        i++
        continue
      }

      const headerMatch = line.match(/^(#{1,3})\s+(.*)$/)
      if (headerMatch) {
        const level = headerMatch[1].length
        const headerText = headerMatch[2]

        let className = ""
        if (level === 1) {
          className = "text-2xl font-bold mt-6 mb-4 text-white leading-tight"
        } else if (level === 2) {
          className = "text-xl font-bold mt-5 mb-3 text-white leading-tight"
        } else {
          className = "text-lg font-semibold mt-4 mb-2 text-slate-100 leading-tight"
        }

        processedLines.push(
          <div key={`header-${i}`} className={className}>
            {renderInlineMarkdown(headerText)}
          </div>,
        )
        i++
        continue
      }

      const bulletMatch = line.match(/^[*-]\s+(.*)$/)
      if (bulletMatch) {
        processedLines.push(
          <div key={`bullet-${i}`} className="flex gap-3 ml-6 my-2 text-slate-100">
            <span className="text-pink-400 flex-shrink-0 font-semibold text-lg">•</span>
            <span className="leading-relaxed">{renderInlineMarkdown(bulletMatch[1])}</span>
          </div>,
        )
        i++
        continue
      }

      const numberMatch = line.match(/^\d+\.\s+(.*)$/)
      if (numberMatch) {
        const number = line.match(/^(\d+)\./)?.[1]
        processedLines.push(
          <div key={`number-${i}`} className="flex gap-3 ml-6 my-2 text-slate-100">
            <span className="text-indigo-400 flex-shrink-0 font-bold min-w-fit">{number}.</span>
            <span className="leading-relaxed">{renderInlineMarkdown(numberMatch[1])}</span>
          </div>,
        )
        i++
        continue
      }

      processedLines.push(
        <p key={`para-${i}`} className="my-3 text-slate-100 leading-relaxed text-base">
          {renderInlineMarkdown(line)}
        </p>,
      )
      i++
    }

    return processedLines
  }

  const renderInlineMarkdown = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = []
    let lastIndex = 0

    // Bold matches
    const boldMatches: Array<{ start: number; end: number; text: string }> = []
    const boldRegex = /\*\*(.*?)\*\*/g
    let boldMatch: RegExpExecArray | null
    while ((boldMatch = boldRegex.exec(text)) !== null) {
      boldMatches.push({ start: boldMatch.index, end: boldMatch.index + boldMatch[0].length, text: boldMatch[1] })
    }

    // Italic matches - check they don't overlap with bold
    const italicMatches: Array<{ start: number; end: number; text: string }> = []
    const italicRegex = /\*(.*?)\*/g
    let italicMatch: RegExpExecArray | null
    while ((italicMatch = italicRegex.exec(text)) !== null) {
      const isOverlappingWithBold = boldMatches.some((b) => b.start <= italicMatch!.index && italicMatch!.index < b.end)
      if (!isOverlappingWithBold) {
        italicMatches.push({
          start: italicMatch.index,
          end: italicMatch.index + italicMatch[0].length,
          text: italicMatch[1],
        })
      }
    }

    // Code matches
    const codeMatches: Array<{ start: number; end: number; text: string }> = []
    const codeRegex = /`(.*?)`/g
    let codeMatch: RegExpExecArray | null
    while ((codeMatch = codeRegex.exec(text)) !== null) {
      codeMatches.push({ start: codeMatch.index, end: codeMatch.index + codeMatch[0].length, text: codeMatch[1] })
    }

    const allMatches = [...boldMatches, ...italicMatches, ...codeMatches].sort((a, b) => a.start - b.start)

    lastIndex = 0
    allMatches.forEach((m, idx) => {
      if (lastIndex < m.start) {
        parts.push(text.substring(lastIndex, m.start))
      }

      if (boldMatches.includes(m)) {
        parts.push(
          <strong key={`bold-${idx}`} className="font-bold text-white">
            {m.text}
          </strong>,
        )
      } else if (italicMatches.includes(m)) {
        parts.push(
          <em key={`italic-${idx}`} className="italic text-slate-200">
            {m.text}
          </em>,
        )
      } else if (codeMatches.includes(m)) {
        parts.push(
          <code
            key={`code-${idx}`}
            className="bg-slate-800/70 px-2 py-1 rounded text-sm font-mono text-pink-300 border border-slate-700/50"
          >
            {m.text}
          </code>,
        )
      }

      lastIndex = m.end
    })

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex))
    }

    return parts.length > 0 ? parts : text
  }

  return (
    <div className="text-base leading-relaxed space-y-1 text-slate-100 max-w-3xl">
      {parseMarkdown(content)}
      {isStreaming && (
        <span className="inline-block w-2 h-5 ml-1 bg-gradient-to-r from-pink-400 to-indigo-400 rounded-sm animate-pulse"></span>
      )}
    </div>
  )
}
