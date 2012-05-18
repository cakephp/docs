5 Configuration
---------------

Database Configuration
~~~~~~~~~~~~~~~~~~~~~~

Your **app/config/database.php** file is where your database
configuration all takes place. A fresh install doesn't have a
**database.php**, so you'll need to make a copy of
**database.php.default**. Once you've made a copy and renamed it you'll
see the following:

app/config/database.php
~~~~~~~~~~~~~~~~~~~~~~~

::

    var $default = array('driver'   => 'mysql',
                         'connect'  => 'mysql_connect',
                         'host'     => 'localhost',
                         'login'    => 'user',
                         'password' => 'password',
                         'database' => 'project_name',
                         'prefix'   => '');

Replace the information provided by default with the database connection
information for your application.

One note about the prefix key: the string you enter there will be
prepended to any SQL call that Cake makes to your database when working
with tables. You define it here once so you don't have to specify it in
other places. It also allows you to follow Cake's table naming
conventions if you're on a host that only gives you a single database.
Note: for HABTM join tables, you only add the prefix once:
prefix\_apples\_bananas, not prefix\_apples\_prefix\_bananas.

CakePHP supports the following database drivers:

#. mysql

#. postgres

#. sqlite

#. pear-**drivername** (so you might enter pear-mysql, for example)

#. adodb-**drivername**

The 'connect' key in the **$default** connection allows you to specify
whether or not the database connection will be treated as persistent or
not. Read the comments in the database.php.default file for help on
specifying connection types for your database setup.

Your database tables should also follow the following conventions:

#. Table names used by Cake should consist of English words in plural,
   like "users", "authors" or "articles". Note that corresponding models
   have singular names.

#. Your tables must have a primary key named 'id'.

#. If you plan to relate tables, use foreign keys that look like:
   'article\_id'. The table name is singular, followed by an underscore,
   followed by 'id'.

#. If you include a 'created' and/or 'modified' column in your table,
   Cake will automatically populate the field when appropriate.

You'll also notice that there is a $test connection setting included in
the database.php file. Fill out this configuration (or add other
similarly formatted configurations) and use it in your application by
placing something like:

::

    var $useDbConfig = 'test';

Inside one of your models. You can add any number of additional
connection settings in this manner.

Global Configuration
~~~~~~~~~~~~~~~~~~~~

CakePHP's global configuration can be found in **app/config/core.php**.
While we really dislike configuration files, it just had to be done.
There are a few things you can change here, and the notes on each of
these settings can be found within the comments of the **core.php**
file.

DEBUG: Set this to different values to help you debug your application
as you build it. Specifying this setting to a non-zero value will force
Cake to print out the results of pr( ) and debug( ) function calls, and
stop flash messages from forwarding automatically. Setting it to 2 or
higher will result in SQL statements being printed at the bottom of the
page.

Also when in debug mode (where DEBUG is set to 1 or higher), Cake will
render certain generated error pages, i.e. "Missing Controller,"
"Missing Action," etc. In production mode, however (where DEBUG is set
to 0), Cake renders the "Not Found" page, which can be overridden in
**app/views/errors/error404.thtml**.

CAKE\_SESSION\_COOKIE: Change this value to the name of the cookie you'd
like to use for user sessions in your Cake app.

CAKE\_SECURITY: Change this value to indicate your preferred level of
sessions checking. Cake will timeout sessions, generate new session ids,
and delete old session files based on the settings you provide here. The
possible values are:

#. high: sessions time out after 20 minutes of inactivity, and session
   id's are regenerated on each request

#. medium: sessions time out after 200 minutes of inactivity

#. low: sessions time out after 600 minutes of inactivity

CAKE\_SESSION\_SAVE: Specify how you'd like session data saved. Possible
values are:

#. cake: Session data is saved in tmp/ inside your Cake installation

#. php: Session data saved as defined in php.ini

#. database: Session data saved to database connection defined by the
   'default' key.

Routes Configuration
~~~~~~~~~~~~~~~~~~~~

"Routing" is a pared-down pure-PHP mod\_rewrite-alike that can map URLs
to controller/action/params and back. It was added to Cake to make
pretty URLs more configurable and to divorce us from the mod\_rewrite
requirement. Using mod\_rewrite, however, will make your address bar
look much more tidy.

Routes are individual rules that map matching URLs to specific
controllers and actions. Routes are configured in the
**app/config/routes.php** file. They are set-up like this:

Route Pattern
~~~~~~~~~~~~~

::

    <?php
    $Route->connect (
        'URL',
        array('controller'=>'controllername',
        'action'=>'actionname', 'firstparam')
    );
    ?>

Where:

#. **URL** is the regular expression Cake URL you wish to map,

#. **controllername** is the name of the controller you wish to invoke,

#. **actionname** is the name of the controller's action you wish to
   invoke,

#. and **firstparam** is the value of the first parameter of the action
   you've specified.

Any parameters following **firstparam** will also be passed as
parameters to the controller action.

The following example joins all the urls in /blog to the BlogController.
The default action will be BlogController::index().

Route Example
~~~~~~~~~~~~~

::

    <?php
    $Route->connect ('/blog/:action/*', array('controller'=>'Blog', 'action'=>'index'));
    ?>

A URL like /blog/history/05/june can then be handled like this:

