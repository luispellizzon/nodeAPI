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

const makeSurveyData = () => (
  {
    question: 'any_question',
    answers: [{
      icon: 'any_image',
      answer: 'any_answer'
    },
    {
      answer: 'any_answer2'
    }]
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

  test('Should add a survey on success', async () => {
    const { sut } = makeSut()
    const data = makeSurveyData()
    await sut.add(data)
    const surveyCollection = await collection.findOne({ question: 'any_question' })
    expect(surveyCollection).toBeTruthy()
  })
})
