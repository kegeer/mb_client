import * as TYPES from '../../store/types'

const state = {
  batches: [],
  batches_pagination: {},
  samples: [],
  samples_pagination: {},
  recipients: [],
  locations: []
}

/* eslint-disable no-param-reassign */
const mutations = {
  [TYPES.BATCHES_SET_DATA](st, obj) {
    st.batches = obj.batches
    st.batches_pagination = obj.batches_pagination
  },
  [TYPES.SAMPLES_SET_DATA](st, obj) {
    st.samples = obj.samples
    st.samples_pagination = obj.samples_pagination
  },
  [TYPES.RECIPIENTS_SET_DATA](st, obj) {
    st.recipients = obj.recipients
  },
  [TYPES.LOCATIONS_SET_DATA](st, obj) {
    st.locations = obj.locations
  }
}

const actions = {
  batchesSetData({ commit }, obj) {
    commit(TYPES.BATCHES_SET_DATA, obj)
  },
  samplesSetData({ commit }, obj) {
    commit(TYPES.SAMPLES_SET_DATA, obj)
  },
  recipientsSetData({ commit }, obj) {
    commit(TYPES.RECIPIENTS_SET_DATA, obj)
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
