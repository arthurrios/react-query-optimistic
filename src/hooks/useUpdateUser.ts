import { updateUser } from '@/services/updateUser'
import { useMutation } from '@tanstack/react-query'

export function useUpdateUser() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateUser,
  })

  return {
    updateUser: mutateAsync,
    isLoading: isPending,
  }
}
