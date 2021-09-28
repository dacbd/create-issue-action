# create-issue-action
Another create an issue on Github actions that strives to be as simple as possible...

Basically a converter that takes your yaml entry and connects it to the rest endpoint to create an issue on github.

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
| assignees  |                            | A comma seperated list of Github usernames to assign the issue to  |

## Usage
Limited test has currnet been done, only tested on `ubuntu-latest`

Basic Usage:
```yml
steps:
  - uses: actions/checkout@v2
  - name: create an issue
    uses: DanielBarnes/create-issue-action@main
    with:
      token: ${{ github.token }}
      title: Simple test issue
      body: my new issue
```

The reason for being usage:
```yml
steps:
  - uses: actions/checkout@v2
  - name: Something that might fail
    run: exit 1
  - name: Create Issue on Failed workflow
    if: ${{ failure() }}
    uses: DanielBarnes/create-issue-action@main
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
