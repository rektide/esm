import FastObject from "./fast-object.js"

import emitWarning from "./warning/emit-warning.js"
import getModuleURL from "./util/get-module-url.js"
import toStringLiteral from "./util/to-string-literal.js"

const cacheKeys = new FastObject
const messages = new FastObject
const warned = new FastObject

cacheKeys["WRN_NS_ASSIGNMENT"] =
cacheKeys["WRN_NS_EXTENSION"] =
cacheKeys["WRN_TDZ_ACCESS"] = moduleCacheKey

messages["WRN_ARGUMENTS_ACCESS"] = argumentsAccess
messages["WRN_NS_ASSIGNMENT"] = namespaceAssignment
messages["WRN_NS_EXTENSION"] = namespaceExtension
messages["WRN_TDZ_ACCESS"] = temporalDeadZoneAccess

function moduleCacheKey(request, name) {
  return getModuleURL(request) + "\0" + name
}

function getCacheKey(code, args) {
  const key = code in cacheKeys
    ? cacheKeys[code](...args)
    : args.join("\0")

  return code + "\0" + key
}

function argumentsAccess(request, line, column) {
  return "@std/esm detected undefined arguments access (" +
    line + ":" + column + "): " + getModuleURL(request)
}

function namespaceAssignment(request, key) {
  return "@std/esm cannot assign to the read only module namespace property " +
    toStringLiteral(key, "'") + " of " + getModuleURL(request)
}

function namespaceExtension(request, key) {
  return "@std/esm cannot add property " + toStringLiteral(key, "'") +
    " to module namespace of " + getModuleURL(request)
}

function temporalDeadZoneAccess(request, varName) {
  return "@std/esm detected possible temporal dead zone access of '" +
    varName + "' in " + getModuleURL(request)
}

function warn(code, ...args) {
  const cacheKey = getCacheKey(code, args)

  if (! (cacheKey in warned)) {
    warned[cacheKey] = true
    emitWarning(messages[code](...args))
  }
}

export default warn
