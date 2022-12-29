export const QuizStatuses = [
    {
        key: 0,
        value: "Skica"
    },
    {
        key: 1,
        value: "Objavljeno"
    }
]

export function QuizStatusNameByKey(key: number): string | undefined
{
    return QuizStatuses.find((s) => s.key === key)?.value
}
