# Work

## Prose for other people
When people see text with my name as the author, they must know that I
wrote it, not an agent.

- Do not write prose that other people will read on my behalf, and do not
  offer to. This includes issue and PR bodies, issue and PR comments of any
  length, review comments, chat messages, and email.
- Do not post or send this prose with any tool.
- Exception: when I give you the exact prose and ask you to post it, you
  can post it as me. Post it word for word. Do not edit or add to it.
- Exception: you can write a first draft of a PR body when the PR is a
  draft. You do not need me to ask. Either the PR already exists as a
  draft, or you create it as a draft. You can set this first draft as the
  body of that draft PR. Set the body once. Do not change it again unless
  I ask, and do not mark the PR as ready for review.
- Exception: in my personal private repos, nobody else reads the prose, so
  you can write and post it. A personal private repo is owned by my
  personal account, is private, and has me as the only collaborator. Check
  with `gh api repos/<owner>/<repo> --jq .visibility` and
  `gh api repos/<owner>/<repo>/collaborators --jq '.[].login'`. In these
  repos you can:
  - open issues and write their bodies
  - write and update PR bodies
  - open PRs as ready for review, not as drafts
  - reply to review comments (for example, from Copilot) and resolve the
    threads
  Keep replies short and factual: say what you fixed and in which commit.
  The other rules in this section still apply, for example the repository
  template and no "Generated with Claude Code" line.
- Do not add the "🤖 Generated with Claude Code" line to PR bodies.
- When you write prose for me, always follow the repository's template for
  it (for example, the PR template).
- A find-and-replace of an identifier is not a prose change. When I ask you
  to replace an identifier in my issue or PR (for example, `model` with
  `agent_variant`), replace only that identifier, change nothing else, and
  show me the diff.
- You can help me draft and edit this prose in a local file when I ask.
- You can write commit messages. Keep the `Co-Authored-By` line in them.
- You can write code comments.
- You can write and edit files whose readers are agents (for example
  AGENTS.md, CLAUDE.md, RECIPE.md, and skill files). These are
  instructions, not my prose.
- Data is not prose. When I ask, you can add data aids (for example, tables
  of metrics or query results) to my PRs and issues. Do not write or change
  my prose around them, and keep any notes to factual labels for the data.

## Stacked PRs
When a PR depends on another open PR, create the stack with `gh stack`
(the `github/gh-stack` extension) so that GitHub shows the stack in the UI.
Do not write "Stacked on #N" or other links to the PRs in the stack in PR
bodies or comments.

## tuicr
When I ask for a tuicr review inside tmux, do not use the skill's
`tuicr-wrapper.sh`. Run `tmux new-window -n review -c <repo> "tuicr -w"`
(or `-r <revset>`), then read comments after I say the review is done.
