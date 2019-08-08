import React from 'react'
import { Router, Link } from '@reach/router'
import { ApolloProvider } from 'react-apollo-hooks'
import ApolloClient from 'apollo-boost'
import styled from 'styled-components'

import Home from './pages/Home'
import NewDwarf from './pages/NewDwarf'

const PageContainer = styled.main`
  display: flex;
  min-height: 1vh;
  justify-content: center;
`

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql'
})

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <PageContainer>
        <Router>
          <Home path="/" />
          <NewDwarf path="/new-dwarf" />
        </Router>
      </PageContainer>
    </ApolloProvider>
  )
}

export default App
