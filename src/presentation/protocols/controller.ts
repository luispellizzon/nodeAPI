import { HttpsRequest, HttpResponse } from './http'

export interface Controller {
    handle(httpsRequest: HttpsRequest): Promise<HttpResponse>
}
