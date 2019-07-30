export interface DBEntry {
  id: string
}

export interface DB {
  findById(id: string): DBEntry | null
}
