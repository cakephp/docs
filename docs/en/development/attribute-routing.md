---
title: "Attribute Routing"
description: "Define CakePHP routes directly on controllers using PHP attributes: route actions with #[Get], #[Post], and more, configure scopes, prefixes, middleware, REST resources, and combine with config-based routing."
---

# Attribute Routing

CakePHP supports defining routes directly on controller classes and actions
using PHP attributes. This keeps your route definitions co-located with the code
they map to, reducing the need to switch between controllers and
**config/routes.php**.

Attribute routing is **fully optional**. You can use config-based routing,
attribute routing, or a mix of both. Existing config-based routes continue to work
unchanged.

::: info Added in version 6.0.0
Attribute routing was added.
:::

## Getting Started

Attribute routing relies on the `AttributeResolver` to discover attributes on
your controller classes. Enable it in your **config/routes.php**:

```php
// config/routes.php
use Cake\Routing\Route\DashedRoute;
use Cake\Routing\RouteBuilder;

/** @var \Cake\Routing\RouteBuilder $routes */
$routes->connectAttributes();

$routes->scope('/', callback: function (RouteBuilder $routes) {
    // Config-based routes continue to work alongside attribute routes.
    $routes->fallbacks(DashedRoute::class);
});
```

`connectAttributes()` scans your controllers for routing attributes and
connects them. After that, define routes on your controller using attributes:

```php
<?php
declare(strict_types=1);

namespace App\Controller;

use Cake\Routing\Attribute\Get;
use Cake\Routing\Attribute\Scope;

#[Scope('/articles', namePrefix: 'articles:')]
class ArticlesController extends AppController
{
    #[Get('/', name: 'index')]
    public function index(): void
    {
        // Matches GET /articles
    }

    #[Get('/{id}', name: 'view')]
    public function view(string $id): void
    {
        // Matches GET /articles/123
    }
}
```

That's it. The `#[Scope]` attribute sets a path prefix for all routes in
the controller. The `#[Get]` attribute maps each action to a URL path and HTTP
method.

## Choosing Your Approach

You have three options for defining routes in CakePHP:

| Approach | Where routes live | Best for |
|---|---|---|
| **Config-based only** | `config/routes.php` | Full control over route order, complex routing logic |
| **Attribute-based only** | Controller classes | Convention-driven apps, co-located route definitions |
| **Mixed** | Both | Gradual migration, or general routes in files with specific routes as attributes |

All three approaches produce the same route objects internally. The examples
below show common patterns in both styles so you can compare:

::: code-group

```php [Attributes]
#[Scope('/articles', namePrefix: 'articles:')]
class ArticlesController extends AppController
{
    #[Get('/', name: 'index')]
    public function index(): void {}

    #[Get('/{id}', name: 'view', patterns: ['id' => '\d+'])]
    public function view(int $id): void {}
}
```

```php [Config-based]
// config/routes.php
$routes->scope('/articles', callback: function (RouteBuilder $routes) {
    $routes->get('/', target: 'Articles::index', name: 'articles:index');
    $routes->get('/{id}',
        target: 'Articles::view',
        name: 'articles:view',
    )->setPatterns(['id' => '\d+'])->setPass(['id']);
});
```

:::

## Route Attributes

### Route

`#[Route]` is the base attribute for defining a route on a controller action.
All HTTP method shortcut attributes extend from it.

```php
use Cake\Routing\Attribute\Route;

#[Route('/search', name: 'search', methods: ['GET', 'POST'])]
public function search(): void
{
}
```

`#[Route]` accepts the following parameters:

| Parameter | Type | Description |
|---|---|---|
| `path` | `string` | Route path template (required). Supports `{placeholder}` syntax. |
| `name` | `string\|null` | Named route identifier. Prefixed by any `#[Scope]` `namePrefix`. |
| `methods` | `array` | HTTP methods this route responds to. Empty = all methods. |
| `patterns` | `array` | Regex patterns for route placeholders, e.g. `['id' => '\d+']`. |
| `defaults` | `array` | Additional default route values. |
| `pass` | `array\|null` | Placeholder names passed as action arguments. `null` = auto-infer from path. |
| `persist` | `array` | Parameters that persist across URL generation. |
| `host` | `string\|null` | Restrict the route to a specific hostname pattern. |
| `routeClass` | `string\|null` | Override the route class for this specific route. |

### HTTP Method Shortcuts

For common cases, use the method-specific shortcut attributes instead of
specifying `methods` on `#[Route]`:

| Attribute | HTTP Method |
|---|---|
| `#[Get]` | GET |
| `#[Post]` | POST |
| `#[Put]` | PUT |
| `#[Patch]` | PATCH |
| `#[Delete]` | DELETE |
| `#[Options]` | OPTIONS |
| `#[Head]` | HEAD |

These accept the same parameters as `#[Route]` except for `methods`.

