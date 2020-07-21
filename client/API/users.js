import axios from 'axios'

const baseUrl = ''
const serviceNamespaceUrl = 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local'
const usersApi = '/api/users'

export function resolveNamespace({ req }) {
  if (typeof window === 'undefined') {
    return axios.create({
      baseURL: serviceNamespaceUrl,
      headers: req.headers,
    })
  } else {
    return axios.create({
      baseURL: baseUrl,
    })
  }
}

export const UserAPI = {
  currentUser: usersApi + '/currentuser',
  signUp: usersApi + '/signup',
  signIn: usersApi + '/signin',
  signOut: usersApi + '/signout',
}
