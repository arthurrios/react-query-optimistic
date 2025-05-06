import { createUser } from '@/services/createUser'
import { useMutation } from '@tanstack/react-query'

export function useCreateUser() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createUser,
  })

  return {
    createUser: mutateAsync,
    isLoading: isPending,
  }
}
