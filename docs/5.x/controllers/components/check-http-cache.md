# Checking HTTP Cache

`class` **CheckHttpCacheComponent**(ComponentCollection $collection, array $config = [])

The HTTP cache validation model is one of the processes used for cache gateways,
also known as reverse proxies, to determine if they can serve a stored copy of
a response to the client. Under this model, you mostly save bandwidth, but when
used correctly you can also save some CPU processing, reducing response
times:

``` php
// in a Controller
public function initialize(): void
{
    parent::initialize();

    $this->addComponent('CheckHttpCache');
}
```

Enabling the `CheckHttpCacheComponent` in your controller automatically
activates a `beforeRender` check. This check compares caching headers set in
the response object to the caching headers sent in the request to determine
whether the response was not modified since the last time the client asked for
it. The following request headers are used:

- `If-None-Match` is compared with the response's `Etag` header.
- `If-Modified-Since` is compared with the response's `Last-Modified`
  header.

If response headers match the request header criteria, then view rendering is
skipped. This saves your application generating a view, saving bandwidth and
time. When response headers match, an empty response is returned with a `304 Not Modified` status code.
