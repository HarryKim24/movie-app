// Component
interface ComponentPayload {
  tagName?: string
  props?: {
    [key: string]: unknown
  }
  state?: {
    [key: string]: unknown
  }
}

export class Component {
  public el
  public props
  public state
  constructor(payload: ComponentPayload = {}) {
    const {
      tagName = 'div',
      props = {},
      state = {}
    } = payload
    this.el = document.createElement(tagName)
    this.props = props
    this.state = state
    this.render()
  }
  render() { // 컴포넌트를 렌더링하는 함수
    // ...
  }
}


// Router
interface Route {
  path: string
  component: typeof Component
}
type Routes = Route[]

function routeRender(routes: Routes) {
  if (!location.hash) {
    history.replaceState(null, '', '/#/') // (상태, 제목, 주소)
  }
  const routerView = document.querySelector('router-view')
  const [hash, queryString = ''] = location.hash.split('?')

  // 1) 쿼리스트링을 객체로 변환해 히스토리의 상태에 저장!
  interface Query {
    [key: string]: string
  }
  const query = queryString
    .split('&')
    .reduce((acc, cur) => {
      const [key, value] = cur.split('=')
      acc[key] = value
      return acc
    }, {} as Query)
  history.replaceState(query, '') // (상태, 제목)

  // 2) 현재 라우트 정보를 찾아서 렌더링!
  const currentRoute = routes
    .find(route => new RegExp(`${route.path}/?$`).test(hash))
  if (routerView) {
    routerView.innerHTML = ''
    currentRoute && routerView.append(new currentRoute.component().el)
  }
  // 3) 화면 출력 후 스크롤 위치 복구!
  window.scrollTo(0, 0)
}
export function createRouter(routes: Routes) {
  // 원하는(필요한) 곳에서 호출할 수 있도록 함수 데이터를 반환!
  return function () {
    window.addEventListener('popstate', () => {
      routeRender(routes)
    })
    routeRender(routes)
  }
}


// Store
interface StoreObservers {
  [key: string]: SubscribeCallback[]
}
interface SubscribeCallback {
  (arg: unknown): void
}
export class Store<S> {
  public state = {} as S // 상태(데이터)
  private observers = {} as StoreObservers
  constructor(state: S) {
    for (const key in state) {
      // 각 상태에 대한 변경 감시(Setter) 설정!
      Object.defineProperty(this.state, key, {
        // Getter
        get: () => state[key],
        // Setter
        set: val => {
          state[key] = val
          if (Array.isArray(this.observers[key])) { // 호출할 콜백이 있는 경우!
            this.observers[key].forEach(observer => observer(val))
          }
        }
      })
    }
  }
  // 상태 변경 구독!
  subscribe(key: string, cb: SubscribeCallback) {
    Array.isArray(this.observers[key]) // 이미 등록된 콜백이 있는지 확인!
      ? this.observers[key].push(cb) // 있으면 새로운 콜백 밀어넣기!
      : this.observers[key] = [cb] // 없으면 콜백 배열로 할당!

    // 예시)
    // observers = {
    //   구독할상태이름: [실행할콜백1, 실행할콜백2]
    //   movies: [cb, cb, cb],
    //   message: [cb]
    // }
  }
}