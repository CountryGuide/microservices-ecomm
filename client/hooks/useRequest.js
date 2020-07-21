import { useState } from 'react'
import axios from 'axios'

export function useRequest(url, method, body, onSuccess) {
  const [errors, setErrors] = useState(null)

  async function doRequest() {
    try {
      setErrors(null)
      const { data } = await axios[method](url, body)

      if (onSuccess) {
        onSuccess()
      }
      return data
    } catch (err) {
      setErrors(
        <ul className='list-group'>
          {err.response.data.errors.map((error) => (
            <li className='list-group-item-danger' key={error.message}>
              {error.message}
            </li>
          ))}
        </ul>
      )
    }
  }

  return { doRequest, errors }
}
