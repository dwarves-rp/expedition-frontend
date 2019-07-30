import { DB, DBEntry } from './db'

export interface WeaponEntry extends DBEntry {
  type: string
  damage: {
    min: number
    max: number
  }
}

export enum WeaponIds {
  smallKnife = 'smallKnife'
}

class WeaponDatabase implements DB {
  private data: WeaponEntry[] = [
    {
      id: WeaponIds.smallKnife,
      type: 'Small Knife',
      damage: {
        min: 1,
        max: 4
      }
    }
  ]

  findById(id: string): WeaponEntry | null {
    const result = this.data.find(entry => entry.id === id)
    if (!result) return null
    return result
  }
}

export const WeaponDB = new WeaponDatabase()
