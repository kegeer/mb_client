const Qcs = r => require.ensure([], () => r(require('./Main')), 'qcs-bundles')
const Qc = r => require.ensure([], () => r(require('./Qc')), 'qcs-bundles')

const meta = {
  requiresAuth: true,
}

export default [
  {
    name: 'qcs.index',
    path: '/qcs',
    component: Qcs,
    meta,
    children: [
      {
        name: 'qcs.show',
        path: ':id/qc',
        component: Qc,
        meta
      }
    ]
  }
]
