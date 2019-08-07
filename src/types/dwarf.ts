export interface Dwarf {
  id: number
  name: string
  profession: string
  attributes: {
    app: number
    con: number
    dex: number
    int: number
    pow: number
    siz: number
    str: number
  }
  isDead: boolean
  currentHits: number
  wounds: Wound[]
}

export type Wound = {
  permanent: boolean
  damage: number
  attribute: 'con'
  healRate: 'daily' | 'weekly'
  healAmount: number
  source: string
}
