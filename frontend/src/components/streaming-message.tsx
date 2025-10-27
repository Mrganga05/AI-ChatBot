"use client"

import { useEffect, useState } from "react"
import { MarkdownRenderer } from "./markdown-renderer"

interface StreamingMessageProps {
  text: string
  isComplete: boolean
}

export function StreamingMessage({ text, isComplete }: StreamingMessageProps) {
  const [displayedText, setDisplayedText] = useState("")

  useEffect(() => {
    if (!text) return

    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.substring(0, currentIndex + 1))
        currentIndex++
      } else {
        clearInterval(interval)
      }
    }, 15)

    return () => clearInterval(interval)
  }, [text])

  return <MarkdownRenderer content={displayedText} isStreaming={!isComplete && displayedText.length < text.length} />
}
