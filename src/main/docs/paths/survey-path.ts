export const surveyPath = {
  get: {
    security: [
      {
        apiKeyAuth: []
      }
    ],
    tags: ['Surveys'],
    summary: 'API to list all surveys',
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveys'
            }
          }
        }
      },
      204: {
        description: 'No Content'
      },
      403: {
        $ref: '#/components/forbiddenError'
      },
      404: {
        $ref: '#/components/notFound'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  }
}