Route Handling in a Controller
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

::

    <?php
    class BlogController extends AppController
    {
     function history ($year, $month=null)
     {
       // .. Display appropriate content
     }
    }
    ?>

The 'history' from the URL was matched by :action from the Blog's route.
URL elements matched by \* are passed to the active controller's
handling method as parameters, hence the $year and $month. Called with
URL /blog/history/05, history() would only be passed one parameter, 05.

The following example is a default CakePHP route used to set up a route
for PagesController::display('home'). Home is a view which can be
overridden by creating the file **/app/views/pages/home.thtml**.

Setting the Default Route
~~~~~~~~~~~~~~~~~~~~~~~~~

::

    <?php
    $Route->connect ('/', array('controller'=>'Pages', 'action'=>'display', 'home'));
    ?>

Advanced Routing Configuration: Admin Routing and Webservices
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

There are some settings in /app/config/core.php you can take advantage
of in order to organize your application and craft URLs that make the
most sense to you and your users.

The first of these is admin routing. If your application has a
ProductsController as well as a NewsController, you might want to set up
some special URLs so users with administrative privileges can access
special actions in those controllers. To keep the URLs nice and easy to
read, some people prefer /admin/products/add and /admin/news/post to
something like /products/adminAdd and /news/adminPost.

To enable this, first, uncomment the CAKE\_ADMIN line in your
/app/config/core.php file. The default value of CAKE\_ADMIN is 'admin',
but you can change it to whatever you like. Remember this string,
because you'll need to prepend it to your administrative actions in your
controller. So, admin actions in this case would be named
admin\_actionName(). Here's some examples of desired URLs and possible
CAKE\_ADMIN and controller action settings:

::

    /admin/products/add          CAKE_ADMIN = 'admin'
                                 name of action in ProductsController = 'admin_add()'

    /superuser/news/post         CAKE_ADMIN = 'superuser'
                                 name of action in NewsController = 'superuser_post()'

    /admin/posts/delete          CAKE_ADMIN = 'admin'
                                 name of action in PostsController = 'admin_delete()'

Using admin routes allows you to keep your logic organized while making
the routing very easy to accomplish. When enabled, you can easily
determine in the controller whether an admin route has been accessed by
using:

$this->params[CAKE\_ADMIN];

or, assuming 'admin' is the value of CAKE\_ADMIN,

$this->params['admin'];

Please note that enabling admin routes or using them does not enable any
sort of authentication or security. You'll need implement those
yourself.

Similarly, you can enable Cake's webservices routing to make easier
there as well. Have a controller action you'd like to expose as a
webservice? First, set WEBSERVICES in /app/config/core.php to 'on'. This
enables some automatic routing somewhat similar to admin routing, except
that a certain set of route prefixes are enabled:

#. rss

#. xml

#. rest

#. soap

#. xmlrpc

What this does is allows you to provide an alternate views that will
automatically be available at /rss/controllerName/actionName or
/soap/controllerName/actionName. This allows you to create a single
action that can have two views: one for normal HTML viewiers, and
another for webservices users. By doing this, you can easily allow much
of the functionality of your application to be available via
webservices.

For example, let's say I have some logic in my application that tells
users who is on the phone in my office. I already have a HTML view for
this data, but I want to offer it in XML so it can be used in a desktop
widget or handheld application. First I need to enable Cake's webservice
routing:

/app/config/core.php (partial)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

::

    /**
     *  The define below is used to turn cake built webservices
     *  on or off. Default setting is off.
     */
        define('WEBSERVICES', 'on');

Next, we need to define a component for the type of webservice you want
to handle. For XML, you'd need to include an XmlComponent, with RSS, and
RssComponent. Components are defined in /app/controllers/components, and
extend the Object class.

Once that's done, I can structure the logic in my controller just as I
normally would:

messages\_controller.php
~~~~~~~~~~~~~~~~~~~~~~~~

::

    <?php
    class PhonesController extends AppController
    {
        function doWhosOnline()
        {
            // this action is where we do all the work of seeing who's on the phone...

            // If I wanted this action to be available via Cake's xml webservices route,
            // I'd need to include a view at /app/views/phones/xml/do_whos_online.thtml.
            // Note: the default view used here is at /app/views/layouts/xml/default.thtml.

            // If a user requests /phones/doWhosOnline, they will get an HTML version.
            // If a user requests /xml/phones/doWhosOnline, they will get the XML version.
        }
    }
    ?>

(Optional) Custom Inflections Configuration
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Cake's naming conventions can be really nice - you can name your model
Box, your controller Boxes, and everything just works out. There are
occasions (especially for our non-english speaking friends) where you
may run into situations where Cake's inflector (the class that
pluralizes, singularizes, camelCases, and under\_scores) might not work
as you'd like. If Cake won't recognize your Foci or Fish, editing the
custom inflections configuration file is where you'll need to go.

Found at /app/config/inflections.php is a list of Cake variables you can
use to adjust the pluralization, singularization of classnames in Cake,
along with definining terms that shouldn't be inflected at all (like
Fish and Deer, for you outdoorsman cakers) along with irregularities.

Follow the notes inside the file to make adjustments, or use the
examples in the file by uncommenting them. You may need to know a little
regex before diving in.
