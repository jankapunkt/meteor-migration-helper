# Meteor.js Migration Helper

Detect which parts of your Meteor.js server environment need to be
migrated in your current 2.x code.

[![built with Meteor](https://img.shields.io/badge/Meteor-package-green?logo=meteor&logoColor=white)](https://packosphere.com/jkuester/migration-helper)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Project Status: Active – The project has reached a stable, usable state and is being actively developed.](https://www.repostatus.org/badges/latest/active.svg)](https://www.repostatus.org/#active)


No need to upgrade to 3.0 now to find out, what's still using Fibers.

There is also an article, which covers this packages functionality:
https://dev.to/jankapunkt/prepare-your-meteorjs-project-for-the-big-30-release-24l8

## Installation

```shell
$ meteor add jkuetser:migration-helper
```

Now open in your Meteor.js project the file `.meteor/packages`
and move the entry `jkuester:migration-helper` to the top, in order
to also detect dependency packages that still use Fibers.

## Run detection

This is a runtime detection. In order to cover all detectable 
structures you need to either run your Meteor.js application
or the tests.

The more your tests cover of your code (test-coverage),
the better you will be able to detect these.

## Detect validated methods using mixins

This package also provides a mixin to be used
with `mdg:validated-method` 

You can import it via

```js
import { checkAsyncMixin } from 'meteor/jkuester:migration-helper'

// ...
const m = new ValidatedMethod({
  name: 'coolMethod',
  mixins: [checkAsyncMixin],
  validate: () => {},
  run: () => {}
})
```

A more versatile approach is to use a factory function for your ValidatedMethods:

```js
export const createMethod = options => {
  options.mixins = options.mixins ?? []
  options.mixins.push(checkAsyncMixin)
  return new ValidatedMethod(options)
}
```

If this is not feasible then you might skip this and let the package detect
them at runtime, when they are executed.

## Note

This package may not detect everything. However, it helps
to identify lots of parts on the server that need change and I hope
it will be useful to you.

## License

MIT
