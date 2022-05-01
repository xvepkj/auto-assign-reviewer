# auto-assign-reviewer

## Usage 

```yml
name: 'Auto Assign Reviewer'

on:
  pull_request_target:
    types: [opened, reopened]

permissions:
  pull-requests: write

jobs:
  auto-assign-pr:
    runs-on: ubuntu-latest
    steps:
      - uses: xvepkj/auto-assign-reviewer@main
```
