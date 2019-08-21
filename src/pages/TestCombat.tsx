import React from 'react'
import { useImmer } from 'use-immer'
import {
  Dwarf,
  ProfessionSlug,
  AttributeSlug,
  VitalSlug,
  GenderSlug,
  professions,
  genders,
  AttributeData,
  HealthDiff
} from '../models/types'
import diff from 'jest-diff'

interface TestProps {
  path: string
}
export default function TestCombat(props: TestProps) {
  const [dwarf, updateDwarf] = useImmer<Dwarf>({
    name: 'Test Boy',
    profession: ProfessionSlug.BREWER,
    age: 100,
    gender: GenderSlug.MALE,
    health: [],
    isDead: false,
    attributes: {
      app: { slug: AttributeSlug.APP, base: 10, value: 0 },
      pow: { slug: AttributeSlug.POW, base: 10, value: 0 },
      con: { slug: AttributeSlug.CON, base: 15, value: 0 },
      dex: { slug: AttributeSlug.DEX, base: 10, value: 0 },
      int: { slug: AttributeSlug.INT, base: 10, value: 0 },
      siz: { slug: AttributeSlug.SIZ, base: 8, value: 0 },
      str: { slug: AttributeSlug.STR, base: 10, value: 0 }
    },
    vitals: {
      hits: { slug: VitalSlug.HITS, value: 16 },
      pow: { slug: VitalSlug.POW, value: 16 },
      san: { slug: VitalSlug.SANITY, value: 16 }
    },
    skills: {}
  })

  const inflictHit = () => {
    updateDwarf((dwarf: Dwarf) => {
      dwarf.health.push({
        description: 'Deep Cut',
        regenRate: 1,
        affects: VitalSlug.HITS,
        value: -2
      })
    })
  }

  const inflictConDamage = () => {
    updateDwarf((dwarf: Dwarf) => {
      dwarf.health.push({
        description: 'Poisoned',
        regenRate: 1,
        affects: AttributeSlug.CON,
        value: -10
      })
    })
  }

  const inflictPermConDamage = () => {
    updateDwarf((dwarf: Dwarf) => {
      dwarf.health.push({
        description: 'Missing Limb',
        regenRate: 0,
        affects: AttributeSlug.CON,
        value: -2
      })
    })
  }

  const tickRecovery = () => {
    updateDwarf((dwarf: Dwarf) => {
      /* Recover Attribute Wounds First */

      dwarf.health.forEach((diff, index) => {
        if (Object.values(AttributeSlug).includes(diff.affects as any)) {
          dwarf.health[index].value += diff.regenRate
        }
      })
      dwarf.health.forEach((diff, index) => {
        const totalHits = getTotalHits(dwarf)
        const rawMaxHits = getRawMaxHits(dwarf)
        const totalMaxHits = getTotalMaxHits(dwarf)

        if (Object.values(VitalSlug).includes(diff.affects as any)) {
          if (totalHits >= totalMaxHits) return
          const regenRate = Math.min(diff.regenRate, totalMaxHits - totalHits)
          dwarf.health[index].value += regenRate
        }
      })

      dwarf.health = dwarf.health.filter(diff => diff.value !== 0)
    })
  }
  console.log(dwarf.health)
  return (
    <>
      <h1>Testing Ground</h1>
      <h3>Current State</h3>
      <ul>
        <li>Name - {dwarf.name}</li>
        <li>Profession - {getProfessionLabel(dwarf.profession)}</li>
        <li>Age - {dwarf.age}</li>
        <li>Gender - {getGenderLabel(dwarf.gender)}</li>
        <li>Base Max Hits - {getNaturalMaxHits(dwarf)}</li>
      </ul>
      <h3>Actions</h3>
      <button onClick={inflictHit}>Inflict Hit</button>
      <button onClick={inflictConDamage}>Inflict Con Damage</button>
      <button onClick={inflictPermConDamage}>Inflict Perm Con Damage</button>
      <button onClick={tickRecovery}>Tick Recovery</button>
      <h4>Health</h4>
      <div>
        Hits - ({getTotalHits(dwarf)}/{getTotalMaxHits(dwarf)})
      </div>
      <h4>Wounds</h4>
      {dwarf.health.map(health => {
        return (
          <p>
            <span>{health.description} - </span>
            <span>{health.affects} - </span>
            <span>({health.value} -)</span>
            <span>{health.regenRate}</span>
          </p>
        )
      })}
      <hr />
    </>
  )
}

function getTotalVitalDamage(
  healthDiffs: HealthDiff[],
  vital: VitalSlug
): number {
  return healthDiffs.reduce((acc, diff) => {
    if (diff.affects === vital) return acc + diff.value
    return acc
  }, 0)
}

function getTotalPermAttributeDamage(
  healthDiffs: HealthDiff[],
  attribute: AttributeSlug
): number {
  return healthDiffs.reduce((acc, diff) => {
    if (diff.affects === attribute && diff.regenRate === 0)
      return acc + diff.value
    return acc
  }, 0)
}

function getTotalAttributeDamage(
  healthDiffs: HealthDiff[],
  attribute: AttributeSlug
): number {
  return healthDiffs.reduce((acc, diff) => {
    if (diff.affects === attribute) return acc + diff.value
    return acc
  }, 0)
}

function getTotalHits(dwarf: Dwarf): number {
  const totalHitsDamage = getTotalVitalDamage(dwarf.health, VitalSlug.HITS)
  const totalRawMaxHits = getNaturalMaxHits(dwarf)
  return totalRawMaxHits + totalHitsDamage
}

function getTotalMaxHits(dwarf: Dwarf): number {
  const totalConDamage = getTotalAttributeDamage(
    dwarf.health,
    AttributeSlug.CON
  )
  const totalSizDamage = getTotalAttributeDamage(
    dwarf.health,
    AttributeSlug.SIZ
  )
  const rawCon = getAttributeRaw(dwarf.attributes.con)
  const rawSiz = getAttributeRaw(dwarf.attributes.siz)
  const totalCon = rawCon + totalConDamage
  const totalSiz = rawSiz + totalSizDamage
  return Math.floor((totalCon + totalSiz) / 2) + 5
}

function getRawMaxHits(dwarf: Dwarf): number {
  const totalPermConDamage = getTotalPermAttributeDamage(
    dwarf.health,
    AttributeSlug.CON
  )
  const rawCon = getAttributeRaw(dwarf.attributes.con)
  const rawSiz = getAttributeRaw(dwarf.attributes.siz)
  const totalCon = rawCon + totalPermConDamage
  return Math.floor((totalCon + rawSiz) / 2) + 5
}

function getNaturalMaxHits(dwarf: Dwarf): number {
  const rawCon = getAttributeRaw(dwarf.attributes.con)
  const rawSiz = getAttributeRaw(dwarf.attributes.siz)
  return Math.floor((rawCon + rawSiz) / 2) + 5
}

function getAttributeRaw(attribute: AttributeData): number {
  return attribute.base + attribute.value
}

function getGenderLabel(slug: GenderSlug): string {
  return genders[slug].label
}

function getProfessionLabel(slug: ProfessionSlug): string {
  return professions[slug].label
}
