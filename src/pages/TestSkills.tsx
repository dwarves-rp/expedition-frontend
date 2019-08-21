import React, { Dispatch } from 'react'
import { SessionTracking, SessionTrackingAction } from '../App'
import { useImmer } from 'use-immer'
import {
  Dwarf,
  ProfessionSlug,
  GenderSlug,
  AttributeSlug,
  VitalSlug,
  SkillSlug,
  skills,
  skillCategories
} from '../models/types'
import Prando from 'prando'
interface TestSkillsProps {
  path: string
  sessionTracking: SessionTracking
  sessionDispatch: Dispatch<SessionTrackingAction>
}
export default function TestSkills(props: TestSkillsProps) {
  const [dwarf, updateDwarf] = useImmer<Dwarf>({
    name: 'Test Boy',
    profession: ProfessionSlug.BREWER,
    age: 100,
    gender: GenderSlug.MALE,
    health: [],
    isDead: false,
    attributes: {
      app: { slug: AttributeSlug.APP, base: 16, value: 0 },
      pow: { slug: AttributeSlug.POW, base: 12, value: 0 },
      con: { slug: AttributeSlug.CON, base: 15, value: 0 },
      dex: { slug: AttributeSlug.DEX, base: 10, value: 0 },
      int: { slug: AttributeSlug.INT, base: 14, value: 0 },
      siz: { slug: AttributeSlug.SIZ, base: 8, value: 0 },
      str: { slug: AttributeSlug.STR, base: 12, value: 0 }
    },
    vitals: {
      hits: { slug: VitalSlug.HITS, value: 16 },
      pow: { slug: VitalSlug.POW, value: 16 },
      san: { slug: VitalSlug.SANITY, value: 16 }
    },
    skills: {
      insight: { slug: SkillSlug.INSIGHT, value: 31 }
    }
  })

  const rollValue = (value: number) => {
    const rng = new Prando()
    const roll = rng.nextInt(1, 100)
    if (roll <= value) {
      console.log('Success!', roll)
    } else {
      console.log('Failure!', roll)
    }
  }
  return (
    <>
      <h1>Test Skills</h1>

      <div>
        {Object.keys(skills).map(skill => {
          return (
            <div>
              <span>{skills[skill as SkillSlug].label}</span>
              <button
                onClick={() =>
                  rollValue(getRollValue(skill as SkillSlug, dwarf))
                }
              >
                Roll {getRollValue(skill as SkillSlug, dwarf)}
              </button>
            </div>
          )
        })}
      </div>
    </>
  )
}

function getRollValue(skillSlug: SkillSlug, dwarf: Dwarf) {
  const skill = skills[skillSlug]
  const value = dwarf.skills[skillSlug] ? dwarf.skills[skillSlug].value : 0

  return (
    skill.base(dwarf) +
    value +
    skillCategories[skill.skillCategory].value(dwarf)
  )
}
