import { Store } from '../core/heropy'

interface State {
  name: string
  email: string
  github: string
  repository: string
}

export default new Store<State>({
  name: 'HARRY / KimGyuSang',
  email: 'tl9434@naver.com',
  github: 'https://github.com/HarryKim24',
  repository: 'https://github.com/HarryKim24/remove-movie-app.git'
})