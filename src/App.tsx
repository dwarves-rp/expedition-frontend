import React, { useReducer } from 'react'
import { Router, Link } from '@reach/router'
import { ApolloProvider } from 'react-apollo-hooks'
import ApolloClient from 'apollo-boost'
import styled from 'styled-components'

import Home from './pages/Home'
import NewDwarf from './pages/NewDwarf'
import TestCombat from './pages/TestCombat'
import TestSkills from './pages/TestSkills'

const PageContainer = styled.main`
  display: flex;
  min-height: 1vh;

  align-items: center;
  flex-direction: column;
`

const Header = styled.div`
  display: flex;
`

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql'
})

export interface SessionTracking {}

export enum SessionAction {
  NOOP,
  ECHO
}

export type SessionTrackingAction =
  | { type: SessionAction.NOOP }
  | { type: SessionAction.ECHO; payload: string }

function sessionTracking(
  state: SessionTracking,
  action: SessionTrackingAction
) {
  switch (action.type) {
    case SessionAction.ECHO: {
      return state
    }
    case SessionAction.NOOP: {
      return state
    }
  }
}
const App: React.FC = () => {
  const [sessionTracker, dispatch] = useReducer(sessionTracking, {})
  return (
    <ApolloProvider client={client}>
      <PageContainer>
        <Header>
          <Link to="/">Home</Link> | <Link to="/new-dwarf">New Dwarf</Link> |{' '}
          <Link to="/test-combat">Test</Link> | <button>Start Session</button>{' '}
          <button>Close Session</button>
        </Header>
        <Router>
          <Home path="/" />
          <NewDwarf path="/new-dwarf" />
          <TestCombat path="/test-combat" />
          <TestSkills
            path="/test-skills"
            sessionTracking={sessionTracker}
            sessionDispatch={dispatch}
          />
        </Router>
      </PageContainer>
    </ApolloProvider>
  )
}

export default App
