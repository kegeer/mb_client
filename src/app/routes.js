import { routes as results } from './results'
import { routes as qcs } from './qcs'
import { routes as experiments } from './experiments'
import { routes as pipelines } from './pipelines'
import { routes as projects } from './projects'
import { routes as batches } from './batches'
import { routes as dashboard } from './dashboard'
import { routes as Auth } from './auth'
export default [...Auth, ...results, ...qcs, ...experiments, ...pipelines, ...projects, ...batches, ...dashboard]
