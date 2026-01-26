# Routes Tool

The routes tool provides a simple to use CLI interface for testing and debugging
routes. You can use it to test how routes are parsed, and what URLs routing
parameters will generate.

## Getting a List of all Routes

``` bash
bin/cake routes
```

## Testing URL parsing

You can quickly see how a URL will be parsed using the `check` method:

``` bash
bin/cake routes check /articles/edit/1
```

If your route contains any query string parameters remember to surround the URL
in quotes:

``` bash
bin/cake routes check "/articles/?page=1&sort=title&direction=desc"
```

## Testing URL Generation

You can see the URL a `routing array` will generate using the
`generate` method:

``` bash
bin/cake routes generate controller:Articles action:edit 1
```
