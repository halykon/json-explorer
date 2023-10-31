// This is a very barebones implementation of lodash's get function.
type TValue = Record<string, unknown>

export function getProp(value: unknown, query: string | string[]) {
  // Parse query
  // if query is an array, it's already parsed, if not 
  // replace bracket with dot notation and split by dot, this way we get an array of keys
  const parsedQuery = Array.isArray(query)
    ? query 
    : query
      // replace [0] with .0. First capture group is the whole match, second is the index number.
      .replace(/(\[(\d)\])/g, '.$2')
      .replace(/^\./, '')
      .split('.')
  
      // if the array is empty, we've reached the final key, therefore no more recursion is needed and the provided value is the final value and therefore returned.
  if (!parsedQuery.length || parsedQuery[0] === undefined) return value

  const key = parsedQuery[0]

  // if the value is not an object, or the key is not in the object, or the value of the key is undefined, return undefined because the value doesn't exist.
  if (typeof value !== 'object' || value === null || !(key in value)) return undefined

  // recurse over the value of the key, and remove the first element of the parsedQuery array.
  return getProp((value as TValue)[key], parsedQuery.slice(1))
}