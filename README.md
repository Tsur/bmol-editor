
# What it is

A browser-based map editor

## Setting up

```bash
$ cd root
# Set up a virtual environment
$ npm install -g nave
$ nave use myenvironment stable
# Set up global dependences
$ npm install -g grunt-cli bunyan less jsdoc
# Set up local dependences
$ npm install
```

## Running at local

```bash
$ cd root
$ grunt server | bunyan
# if also requiring js linting, just:
$ grunt | bunyan
```

## Testing

```bash
$ cd root
$ grunt test | bunyan
```

You may also run it directly if futher configuration is needed:

```bash
$ cd root
$ export NODE_ENV=testing
$ mocha -r "server.js" server/tests/ | bunyan
# If running server after running tests in same terminal, run to retrieve .env data:
$ export NODE_ENV=
```

## Docs

```bash
$ cd root/docs/html && http-server
```

To generate the docs from sources:

```bash
$ cd /vagrant/root
$ grunt docs --debug
```