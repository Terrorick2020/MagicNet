export interface IMagicNetError extends Error {
    statusCode: number
    message: string
    stack: string
}

export interface IErrorResponse {
    message: string
    stack?: string
}