import { AddSurveyModel, AddSurveyRepository } from '../../../../data/use-cases/add-survey/add-survey-protocols'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository {
  async add (accountData: AddSurveyModel): Promise<void> {
    (await MongoHelper.getCollection('surveys')).insertOne(accountData)
  }
}
