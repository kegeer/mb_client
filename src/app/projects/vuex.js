import * as TYPES from '../../store/types'

const state = {
  projects: [],
  projects_pagination: {},
  tasks: [],
  tasks_pagination: {},
  managers: [],
  locations: []
}

/* eslint-disable no-param-reassign */
const mutations = {
  [TYPES.PROJECTS_SET_DATA](st, obj) {
    st.projects = obj.projects
    st.projects_pagination = obj.projects_pagination
  },
  [TYPES.TASKS_SET_DATA](st, obj) {
    st.tasks = obj.tasks
    st.tasks_pagination = obj.tasks_pagination
  },
  [TYPES.MANAGERS_SET_DATA](st, obj) {
    st.managers = obj.managers
  },
  [TYPES.LOCATIONS_SET_DATA](st, obj) {
    st.locations = obj.locations
  }
}

const actions = {
  projectsSetData({ commit }, obj) {
    commit(TYPES.PROJECTS_SET_DATA, obj)
  },
  tasksSetData({ commit }, obj) {
    commit(TYPES.TASKS_SET_DATA, obj)
  },
  managersSetData({ commit }, obj) {
    commit(TYPES.MANAGERS_SET_DATA, obj)
  },
  locationsSetData({ commit }, obj) {
    commit(TYPES.LOCATIONS_SET_DATA, obj)
  }
}

const module = {
  state,
  mutations,
  actions,
}

export default { module }
