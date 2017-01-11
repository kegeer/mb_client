const Experiments = r => require.ensure([], () => r(require('./Main.vue')), 'experiments-bundle')
const Analysises = r => require.ensure([], () => r(require('./components/Analysis.vue')), 'experiments-bundle')
const AnalysisesForm = r => require.ensure([], () => r(require('./components/AnalysisForm.vue')), 'experiments-bundle')
const Dilutions = r => require.ensure([], () => r(require('./components/Dilution.vue')), 'experiments-bundle')
const DilutionsForm = r => require.ensure([], () => r(require('./components/DilutionForm.vue')), 'experiments-bundle')
const Extractions = r => require.ensure([], () => r(require('./components/Extraction.vue')), 'experiments-bundle')
const ExtractionsForm = r => require.ensure([], () => r(require('./components/ExtractionForm.vue')), 'experiments-bundle')
const Splits = r => require.ensure([], () => r(require('./components/Split.vue')), 'experiments-bundle')
const SplitsForm = r => require.ensure([], () => r(require('./components/SplitForm.vue')), 'experiments-bundle')
const Distributions = r => require.ensure([], () => r(require('./components/Distribution.vue')), 'experiments-bundle')
const DistributionsForm = r => require.ensure([], () => r(require('./components/DistributionForm.vue')), 'experiments-bundle')
const Poolings = r => require.ensure([], () => r(require('./components/Pooling.vue')), 'experiments-bundle')
const PoolingsForm = r => require.ensure([], () => r(require('./components/PoolingForm.vue')), 'experiments-bundle')
const Libraries = r => require.ensure([], () => r(require('./components/Library.vue')), 'experiments-bundle')
const LibrariesForm = r => require.ensure([], () => r(require('./components/LibraryForm.vue')), 'experiments-bundle')
const Sequences = r => require.ensure([], () => r(require('./components/Sequence.vue')), 'experiments-bundle')
const SequencesForm = r => require.ensure([], () => r(require('./components/SequenceForm.vue')), 'experiments-bundle')

const meta = {
  requiresAuth: true,
}

export default [
  {
    path: '/experiments',
    name: 'experiments.index',
    component: Experiments,
    meta,
    children: [
      {
        path: 'splits',
        name: 'splits.index',
        component: Splits,
        meta,
        children: [
          {
            name: 'splits.new',
            path: 'new',
            component: SplitsForm,
            meta
          },
          {
            name: 'splits.edit',
            path: ':split_id/edit',
            component: SplitsForm,
            meta
          }
        ]
      },
      {
        path: 'extractions',
        name: 'extractions.index',
        component: Extractions,
        meta,
        children: [
          {
            name: 'extractions.new',
            path: 'new',
            component: ExtractionsForm,
            meta
          },
          {
            name: 'extractions.edit',
            path: ':extraction_id/edit',
            component: ExtractionsForm,
            meta
          }
        ]
      },
      {
        path: 'dilutions',
        name: 'dilutions.index',
        component: Dilutions,
        meta,
        children: [
          {
            name: 'dilutions.new',
            path: 'new',
            component: DilutionsForm,
            meta
          },
          {
            name: 'dilutions.edit',
            path: ':dilution_id/edit',
            component: DilutionsForm,
            meta
          }
        ]
      },
      {
        path: 'distributions',
        name: 'distributions.index',
        component: Distributions,
        meta,
        children: [
          {
            name: 'distributions.new',
            path: 'new',
            component: DistributionsForm,
            meta
          },
          {
            name: 'distributions.edit',
            path: ':distribution_id/edit',
            component: DistributionsForm,
            meta
          }
        ]
      },
      {
        path: 'analysises',
        name: 'analysises.index',
        component: Analysises,
        meta,
        children: [
          {
            name: 'analysises.new',
            path: 'new',
            component: AnalysisesForm,
            meta
          },
          {
            name: 'analysises.edit',
            path: ':analysis_id/edit',
            component: AnalysisesForm,
            meta
          }
        ]
      },
      {
        path: 'poolings',
        name: 'poolings.index',
        component: Poolings,
        meta,
        children: [
          {
            name: 'poolings.new',
            path: 'new',
            component: PoolingsForm,
            meta
          },
          {
            name: 'poolings.edit',
            path: ':pooling_id/edit',
            component: PoolingsForm,
            meta
          }
        ]
      },
      {
        path: 'libraries',
        name: 'libraries.index',
        component: Libraries,
        meta,
        children: [
          {
            name: 'libraries.new',
            path: 'new',
            component: LibrariesForm,
            meta
          },
          {
            name: 'libraries.edit',
            path: ':library_id/edit',
            component: LibrariesForm,
            meta
          }
        ]
      },
      {
        path: 'sequences',
        name: 'sequences.index',
        component: Sequences,
        meta,
        children: [
          {
            name: 'sequences.new',
            path: 'new',
            component: SequencesForm,
            meta
          },
          {
            name: 'sequences.edit',
            path: ':sequence_id/edit',
            component: SequencesForm,
            meta
          }
        ]
      }
    ]
  }
]
