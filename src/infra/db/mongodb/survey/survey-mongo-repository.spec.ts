import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'
import MockDate from 'mockdate'

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
    MockDate.set(new Date())
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    MockDate.reset()
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

    test('Should return empty list of surveys', async () => {
      const { sut } = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(0)
    })
  })

  describe('loadById()', () => {
    test('Should return null if id is not found', async () => {
      await collection.insertOne(makeSurveyData('any'))
      const { sut } = makeSut()
      const survey = await sut.loadById('609251905bf72b2e245f71ae')
      expect(survey).toBeNull()
    })

    test('Should return survey if id exists', async () => {
      const { insertedId } = await collection.insertOne(makeSurveyData('any'))
      const { sut } = makeSut()
      const survey = await sut.loadById(insertedId.toString())
      expect(survey.id).toBe(insertedId.toString())
      expect(survey.question).toBe('any_question')
      expect(survey.answers.length).toBe(2)
      expect(survey.date).toEqual(new Date())
    })
  })
})
