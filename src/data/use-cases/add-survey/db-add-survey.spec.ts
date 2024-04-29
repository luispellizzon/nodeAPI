import { DbAddSurvey } from './db-add-survey'
import { AddSurveyRepository, AddSurveyModel } from './add-survey-protocols'

type SutTypes = {
    sut: DbAddSurvey,
    addSurveyRepositoryStub: AddSurveyRepository
}

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = makeAddSurveyRepoStub()
  const sut = new DbAddSurvey(addSurveyRepositoryStub)
  return {
    sut,
    addSurveyRepositoryStub
  }
}

const makeAddSurveyRepoStub = () => {
  class AddAccountRepositoryStub implements AddSurveyRepository {
    add (accountData: AddSurveyModel): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new AddAccountRepositoryStub()
}

const makeSurveyData = () => ({
  question: 'any_question',
  answers: [{
    icon: 'any_icon',
    answer: 'any_answer'
  }]
})

describe('DB Add Survey use-case', () => {
  test('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const surveyData = makeSurveyData()
    const addRepoSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    await sut.add(surveyData)
    expect(addRepoSpy).toHaveBeenCalledWith(surveyData)
  })
})
