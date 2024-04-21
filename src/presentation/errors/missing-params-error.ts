export class MissingParamError extends Error {
  constructor (missingParam: string) {
    super(`Missing param: ${missingParam}`)
    this.name = 'MissingParamError'
  }
}
