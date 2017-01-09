const Qcs = r => require.ensure([], () => r(require('./Main')), 'qcs-bundles')
const Qc = r => require.ensure([], () => r(require('./Qc')), 'qcs-bundles')

export default [
  {
    name: 'qcs.index',
    path: '/qcs',
    component: Qcs,
    children: [
      {
        name: 'qcs.show',
        path: ':id/qc',
        component: Qc
      }
    ]
  }
]