::: code-group

```php [Method shortcuts]
use Cake\Routing\Attribute\Get;
use Cake\Routing\Attribute\Post;

#[Get('/articles', name: 'list')]
#[Post('/articles', name: 'create')]
public function index(): void {}
```

```php [Generic Route]
use Cake\Routing\Attribute\Route;

#[Route('/articles', name: 'list', methods: ['GET'])]
#[Route('/articles', name: 'create', methods: ['POST'])]
public function index(): void {}
```

:::

### Multiple Routes on One Action

All route attributes are repeatable. A single action can respond to multiple
routes or HTTP methods:

```php
use Cake\Routing\Attribute\Get;
use Cake\Routing\Attribute\Post;

#[Get('/articles', name: 'index')]
#[Post('/articles', name: 'index-post')]
public function index(): void
{
    // Handles both GET and POST on /articles
}
```

## Controller-Level Attributes

Controller-level attributes configure shared behavior for all routes defined on
the controller.

### Scope {#scope}

`#[Scope]` sets a path prefix, name prefix, and shared defaults for all routes
in the controller. It is repeatable and stacks across class inheritance.

```php
use Cake\Routing\Attribute\Scope;

#[Scope('/api/v1', namePrefix: 'api:v1:')]
class ArticlesController extends AppController
{
    #[Get('/articles', name: 'articles')]
    public function index(): void
    {
        // Matches /api/v1/articles, named "api:v1:articles"
    }
}
```

`#[Scope]` parameters:

| Parameter | Type | Description |
|---|---|---|
| `path` | `string` | Path prefix prepended to all route paths. |
| `namePrefix` | `string` | Prefix prepended to all route names. |
| `defaults` | `array` | Default route values merged into every route. |
| `patterns` | `array` | Shared regex patterns for placeholders. |
| `host` | `string\|null` | Restrict all routes to a hostname pattern. |

### Prefix {#prefix}

CakePHP automatically derives a routing prefix from the controller's namespace.
For example, `App\Controller\Admin\UsersController` gets prefix `Admin` and
path `/admin` automatically.

Use `#[Prefix]` to override this behavior:

```php
use Cake\Routing\Attribute\Prefix;
use Cake\Routing\Attribute\Get;

#[Prefix('Admin', path: '/backend')]
class DashboardController extends AppController
{
    #[Get('/dashboard', name: 'admin-dashboard')]
    public function index(): void
    {
        // Matches /backend/dashboard with prefix 'Admin'
    }
}
```

| Parameter | Type | Description |
|---|---|---|
| `name` | `string` | The routing prefix name. |
| `path` | `string\|null` | Override the URL path segment. Defaults to the dasherized namespace path. |

### Middleware {#middleware}

Apply middleware to all routes on a controller, or to specific actions:

```php
use Cake\Routing\Attribute\Get;
use Cake\Routing\Attribute\Middleware;

#[Middleware('csrf', 'auth')]
class ArticlesController extends AppController
{
    #[Get('/articles', name: 'index')]
    public function index(): void
    {
        // Has csrf + auth middleware
    }

    #[Get('/articles/{id}', name: 'view')]
    #[Middleware('rate-limit')]
    public function view(int $id): void
    {
        // Has csrf + auth + rate-limit middleware
    }
}
```

Middleware is merged in order: RouteBuilder-level, then class-level, then
method-level. String middleware names are deduplicated; closures are always
kept.

