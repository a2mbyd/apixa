---
description: Open a GitHub issue and a task branch from a short brief
---

The developer is starting a change. The words they typed after `/plan-change` are the brief. Prep the issue and open it. Do not write the code.

## Stop first

Stop and ask what the change is if the brief is empty.

Stop if the current branch is already `task/N-slug` for this same brief. Name the branch. Do not stack a second change on it.

If the current branch is any other branch (including another `task/…` branch), do not build on it. Still open the issue, then create the new task branch from latest `main` as below.

Read `docs/context.md` and the **Current** folder under `versions/` (see `versions/README.md`). Do not recap the project.

If the brief is “implement the version” or clearly the whole active milestone, prefer telling them to use `/implement-version` after the issue exists — still open the issue if they ran `/plan-change`.

If the brief asks for something in the active version’s **Out** of scope, say so in the issue body and in chat. Do not pretend it is in scope.

## Write the issue

Turn the brief into a specific issue. Keep their words.

Title is the outcome. "Add defineApi resource generation" is a title. "Working on core" is not.

Body, in this order:

```markdown
Asked for: <their brief, unchanged>

Active version: vX.Y.Z

<One or two sentences on the problem.>

<One or two sentences on the outcome.>

Touches:
- path/to/file
```

Touches lists every file you expect to edit. Include:

- `docs/context.md` and/or `docs/architecture.md` when direction changes
- `docs/story.md` when the log will change
- `versions/vX.Y.Z/*` only when correcting or completing that milestone’s contract (not for unrelated future work)

Leave a file off the list when you are not sure, and say that in the chat.

Label the issue `task`. Repo is `a2mbyd/apixa`.

```bash
gh issue create --repo a2mbyd/apixa --title "Add defineApi resource generation" --label "task" --body "$(cat <<'EOF'
...
EOF
)"
```

The developer already asked to open it by running this command. Do not ask for a second yes.

## Branch

Always start the task branch from latest `main`. Never create it from the current checkout if that checkout is a sub-branch.

N is the new issue number. The slug is short, lowercase, and hyphenated.

```bash
git fetch origin
git switch main
git pull --ff-only origin main
git switch -c task/N-slug
```

Leave unrelated dirty files unstaged. If the switch or pull would overwrite them, stop and name the files.

## Reply

Give the issue URL, the branch name, the active version, and the Touches list. Then wait. Do not start the edit unless the brief also said to implement it now.
