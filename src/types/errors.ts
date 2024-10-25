export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number = 500
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class AuthError extends AppError {
  constructor(message: string = "認証エラーが発生しました") {
    super(message, "AUTH_ERROR", 401);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = "入力値が不正です") {
    super(message, "VALIDATION_ERROR", 400);
  }
}
