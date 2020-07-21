import 'bootstrap/dist/css/bootstrap.css'
import { resolveNamespace, UserAPI } from '../API/users'
import Header from '@/components/Header'

function AppComponent({ Component, pageProps, currentUser }) {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </div>
  )
}

AppComponent.getInitialProps = async ({ Component, ctx }) => {
  const client = resolveNamespace(ctx)
  const { data } = await client.get(UserAPI.currentUser)

  let pageProps = {}
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx)
  }

  return { pageProps, ...data }
}

export default AppComponent
