import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { API_URL } from 'lib/api'
import { useEffect } from 'react'
import { useStore } from 'stores/index'

export const useChannels = (joined: boolean = true) => {
  const apiToken = useStore((s) => s.apiToken)

  const { error, data } = useQuery({
    queryKey: [`channels/${joined.toString()}`],
    queryFn: () => {
      if (!apiToken) return []
      return axios
        .get(`${API_URL}/api/channels?joined=${joined}`, {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        })
        .then((res) => res.data)
    },
  })

  useEffect(() => {
    if (!error) return
    console.log('error:', error)
  }, [error])

  return data?.channels || []
}