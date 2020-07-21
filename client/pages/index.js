import { UserAPI, resolveNamespace } from 'API/users'

function Index({ currentUser }) {
  return currentUser ? <h1>You are signed in</h1> : <h1>You are not signed in</h1>
}

Index.getInitialProps = async (context) => {
  const client = resolveNamespace(context)
  const { data } = await client.get(UserAPI.currentUser)

  return data
}

export default Index
