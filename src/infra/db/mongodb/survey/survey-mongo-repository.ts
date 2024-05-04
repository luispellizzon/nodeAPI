import { LoadSurveysRepository } from '../../../../data/protocols/db/survey/load-survey-repository'
import { AddSurveyModel, AddSurveyRepository } from '../../../../data/use-cases/add-survey/add-survey-protocols'
import { SurveyModel } from '../../../../domain/models/survey-model'
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
