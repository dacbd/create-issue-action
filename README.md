# create-issue-action
Another create an issue on GitHub action that strives to be as simple as possible...

Basically a converter that takes your yaml entry and connects it to the rest endpoint to create an issue on GitHub.

## Config
options for `with:`
| Option  | Default Value  | Notes  |
| ------------ | ------------ | ------------ |
| token      | github.token / `required`  | Use `${{ github.token }}` or create a PAT stored in the secrets store.   |
| owner      | github.context.repo.owner  | The owner of the repo to make the issue on. Implied from the context of the running action.  |
| repo       | github.context.repo.repo   | The repo to make the issue on. Implied from the context of the running action.  |
| title      | `required`                 |   |
| body       |                            |   |
| milestone  |                            |   |
| labels     |                            | A comma seperated list of labels  |
| assignees  |                            | A comma seperated list of GitHub usernames to assign the issue to  |

## Outputs
| output | value |
| ------ | ----- |
| json | [See Response](https://docs.github.com/en/rest/issues/issues#create-an-issue) |
| html_url | the issue's web url |
| number | the issue's number |

## Usage
Limited testing has been done, and only on `ubuntu-latest`

Basic Usage:

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

The reason for being usage:

```yml
steps:
  - uses: actions/checkout@v4
  - name: Something that might fail
    run: exit 1
  - name: Create Issue on Failed workflow
    if: ${{ failure() }}
    uses: dacbd/create-issue-action@main
    with:
      token: ${{ github.token }}
      title: Action workflow failed.
      body: |
        ### Context
        [Failed Run](https://github.com/${{ github.repository }}/actions/runs/${{ github.run_id }})
        [Codebase](https://github.com/${{ github.repository }}/tree/${{ github.sha }})
        Workflow name - `${{ github.workflow }}`
        Job -           `${{ github.job }}`
        status -        `${{ job.status }}`
      assignees: SomeUsername,AnotherUsername
```

## Other examples

Using outputs:

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

Transpose issues to a private repo:

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
If you encounter issues with my action feel free to create an issue or a PR, happy to take improvements or requests.

More verbose logging can be enabled via GitHub Actions feature: [`ACTIONS_STEP_DEBUG`](https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/enabling-debug-logging#enabling-step-debug-logging)
