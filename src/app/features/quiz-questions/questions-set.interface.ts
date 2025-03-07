export interface QuestionSet {
    id: string
    quiz: string
    isActive: boolean
    questionType: number
    pointMultiplier: number
    Question: string
    answerPossibilities: Record<string, string>
}
