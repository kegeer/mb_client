/* eslint-disable global-require */
export const Main = r => require.ensure([], () => r(require('../components/Main')), 'auth-bundle')
export const Signin = r => require.ensure([], () => r(require('../components/forms/Signin')), 'auth-bundle')
export const Signup = r => require.ensure([], () => r(require('../components/forms/Signup')), 'auth-bundle')
