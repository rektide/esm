import { satisfies as _satisfies } from "semver"
import shared from "../shared.js"

function init() {
  const nonDigitRegExp = /[^\d.]/g

  function satisfies(version, range) {
    if (typeof version !== "string" ||
        typeof range !== "string") {
      return false
    }

    const cache = shared.memoize.utilSatisfies
    const cacheKey = version + "\0" + range

    if (Reflect.has(cache, cacheKey)) {
      return cache[cacheKey]
    }

    version = version.replace(nonDigitRegExp, "")
    return cache[cacheKey] = _satisfies(version, range)
  }

  return satisfies
}

export default shared.inited
  ? shared.module.utilSatisfies
  : shared.module.utilSatisfies = init()
