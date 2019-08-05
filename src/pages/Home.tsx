import React from 'react'
import styled, { css } from 'styled-components'
import { number } from 'prop-types'
import { fakeDwarfList, Wound, Dwarf } from '../data/dwarves'
import grave from '../images/hasty-grave.png'
import * as R from 'ramda'

interface HomeProps {
  path: string
}

const DwarfList = styled.div`
  display: flex;
  flex-direction: column;
  width: 640px;
`

interface DwarfProps {
  isDead: boolean
}

const DwarfUI = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 5px;
  height: 30px;
  margin-bottom: 6px;
  box-shadow: inset 0 -1px 1px rgba(255, 255, 255, 0.3);
  background: #555;
  color: white;
  ${(props: DwarfProps) =>
    props.isDead &&
    css`
      background: #000;
    `}
`

interface DwarfHealthProps {
  healthColor: string
  healthPercentage: string
}

function getMaxHits(siz: number, con: number): number {
  return Math.floor((siz + con) / 2) + 5
}

const getMaxHitsFromDwarf = R.converge(getMaxHits, [
  R.path(['attributes', 'siz']),
  R.path(['attributes', 'con'])
])

function getHealthBarColor(current: number, maximum: number): string {
  if (current / maximum >= 0.8) return 'rgb(43, 194, 83)'
  if (current / maximum >= 0.4) return '#f1a165'
  if (current / maximum > 0) return '#f0a3a3'
  return '#00000'
}

const getHealthBarColorFromDwarf = R.converge(getHealthBarColor, [
  R.prop('currentHits'),
  getMaxHitsFromDwarf
])

function getHealthPercentageAsString(current: number, maximum: number): string {
  const percentage = current / maximum
  const naturalPercentage = Math.floor(percentage * 100)
  // if (naturalPercentage >= 100) return '100%'
  return `${naturalPercentage}%`
}

const getHealthPercentageAsStringFromDwarf = R.converge(
  getHealthPercentageAsString,
  [R.prop('currentHits'), getMaxHitsFromDwarf]
)

const DwarfHealth = styled.div`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  ${(props: DwarfHealthProps) => css`
    background-color: ${props.healthColor};
    width: ${props.healthPercentage};
  `};
`

interface DwarfHealthDamageProps {
  percentage: string
}

function getConDamagePercentageAsString(
  tempMaxHits: number,
  maxHits: number
): string {
  const percentage = tempMaxHits / maxHits
  const naturalPercentage = Math.floor(percentage * 100)
  return `${100 - naturalPercentage}%`
}

const getTempMaxHits = (dwarf: Dwarf) => {
  const conDamage = getNonPermanentConDamage(dwarf.wounds)
  return getMaxHits(dwarf.attributes.siz, dwarf.attributes.con - conDamage)
}

const getNonPermanentConDamage = R.compose(
  R.sum,
  R.map(R.prop('damage')),
  R.filter(R.propEq('attribute', 'con')),
  R.filter(R.propEq('permanent', false))
)

const DwarfHealthDamage = styled.div`
  position: absolute;
  z-index: 1;
  top: 0;

  right: 0;
  bottom: 0;

  background: #cecece;
  ${(props: DwarfHealthDamageProps) => css`
    width: ${props.percentage};
  `}
`

const DwarfContent = styled.div`
  position: absolute;
  z-index: 2;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  border-radius: 5px;
  padding: 6px 12px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
`

const DeadMarker = styled.img`
  height: 18px;
`

export default function Home(props: HomeProps) {
  const dwarfList = fakeDwarfList.map(dwarf => {
    console.log(dwarf)
    return (
      <DwarfUI key={dwarf.id} isDead={dwarf.isDead}>
        <DwarfHealth
          healthColor={getHealthBarColorFromDwarf(dwarf)}
          healthPercentage={getHealthPercentageAsStringFromDwarf(dwarf)}
        />
        <DwarfHealthDamage
          percentage={getConDamagePercentageAsString(
            getTempMaxHits(dwarf),
            getMaxHitsFromDwarf(dwarf)
          )}
        />
        <DwarfContent>
          <span>{dwarf.name}</span>
          {dwarf.isDead && <DeadMarker src={grave} />}
          <span>{dwarf.profession}</span>
        </DwarfContent>
      </DwarfUI>
    )
  })

  return <DwarfList>{dwarfList}</DwarfList>
}
