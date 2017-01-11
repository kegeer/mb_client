import { Signup, Signin, Main } from './components'

export default [
  {
  name: 'auth',
  path: '/auth',
  component: Main,
  redirect: { name: 'auth.signin' },
  meta: { requiresAuth: false },
  children: [
    {
      name: 'auth.signin',
      path: 'signin',
      component: Signin,
      meta: { requiresAuth: false }
    },
    {
      name: 'auth.signup',
      path: 'signup',
      component: Signup,
      meta: { requiresAuth: false }
    }
  ]
  }
]
