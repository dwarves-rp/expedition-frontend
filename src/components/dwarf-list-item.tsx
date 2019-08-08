import React from 'react'
import { Dwarf, Wound } from '../types/dwarf'
import styled, { css } from 'styled-components'
import grave from '../images/hasty-grave.png'
import * as R from 'ramda'

type DwarfListItemProps = {
  dwarf: Dwarf
}
export function DwarfListItem(props: DwarfListItemProps) {
  const dwarf = props.dwarf
  return (
    <Background key={dwarf.id} isDead={dwarf.isDead}>
      <HealthBar
        healthColor={getHealthBarColorFromDwarf(dwarf)}
        healthPercentage={getHealthPercentageAsStringFromDwarf(dwarf)}
      />
      <MaxHealthDamageBar
        percentage={getConDamagePercentageAsString(
          getTempMaxHits(dwarf),
          getMaxHitsFromDwarf(dwarf)
        )}
      />
      <Content>
        <span>{dwarf.name}</span>
        {dwarf.isDead && <DeadMarker src={grave} />}
        <span>{dwarf.profession}</span>
      </Content>
    </Background>
  )
}

interface BackgroundProps {
  isDead: boolean
}

const Background = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 5px;
  height: 30px;
  margin-bottom: 6px;
  box-shadow: inset 0 -1px 1px rgba(255, 255, 255, 0.3);
  background: #555;
  color: white;
  ${(props: BackgroundProps) =>
    props.isDead &&
    css`
      background: #000;
    `}
`

interface HealthBarProps {
  healthColor: string
  healthPercentage: string
}

const HealthBar = styled.div`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  ${(props: HealthBarProps) => css`
    background-color: ${props.healthColor};
    width: ${props.healthPercentage};
  `};
`

interface MaxHealthDamageBarProps {
  percentage: string
}

const MaxHealthDamageBar = styled.div`
  position: absolute;
  z-index: 1;
  top: 0;

  right: 0;
  bottom: 0;

  background: #cecece;
  ${(props: MaxHealthDamageBarProps) => css`
    width: ${props.percentage};
  `}
`

const Content = styled.div`
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

  return `${naturalPercentage}%`
}

const getHealthPercentageAsStringFromDwarf = R.converge(
  getHealthPercentageAsString,
  [R.prop('currentHits'), getMaxHitsFromDwarf]
)

function getConDamagePercentageAsString(
  tempMaxHits: number,
  maxHits: number
): string {
  const percentage = tempMaxHits / maxHits
  const naturalPercentage = Math.floor(percentage * 100)
  return `${100 - naturalPercentage}%`
}

const getNonPermanentConDamage = R.compose(
  R.sum,
  R.map(R.prop('damage')),
  R.filter<Wound>(R.propEq('attribute', 'con')),
  R.filter<Wound>(R.propEq('permanent', false))
)

const getTempMaxHits = (dwarf: Dwarf) => {
  console.log(dwarf)
  const conDamage = getNonPermanentConDamage(dwarf.wounds)
  return getMaxHits(dwarf.attributes.siz, dwarf.attributes.con - conDamage)
}
