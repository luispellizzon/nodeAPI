import { LoadSurveysRepository, AddSurveyModel, AddSurveyRepository, SurveyModel } from './survey-mongo-repository-protocols'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository {
  async add (accountData: AddSurveyModel): Promise<void> {
    (await MongoHelper.getCollection('surveys')).insertOne(accountData)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const collection = await MongoHelper.getCollection('surveys')
    const surveys = await collection.find().toArray()
    const mappedSurveys = surveys.map(survey => MongoHelper.map<SurveyModel>(survey))
    return mappedSurveys
  }
}
