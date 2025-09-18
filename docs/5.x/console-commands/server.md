# Server Tool

The `ServerCommand` lets you stand up a simple webserver using the built in PHP
webserver. While this server is *not* intended for production use it can
be handy in development when you want to quickly try an idea out and don't want
to spend time configuring Apache or Nginx. You can start the server command with:

``` bash
bin/cake server
```

You should see the server boot up and attach to port 8765. You can visit the
CLI server by visiting `http://localhost:8765`
in your web-browser. You can close the server by pressing `CTRL-C` in your
terminal.

> [!NOTE]
> Try `bin/cake server -H 0.0.0.0` if the server is unreachable from other hosts.

## Changing the Port and Document Root

You can customize the port and document root using options:

``` bash
bin/cake server --port 8080 --document_root path/to/app
```
