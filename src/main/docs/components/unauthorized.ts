export const unauthorizedError = {
  description: 'Invalid Credentials',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}
