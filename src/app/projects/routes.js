const Projects = r => require.ensure([], () => r(require('./Main.vue')), 'projects-bundle')
const Form = r => require.ensure([], () => r(require('./Form.vue')), 'projects-bundle')
const Tasks = r => require.ensure([], () => r(require('./components/Tasks.vue')), 'projects-bundle')
const TasksForm = r => require.ensure([], () => r(require('./components/TasksForm.vue')), 'projects-bundle')

export default [
  {
    path: '/projects',
    name: 'projects.index',
    component: Projects,
    children: [
      {
        path: 'new',
        name: 'projects.new',
        component: Form
      },
      {
        path: ':id/edit',
        name: 'projects.edit',
        component: Form
      },
      {
        path: ':id/tasks',
        name: 'project.tasks.index',
        component: Tasks,
        children: [
          {
            path: 'new',
            name: 'project.tasks.new',
            component: TasksForm
          },
          {
            path: ':task_id/edit',
            name: 'project.tasks.edit',
            component: TasksForm
          }
        ]
      }
    ]
  }
]
