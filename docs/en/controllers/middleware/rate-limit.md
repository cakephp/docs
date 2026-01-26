# Rate Limiting Middleware

::: info Added in version 5.3
:::

The `RateLimitMiddleware` provides configurable rate limiting for your
application to protect against abuse and ensure fair usage of resources.

## Basic Usage

To use rate limiting in your application, add the middleware to your
middleware queue:

``` php
// In src/Application.php
use Cake\Http\Middleware\RateLimitMiddleware;

public function middleware(MiddlewareQueue $middlewareQueue): MiddlewareQueue
{
    $middlewareQueue
        // ... other middleware
        ->add(new RateLimitMiddleware([
            'limit' => 60,        // 60 requests
            'window' => 60,       // per 60 seconds
            'identifier' => RateLimitMiddleware::IDENTIFIER_IP,
        ]));

    return $middlewareQueue;
}
```

When a client exceeds the rate limit, they will receive a
`429 Too Many Requests` response.

## Constants

The middleware provides constants for common identifier and strategy values:

### Identifier Constants

- `RateLimitMiddleware::IDENTIFIER_IP` - Client IP address (default)
- `RateLimitMiddleware::IDENTIFIER_USER` - Authenticated user
- `RateLimitMiddleware::IDENTIFIER_ROUTE` - Route (controller/action combination)
- `RateLimitMiddleware::IDENTIFIER_API_KEY` - API key from token headers
- `RateLimitMiddleware::IDENTIFIER_TOKEN` - Alias for API key

### Strategy Constants

- `RateLimitMiddleware::STRATEGY_SLIDING_WINDOW` - Sliding window algorithm (default)
- `RateLimitMiddleware::STRATEGY_FIXED_WINDOW` - Fixed window algorithm
- `RateLimitMiddleware::STRATEGY_TOKEN_BUCKET` - Token bucket algorithm

## Configuration Options

The middleware accepts the following configuration options:

- **limit** - Maximum number of requests allowed (default: 60)
- **window** - Time window in seconds (default: 60)
- **identifier** - How to identify clients. Use identifier constants (default: `IDENTIFIER_IP`)
- **strategy** - Rate limiting algorithm. Use strategy constants (default: `STRATEGY_SLIDING_WINDOW`)
- **strategyClass** - Fully qualified class name of a custom rate limiter strategy. Takes precedence over `strategy` option
- **cache** - Cache configuration to use (default: 'default')
- **headers** - Whether to include rate limit headers in responses (default: true)
- **includeRetryAfter** - Whether to include Retry-After header in 429 responses (default: true)
- **message** - Custom error message for rate limit exceeded (default: 'Rate limit exceeded. Please try again later.')
- **ipHeader** - Header name(s) to check for client IP when behind a proxy (default: 'x-forwarded-for')
- **tokenHeaders** - Array of headers to check for API tokens (default: `['Authorization', 'X-API-Key']`)
- **skipCheck** - Callback to determine if a request should skip rate limiting
- **costCallback** - Callback to determine the cost of a request
- **identifierCallback** - Callback to determine the identifier for a request
- **limitCallback** - Callback to determine the limit for a specific identifier
- **keyGenerator** - Callback for custom cache key generation
- **limiters** - Array of named limiter configurations for different rate limit profiles
- **limiterResolver** - Callback to resolve which named limiter applies to a request

## Identifier Types

### IP Address

The default identifier type tracks requests by IP address:

``` php
use Cake\Http\Middleware\RateLimitMiddleware;

new RateLimitMiddleware([
    'identifier' => RateLimitMiddleware::IDENTIFIER_IP,
    'limit' => 100,
    'window' => 60,
])
```

The middleware automatically handles proxy headers. You can configure
which headers to check using the `ipHeader` option:

``` text
new RateLimitMiddleware([
    'identifier' => RateLimitMiddleware::IDENTIFIER_IP,
    'ipHeader' => ['CF-Connecting-IP', 'X-Forwarded-For'],
])
```

### User-based

Track requests per authenticated user:

``` text
new RateLimitMiddleware([
    'identifier' => RateLimitMiddleware::IDENTIFIER_USER,
    'limit' => 1000,
    'window' => 3600, // 1 hour
])
```

This requires authentication middleware to be loaded before rate limiting.
The middleware checks for users implementing `Authentication\IdentityInterface`.

### Route-based

Apply different limits to different routes:

``` text
new RateLimitMiddleware([
    'identifier' => RateLimitMiddleware::IDENTIFIER_ROUTE,
    'limit' => 10,
    'window' => 60,
])
```

This creates separate limits for each controller/action combination.

### API Key / Token

Track requests by API key or token:

``` text
new RateLimitMiddleware([
    'identifier' => RateLimitMiddleware::IDENTIFIER_API_KEY,
    'limit' => 5000,
    'window' => 3600,
])
```

By default, the middleware looks for tokens in the `Authorization` and
`X-API-Key` headers. You can customize which headers to check:

``` text
new RateLimitMiddleware([
    'identifier' => RateLimitMiddleware::IDENTIFIER_TOKEN,
    'tokenHeaders' => ['Authorization', 'X-API-Key', 'X-Auth-Token'],
])
```

## Custom Identifiers

You can create custom identifiers using a callback:

``` php
new RateLimitMiddleware([
    'identifierCallback' => function ($request) {
        // Custom logic to identify the client
        $tenant = $request->getHeader('X-Tenant-ID');
        return 'tenant_' . $tenant[0];
    },
])
```

