import { useState } from "react"
import { IcebreakersForm } from "@/components/icebreakers-form"
import { IcebreakersResults } from "@/components/icebreakers-results"

export default function Home() {
  const [icebreakers, setIcebreakers] = useState<string[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerate = async (formData: {
    senderProfileUrl: string
    problemSolved: string
    solutionOffered: string
    recipientProfileUrl: string
  }) => {
    setIsLoading(true)
    try {
      // Simulate API call - replace with your actual backend endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock response - replace with actual API response
      const mockIcebreakers = [
        `Hi! I noticed you're working on ${formData.problemSolved.substring(0, 30)}... I help with exactly that through ${formData.solutionOffered.substring(0, 30)}. Would love to connect!`,
        `I came across your profile and saw you might be interested in solutions for ${formData.problemSolved.substring(0, 30)}. I specialize in ${formData.solutionOffered.substring(0, 30)}. Let's chat?`,
        `Your experience caught my attention! I think you'd benefit from knowing more about how I help with ${formData.solutionOffered.substring(0, 30)}. Open to a quick chat?`,
      ]

      setIcebreakers(mockIcebreakers)
    } catch (error) {
      console.error("Error generating icebreakers:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setIcebreakers(null)
  }

  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-pretty">LinkedIn Icebreakers</h1>
          <p className="text-lg text-muted-foreground">
            Generate personalized opening messages to break the ice with new connections
          </p>
        </div>

        {/* Form Section */}
        <div className="mb-8">
          <IcebreakersForm
            onSubmit={handleGenerate}
            isLoading={isLoading}
            hasResults={icebreakers !== null}
            onReset={handleReset}
          />
        </div>

        {/* Results Section */}
        {icebreakers !== null && <IcebreakersResults icebreakers={icebreakers} />}
      </div>
    </main>
  )
}
