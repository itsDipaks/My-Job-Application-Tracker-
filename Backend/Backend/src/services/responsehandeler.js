export class responsehandler {
  constructor() {
  };
  successResponse = (res, message, data, statusCode = 200) => {
    return res.status(statusCode).json({
      s: 1,
      m: message,
      data: data,
    })
  };
    errorResponse = (res, message, errorCode = null, statusCode = 400, data = null) => {
    return res.status(statusCode).json({
      s: 0,
      m: message,
      errorCode: errorCode,
      data: data,
    })
  };
    validationError = (res, message) => {
    return res.status(400).json({
      s: 0,
      m: message,
      errorCode: "VALIDATION_ERROR",
      data: null,
    })
  };
    notFoundError = (res, message) => {
    return res.status(404).json({
      s: 0,
      m: message,
      errorCode: "NOT_FOUND",
      data: null,
    })
  };
   unauthorizedError = (res, message) => {
    return res.status(401).json({
      s: 0,
      m: message,
      errorCode: "UNAUTHORIZED",
      data: null,
    })
  };
  conflictError = (res, message) => {
    return res.status(409).json({
      s: 0,
      m: message,
      errorCode: "CONFLICT",
      data: null,
    })
  };
    serverError = (res, message = "Something went wrong. Please try again later.") => {
    return res.status(500).json({
      s: 0,
      m: message,
      errorCode: "SERVER_ERROR",
      data: null,
    })
  }
};