## Rate Limiting Strategies

### Sliding Window

The default strategy that provides smooth rate limiting by continuously
adjusting the window based on request timing:

``` text
new RateLimitMiddleware([
    'strategy' => RateLimitMiddleware::STRATEGY_SLIDING_WINDOW,
])
```

### Fixed Window

Resets the counter at fixed intervals:

``` text
new RateLimitMiddleware([
    'strategy' => RateLimitMiddleware::STRATEGY_FIXED_WINDOW,
])
```

### Token Bucket

Allows for burst capacity while maintaining an average rate:

``` text
new RateLimitMiddleware([
    'strategy' => RateLimitMiddleware::STRATEGY_TOKEN_BUCKET,
    'limit' => 100,    // bucket capacity
    'window' => 60,    // refill rate
])
```

### Custom Strategy

You can use a custom rate limiter strategy by specifying the `strategyClass`
option. Your class must implement `Cake\Http\RateLimiter\RateLimiterInterface`:

``` text
new RateLimitMiddleware([
    'strategyClass' => App\RateLimiter\MyCustomRateLimiter::class,
])
```

The `strategyClass` option takes precedence over the `strategy` option.

## Named Limiters

For complex applications, you can define named limiter configurations
and resolve them dynamically per request:

``` php
new RateLimitMiddleware([
    'limiters' => [
        'default' => [
            'limit' => 60,
            'window' => 60,
        ],
        'api' => [
            'limit' => 1000,
            'window' => 3600,
        ],
        'premium' => [
            'limit' => 10000,
            'window' => 3600,
        ],
    ],
    'limiterResolver' => function ($request) {
        $user = $request->getAttribute('identity');
        if ($user && $user->plan === 'premium') {
            return 'premium';
        }
        if (str_starts_with($request->getPath(), '/api/')) {
            return 'api';
        }
        return 'default';
    },
])
```

## Advanced Usage

### Skip Rate Limiting

Skip rate limiting for certain requests:

``` php
new RateLimitMiddleware([
    'skipCheck' => function ($request) {
        // Skip rate limiting for health checks
        return $request->getParam('action') === 'health';
    },
])
```

### Request Cost

Assign different costs to different types of requests:

``` php
new RateLimitMiddleware([
    'costCallback' => function ($request) {
        // POST requests cost 5x more
        return $request->getMethod() === 'POST' ? 5 : 1;
    },
])
```

### Dynamic Limits

Set different limits for different users or plans:

``` php
new RateLimitMiddleware([
    'limitCallback' => function ($request, $identifier) {
        $user = $request->getAttribute('identity');
        if ($user && $user->plan === 'premium') {
            return 10000; // Premium users get higher limit
        }
        return 100; // Free tier limit
    },
])
```

### Custom Key Generation

Customize how cache keys are generated:

``` php
new RateLimitMiddleware([
    'keyGenerator' => function ($request, $identifier) {
        // Include the HTTP method in the key for per-method limits
        return $identifier . '_' . $request->getMethod();
    },
])
```

### Resetting Rate Limits

To programmatically reset a rate limit for a specific identifier, use the
`reset()` method on the rate limiter strategy directly. This is useful for:

- Admin actions to unblock users who were incorrectly rate-limited
- Resetting limits when a user upgrades their plan
- Clearing state between tests

``` php
use Cake\Cache\Cache;
use Cake\Http\RateLimit\SlidingWindowRateLimiter;

// Create a rate limiter with the same cache config as your middleware
$limiter = new SlidingWindowRateLimiter(Cache::pool('default'));

// Reset using the hashed identifier format
$identifier = 'rate_limit_' . hash('xxh3', $userId);
$limiter->reset($identifier);
```

> [!NOTE]
> The identifier format used internally is `'rate_limit_' . hash('xxh3', $value)`
> where `$value` is the raw identifier (IP address, user ID, etc.).

## Rate Limit Headers

When enabled, the middleware adds the following headers to responses:

- `X-RateLimit-Limit` - The maximum number of requests allowed
- `X-RateLimit-Remaining` - The number of requests remaining
- `X-RateLimit-Reset` - Unix timestamp when the rate limit resets

When a client exceeds the limit, a `Retry-After` header is also included
(controlled by the `includeRetryAfter` option).

## Multiple Rate Limiters

You can apply multiple rate limiters with different configurations:

``` php
// Strict limit for login attempts
$middlewareQueue->add(new RateLimitMiddleware([
    'identifier' => RateLimitMiddleware::IDENTIFIER_IP,
    'limit' => 5,
    'window' => 900, // 15 minutes
    'skipCheck' => function ($request) {
        return $request->getParam('action') !== 'login';
    },
]));

// General API rate limit
$middlewareQueue->add(new RateLimitMiddleware([
    'identifier' => RateLimitMiddleware::IDENTIFIER_API_KEY,
    'limit' => 1000,
    'window' => 3600,
]));
```

## Cache Configuration

The rate limiter stores its data in cache. Make sure you have a persistent
cache configured:

``` text
// In config/app.php
'Cache' => [
    'rate_limit' => [
        'className' => 'Redis',
        'prefix' => 'rate_limit_',
        'duration' => '+1 hour',
    ],
],
```

Then use it in the middleware:

``` text
new RateLimitMiddleware([
    'cache' => 'rate_limit',
])
```

> [!WARNING]
> The `File` cache engine is not recommended for production use with
> rate limiting as it may not handle concurrent requests properly.
