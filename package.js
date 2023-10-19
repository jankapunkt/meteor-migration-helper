/* eslint-env meteor */
Package.describe({
  name: 'jkuester:migration-helper',
  version: '1.0.1',
  // Brief, one-line summary of the package.
  summary: 'Detect where migration is required in Meteor.js 2.x',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/jankapunkt/meteor-migration-helper.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
})

Package.onUse(function (api) {
  api.versionsFrom(['1.12.1', '2.3']);
  api.use('ecmascript')
  api.use('mongo')
  api.use('mdg:validated-method@1.3.0')
  api.addFiles('migration-helper.js', 'server')
  api.mainModule('index.js', 'server')
})
