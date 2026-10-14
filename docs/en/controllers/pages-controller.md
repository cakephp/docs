# The Pages Controller

CakePHP ships with a default controller `PagesController.php`. This is a
simple and optional controller for serving up static content. The home page
you see after installation is generated using this controller. If you make the
view file `templates/Pages/about_us.ctp` you can access it using the url
`https://example.com/pages/about_us`. You are free to modify the Pages
Controller to meet your needs.

The Pages Controller is part of your application, in
`src/Controller/PagesController.php`. It is included in the
[pieceofcake2/app](https://pieceofcake2.github.io/app/) skeleton, and when you
create a project with the [Bake plugin](https://pieceofcake2.github.io/bake/) it
is copied from the plugin's `Console/Templates/skel/Controller/` folder. In the
legacy `app/` layout, the controller is in `app/Controller/` and the page views
in `app/View/Pages/`.

::: info Changed in version 2.1
With CakePHP 2.0 the Pages Controller was part of `lib/Cake`. Since 2.1 the Pages Controller is no longer part of the core but ships in the app folder.
:::

> [!WARNING]
> Do not directly modify ANY file under `vendor/pieceofcake2/cakephp/`, where
> Composer installs the framework, to avoid issues when updating the core in
> future.
