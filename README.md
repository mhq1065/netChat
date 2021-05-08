# exp

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


删除了axios源码中的package.json
```
"browser": {
    "./lib/adapters/http.js": "./lib/adapters/xhr.js"
  },
```