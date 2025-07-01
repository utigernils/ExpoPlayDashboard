export type AnswerPossibility =
    | { AnswerOptions: { Text: string; isCorrect: boolean; points: number }[] }
    | { Answer: boolean }
    | { GradingRange: { top: number; bottom: number; points: number }[] }
    | {
          AnswerOptions: {
              img_url: string
              isCorrect: boolean
              points: number
          }[]
      }

export interface QuestionSet {
    id: string
    quiz: string
    isActive: boolean
    questionType: number
    pointMultiplier: number
    question: string
    answerPossibilities: any
}
