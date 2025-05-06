import { Header } from './components/header'
import { ThemeProvider } from './components/theme-provider'
import { UserForm } from './components/user-form'
import { UsersList } from './components/users-list'

export function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="max-w-2xl mx-auto mt-20">
        <Header />

        <main className="mt-10 space-y-3">
          <UserForm />
          <UsersList />
        </main>
      </div>
    </ThemeProvider>
  )
}
