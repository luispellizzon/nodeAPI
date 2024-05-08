import components from './components'
import paths from './paths'
import schemas from './schemas'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Survey API',
    description: 'Clean Node API (Typescript)',
    version: '1.0.0'
  },
  license: {
    name: '',
    url: ''
  },
  servers: [{
    url: '/api'
  }],
  tags: [
    {
      name: 'Login'
    },
    {
      name: 'Surveys'
    }],
  paths,
  schemas,
  components
}
