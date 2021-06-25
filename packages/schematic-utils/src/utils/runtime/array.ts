export function clean<T>(array: Array<T | undefined>): Array<T> {
  return array.filter((x) => x !== undefined) as Array<T>;
}
