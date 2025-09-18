# 4.6 Migration Guide

CakePHP 4.6 is an API compatible upgrade from 4.0. This page outlines the
deprecations and features added in 4.6.

## Upgrading to 4.6.0

You can can use composer to upgrade to CakePHP 4.6.0:

    php composer.phar require --update-with-dependencies "cakephp/cakephp:^4.6"

> [!NOTE]
> CakePHP 4.6 requires PHP 7.4 or greater.

## New Features

### Cache

- `RedisEngine` now supports a `tls` option that enables connecting to redis
  over a TLS connection. You can use the `ssl_ca`, `ssl_cert` and
  `ssl_key` options to define the TLS context for redis.

### Console

- Optional `Command` arguments can now have a `default` value.

### I18n

- `Number::formatter()` and `currency()` now accept a `roundingMode`
  option to override how rounding is done.

### View

- `NumberHelper::format()` now accepts a `roundingMode` option to override how
  rounding is done.
