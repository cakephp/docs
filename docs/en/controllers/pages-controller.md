# The Pages Controller

CakePHP ships with a default controller `PagesController.php`. This is a
simple and optional controller for serving up static content. The home page
you see after installation is generated using this controller. If you make the
view file `app/View/Pages/about_us.ctp` you can access it using the url
`http://example.com/pages/about_us`. You are free to modify the Pages
Controller to meet your needs.

When you "bake" an app using CakePHP's console utility the Pages Controller is
created in your `app/Controller/` folder. You can also copy the file from
`lib/Cake/Console/Templates/skel/Controller/PagesController.php`.

::: pieceofcake2
In the pieceofcake2 fork, `lib/Cake/Console/Templates/skel/` no longer exists. Copy
`PagesController.php` from the Bake plugin's `Console/Templates/skel/Controller/` or from the
[pieceofcake2/app](https://github.com/pieceofcake2/app) skeleton. In the modern layout the
controller goes in `src/Controller/` and page views in `templates/Pages/` (e.g. `templates/Pages/about_us.ctp`).
The framework itself is installed in `vendor/pieceofcake2/cakephp/` by Composer; do not modify it either.
:::

::: info Changed in version 2.1
With CakePHP 2.0 the Pages Controller was part of `lib/Cake`. Since 2.1 the Pages Controller is no longer part of the core but ships in the app folder.
:::

> [!WARNING]
> Do not directly modify ANY file under the `lib/Cake` folder to avoid
> issues when updating the core in future.
