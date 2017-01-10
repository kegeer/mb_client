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

export default [
  {
    path: '/experiments',
    name: 'experiments.index',
    component: Experiments,
    children: [
      {
        path: 'splits',
        name: 'splits.index',
        component: Splits,
        children: [
          {
            name: 'splits.new',
            path: 'new',
            component: SplitsForm
          },
          {
            name: 'splits.edit',
            path: ':split_id/edit',
            component: SplitsForm
          }
        ]
      },
      {
        path: 'extractions',
        name: 'extractions.index',
        component: Extractions,
        children: [
          {
            name: 'extractions.new',
            path: 'new',
            component: ExtractionsForm
          },
          {
            name: 'extractions.edit',
            path: ':extraction_id/edit',
            component: ExtractionsForm
          }
        ]
      },
      {
        path: 'dilutions',
        name: 'dilutions.index',
        component: Dilutions,
        children: [
          {
            name: 'dilutions.new',
            path: 'new',
            component: DilutionsForm
          },
          {
            name: 'dilutions.edit',
            path: ':dilution_id/edit',
            component: DilutionsForm
          }
        ]
      },
      {
        path: 'distributions',
        name: 'distributions.index',
        component: Distributions,
        children: [
          {
            name: 'distributions.new',
            path: 'new',
            component: DistributionsForm
          },
          {
            name: 'distributions.edit',
            path: ':distribution_id/edit',
            component: DistributionsForm
          }
        ]
      },
      {
        path: 'analysises',
        name: 'analysises.index',
        component: Analysises,
        children: [
          {
            name: 'analysises.new',
            path: 'new',
            component: AnalysisesForm
          },
          {
            name: 'analysises.edit',
            path: ':analysis_id/edit',
            component: AnalysisesForm
          }
        ]
      },
      {
        path: 'poolings',
        name: 'poolings.index',
        component: Poolings,
        children: [
          {
            name: 'poolings.new',
            path: 'new',
            component: PoolingsForm
          },
          {
            name: 'poolings.edit',
            path: ':pooling_id/edit',
            component: PoolingsForm
          }
        ]
      },
      {
        path: 'libraries',
        name: 'libraries.index',
        component: Libraries,
        children: [
          {
            name: 'libraries.new',
            path: 'new',
            component: LibrariesForm
          },
          {
            name: 'libraries.edit',
            path: ':library_id/edit',
            component: LibrariesForm
          }
        ]
      },
      {
        path: 'sequences',
        name: 'sequences.index',
        component: Sequences,
        children: [
          {
            name: 'sequences.new',
            path: 'new',
            component: SequencesForm
          },
          {
            name: 'sequences.edit',
            path: ':sequence_id/edit',
            component: SequencesForm
          }
        ]
      }
    ]
  }
]
