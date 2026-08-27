"use client"

import { CheckIcon, CopyIcon } from "@phosphor-icons/react"
import { useEffect, useState } from "react"
import { codeToHtml } from "shiki"

import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { surfaceDepth } from "@/lib/surface-depth"
import { cn } from "@/lib/utils"

const codeContentClassName = cn(
  "p-4 text-sm leading-relaxed",
  "[&_.shiki]:bg-transparent",
  "[&_pre]:m-0 [&_pre]:w-max [&_pre]:bg-transparent [&_pre]:p-0",
  "[&_code]:block [&_code]:w-max [&_code]:font-mono [&_code]:text-[13px] [&_code]:leading-6"
)

export type CodeProps = {
  code: string
  language?: "tsx" | "typescript" | "bash" | "json" | "markdown"
  filename?: string
  filepath?: string
  className?: string
  expandable?: boolean
}

export function Code({
  code,
  language = "tsx",
  filename,
  filepath,
  className,
  expandable = false,
}: CodeProps) {
  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function highlight() {
      const isDark = document.documentElement.classList.contains("dark")
      const html = await codeToHtml(code, {
        lang: language,
        theme: isDark ? "github-dark" : "github-light",
        transformers: [
          {
            pre(node) {
              delete node.properties.style
              node.properties.class = "shiki-pre"
            },
          },
        ],
      })

      if (!cancelled) {
        setHighlightedHtml(html)
      }
    }

    highlight()

    const observer = new MutationObserver(highlight)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [code, language])

  async function handleCopy() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  const label = filename ?? filepath

  const codeBody = highlightedHtml ? (
    <div
      className={codeContentClassName}
      dangerouslySetInnerHTML={{ __html: highlightedHtml }}
    />
  ) : (
    <pre className="p-4 font-mono text-[13px] leading-6 text-foreground">
      <code className="block w-max">{code}</code>
    </pre>
  )

  return (
    <div
      data-slot="code"
      className={cn(
        "min-w-0 w-full max-w-full overflow-hidden rounded-squircle-lg border bg-muted/40",
        surfaceDepth("lg"),
        className
      )}
    >
      {label ? (
        <div className="flex items-center justify-between gap-3 border-b border-border/60 bg-muted/40 px-4 py-2.5">
          <div className="min-w-0">
            {filename ? (
              <p className="truncate font-mono text-xs font-medium text-foreground">
                {filename}
              </p>
            ) : null}
            {filepath ? (
              <p className="truncate font-mono text-[11px] text-muted-foreground">
                {filepath}
              </p>
            ) : null}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={handleCopy}
            className="shrink-0 text-muted-foreground hover:text-foreground"
          >
            {copied ? (
              <>
                <CheckIcon weight="bold" />
                Copied
              </>
            ) : (
              <>
                <CopyIcon weight="bold" />
                Copy
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="flex justify-end border-b border-border/60 bg-muted/40 px-3 py-2">
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={handleCopy}
            className="text-muted-foreground hover:text-foreground"
          >
            {copied ? (
              <>
                <CheckIcon weight="bold" />
                Copied
              </>
            ) : (
              <>
                <CopyIcon weight="bold" />
                Copy
              </>
            )}
          </Button>
        </div>
      )}

      <ScrollArea
        viewportClassName={cn(
          "overflow-x-auto",
          !expandable && "max-h-[min(28rem,60vh)]"
        )}
      >
        {codeBody}
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
