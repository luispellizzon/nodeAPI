import { LoadSurveysRepository, LoadSurveyByIdRepository, AddSurveyModel, AddSurveyRepository, SurveyModel } from './survey-mongo-repository-protocols'
import { MongoHelper } from '../helpers/mongo-helper'
import { ObjectId } from 'mongodb'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository {
  async add (accountData: AddSurveyModel): Promise<void> {
    (await MongoHelper.getCollection('surveys')).insertOne(accountData)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const collection = await MongoHelper.getCollection('surveys')
    const surveys = await collection.find().toArray()
    const mappedSurveys = surveys.map(survey => MongoHelper.map<SurveyModel>(survey))
    return mappedSurveys
  }

  async loadById (surveyId: string): Promise<SurveyModel> {
    const collection = await MongoHelper.getCollection('surveys')
    const survey = await collection.findOne({ _id: new ObjectId(surveyId) })
    return survey ? MongoHelper.map<SurveyModel>(survey) : null
  }
}
