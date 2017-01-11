const Pipelines = r => require.ensure([], () => r(require('./Main.vue')), 'pipelines-bundle')
const Form = r => require.ensure([], () => r(require('./Form.vue')), 'pipelines-bundle')
const Protocols = r => require.ensure([], () => r(require('./components/Protocols.vue')), 'pipelines-bundle')
const ProtocolsForm = r => require.ensure([], () => r(require('./components/ProtocolsForm.vue')), 'pipelines-bundle')
const meta = {
  requiresAuth: true,
}
export default [
  {
    path: '/pipelines',
    name: 'pipelines.index',
    component: Pipelines,
    meta,
    children: [
      {
        path: 'new',
        name: 'pipelines.new',
        component: Form,
        meta
      },
      {
        path: ':id/edit',
        name: 'pipelines.edit',
        component: Form,
        meta
      },
      {
        path: '/protocols',
        name: 'protocols.index',
        component: Protocols,
        meta,
        children: [
          {
            path: 'new',
            name: 'protocols.new',
            component: ProtocolsForm,
            meta
          },
          {
            path: ':protocol_id/edit',
            name: 'protocols.edit',
            component: ProtocolsForm,
            meta
          }
        ]
      }
    ]
  }
]
