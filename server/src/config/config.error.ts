export class MagicNetError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string = ''
  ) {
    super(message)
    this.name = 'MagicNetError'
  }
}

export const TOKEN_EXPIRED = new MagicNetError(
  401,
  'Invalid or missing token!'
)

export const EMAIL_NOT_VERIFIED = new MagicNetError(
  401,
  'Email isn\'t verified!'
)

export const INVALID_CREDENTIALS = new MagicNetError(
  401,
  'Email or password is incorrect!'
)

export const SECRET_CODE_NOT_VERIFIED = new MagicNetError(
  404,
  'Secret code isn`t verify!'
)

export const EMAIL_ALREADY_EXISTS = new MagicNetError(
  409,
  'This email address is already registered!'
)

export const INNER_SERVICE_ERROR = new MagicNetError(
  500,
  'Server problems, try again later!'
)

export const REDIS_ERROR = new MagicNetError(
  503,
  'Redis service unavailable!'
)

export const DATABASE_ERROR = new MagicNetError(
  504,
  'Database operation failed!'
)
