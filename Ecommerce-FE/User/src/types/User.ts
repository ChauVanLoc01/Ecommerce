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
export type User = {
  id: string
  full_name: string
  birthday: Date
  email: string
  address: string
  rankId: string
  role: number
  status: number
  createdAt: Date
  updatedAt: Date
}
