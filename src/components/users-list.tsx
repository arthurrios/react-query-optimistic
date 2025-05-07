import {
  USERS_QUERY_KEY,
  useUsers,
  type UsersQueryData,
} from '@/hooks/useUsers'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Switch } from './ui/switch'
import { Skeleton } from './ui/skeleton'
import { useUpdateUser } from '@/hooks/useUpdateUser'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { useCreateUser } from '@/hooks/useCreateUser'
import { useQueryClient } from '@tanstack/react-query'
import type { IUser } from '@/types/IUser'

export function UsersList() {
  const { users, isLoading } = useUsers()
  const { updateUser } = useUpdateUser()
  const { createUser } = useCreateUser()
  const queryClient = useQueryClient()

  async function handleBlockedChange(id: string, blocked: boolean) {
    try {
      await updateUser({ id, blocked })
    } catch {
      toast.error('Error updating user!')
    }
  }

  async function handleTryCreatingUserAgain({
    id,
    name,
    username,
  }: Omit<IUser, 'blocked'>) {
    queryClient.setQueryData<UsersQueryData>(USERS_QUERY_KEY, (old) =>
      old?.filter((user) => user.id !== id),
    )

    await createUser({ name, username, blocked: false })
  }

  return (
    <div className="space-y-4">
      {isLoading && (
        <>
          <Skeleton className="h-[74px]" />
          <Skeleton className="h-[74px]" />
          <Skeleton className="h-[74px]" />
        </>
      )}
      {users.map((user) => {
        const userInitials = user.name
          .split(' ')
          .map((name) => name[0])
          .join('')
          .toUpperCase()

        return (
          <div
            key={user.id}
            className={cn(
              'border p-4 rounded-md flex items-center justify-between',
              user.status === 'pending' && 'opacity-70',
              user.status === 'error' && 'border-destructive bg-destructive/10',
            )}
          >
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={`https://github.com/${user.username}.png`} />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>

              <div>
                <strong className="text-lg block leading-3">{user.name}</strong>
                <small className="text-muted-foreground">{user.username}</small>
              </div>
            </div>

            {user.status === 'error' ? (
              <Button onClick={() => handleTryCreatingUserAgain(user)}>
                Try again
              </Button>
            ) : (
              <Switch
                checked={user.blocked}
                onCheckedChange={(blocked) =>
                  handleBlockedChange(user.id, blocked)
                }
                disabled={user.status === 'pending'}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
