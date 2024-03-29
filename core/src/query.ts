export type Types = "modifiedQuery" | "infiniteQuery" | "query"
export type Methods = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS" | "HEAD" | "CONNECT" | "TRACE"
export type LowercaseMethods = Lowercase<Methods>

export type Args = readonly unknown[]
export type Getter<A extends Args, R, _M extends Methods = "GET"> = (...args: A) => R
export type Query<K extends string, A extends Args, R, T extends Types, M extends Methods> = {
  key: K
  getter: Getter<A, R, M>
  type: T
  method: M
}

export type QueryKey<QK extends string, M extends Methods> =
  | {
      queryKey: QK
      method: M
    }
  | QK

export type Fn = (...args: any[]) => any
export type HashedQueryKey<S extends string, K extends string, A extends Args> = [`${S}/${K}`, ...A]
export type Modifier<K extends string, A extends Args, R1, R> = (arg: R1, hashKey: HashedQueryKey<string, K, A>) => R

/**
 * Builds a query from the getter function `fn` and an optional modifier function `modifier`.
 * @param fn - The function to wrap - your main getter
 * @param modifier - An optional function to modify the result of `fn`.
 * @returns A new function that calls `fn` and optionally applies `modifier` to the result.
 * @template F - The type of the function being wrapped.
 * @template R - The return type of the modifier function.
 */
export function query<const QK extends string, A extends Args, R, const M extends Methods = "GET">(
  queryKey: QueryKey<QK, M>,
  getter: Getter<A, R, M>,
): Query<QK, A, R, "query", M>
/**
 * Wraps a function with optional result modifier.
 * @param fn - The function to wrap.
 * @param modifier - An optional function to modify the result of `fn`.
 * @returns A new function that calls `fn` and optionally applies `modifier` to the result.
 * @template F - The type of the function being wrapped.
 * @template R - The return type of the modifier function.
 */
export function query<const QK extends string, A extends Args, R1, R, const M extends Methods = "GET">(
  queryKey: QueryKey<QK, M>,
  fn: Getter<A, R1, M>,
  modifier: Modifier<QK, A, R1, R>,
): Query<QK, A, R, "modifiedQuery", M>
export function query<const QK extends string, A extends Args, R1, R, const M extends Methods = "GET">(
  queryKey: QueryKey<QK, M>,
  fn: Getter<A, R1, M>,
  modifier?: Modifier<QK, A, R1, R>,
) {
  const method: M = typeof queryKey === "string" ? ("GET" as M) : queryKey.method
  const key: QK = typeof queryKey === "string" ? queryKey : queryKey.queryKey
  if (!modifier) {
    const getter = (_schemaKey: string, ...args: A) => fn(...args)
    // This type conversion is incorrect, but it serves to act consistently with Call in type Params
    return { key, getter: getter as unknown as Getter<A, R, M>, type: "query", method }
  }
  const getter = <const SK extends string>(schemaKey: SK, ...args: A) => modifier(fn(...args), [`${schemaKey}/${key}`, ...args])
  // This type conversion is incorrect, but it serves to act consistently with Call in type Params
  return { key, getter: getter as unknown as Getter<A, R, M>, type: "modifiedQuery", method }
}
