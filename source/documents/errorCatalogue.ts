interface ErrorDetail {
  code: string;
  statusCode: number;
  message: string;
}

export const errorCatalogue: ErrorDetail[] = [
    { code: 'bad_request', statusCode: 400, message: 'Bad Request' },
    { code: 'not_implemented', statusCode: 501, message: 'Not Implemented' },
    { code: 'service_error', statusCode: 401, message: 'The external service could not be reached' },
];
