# Semantic Versioning

See [CakePHP Development Process](../appendices/cakephp-development-process.md) and the [Backwards Compatibility Guide](../contributing/backwards-compatibility)

## CakePHP Supported Versions

This table was last updated in February 2026.

| Major Version | Supported Version | PHP-Version    | Active Support | Security Support     |
|---------------|-------------------|----------------|----------------|----------------------|
| `5.x`         | `5.1` to `5.3`    | `8.1` to `8.5` | `5.3+`         | ✅                    |
| `4.x`         | `4.4` to `4.6`    | `7.2` to `8.3` | ❌              | September 10th, 2026 |
| `3.x`         | None              | `5.6` to `7.4` | ❌              | ❌                    |
| `2.x`         | None              | `5.4` to `7.4` | ❌              | ❌                    |
| `1.x`         | None              | `¯\_(ツ)_/¯`    | ❌              | ❌                    |

### Major Version Support

We follow the rule to support the previous major version for

- 24 months of `active support` (includes new features and bugfixes) and
- 36 months of `security support`

after the release of a new major version.

E.g. [CakePHP 5.0](https://github.com/cakephp/cakephp/releases/tag/5.0.0) released on September 10th 2023,
so we will support CakePHP 4.x until September 10th 2025 and provide security updates until September 10th 2026.

### Minor Version Support

`Active support` for a minor branch ends the moment a new minor branch is released.
E.g. when CakePHP 5.2 is released, active support for CakePHP 5.1 will end and only security updates will be provided.

`Security updates` will be provided

- till the end of the support period for the major version, or
- 3 new minor releases have been published (e.g. `5.2` support ended when `5.5` was released)

whichever comes first.

> [!TIP]
> Keep production applications on a currently supported major line and plan
> regular upgrades to stay within supported minor ranges.

> [!TIP]
> Each minor and major release of CakePHP includes automated upgrade commands which you
> can use to upgrade your application or plugin. See e.g. the
> [upgrade guide](../appendices/5-0-upgrade-guide.md#use-the-upgrade-tool)
> for more details on how to use these commands.
