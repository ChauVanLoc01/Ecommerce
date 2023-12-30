export const concatEnv = (defaultKey: string) => (key: string) =>
  `${defaultKey}.${key}`
