import { useUsers } from '@/hooks/useUsers'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Switch } from './ui/switch'
import { Skeleton } from './ui/skeleton'
import { useUpdateUser } from '@/hooks/useUpdateUser'

export function UsersList() {
  const { users, isLoading } = useUsers()
  const { updateUser } = useUpdateUser()

  async function handleBlockedChange(id: string, blocked: boolean) {
    await updateUser({ id, blocked })
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
            className="border p-4 rounded-md flex items-center justify-between"
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

            <Switch
              checked={user.blocked}
              onCheckedChange={(blocked) =>
                handleBlockedChange(user.id, blocked)
              }
            />
          </div>
        )
      })}
    </div>
  )
}
