# Maintained Plugins

The [Piece of Cake 2](https://github.com/pieceofcake2) project maintains the
framework fork together with related repositories and forks of popular
CakePHP 2 plugins. All maintained plugins are compatible with PHP 8.x.

## Core repositories

- [CakePHP](https://github.com/pieceofcake2/cakephp) - CakePHP 2.x framework
- [App Skeleton](https://github.com/pieceofcake2/app) - Application skeleton
- [Plugin Skeleton](https://github.com/pieceofcake2/plugin) - Plugin skeleton
- [Bake Plugin](https://github.com/pieceofcake2/bake) - Code generation tool
- [Upgrade Plugin](https://github.com/pieceofcake2/upgrade) - Upgrade utility (CakePHP 1.3 to 2.0)

## Development tools

- [PHPStan CakePHP](https://github.com/pieceofcake2/phpstan-cakephp2) - PHPStan extension for static analysis

## Maintained plugins

### Debugging

- [DebugKit Plugin](https://github.com/pieceofcake2/debug_kit) - Debug toolbar
  ([documentation](https://github.com/pieceofcake2/debug_kit/blob/2.x/docs/README.md))

### Infrastructure

- [Aws Plugin](https://github.com/pieceofcake2/aws) - AWS SDK integration
- [Bref Plugin](https://github.com/pieceofcake2/bref) - AWS Lambda deployment with Bref

### Logging & Monitoring

- [Monolog Plugin](https://github.com/pieceofcake2/monolog) - Monolog integration
- [Sentry Plugin](https://github.com/pieceofcake2/sentry) - Error tracking and monitoring

### Templating

- [TwigView Plugin](https://github.com/pieceofcake2/twig-view) - Twig template engine
- [CsvView Plugin](https://github.com/pieceofcake2/csv-view) - CSV view class

### View Helpers

- [Markdown Plugin](https://github.com/pieceofcake2/markdown) - Markdown helper
- [MenuBuilder Plugin](https://github.com/pieceofcake2/menu_builder) - Navigation menu helper
- [Vite Plugin](https://github.com/pieceofcake2/vite) - Vite asset helper with dev server support
- [WebpackEncore Plugin](https://github.com/pieceofcake2/webpack-encore) - Webpack Encore asset helper

### Forms & Validation

- [Xform Plugin](https://github.com/pieceofcake2/xform) - Extended form helper
- [Cakeplus Plugin](https://github.com/pieceofcake2/cakeplus) - Form utilities and enhancements

### Database

- [Datasources Plugin](https://github.com/pieceofcake2/datasources) - Additional datasources (CSV / TSV files, arrays and more)

### Authentication and Authorization

- [Authenticate Plugin](https://github.com/pieceofcake2/authenticate) - Authentication classes
- [AclExtras Plugin](https://github.com/pieceofcake2/acl_extras) - Console tools for managing ACL tables

### Files

- [Upload Plugin](https://github.com/pieceofcake2/upload) - File upload handling
- [Imagine Plugin](https://github.com/pieceofcake2/imagine) - Image processing library wrapper
- [CakePdf Plugin](https://github.com/pieceofcake2/cakepdf) - PDF generation

### SEO

- [Seo Plugin](https://github.com/pieceofcake2/seo) - Search engine optimization
- [Sitemap Plugin](https://github.com/pieceofcake2/sitemap) - Sitemap generation

### I18n

- [Localized Plugin](https://github.com/pieceofcake2/localized) - Localization utilities

## Installing a plugin

Install plugins with Composer and load them as usual with `CakePlugin::load()`.
See each repository's README for the package name and setup. With the
[modern layout](/appendices/migrating-to-the-modern-layout), Composer installs plugins
into `plugins/` through the `installer-paths` setting.

Plugins that don't support Composer autoloading still need `App::uses()` for
their classes, for example `App::uses('MyPluginHelper', 'MyPlugin.View/Helper')`.

## Contributing

The project welcomes bug reports (especially PHP 8.x compatibility issues),
security vulnerability reports and pull requests.
