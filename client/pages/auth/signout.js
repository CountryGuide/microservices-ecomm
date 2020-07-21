import { useRequest } from 'hooks/useRequest'
import { UserAPI } from 'API/users'
import Router from 'next/router'
import { useEffect } from 'react'

function SignOut() {
  const { doRequest } = useRequest(UserAPI.signOut, 'post', {}, () => Router.push('/'))

  useEffect(() => {
    doRequest()
  }, [])

  return <div>Signing out</div>
}

export default SignOut
