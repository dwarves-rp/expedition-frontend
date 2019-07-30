import React from 'react'
import Prando from 'prando'
import { WeaponDB, WeaponIds } from './data/weapons'
import { getWeaponRoller } from './lib/rollers'

const App: React.FC = () => {
  const rng = new Prando()
  const weapon = WeaponDB.findById(WeaponIds.smallKnife)
  if (!weapon) return <div>fail</div>
  const rollWeapon = getWeaponRoller(rng)
  return <div>{rollWeapon(weapon)}</div>
}

export default App
