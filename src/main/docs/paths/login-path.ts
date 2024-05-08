export const loginPath = {
  post: {
    tags: ['Login'],
    summary: 'API for user authentication',
    requestBody: {
      description: 'Request must contain valid email and valid password!',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/loginParams'
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Authentication success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/account'
            }
          }
        }
      },
      401: {
        description: 'Unauthorized',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/unauthorizedError'
            }
          }
        }
      }
    }
  }
}
