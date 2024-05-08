export const signUpPath = {
  post: {
    tags: ['Login'],
    summary: 'API to signup users',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/signUpParams'
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Account created',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/account'
            }
          }
        }
      },
      400: {
        $ref: '#/components/badRequest'
      },
      403: {
        $ref: '#/components/forbiddenError'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  }
}