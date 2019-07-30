import { DB, DBEntry } from './db'

interface Armor extends DBEntry {
  type: string
  defense: {
    min: number
    max: number
  }
}

export class ArmorDB implements DB {
  data: Armor[] = [
    {
      id: 'heavyCloth',
      type: 'Heavy Cloth',
      defense: {
        min: 0,
        max: 2
      }
    }
  ]

  findById(id: string): Armor | null {
    const result = this.data.find(entry => entry.id === id)
    if (!result) return null
    return result
  }
}
