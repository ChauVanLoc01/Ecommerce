export type PostSearchBody = {
  id: string
  name: string
  description: string
}

export type PostSearchResult = {
  hits: {
    total: number
    hits: Array<{
      _source: PostSearchBody
    }>
  }
}
