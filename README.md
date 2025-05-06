# React Query Optimistic Updates - Best Practices

## Introduction

This repository demonstrates best practices for implementing optimistic updates with React Query. Optimistic updates provide a more responsive user experience by immediately reflecting changes in the UI before they are confirmed by the server. This approach creates a smoother, more responsive feel to your application.

## What are Optimistic Updates?

Optimistic updates are a UI pattern where we update the interface immediately after a user action, without waiting for the server's response. This creates the impression of instant changes, enhancing the perceived performance of your application.

Key benefits:
- Improved user experience with immediate feedback
- Reduced perceived latency
- Smoother interactions, especially on slower networks

## Project Setup

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Run the mock API server
npm run dev:server
```

## Core Concepts

### 1. Optimistic UI vs. Pessimistic UI

- **Pessimistic UI**: Wait for server confirmation before updating the UI
- **Optimistic UI**: Update the UI immediately, then sync with the server

### 2. Key Components of Optimistic Updates

- **Temporary State**: Showing the expected result immediately
- **Error Handling**: Gracefully handling failures
- **Rollback Mechanism**: Reverting to the previous state if needed

## Implementation Patterns

### Pattern 1: Creating Resources Optimistically

When creating new resources, we can immediately add them to the UI with a temporary ID and pending status:

```typescript
const { mutateAsync, isPending } = useMutation({
  mutationFn: createUser,
  onMutate: (variables) => {
    // Generate a temporary ID
    const tmpUserId = String(Math.random())

    // Update the cache with the new item
    queryClient.setQueryData(USERS_QUERY_KEY, (old) =>
      old?.concat({
        ...variables,
        id: tmpUserId,
        status: 'pending', // Mark as pending
      }),
    )

    return { tmpUserId }
  },
  onSuccess: async (data, _variables, context) => {
    // Cancel any outgoing refetches to avoid overwriting our optimistic update
    await queryClient.cancelQueries({ queryKey: USERS_QUERY_KEY })

    // Replace the temporary item with the real one from the server
    queryClient.setQueryData(USERS_QUERY_KEY, (old) =>
      old?.map((user) => (user.id === context.tmpUserId ? data : user)),
    )
  },
  // Error handling...
})
```

### Pattern 2: Updating Resources Optimistically

For updates to existing resources, we can immediately apply the changes and roll back if needed:

```typescript
const { mutateAsync, isPending } = useMutation({
  mutationFn: updateUser,
  onMutate: (variables) => {
    // Store the previous state for potential rollback
    const previousUsers = queryClient.getQueryData(USERS_QUERY_KEY)

    // Apply the update optimistically
    queryClient.setQueryData(USERS_QUERY_KEY, (old) =>
      old?.map((user) =>
        user.id === variables.id ? { ...user, ...variables } : user,
      ),
    )

    return { previousUsers }
  },
  onError: async (_error, _variables, context) => {
    // Cancel any outgoing refetches
    await queryClient.cancelQueries({ queryKey: USERS_QUERY_KEY })

    // Restore the previous state
    queryClient.setQueryData(USERS_QUERY_KEY, context?.previousUsers)
  },
})
```

## Error Handling Strategies

### Strategy 1: Visual Error Indication

Mark failed operations with visual indicators:

```typescript
onError: async (_error, _variables, context) => {
  await queryClient.cancelQueries({ queryKey: USERS_QUERY_KEY })

  queryClient.setQueryData(USERS_QUERY_KEY, (old) => {
    return old?.map((user) =>
      user.id === context?.tmpUserId ? { ...user, status: 'error' } : user,
    )
  })
}
```

### Strategy 2: Retry Mechanism

Provide users with the ability to retry failed operations:

```tsx
{user.status === 'error' ? (
  <Button onClick={() => handleTryCreatingUserAgain(user)}>
    Try again
  </Button>
) : (
  // Normal UI
)}
```

## Best Practices

### 1. Cancel Outgoing Queries

Always cancel outgoing queries before making optimistic updates to prevent race conditions:

```typescript
await queryClient.cancelQueries({ queryKey: USERS_QUERY_KEY })
```

### 2. Store Previous State

Always capture the previous state for potential rollbacks:

```typescript
const previousUsers = queryClient.getQueryData(USERS_QUERY_KEY)
```

### 3. Use Status Indicators

Provide visual feedback about the state of operations:

```typescript
// Define a type with status
export type WithStatus<T> = T & { status?: 'pending' | 'error' }

// Use in your UI
<div className={cn(
  'border p-4 rounded-md',
  user.status === 'pending' && 'opacity-70',
  user.status === 'error' && 'border-destructive bg-destructive/10',
)}>
```

### 4. Invalidate Queries After Success

Ensure data consistency by invalidating queries after successful operations:

```typescript
onSettled: () => {
  queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY })
}
```

### 5. Consider Network Conditions

Implement fallbacks for poor network conditions:

```typescript
// Add artificial delay to simulate network latency in development
export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
```

## When to Use Optimistic Updates

Optimistic updates are most beneficial when:

1. The operation has a high probability of success
2. Immediate feedback significantly improves user experience
3. The UI state can be accurately predicted before server confirmation
4. The application can gracefully handle rollbacks if needed

## When to Avoid Optimistic Updates

Consider a more cautious approach when:

1. Operations have complex server-side logic that's difficult to replicate client-side
2. The cost of showing incorrect state is high (e.g., financial transactions)
3. Network reliability is a significant concern
4. Server-side validation is complex and can't be fully replicated client-side

## Advanced Techniques

### Concurrent Optimistic Updates

Handling multiple updates to the same resource:

```typescript
// Use a unique identifier for each operation
const operationId = Date.now()

// Track ongoing operations
const ongoingOperations = new Set()
ongoingOperations.add(operationId)

// Clean up after completion
onSettled: () => {
  ongoingOperations.delete(operationId)
}
```

## Resources

- [TanStack Query Documentation](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates)
- [React Query Optimistic Updates Guide](https://tkdodo.eu/blog/mastering-mutations-in-react-query)

## License

MIT