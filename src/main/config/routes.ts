import { Express, Router } from 'express'
import { readdirSync } from 'fs'
import path from 'path'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  // fb.sync('**/src/main/routes/**route.ts').map(async (file) => {
  //   (await import(`../../../${file}`)).default(router)
  // })

  readdirSync(path.join(__dirname, '../routes')).map(async (file) => {
    if (!file.includes('.test.')) {
      (await import(`../routes/${file}`)).default(router)
    }
  })
}
