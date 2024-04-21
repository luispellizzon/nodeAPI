import { HttpsRequest, HttpResponse } from './http'

export interface Controller {
    handle(HttpsRequest: HttpsRequest): Promise<HttpResponse>
}
