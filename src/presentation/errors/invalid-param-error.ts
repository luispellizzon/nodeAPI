export class InvalidParamError extends Error {
  constructor (missingParam: string) {
    super(`Invalid param: ${missingParam}`)
    this.name = 'InvalidParamError'
  }
}
