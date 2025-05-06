import { listUsers } from '@/services/listUsers'
import type { IUser } from '@/types/IUser'
import type { WithStatus } from '@/types/utils'
import { useQuery } from '@tanstack/react-query'

export const USERS_QUERY_KEY = ['users']

export type UsersQueryData = WithStatus<IUser>[]

export function useUsers() {
  const { data, isLoading } = useQuery({
    staleTime: Infinity,
    queryKey: USERS_QUERY_KEY,
    queryFn: async () => {
      const users = await listUsers()

      return users as UsersQueryData
    },
  })

  return {
    users: data ?? [],
    isLoading,
  }
}
