# Git Contribution Setup

This project enforces Git contribution rules with Husky hooks, Commitlint, and branch naming checks.

## What Is Enforced

The repository currently enforces:

- Commit message format (Conventional Commits)
- Branch naming conventions before push
- Lint checks on staged files before commit

These checks run automatically through Git hooks in the repository.

## Prerequisites

Make sure you have:

- Node.js 20+
- npm

Then install dependencies from the project root:

```bash
npm install
```

This triggers the `prepare` script, which installs Husky hooks.

## Hooks Used In This Repository

### Pre-commit

- Hook file: `.husky/pre-commit`
- Runs: `npx lint-staged`
- Purpose: runs checks on staged files before a commit is created

### Commit-msg

- Hook file: `.husky/commit-msg`
- Runs: `npx commitlint --edit $1`
- Purpose: validates your commit message format

### Pre-push

- Hook file: `.husky/pre-push`
- Runs: `node ./scripts/validate-branch.js`
- Purpose: blocks push if your branch name does not match allowed patterns

## Commit Message Rules

Commit messages are validated using Commitlint with `@commitlint/config-conventional`.

Preferred format:

```text
type(scope): short description
```

Scope is optional:

```text
type: short description
```

### Common valid examples

```text
feat: add home page hero animation
fix(api): handle missing order id
docs: add git contribution setup guide
chore: update frontend dependencies
```

### Common commit types

- feat
- fix
- docs
- style
- refactor
- perf
- test
- build
- ci
- chore
- revert

## Branch Naming Rules

Push is allowed only for branches that match one of these prefixes:

- `feature/`
- `fix/`
- `hotfix/`
- `chore/`
- `test/`
- `release/`

Or exactly:

- `dev`

Examples:

```text
feature/ticket-form-validation
fix/checkout-total-rounding
chore/update-storybook
release/v1.2.0
dev
```

## Typical Contributor Workflow

1. Create a valid branch name.
2. Make your changes.
3. Stage files.
4. Commit with a Conventional Commit message.
5. Push.

Example:

```bash
git checkout -b feature/homepage-copy-update
git add .
git commit -m "docs: update readme extension links"
git push -u origin feature/homepage-copy-update
```

## Troubleshooting

### Commit rejected by commit-msg hook

Your commit message format is invalid. Rewrite using Conventional Commits, then commit again.

### Push rejected by pre-push hook

Your branch name is invalid. Rename it:

```bash
git branch -m feature/new-valid-name
```

Then push again.

### Hooks are not running

From repo root:

```bash
npm install
```

If needed, reinstall hooks manually:

```bash
npx husky
```

## Related Repository Files

- `package.json`
- `.husky/pre-commit`
- `.husky/commit-msg`
- `.husky/pre-push`
- `commitlint.config.ts`
- `scripts/validate-branch.js`
