import { Button } from './ui/button'
import { Input } from './ui/input'

export function UserForm() {
  return (
    <form action="" className="bg-muted p-4 rounded-md">
      <div className="flex gap-3">
        <Input placeholder="Username" />
        <Input placeholder="Github" />
      </div>

      <Button className="mt-3 w-full">Register</Button>
    </form>
  )
}
