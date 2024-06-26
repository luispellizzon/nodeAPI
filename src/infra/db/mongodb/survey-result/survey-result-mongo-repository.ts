import { SaveSurveyResultParams, SaveSurveyResultRepository, SurveyResultModel } from '@/data/use-cases/survey-result/save-survey-result/db-save-survey-result-protocols'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const collection = await MongoHelper.getCollection('surveys-results')
    const doc = await collection.findOneAndUpdate({
      surveyId: data.surveyId,
      accountId: data.accountId
    }, {
      $set: {
        answer: data.answer,
        date: data.date
      }
    }, {
      upsert: true,
      returnDocument: 'after'
    })
    const mappedDoc = MongoHelper.map<SurveyResultModel>(doc)
    return mappedDoc
  }
}
