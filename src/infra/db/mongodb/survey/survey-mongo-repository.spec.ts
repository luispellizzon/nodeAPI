import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'

type SutTypes = {
    sut: SurveyMongoRepository
}
const makeSut = (): SutTypes => {
  const sut = new SurveyMongoRepository()
  return {
    sut
  }
}

const makeSurveyData = (prefix: string) => (
  {
    question: `${prefix}_question`,
    answers: [{
      icon: `${prefix}_icon`,
      answer: `${prefix}_answer`
    },
    {
      answer: `${prefix}_answer`
    }],
    date: new Date()
  }
)

let collection: Collection
describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    collection = await MongoHelper.getCollection('surveys')
    await collection.deleteMany({})
  })

  describe('add()', () => {
    test('Should add a survey on success', async () => {
      const { sut } = makeSut()
      const data = makeSurveyData('any')
      await sut.add(data)
      const surveyCollection = await collection.findOne({ question: 'any_question' })
      expect(surveyCollection).toBeTruthy()
    })
  })

  describe('loadAll()', () => {
    test('Should load all surveys on success', async () => {
      await collection.insertMany([makeSurveyData('any'), makeSurveyData('other')])
      const { sut } = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(2)
      expect(surveys[0].question).toBe('any_question')
      expect(surveys[1].question).toBe('other_question')
    })
  })
})
