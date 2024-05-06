import { Collection } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import MockDate from 'mockdate'
import { SaveSurveyResultModel } from '@/domain/use-cases/save-survey-result'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { SurveyModel } from '../survey-mongo-repository-protocols'
import { AccountModel, AddAccountModel } from '../../account/account-mongo-repository-protocols'

type SutTypes = {
    sut: SurveyResultMongoRepository
}
const makeSut = (): SutTypes => {
  const sut = new SurveyResultMongoRepository()
  return {
    sut
  }
}

const makeSurvey = async (): Promise<SurveyModel> => {
  const surveyData = {
    question: 'any_question',
    answers: [{
      icon: 'any_icon',
      answer: 'any_answer'
    },
    {
      icon: 'any_icon2',
      answer: 'any_answer2'
    }],
    date: new Date()
  }
  const survey = await surveyCollection.insertOne(surveyData)

  return { id: survey.insertedId.toString(), ...surveyData }
}

const makeAccount = async (): Promise<AccountModel> => {
  const accountData:AddAccountModel = {
    name: 'any_name',
    email: 'any_email@hotmail.com',
    password: 'any_password'
  }
  const account = await accountCollection.insertOne(accountData)

  return { id: account.insertedId.toString(), ...accountData }
}

const makeSaveSurveyResultData = ():SaveSurveyResultModel => ({
  surveyId: 'survey_id',
  accountId: 'account_id',
  answer: 'any_answer',
  date: new Date()
})

const makeSurveyResultData = (): SurveyResultModel => (Object.assign({}, makeSaveSurveyResultData(), { id: 'any_id' }))

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection
describe('Save Survey Mongo Repository', () => {
  beforeAll(async () => {
    MockDate.set(new Date())
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    MockDate.reset()
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    surveyResultCollection = await MongoHelper.getCollection('surveys-results')
    accountCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    await surveyResultCollection.deleteMany({})
    await accountCollection.deleteMany({})
  })

  describe('save()', () => {
    test('Should add a survey result if it is new', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()
      await surveyCollection.insertOne(makeSaveSurveyResultData())
      const { sut } = makeSut()
      const surveyResult = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })
      console.log(surveyResult)
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toBeTruthy()
      expect(surveyResult.answer).toBe(survey.answers[0].answer)
    })
  })
})
