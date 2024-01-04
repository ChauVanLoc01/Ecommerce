export type DefaultUser = {
  _id: string
  roles: string[]
  email: string
  createdAt: string
  updatedAt: string
}

export type OptionUser = {
  name: string
  date_of_birth: string
  address: string
  phone: string
  avatar: string
  password: string
  new_password: string
}
export type User = DefaultUser & Partial<OptionUser>
