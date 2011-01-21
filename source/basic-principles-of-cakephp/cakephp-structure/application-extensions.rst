2.1.4 Application Extensions
----------------------------

Controllers, helpers and models each have a parent class you can
use to define application-wide changes. AppController (located at
/app/app\_controller.php), AppHelper (located at
/app/app\_helper.php) and AppModel (located at /app/app\_model.php)
are great places to put methods you want to share between all
controllers, helpers or models.

Although they aren’t classes or files, routes play a role in
requests made to CakePHP. Route definitions tell CakePHP how to map
URLs to controller actions. The default behavior assumes that the
URL “/controller/action/var1/var2” maps to
Controller::action($var1, $var2), but you can use routes to
customize URLs and how they are interpreted by your application.

Some features in an application merit packaging as a whole. A
plugin is a package of models, controllers and views that
accomplishes a specific purpose that can span multiple
applications. A user management system or a simplified blog might
be a good fit for CakePHP plugins.

2.1.4 Application Extensions
----------------------------

Controllers, helpers and models each have a parent class you can
use to define application-wide changes. AppController (located at
/app/app\_controller.php), AppHelper (located at
/app/app\_helper.php) and AppModel (located at /app/app\_model.php)
are great places to put methods you want to share between all
controllers, helpers or models.

Although they aren’t classes or files, routes play a role in
requests made to CakePHP. Route definitions tell CakePHP how to map
URLs to controller actions. The default behavior assumes that the
URL “/controller/action/var1/var2” maps to
Controller::action($var1, $var2), but you can use routes to
customize URLs and how they are interpreted by your application.

Some features in an application merit packaging as a whole. A
plugin is a package of models, controllers and views that
accomplishes a specific purpose that can span multiple
applications. A user management system or a simplified blog might
be a good fit for CakePHP plugins.
