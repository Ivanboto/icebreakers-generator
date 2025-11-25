import { useState } from "react"
import { IcebreakersForm } from "@/components/icebreakers-form"
import { IcebreakersResults } from "@/components/icebreakers-results"
import { generateIcebreakers } from "@/services/icebreaker.service"

export default function Home() {
  const [icebreakers, setIcebreakers] = useState<string[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async (formData: {
    senderProfileUrl: string
    problemSolved: string
    solutionOffered: string
    recipientProfileUrl: string
  }) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await generateIcebreakers({
        senderUrl: formData.senderProfileUrl,
        problemDescription: formData.problemSolved,
        solutionDescription: formData.solutionOffered,
        recipientUrl: formData.recipientProfileUrl,
      })

      setIcebreakers(response.icebreakers)
    } catch (error) {
      console.error("Error generating icebreakers:", error)
      setError("Failed to generate icebreakers. Please try again.")
      setIcebreakers(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setIcebreakers(null)
    setError(null)
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

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive text-center">{error}</p>
          </div>
        )}

        {/* Results Section */}
        {icebreakers !== null && <IcebreakersResults icebreakers={icebreakers} />}
      </div>
    </main>
  )
}
