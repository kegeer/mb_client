const Results = r => require.ensure([], () => r(require('./Main')), 'results-bundles')
const Result = r => require.ensure([], () => r(require('./Result')), 'results-bundles')

export default [
  {
    name: 'results.index',
    path: '/results',
    component: Results,
    children: [
      {
        name: 'results.show',
        path: ':id/result',
        component: Result
      }
    ]
  }
]
