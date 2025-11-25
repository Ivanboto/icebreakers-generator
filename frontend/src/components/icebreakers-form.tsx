import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, RotateCcw } from "lucide-react"

interface IcebreakersFormProps {
  onSubmit: (data: {
    senderProfileUrl: string
    problemSolved: string
    solutionOffered: string
    recipientProfileUrl: string
  }) => Promise<void>
  isLoading: boolean
  hasResults: boolean
  onReset: () => void
}

export function IcebreakersForm({ onSubmit, isLoading, hasResults, onReset }: IcebreakersFormProps) {
  const [formData, setFormData] = useState({
    senderProfileUrl: "",
    problemSolved: "",
    solutionOffered: "",
    recipientProfileUrl: "",
  })

  const [errors, setErrors] = useState<Record<string, boolean>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: false }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, boolean> = {}

    if (!formData.senderProfileUrl.trim()) newErrors.senderProfileUrl = true
    if (!formData.problemSolved.trim()) newErrors.problemSolved = true
    if (!formData.solutionOffered.trim()) newErrors.solutionOffered = true
    if (!formData.recipientProfileUrl.trim()) newErrors.recipientProfileUrl = true

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    await onSubmit(formData)
  }

  return (
    <Card className="p-8 bg-card border border-border shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sender Profile URL */}
        <div className="space-y-2">
          <Label htmlFor="senderProfileUrl" className="text-sm font-medium">
            Your LinkedIn Profile URL
          </Label>
          <Input
            id="senderProfileUrl"
            name="senderProfileUrl"
            type="url"
            placeholder="https://linkedin.com/in/your-profile"
            value={formData.senderProfileUrl}
            onChange={handleChange}
            disabled={isLoading}
            className={`transition-colors ${errors.senderProfileUrl ? "border-destructive" : "border-border"}`}
          />
          {errors.senderProfileUrl && <p className="text-xs text-destructive">This field is required</p>}
        </div>

        {/* Problem You Solve */}
        <div className="space-y-2">
          <Label htmlFor="problemSolved" className="text-sm font-medium">
            Problem You Solve
          </Label>
          <Textarea
            id="problemSolved"
            name="problemSolved"
            placeholder="e.g., Help B2B SaaS companies reduce churn and increase retention"
            value={formData.problemSolved}
            onChange={handleChange}
            disabled={isLoading}
            rows={3}
            className={`resize-none transition-colors ${errors.problemSolved ? "border-destructive" : "border-border"}`}
          />
          {errors.problemSolved && <p className="text-xs text-destructive">This field is required</p>}
        </div>

        {/* Solution You Offer */}
        <div className="space-y-2">
          <Label htmlFor="solutionOffered" className="text-sm font-medium">
            Solution You Offer
          </Label>
          <Textarea
            id="solutionOffered"
            name="solutionOffered"
            placeholder="e.g., AI-powered customer analytics platform with predictive insights"
            value={formData.solutionOffered}
            onChange={handleChange}
            disabled={isLoading}
            rows={3}
            className={`resize-none transition-colors ${
              errors.solutionOffered ? "border-destructive" : "border-border"
            }`}
          />
          {errors.solutionOffered && <p className="text-xs text-destructive">This field is required</p>}
        </div>

        {/* Recipient Profile URL */}
        <div className="space-y-2">
          <Label htmlFor="recipientProfileUrl" className="text-sm font-medium">
            Recipient's LinkedIn Profile URL
          </Label>
          <Input
            id="recipientProfileUrl"
            name="recipientProfileUrl"
            type="url"
            placeholder="https://linkedin.com/in/recipient-profile"
            value={formData.recipientProfileUrl}
            onChange={handleChange}
            disabled={isLoading}
            className={`transition-colors ${errors.recipientProfileUrl ? "border-destructive" : "border-border"}`}
          />
          {errors.recipientProfileUrl && <p className="text-xs text-destructive">This field is required</p>}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isLoading ? "Generating..." : "Generate Messages"}
          </Button>

          {hasResults && (
            <Button
              type="button"
              variant="outline"
              onClick={onReset}
              disabled={isLoading}
              className="px-4 bg-transparent"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          )}
        </div>
      </form>
    </Card>
  )
}
