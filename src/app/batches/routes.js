const Batches = r => require.ensure([], () => r(require('./Main')), 'batches-bundle')
const Form = r => require.ensure([], () => r(require('./Form')), 'batches-bundle')
const Samples = r => require.ensure([], () => r(require('./components/Samples')), 'batches-bundle')
const SamplesForm = r => require.ensure([], () => r(require('./components/SamplesForm')), 'batches-bundle')

const meta = {
  requiresAuth: true,
}

export default [
  {
    name: 'batches.index',
    path: '/batches',
    component: Batches,
    meta,
    children: [
      {
        name: 'batches.new',
        path: 'create',
        component: Form,
        meta
      }, {
        name: 'batches.edit',
        path: ':id/edit',
        component: Form,
        meta
      }, {
        name: 'batch.samples.index',
        path: ':id/samples',
        component: Samples,
        meta,
        children: [
          {
            name: 'batch.samples.new',
            path: 'new',
            component: SamplesForm
          },
          {
            name: 'batch.samples.edit',
            path: ':sample_id/edit',
            component: SamplesForm
          }
        ]
      }
    ],
  },
]
