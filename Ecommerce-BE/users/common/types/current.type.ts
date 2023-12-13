export type CurrentUserType = {
  id: string
  role: number
  storeRoleId?: string
}

export type CurrentStoreType = {
  userId: string
  storeId: string
  role: number
}
