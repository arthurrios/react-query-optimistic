import { ThemeSwitcher } from './ui/theme-switcher'

export function Header() {
  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="font-bold text-3xl tracking-wider">theusers</h1>
        <small className="text-muted-foreground">Manage your users</small>
      </div>

      <ThemeSwitcher />
    </header>
  )
}
