import { updateUser } from '@/services/updateUser'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { USERS_QUERY_KEY } from './useUsers'
import type { IUser } from '@/types/IUser'

export function useUpdateUser() {
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateUser,
    onMutate: (variables) => {
      const previousUsers = queryClient.getQueryData<IUser[]>(USERS_QUERY_KEY)

      queryClient.setQueryData<IUser[]>(USERS_QUERY_KEY, (old) =>
        old?.map((user) =>
          user.id === variables.id ? { ...user, ...variables } : user,
        ),
      )

      return { previousUsers }
    },
    onError: async (_error, _variables, context) => {
      await queryClient.cancelQueries({ queryKey: USERS_QUERY_KEY })

      queryClient.setQueryData<IUser[]>(USERS_QUERY_KEY, context?.previousUsers)
    },
  })

  return {
    updateUser: mutateAsync,
    isLoading: isPending,
  }
}