::: tip
`#[Middleware]` references middleware names or groups registered with
`$routes->registerMiddleware()` in your **config/routes.php**. See
[Route Scoped Middleware](../development/routing#route-scoped-middleware) for
details on registering middleware.
:::

#### Inline Closure Middleware (PHP 8.5+)

Starting with PHP 8.5, closures are supported in attributes. This means you can
define inline middleware directly on a controller or action without registering
it in your routes file first:

```php
use Cake\Routing\Attribute\Middleware;
use Cake\Routing\Attribute\Scope;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

#[Scope(path: '/api')]
#[Middleware(static function (ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface {
    $response = $handler->handle($request);

    return $response->withHeader('X-Api-Version', '1.0');
})]
class ApiController extends AppController
{
}
```

Closure middleware receives the standard PSR-15 `ServerRequestInterface` and
`RequestHandlerInterface` arguments. Unlike string-based middleware, closures are
never deduplicated — each closure is always applied.

::: warning
Inline closure middleware requires **PHP 8.5 or higher**. On earlier PHP
versions, using closures in attributes will result in a parse error.
:::

### Extensions {#extensions}

Define which file extensions a controller's routes should parse:

```php
use Cake\Routing\Attribute\Extensions;
use Cake\Routing\Attribute\Get;

#[Extensions(['json', 'xml'])]
class ArticlesController extends AppController
{
    #[Get('/articles', name: 'index')]
    public function index(): void
    {
        // Matches /articles.json, /articles.xml
    }

    #[Get('/articles/feed', name: 'feed')]
    #[Extensions(['xml'])]
    public function feed(): void
    {
        // Only matches /articles/feed.xml (method-level overrides class-level)
    }
}
```

### RouteClass {#routeclass}

Set the default route class for all attribute routes on a controller:

```php
use Cake\Routing\Attribute\RouteClass;
use Cake\Routing\Route\InflectedRoute;

#[RouteClass(InflectedRoute::class)]
class LegacyController extends AppController
{
    // All attribute routes on this controller use InflectedRoute
}
```

Individual routes can still override this with the `routeClass` parameter on
`#[Route]`.

## Resource Routes {#resource-routes}

The `#[Resource]` attribute generates RESTful routes, equivalent to calling
`$routes->resources()` in a routes file:

::: code-group

```php [Attributes]
use Cake\Routing\Attribute\Resource;

#[Resource(only: ['index', 'view'])]
class ArticlesController extends AppController
{
}
```

```php [Config-based]
// config/routes.php
$routes->scope('/', callback: function (RouteBuilder $routes) {
    $routes->resources('Articles', ['only' => ['index', 'view']]);
});
```

:::

Both produce the same routes:

| HTTP Method | URL | Action |
|---|---|---|
| GET | `/articles` | `index` |
| GET | `/articles/{id}` | `view` |

`#[Resource]` parameters:

| Parameter | Type | Description |
|---|---|---|
| `path` | `string\|null` | Override the resource URL path. |
| `only` | `array` | Limit which REST actions to generate. |
| `actions` | `array` | Map REST actions to custom controller methods. |
| `map` | `array` | Define additional non-standard resource routes. |
| `prefix` | `string\|null` | Prefix for nested resource routes. |
| `id` | `string` | Regex pattern for the resource identifier (default: `[0-9]+`). |
| `inflect` | `string` | Inflection method for path generation (default: `dasherize`). |
| `connectOptions` | `array` | Additional options passed to `connect()`. |

`#[Resource]` inherits class-level `#[Scope]`, `#[Middleware]`, `#[Extensions]`,
and `#[RouteClass]` settings.

## Route Parameters

### Placeholders and Named Arguments {#placeholders}

When a route path contains `{placeholder}` elements, they are automatically
passed as arguments to the controller action. Parameter names are matched to
action argument names:

```php
#[Get('/articles/{id}', name: 'view')]
public function view(int $id): void
{
    // GET /articles/42 → $id = 42
}
```

With multiple placeholders, argument binding is by name — the order of action
parameters does not need to match the URL order:

```php
#[Get('/articles/{slug}/{id}', name: 'view')]
public function view(int $id, string $slug): void
{
    // GET /articles/my-post/42 → $id = 42, $slug = 'my-post'
    // Arguments are matched by name, not position
}
```

This is different from config-based routing where passed parameters are matched
positionally. Named argument binding is automatic for attribute routes.

### Explicit Pass Parameters

You can control explicitly which placeholders are passed as arguments, and in
which order, using the `pass` parameter:

```php
#[Route('/view/{id}', name: 'view', patterns: ['id' => '\d+'], pass: ['id'])]
public function view(int $id): void
{
}
```

Set `pass` to an empty array to prevent any placeholders from being passed as
action arguments:

```php
#[Route('/page/{slug}', name: 'page', pass: [])]
public function display(): void
{
    // Access slug via $this->request->getParam('slug') instead
}
```

When `pass` is not specified (or `null`), all placeholders are automatically
inferred and passed in the order they appear in the path.

### Patterns

Constrain placeholder values with regex patterns:

```php
#[Get('/articles/{id}', name: 'view', patterns: ['id' => '\d+'])]
public function view(int $id): void
{
    // Only matches numeric IDs
}
```

Patterns can also be set at the scope level to apply to all routes in a
controller:

```php
#[Scope('/articles', patterns: ['id' => '\d+'])]
class ArticlesController extends AppController
{
    #[Get('/{id}', name: 'view')]
    public function view(int $id): void {}

    #[Get('/{id}/edit', name: 'edit')]
    public function edit(int $id): void {}
}
```

### Host Restrictions

Restrict routes to specific hostnames at the scope or route level:

```php
#[Scope('/api', host: 'api.example.com')]
class ApiController extends AppController
{
    #[Get('/status', name: 'status')]
    public function status(): void
    {
        // Only matches requests to api.example.com/api/status
    }
}
```

### Persistent Parameters

Persistent parameters carry forward automatically during URL generation:

```php
#[Route('/{lang}/articles', name: 'articles', persist: ['lang'])]
public function index(): void
{
}
```

## Combining with Config-Based Routes {#combining}

Attribute routes and config-based routes coexist. The `connectAttributes()` call
connects attribute routes at the position it appears in your routes file:

```php
// config/routes.php

// Attribute routes are connected first
$routes->connectAttributes();

// Config-based routes follow
$routes->scope('/', callback: function (RouteBuilder $routes) {
    $routes->connect('/pages/*', defaults: ['controller' => 'Pages', 'action' => 'display']);
    $routes->fallbacks(DashedRoute::class);
});
```

::: warning
Route order matters. Routes connected first are matched first. Place
`connectAttributes()` before or after your config-based routes depending on which
should take priority.
:::

### Attribute Collection Order

When route priority is important, it helps to separate two concepts:

- **Collection order**: how attributes are discovered on controllers/actions.
- **Match order**: the order routes are connected in the route collection.

`connectAttributes()` discovers attribute routes and connects them immediately.
Those connected routes then participate in normal first-match routing, just like
config-based routes.

Within inheritance, parent and child controller attributes are merged according
to the inheritance rules described in [Inheritance](#inheritance).

If you have overlapping route patterns where precedence matters, do not rely on
implicit discovery details alone. Prefer one of these approaches:

- Define the conflicting routes explicitly in **config/routes.php** where order is
    obvious.
- Use stricter `patterns` so only one route can match a given URL.
- Place `connectAttributes()` before or after config-based routes to set global
    precedence.

Use `bin/cake routes` to inspect the final connected routes and verify match
priority.

### Using connectAttributes() Inside a Scope

When `connectAttributes()` is called inside a scope, all discovered attribute
routes are connected within that scope's path:

```php
$routes->scope('/admin', callback: function (RouteBuilder $routes) {
    $routes->connectAttributes();
});
```

In this case, a controller with `#[Scope('/articles')]` would have its routes
connected under `/admin/articles/...`. This is useful for constraining where
attribute routes are mounted.

### Resolver Configuration

`connectAttributes()` accepts a resolver configuration name. By default it uses
`'default'`. You can define multiple resolver configurations to scan different
sets of controllers:

```php
// Connect routes from different resolver configs
$routes->connectAttributes('api');
$routes->connectAttributes('default');
```

## Inheritance {#inheritance}

Attribute routing supports class inheritance. Attributes on parent classes are
inherited by child controllers:

```php
#[Scope(path: '/base', namePrefix: 'base:')]
#[Middleware('auth')]
abstract class BaseApiController extends AppController
{
    #[Get('/health', name: 'health')]
    public function health(): void {}
}

#[Scope(path: '/v1', namePrefix: 'v1:')]
class UsersController extends BaseApiController
{
    #[Get('/users', name: 'users')]
    public function index(): void {}
}
```

This produces:

| Route | Name | Path | Middleware |
|---|---|---|---|
| `health` | `base:v1:health` | `/base/v1/health` | `auth` |
| `users` | `base:v1:users` | `/base/v1/users` | `auth` |

Key inheritance behaviors:

- `#[Scope]` attributes **stack** — parent and child scope paths and name
  prefixes are concatenated.
- `#[Middleware]` attributes **merge** — parent middleware is applied first, then
  child middleware is added.
- `#[Extensions]` on the child **replaces** the parent's extensions.
- `#[Prefix]` on the child **overrides** any namespace-derived or parent prefix.
- `#[RouteClass]` on the child **overrides** the parent's route class.
- Abstract controller classes are automatically skipped (their routes are only
  connected through concrete subclasses).
- Only `public` methods are considered. Methods starting with `__` are ignored.

## Attribute Reference {#reference}

### Method-Level Attributes

| Attribute | Target | Repeatable | Description |
|---|---|---|---|
| `#[Route]` | Method | Yes | Define a route with any HTTP method(s) |
| `#[Get]` | Method | Yes | GET-only route |
| `#[Post]` | Method | Yes | POST-only route |
| `#[Put]` | Method | Yes | PUT-only route |
| `#[Patch]` | Method | Yes | PATCH-only route |
| `#[Delete]` | Method | Yes | DELETE-only route |
| `#[Options]` | Method | Yes | OPTIONS-only route |
| `#[Head]` | Method | Yes | HEAD-only route |
| `#[Middleware]` | Class + Method | Yes | Apply middleware |
| `#[Extensions]` | Class + Method | No | Set parsed file extensions |

### Class-Level Attributes

| Attribute | Repeatable | Description |
|---|---|---|
| `#[Scope]` | Yes | Path prefix, name prefix, shared defaults, patterns, host |
| `#[Prefix]` | No | Override routing prefix name and path |
| `#[RouteClass]` | No | Default route class for all routes |
| `#[Middleware]` | Yes | Apply middleware to all routes |
| `#[Extensions]` | No | Default file extensions for all routes |
| `#[Resource]` | No | Generate RESTful resource routes |

All attributes are in the `Cake\Routing\Attribute` namespace.
