import { MissingParamError } from '../errors/missing-params-error'
import { HttpResponse, HttpsRequest } from '../protocols/http'

export class SignUpController {
  handle (httpRequest: HttpsRequest): HttpResponse {
    if (!httpRequest.body.name) {
      return {
        body: new MissingParamError('Missing param: name'),
        statusCode: 400
      }
    }

    if (!httpRequest.body.email) {
      return {
        body: new MissingParamError('Missing param: email'),
        statusCode: 400
      }
    }
  }
}
