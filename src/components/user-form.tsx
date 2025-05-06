import { useCreateUser } from '@/hooks/useCreateUser'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useState } from 'react'
import { toast } from 'sonner'

export function UserForm() {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')

  const { createUser, isLoading } = useCreateUser()

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    try {
      createUser({ name, username, blocked: false })

      toast.success('User created successfully!')
    } catch {
      toast.error('Something went wrong!')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-muted p-4 rounded-md">
      <div className="flex gap-3">
        <Input
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          value={name}
          disabled={isLoading}
        />
        <Input
          placeholder="Github"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          disabled={isLoading}
        />
      </div>

      <Button className="mt-3 w-full" disabled={isLoading}>
        Register
      </Button>
    </form>
  )
}
