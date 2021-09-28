# create-issue-action
Another create an issue on Github actions that strives to be as simple as possible...

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
