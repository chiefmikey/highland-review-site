# CICD GitHub mirror (wolfe.tools is authoritative)

**This document is the canonical reference for the one-push mirror pattern. To enable it on a repo, add a `.gitea/workflows/mirror.yml` and push to wolfe.tools. Note: this repo is currently local-only — no remote is wired and the workflow has not been added here yet.**

## Principle

`git@git.wolfe.tools:<owner>/<repo>.git` (our self-hosted **Gitea**) is the single
source of truth. `github.com/chiefmikey/<repo>` is a **read-only public mirror**.

You push **once**, to wolfe.tools. A per-repo Gitea Actions workflow force-syncs the
GitHub mirror on every push. Never push to GitHub directly, and never maintain a
second remote by hand — that is what produced the original split-brain (GitHub
drifted 40 commits ahead of wolfe.tools with duplicate, independently-committed
features). See `claude/memory/reference_git_remote_topology.md`.

```text
  developer / agent
        │  git push   (ONE push)
        ▼
  wolfe.tools (Gitea)  ──  authoritative
        │  push event
        ▼
  .gitea/workflows/mirror.yml  (Gitea Actions, act_runner)
        │  git push --force --prune  (branches + tags)
        ▼
  github.com/chiefmikey/<repo>   ── mirror (exact copy)
```

## How it works

- **Trigger:** every push to any branch or tag (`.gitea/workflows/mirror.yml`).
- **Source read:** a bare `git clone --mirror` of the authoritative repo over the
  **internal** address `http://gitea:3000/<owner>/<repo>.git`, authenticated with
  the automatic, repo-scoped `${{ github.token }}` Gitea injects into every job.
  The job container runs on the `gitea_default` docker network, so `gitea:3000`
  resolves with no reverse-proxy in the path.
- **Destination push:** `git push --force --prune … refs/heads/* refs/tags/*` to
  `https://x-access-token:${GH_MIRROR_TOKEN}@github.com/<dest>.git`.
  - `--prune` deletes GitHub refs that no longer exist on wolfe.tools (keeps the
    mirror exact).
  - `--force` keeps GitHub matching even if source history was amended. GitHub is
    downstream-only, so force there is intended and safe.
  - We do **not** use `git push --mirror` — it would also push Gitea-internal refs
    (`refs/pull/*`) that GitHub rejects.
- **Destination name:** defaults to `chiefmikey/<same-repo-name>`. Override per repo
  with an Actions **variable** `MIRROR_GITHUB_REPO` (`owner/repo`) if the GitHub
  name differs.
- **Concurrency:** mirror runs are serialized (`concurrency.group: mirror-to-github`,
  `cancel-in-progress: false`) so two quick pushes cannot race the destination.

## Add it to a new repo (the whole checklist)

1. Copy `.gitea/workflows/mirror.yml` into the new repo (no edits needed if the
   GitHub mirror is `chiefmikey/<repo>`; otherwise set the `MIRROR_GITHUB_REPO`
   variable).
2. Ensure the GitHub mirror repo exists (create it empty on GitHub if not).
3. Push to wolfe.tools. Done — the first push runs the workflow and seeds the mirror.

The shared credential is already in place fleet-wide, so step 1 is usually the only
work:

## One-time infrastructure (already done on wolfe-server)

- **Gitea Actions** enabled (`[actions] ENABLED = true`) with `act_runner`
  (`gitea/act_runner`) registered, labels include `ubuntu-latest`.
- **User-level Actions secret `GH_MIRROR_TOKEN`** — a GitHub PAT with push access to
  the mirrors. Set once at the **user** level so every repo inherits it; you do not
  re-add it per repo. To set/rotate it:

  ```bash
  # mint a short-lived Gitea API token (run as the git user inside the container)
  TN="mirror-$(date +%s)"
  RAW=$(ssh wolfe "docker exec -u git gitea gitea admin user generate-access-token \
        --username <gitea-user> --token-name $TN --scopes write:user --raw 2>&1")
  GT=$(printf '%s' "$RAW" | grep -oE '[0-9a-f]{40}' | tail -1)   # Gitea logs to stdout; grab the 40-hex token

  # PAT comes from 1Password, never hardcoded
  GH_PAT=$(secret "GitHub PAT chiefmikey ADMIN" token)

  # create/update the user-level secret (201 Created / 204 No Content = success)
  curl -s -o /dev/null -w '%{http_code}\n' -X PUT \
    -H "Authorization: token $GT" -H 'Content-Type: application/json' \
    "http://127.0.0.1:3100/api/v1/user/actions/secrets/GH_MIRROR_TOKEN" \
    -d "{\"data\":\"$GH_PAT\"}"
  ```

  Notes: `127.0.0.1:3100` is the host port mapped to the Gitea container's `:3000`
  (the external `/api/` path is reverse-proxy-gated). Gitea forbids `admin` commands
  as root, hence `-u git`. There is no GET for user-level secrets (the list endpoint
  404s) — the PUT status code is the confirmation.

## Verifying a mirror run

```bash
# the workflow run shows up in Gitea under the repo's Actions tab, or via API:
ssh wolfe 'GT=$(cat /tmp/.gtok); curl -s -H "Authorization: token $GT" \
  "http://127.0.0.1:3100/api/v1/repos/<owner>/<repo>/actions/tasks" | head'

# confirm the mirror matches:
git ls-remote https://github.com/chiefmikey/<repo>.git HEAD
git ls-remote git@git.wolfe.tools:<owner>/<repo>.git HEAD   # same SHA == in sync
```

## Local git hygiene (so agents never re-create the split-brain)

- `origin` = wolfe.tools (authoritative). Push only here.
- `github` remote, if present locally, is for **fetch/inspection only** — never push.
- `main` tracks `origin/main`; `git push` (no args) goes to wolfe.tools.
- Verify a commit "landed" against `origin/main`, not GitHub. A clean push to GitHub
  proves nothing about the source of truth.
