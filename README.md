
# What it is

A 2D browser-based map editor

Note: You will need the sprites in order to make it to work. It supports plain png images or a compressed `.spr` file ( try this [one](https://www.dropbox.com/s/l1mozr8w3mafgjd/images.spr?dl=0) for testing purposes). Then drop a folder containing the `.spr` file into the application.

## Setting up

```bash
$ nvm use && npm install
```

## Running at local

```bash
$ npm run desktop:dev
```

## Testing

```bash
$ npm test
```

# Issues

* pngjs-image

  We are using a modified version of pngjs-image to make compatible with browserify and make to run in browser. If for some reason, you get into problems, then use the original pngjs-image version. To do so, just replace in `package.json` file next line:

  "pngjs-image": "" --> "pngjs-image": "^0.11.6"
