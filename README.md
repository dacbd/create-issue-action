# dacbd/create-issue-action@main

The #1 simple and awesome create-issue action on GitHub. 🌟

Basically a converter that takes your yaml entry and connects it to the rest endpoint to create an issue on GitHub.

## Quick Start (or [jump to advanced](https://github.com/dacbd/create-issue-action#generate-advanced-report)):

```yml
steps:
  - uses: actions/checkout@v4
  - name: create an issue
    uses: dacbd/create-issue-action@main
    with:
      token: ${{ github.token }}
      title: Simple test issue
      body: my new issue
```

## Configure

### Inputs (through `with:`)

| Option  | Default Value  | Notes  |
| ------------ | ------------ | ------------ |
| token      | github.token / `required`  | Use `${{ github.token }}` (same as `${{secrets.GITHUB_TOKEN}}`) or create a PAT stored in the secrets store.   |
| owner      | github.context.repo.owner  | The owner of the repo to make the issue on. Implied from the context of the running action.  |
| repo       | github.context.repo.repo   | The repo to make the issue on. Implied from the context of the running action.  |
| title      | `required`                 |   |
| body       |                            |   |
| milestone  |                            |   |
| labels     |                            | A comma seperated list of labels  |
| assignees  |                            | A comma seperated list of GitHub usernames to assign the issue to  |

### Outputs

| output | value |
| ------ | ----- |
| json | [See Response](https://docs.github.com/en/rest/issues/issues#create-an-issue) |
| html_url | the issue's web url |
| number | the issue's number |

## Usage

> [!NOTE]
> Limited testing has been done, and only on `ubuntu-latest`.
> We welcome tester volunteers!

### Generate Advanced Report

```yml
name: Your Awesome Workflow
...

jobs:
  job-that-might-fail:
    ...

  create-issue-if-job-fails:
    needs: job-that-might-fail
    runs-on: ubuntu-latest
    if: always() && needs.job-that-might-fail.result == 'failure'
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
    
      - name: Create Issue
        uses: dacbd/create-issue-action@main
        with:
          token: ${{ github.token }}
          title: |
            [${{ github.workflow }}] failed during [${{ github.event_name }}]

          # Auto-assign person who triggered the failure.
          assignees: ${{ github.actor }},${{ github.triggering_actor }}
          labels: CICD
          body: |
            ## Failure Report:
            
            > [!IMPORTANT]
            > Details on failed run: https://github.com/${{ github.repository }}/actions/runs/${{ github.run_id }}
    
            - Author: @${{ github.triggering_actor }}
            - Branch: `${{ github.ref }}`
            - Commit: ${{ github.sha }}
            - Workflow Path: `${{ github.workflow_ref }}`
    
            - [ ] **Task**: Review failed run, fix the issue(s), and re-run until successful.
    
            > This issue was created automatically by GitHub, 
            > through `dacbd/create-issue-action@main` action
            > and KemingHe's contribution.
            > **DO NOT** close this issue until resolved.
```

### Using outputs

```yml
...
steps:
  - uses: actions/checkout@v4
  - uses: dacbd/create-issue-action@main
    id: new-issue
    with:
      token: ${{ github.token }}
      title: Simple test issue
      body: my new issue
  - run: |
      echo "${{ steps.new-issue.outputs.json }}" | jq
      echo "${{ steps.new-issue.outputs.json }}" | jq .state
      echo "${{ steps.new-issue.outputs.json }}" | jq .labels[].name
```

### Transpose issues to a private repo:

```yml
name: transpose issue
  issues:
    types: [labeled]
job:
  transpose:
    runs-on: ubuntu-latest
    if: contains(github.event.issue.labels.*.name, 'backend')
    steps:
      - name: Copy Issue
        uses: dacbd/create-issue-action@main
        with:
          token: ${{ secrets.PAT }}
          org: octo-org
          repo: private-backend-service
          title: ${{ github.event.issue.title }}
          body: |
            Closes: ${{ github.event.issue.html_url }}
            # Body
            ${{ github.event.issue.body }}
```

## Issues & debugging

If you encounter issues with `dacbd/create-issue-action@main`, feel free to create an issue or a PR, happy to take improvements or requests.

> [!TIP]
> - Issue shortcut: https://github.com/dacbd/create-issue-action/issues/new
> - More verbose logging can be enabled via GitHub Actions feature: [`ACTIONS_STEP_DEBUG`](https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/enabling-debug-logging#enabling-step-debug-logging)

## Contributors

<a href="https://github.com/dacbd/create-issue-action/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=dacbd/create-issue-action" />
</a>

Made with [contrib.rocks](https://contrib.rocks).

## Community Activities

Proposed to auto-generate repo activity report via https://repobeats.axiom.co/
