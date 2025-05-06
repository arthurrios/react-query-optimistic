import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Switch } from './ui/switch'

const users = [
  {
    id: Math.random(),
    name: 'Rodrigo Gonçalves',
    username: 'orodrigogo',
  },
  {
    id: Math.random(),
    name: 'Diego Fernandes',
    username: 'diego3g',
  },
  {
    id: Math.random(),
    name: 'Mayk Brito',
    username: 'maykbrito',
  },
  {
    id: Math.random(),
    name: 'Arthur Rios',
    username: 'arthurrios',
  },
]

export function UsersList() {
  return (
    <div className="space-y-4">
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

            <Switch />
          </div>
        )
      })}
    </div>
  )
}
