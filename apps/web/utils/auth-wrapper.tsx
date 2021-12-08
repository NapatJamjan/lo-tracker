import React, { createContext } from 'react'
import { useSession } from 'next-auth/react';
import { useApollo } from './apollo-client';
import { ApolloProvider } from '@apollo/client'

interface AuthState {
  isSignedIn: boolean
  username: string
  isTeacher: boolean
  roleLevel: number
  isSameUser: (string) => boolean
}

const initialState: AuthState = {
  isSignedIn: false,
  username: '',
  isTeacher: false,
  roleLevel: -1,
  isSameUser: (_) => false,
}

export const AuthContext = createContext<AuthState>(initialState)

interface AuthWrapperProps {
  pageProps: any
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({children, pageProps}) => {
  const { data: session, status } = useSession()
  const client = useApollo(pageProps, !!session?session.user.accessToken:'')
  if (status === 'loading') return null
  if (status === 'unauthenticated') return <AuthContext.Provider value={initialState}>{children}</AuthContext.Provider>
  return <ApolloProvider client={client}>
    <AuthContext.Provider value={{
      isSignedIn: true,
      username: session.user.name,
      isTeacher: !!session.user.teacher,
      roleLevel: session.user.teacher?.roleLevel || -1,
      isSameUser: (id: string) => !!session?session.user.id===id:false,
      }}>
      {children}
    </AuthContext.Provider>
  </ApolloProvider>
}