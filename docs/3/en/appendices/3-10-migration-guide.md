# 3.10 Migration Guide

CakePHP 3.10 is an API compatible upgrade from 3.8. This page outlines the
changes and improvements made.

To upgrade to 3.10.x run the following composer command:

``` bash
php composer.phar require --update-with-dependencies "cakephp/cakephp:3.10.*"
```

## Deprecations

No features were deprecated in 3.10

## Behavior Changes

While the following changes do not change the signature of any methods they do
change the semantics or behavior of methods.

### Validation

- `Validation::time()` will now reject a string if minutes are missing. Previously,
  this would accept hours-only digits although the api documentation showed minutes were required.

## New Features

- Improved API documentation.
- Backported improvements to `Validation::time()` from 4.x.
- `EmailTrait::assertMailSentFrom()` now accepts an array with an address
  & alias.
