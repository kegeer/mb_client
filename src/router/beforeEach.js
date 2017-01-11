import store from '../store'
const needAuth = auth => auth === true
// const needRole = role => role === true
const beforeEach = (to, from, next) => {
  const auth = to.meta.requiresAuth
  const role = to.meta.requiresRole
  
  store.dispatch('resetMessages')
  if (!needAuth(auth)) {
    next()
    return
  }
  store.dispatch('checkUserToken')
    .then(() => {
      next()
    })
    .catch(() => {
      next({ name: 'auth.signin'})
    })
}
export default beforeEach
