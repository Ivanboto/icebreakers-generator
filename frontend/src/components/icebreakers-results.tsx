import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { useState } from "react"

interface IcebreakersResultsProps {
  icebreakers: string[]
}

export function IcebreakersResults({ icebreakers }: IcebreakersResultsProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Generated Icebreakers</h2>
        <p className="text-sm text-muted-foreground">Here are 3 personalized messages ready to use</p>
      </div>

      <div className="grid gap-4">
        {icebreakers.map((icebreaker, index) => (
          <Card key={index} className="p-6 bg-card border border-border hover:shadow-md transition-shadow duration-300">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                    {index + 1}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    Message {index + 1}
                  </span>
                </div>
                <p className="text-foreground leading-relaxed">{icebreaker}</p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(icebreaker, index)}
                className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
              >
                {copiedIndex === index ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <p className="text-xs text-muted-foreground text-center pt-4">
        Click the copy icon to save any message to your clipboard
      </p>
    </div>
  )
}
