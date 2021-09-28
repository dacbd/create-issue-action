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
