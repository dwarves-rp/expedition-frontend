import React, { ReactNode } from 'react'
import styled, { css } from 'styled-components'
// import { fakeDwarfList } from '../data/dwarves'
import { Dwarf } from '../types/dwarf'

import * as R from 'ramda'
import { gql } from 'apollo-boost'
import { useQuery } from 'react-apollo-hooks'
import { DwarfListItem } from '../components/dwarf-list-item'

interface HomeProps {
  path: string
}

const DwarfList = styled.div`
  display: flex;
  flex-direction: column;
  width: 640px;
`

const GET_DWARVES = gql`
  {
    dwarves {
      id
      attributes {
        app
        con
        dex
        int
        pow
        siz
        str
      }
      name
      profession
      isDead
      currentHits
      wounds
    }
  }
`

type GetDwarvesResponse = { dwarves: Dwarf[] }
export default function Home(props: HomeProps) {
  const { data, error, loading } = useQuery<GetDwarvesResponse>(GET_DWARVES)
  if (loading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>Error! {error.message}</div>
  }
  if (!data) {
    return <div>Who knows</div>
  }

  return (
    <DwarfList>
      {R.map(
        (dwarf: Dwarf) => (
          <DwarfListItem dwarf={dwarf} />
        ),
        data.dwarves
      )}
    </DwarfList>
  )
}
