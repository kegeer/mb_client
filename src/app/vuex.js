import { isFunction } from 'lodash'
import { vuex as Batches } from './batches'
import { vuex as Experiments } from './experiments'
import { vuex as Projects } from './projects'
import { vuex as Pipelines } from './pipelines'
import { vuex as Qcs } from './qcs'
import { vuex as Results } from './results'
import { vuex as Auth } from './auth'

const vuex = {Experiments, Results, Qcs, Projects, Pipelines, Batches, Auth}
const keys = Object.keys(vuex)

const modules = keys.reduce((acc, key) => ({...acc, [key]: vuex[key].module}), {})
const plugins = keys.reduce((acc, key) => [...acc, vuex[key].plugin], []).filter(isFunction)

export default { modules, plugins }
