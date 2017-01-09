const Pipelines = r => require.ensure([], () => r(require('./Main.vue')), 'pipelines-bundle')
const Form = r => require.ensure([], () => r(require('./Form.vue')), 'pipelines-bundle')
const Protocols = r => require.ensure([], () => r(require('./components/Protocols.vue')), 'pipelines-bundle')
const ProtocolsForm = r => require.ensure([], () => r(require('./components/ProtocolsForm.vue')), 'pipelines-bundle')

export default [
  {
    path: '/pipelines',
    name: 'pipelines.index',
    component: Pipelines,
    children: [
      {
        path: 'new',
        name: 'pipelines.new',
        component: Form
      },
      {
        path: ':id/edit',
        name: 'pipelines.edit',
        component: Form
      },
      {
        path: ':id/protocols',
        name: 'pipeline.protocols.index',
        component: Protocols,
        children: [
          {
            path: 'new',
            name: 'pipeline.protocols.new',
            component: ProtocolsForm
          },
          {
            path: ':task_id/edit',
            name: 'pipeline.protocols.edit',
            component: ProtocolsForm
          }
        ]
      }
    ]
  }
]
