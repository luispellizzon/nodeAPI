export class AlreadyExistsError extends Error {
  constructor (paramInUse: string) {
    super(`The ${paramInUse} provided already exists`)
    this.name = `${paramInUse}-already-exists`
  }
}
