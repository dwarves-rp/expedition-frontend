import React, { useState, useEffect } from 'react'
import { maleNames, femaleNames } from '../data/fake-names'
import styled from 'styled-components'
import NativeSelect from '@material-ui/core/NativeSelect'
import TextField from '@material-ui/core/TextField'
import Prando from 'prando'
import { professions } from '../data/professions'
import { useImmer } from 'use-immer'
import * as R from 'ramda'
import update from 'ramda/es/update'

interface NewDwarfProps {
  path: string
}

interface GenderOption {
  value: string
  label: string
}

export default function NewDwarf(props: NewDwarfProps) {
  const [name, setName] = useState('')
  const [gender, setGender] = useState('male')
  const [profession, setProfession] = useState(professions[0].slug)

  return (
    <div>
      <h1>Bio</h1>
      <Biography
        name={name}
        setName={setName}
        gender={gender}
        setGender={setGender}
        profession={profession}
        setProfession={setProfession}
      />
      <h1>Attributes</h1>
      <Attributes />
      <h1>Vitals</h1>
      <h1>Skills</h1>
    </div>
  )
}

const AttributeGrid = styled.div`
  display: grid;
  grid-template-columns: 50px 75px 100px 75px 75px 75px;
  grid-auto-rows: 50px;
  align-items: center;
  grid-column-gap: 24px;
  grid-row-gap: 24px;
`

const Attribute = styled.div`
  display: flex;
`
const Label = styled.div``
const Base = styled.div``
const Cell = styled.div``

interface Attribute {
  base: number
  value: number
  rollLabel: string
}

function getAttributeBase(attribute: { base: number; value: number }) {
  return attribute.base
}

function getAttributeValue(attribute: { base: number; value: number }) {
  return attribute.value
}

const getAttributeTotal = R.converge(R.add, [
  getAttributeBase,
  getAttributeValue
])

function Attributes() {
  const [attributes, updateAttributes] = useImmer<{
    [key: string]: Attribute
  }>({
    str: { base: 10, value: 0, rollLabel: 'Effort' },
    con: { base: 14, value: 0, rollLabel: 'Stamina' },
    siz: { base: 8, value: 0, rollLabel: '' },
    int: { base: 10, value: 0, rollLabel: 'Idea' },
    pow: { base: 10, value: 0, rollLabel: 'Luck/Will' },
    dex: { base: 10, value: 0, rollLabel: 'Agility' },
    app: { base: 12, value: 0, rollLabel: 'Charisma' }
  })

  const onChangeAttribute = (attrString: string, value: number) => {
    updateAttributes(draft => {
      draft[attrString].value = value
    })
  }
  const randomize = () => {
    updateAttributes(draft => {
      Object.keys(draft).forEach(attrString => {
        draft[attrString].value = 0
      })
    })
    const rng = new Prando()
    const choices = ['str', 'con', 'siz', 'int', 'pow', 'dex', 'app']
    let pointsRemaining = 14
    while (pointsRemaining > 0) {
      const toRaise = rng.nextArrayItem(choices)
      if (toRaise === 'siz' && attributes[toRaise].value >= 2) continue // Dont randomize size above 10
      if (getAttributeTotal(attributes[toRaise]) + 1 > 20) continue // Don't randomize above a 20 in any 1 stat
      updateAttributes(draft => {
        draft[toRaise].value += 1
      })
      pointsRemaining--
    }
  }
  return (
    <>
      <AttributeGrid>
        {Object.keys(attributes).map(attrString => {
          return (
            <>
              <Label>{attrString.toUpperCase()}</Label>
              <TextField
                label="Base"
                type="number"
                disabled
                value={attributes[attrString].base}
              />
              <TextField
                label="Value"
                type="number"
                value={attributes[attrString].value}
                onChange={e =>
                  onChangeAttribute(attrString, parseInt(e.target.value, 10))
                }
              />
              <TextField
                label="Total"
                type="number"
                value={getAttributeTotal(attributes[attrString])}
                disabled
              />
              <TextField
                label={attributes[attrString].rollLabel}
                type="number"
                disabled
                value={getAttributeTotal(attributes[attrString]) * 5}
              />
              <TextField
                label="Bonus"
                type="number"
                disabled
                value={getAttributeTotal(attributes[attrString]) - 10}
              />
            </>
          )
        })}
      </AttributeGrid>
      <button onClick={randomize}>Randomize</button>
    </>
  )
}

interface BiographyProps {
  name: string
  setName: React.Dispatch<React.SetStateAction<string>>
  gender: string
  setGender: React.Dispatch<React.SetStateAction<string>>
  profession: string
  setProfession: React.Dispatch<React.SetStateAction<string>>
}

function Biography({
  name,
  setName,
  gender,
  setGender,
  profession,
  setProfession
}: BiographyProps) {
  const randomize = () => {
    const rng = new Prando()
    const gender = rng.nextBoolean() ? 'male' : 'female'
    const name =
      gender === 'male'
        ? rng.nextArrayItem(maleNames)
        : rng.nextArrayItem(femaleNames)
    const profession = rng.nextArrayItem(professions).slug
    setName(name)
    setGender(gender)
    setProfession(profession)
  }

  return (
    <>
      <input type="text" value={name} onChange={e => setName(e.target.value)} />
      <NativeSelect value={gender} onChange={e => setGender(e.target.value)}>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </NativeSelect>
      <NativeSelect
        value={profession}
        onChange={e => setProfession(e.target.value)}
      >
        {professions.map(prof => (
          <option value={prof.slug}>{prof.label}</option>
        ))}
      </NativeSelect>
      <button onClick={randomize}>Randomize</button>
    </>
  )
}
