export interface QuestionSet {
    id: string
    quiz: string
    isActive: boolean
    questionType: number
    pointMultiplier: number
    question: string
    answerPossibilities: Record<string, string>
}
