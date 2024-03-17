export type CurrentUserType = {
  id: string
  role: string
  storeRoleId?: string
}

export type CurrentStoreType = {
  userId: string
  storeId: string
  role: string
}
