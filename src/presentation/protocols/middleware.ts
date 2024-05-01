import { HttpResponse, HttpsRequest } from './http'

export interface Middleware {
    handle(httpRequest: HttpsRequest): Promise<HttpResponse>
}
