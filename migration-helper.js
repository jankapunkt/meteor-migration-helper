import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { getLocation } from './getLocation'
import { analyze } from './analyze'

/* -----------------------------------------------------------------------------
 |
 | Mongo.Collection and Mongo.Cursor
 |
 ---------------------------------------------------------------------------- */

// monkey-patch a Collection/Cursor proto function
// to inject some analysis code without altering
// the original behavior
const patch = (proto, name) => {
  const original = proto[name]
  const className = proto.constructor.name
  const fn = function (...args) {
    const self = this
    const location = getLocation()

    if (!fn.__asyncChecked) {
      console.warn(`Deprecated: ${className}.${name} needs to be migrated to ${name}Async in collection "${self._name}"!`)
      console.warn('=>', location)
      fn.__asyncChecked = true
    }
    return original.call(self, ...args)
  }

  proto[name] = fn
}

// apply patching to Mongo.Collection functions
const mNames = ['insert', 'update', 'remove', 'findOne', 'createIndex']
const mProto = Mongo.Collection.prototype
mNames.forEach(name => patch(mProto, name))

// applying patches Mongo.Cursor functions
const cNames = ['count', 'forEach', 'map', 'fetch']
const cProto = Mongo.Cursor.prototype
cNames.forEach(name => patch(cProto, name))

/* -----------------------------------------------------------------------------
 |
 | Meteor Methods
 |
 ---------------------------------------------------------------------------- */

const originalMethods = Meteor.methods

Meteor.methods = options => {
  const location = getLocation()
  const entries = Object.entries(options)
  const type = 'Method'
  entries.forEach(([name, fn]) => {
    analyze({ name, fn, location, type })
  })

  return originalMethods(options)
}

/* -----------------------------------------------------------------------------
 |
 | Meteor Publications
 |
 ---------------------------------------------------------------------------- */

const originalPub = Meteor.publish

Meteor.publish = (name, fn) => {
  const location = getLocation()
  const type = 'Publication'
  analyze({ name, fn, location, type })
  return originalPub(name, fn)
}

/* -----------------------------------------------------------------------------
 |
 | Validated Methods
 |
 ---------------------------------------------------------------------------- */

const originalExec = ValidatedMethod.prototype._execute

ValidatedMethod.prototype._execute = function (...args) {
  const self = this

  analyze({
    name: self.name,
    location: getLocation(),
    type: 'ValidatedMethod',
    fn: self.run
  })
  return originalExec.call(self, ...args)
}
