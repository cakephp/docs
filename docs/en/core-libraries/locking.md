# Locking

`class` Cake\\Lock\\**Lock**

Locking helps you coordinate access to shared resources across concurrent
requests, CLI commands, queue workers, or background jobs. Use locks when you
need to ensure that only one process performs a critical section at a time.

CakePHP provides the `Cake\Lock\Lock` facade together with pluggable lock
engines for Redis, Memcached, local files, and no-op/testing usage.

## Configuring Lock Engines

Lock engine configurations are typically defined in **config/app.php**:

```php
'Lock' => [
    'default' => [
        'className' => 'Redis',
        'host' => '127.0.0.1',
        'port' => 6379,
        'prefix' => 'myapp_lock_',
        'ttl' => 60,
    ],
],
```

You can also configure lock engines at runtime:

```php
use Cake\Lock\Lock;

Lock::setConfig('orders', [
    'className' => 'Redis',
    'host' => '127.0.0.1',
    'port' => 6379,
    'prefix' => 'orders_',
    'ttl' => 30,
]);
```

Lock configurations use the same `className` conventions as other registry-based
CakePHP services:

```php
Lock::setConfig('default', ['className' => 'Redis']);
Lock::setConfig('default', ['className' => 'Cake\Lock\Engine\RedisLockEngine']);
```

If an engine cannot be initialized, CakePHP falls back to the noop
`NullLockEngine` and emits a warning.

## Acquiring and Releasing Locks

Use `Lock::acquire()` to attempt a non-blocking lock:

```php
use Cake\Lock\Lock;

$lock = Lock::acquire('invoice-' . $invoiceId, ttl: 60);
if ($lock === null) {
    return;
}

try {
    $this->Invoices->send($invoiceId);
} finally {
    $lock->release();
}
```

The returned `AcquiredLock` object represents the held lock. You can:

- call `release()` to release it explicitly
- call `refresh()` to extend the TTL for long-running work
- rely on its best-effort destructor cleanup if the handle is dropped

Explicit release is still recommended for predictable behavior.

## Preferred Usage with `synchronized()`

In many cases, `Lock::synchronized()` is the simplest and safest API because it
guarantees prompt release:

```php
$result = Lock::synchronized(
    'reports-daily',
    function () {
        return $this->Reports->buildDaily();
    },
    ttl: 120,
    timeout: 10,
);
```

If the lock cannot be acquired before the timeout expires, `synchronized()`
returns `null`.

## Blocking Acquisition

Use `Lock::acquireBlocking()` when you want to wait for a lock to become
available:

```php
$lock = Lock::acquireBlocking(
    'payment-' . $paymentId,
    ttl: 60,
    timeout: 10,
    retryInterval: 100,
);

if ($lock === null) {
    return;
}

try {
    $this->Payments->capture($paymentId);
} finally {
    $lock->release();
}
```

The `retryInterval` value is expressed in milliseconds.

## Inspecting and Managing Locks

CakePHP provides additional helper methods for lock lifecycle management:

```php
if (Lock::isLocked('imports-products')) {
    return;
}

$lock = Lock::acquire('imports-products');

if ($lock) {
    $lock->refresh(120);
    $lock->release();
}

Lock::forceRelease('imports-products');
```

- `isLocked()` performs a point-in-time check using the underlying engine
- `refresh()` extends the lock TTL if the current owner still holds the lock
- `forceRelease()` bypasses ownership checks and should only be used for
  administrative recovery flows

## Available Engines

CakePHP ships with the following lock engines:

- `Redis` Recommended for distributed systems and multi-node deployments
- `Memcached` Suitable when Memcached is already part of your infrastructure
- `File` Useful for single-server deployments using local filesystem locks
- `Null` Useful for tests, local development, and intentional no-op behavior

### Shared Engine Options

All lock engines support these common options:

- `prefix` Prefix added to lock keys
- `ttl` Default lock time-to-live in seconds

### RedisLockEngine Options

- `host` Redis server host
- `port` Redis server port
- `password` Redis password
- `database` Redis database index
- `timeout` Connection timeout
- `persistent` Whether to use persistent connections

### MemcachedLockEngine Options

- `servers` Array of Memcached servers
- `persistent` Persistent connection identifier

### FileLockEngine Options

- `path` Directory used to store lock files

The `FileLockEngine` is local to a single host. Unlike Redis or Memcached, it
does not provide true TTL-based expiration in the backend. Locks are normally
released explicitly, when the lock handle is destroyed, or when the process
terminates.
