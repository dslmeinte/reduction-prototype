/**
 * @return a function that extracts the property from a value of type {@link T}.
 * @param propertyName the name of the property on {@link T} to extract.
 */
export const extractorOf = <T, K extends keyof T>(propertyName: K): ((t: T) => T[K]) =>
    (t: T) => t[propertyName]

