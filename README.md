# Artdom Product Katalog


## Prerequisites

📦 'inkscape' CLI installed - version 0.48.4

#### Create following folder structure to host data:
```
-dataFolder
  |
  |-data
  |  |
  |  |-pages-array.json (contains empty array)
  |
  |-jpg
  |  |
  |  |-thumb
  |  |-client
  |
  |-svg
```

## Release
- Commit changes
- run `npm version patch`
- run `git push --tags`
- Build app by running `npm build`
- Go to github, create release, mark it with tag and upload exe

## TODO
- Refresh page list after source change
- Add cancel button to bulk preview refresh
- Add counter on bulk preview refresh
