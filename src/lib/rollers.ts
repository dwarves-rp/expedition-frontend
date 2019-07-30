import Prando from 'prando'
import { WeaponEntry } from '../data/weapons'
import * as R from 'ramda'

type minMax = { min: number; max: number }

export const rollNumberBetween = R.curry((rng: Prando, minMax: minMax) =>
  rng.nextInt(minMax.min, minMax.max)
)

// getDamageFromWeapon :: Weapon A -> [Int, Int]
export const getDamageFromWeapon = (weapon: WeaponEntry) => ({
  min: weapon.damage.min,
  max: weapon.damage.max
})

export const getWeaponRoller = (rng: Prando) =>
  R.compose(
    rollNumberBetween(rng),
    getDamageFromWeapon
  )
