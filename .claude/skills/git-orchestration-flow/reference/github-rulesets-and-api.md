# GitHub PR Thread & Ruleset Reference

Helper reference for resolving GitHub API rulesets, inspecting merge block status, and executing GraphQL mutations for thread resolution.

## Inspecting Branch Protection & Rulesets

To list active rulesets for a repository:
```bash
gh api repos/:owner/:repo/rulesets
```

To view details of a specific ruleset:
```bash
gh api repos/:owner/:repo/rulesets/:ruleset_id
```

## GraphQL Queries & Mutations

### Query Unresolved Threads
```graphql
query GetUnresolvedThreads($owner: String!, $repo: String!, $prNumber: Int!) {
  repository(owner: $owner, name: $repo) {
    pullRequest(number: $prNumber) {
      reviewThreads(first: 50) {
        nodes {
          id
          isResolved
          isOutdated
          path
          line
          comments(first: 5) {
            nodes {
              author { login }
              body
            }
          }
        }
      }
    }
  }
}
```

### Resolve Thread Mutation
```graphql
mutation ResolveThread($threadId: ID!) {
  resolveReviewThread(input: { threadId: $threadId }) {
    thread {
      id
      isResolved
    }
  }
}
```

### CLI One-Liner Execution
```bash
gh api graphql \
  -F threadId="THREAD_NODE_ID" \
  -f query='mutation($threadId: ID!) { resolveReviewThread(input: {threadId: $threadId}) { thread { id isResolved } } }'
```
