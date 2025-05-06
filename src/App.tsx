import { QueryClientProvider } from '@tanstack/react-query'
import { Header } from './components/header'
import { ThemeProvider } from './components/theme-provider'
import { UserForm } from './components/user-form'
import { UsersList } from './components/users-list'
import { queryClient } from './lib/queryClient'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'sonner'

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="max-w-2xl mx-auto mt-20">
          <Header />

          <main className="mt-10 space-y-3">
            <UserForm />
            <UsersList />
          </main>
        </div>
        <Toaster />
      </ThemeProvider>

      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}
