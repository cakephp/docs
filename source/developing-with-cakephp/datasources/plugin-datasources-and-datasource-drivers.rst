3.9.3 Plugin DataSources and Datasource Drivers
-----------------------------------------------

Plugin Datasources
~~~~~~~~~~~~~~~~~~

You can also package Datasources into plugins.

Simply place your datasource file into
``plugins/[your_plugin]/models/datasources/[your_datasource]_source.php``
and refer to it using the plugin notation:

::

    var $twitter = array(
        'datasource' => 'Twitter.Twitter',
        'username' => 'test@example.com',
        'password' => 'hi_mom',
    );

Plugin DBO Drivers
~~~~~~~~~~~~~~~~~~

In addition, you can also add to the current selection of CakePHP's
dbo drivers in plugin form.

Simply add your drivers to
``plugins/[your_plugin]/models/datasources/dbo/[your_driver].php``
and again use plugin notation:

::

    var $twitter = array(
        'driver' => 'Twitter.Twitter',
        ...
    );

Combining the Two
~~~~~~~~~~~~~~~~~

Finally, you're also able to bundle together your own DataSource
and respective drivers so that they can share functionality. First
create your main class you plan to extend:

::

    plugins/[social_network]/models/datasources/[social_network]_source.php : 
    <?php
    class SocialNetworkSource extends DataSource {
        // general functionality here
    }
    ?>

And now create your drivers in a sub folder:

::

    plugins/[social_network]/models/datasources/[social_network]/[twitter].php
    <?php
    class Twitter extends SocialNetworkSource {
        // Unique functionality here
    }
    ?>

And finally setup your ``database.php`` settings accordingly:

::

    var $twitter = array(
        'driver' => 'SocialNetwork.Twitter',
        'datasource' => 'SocialNetwork.SocialNetwork',
    );
    var $facebook = array(
        'driver' => 'SocialNetwork.Facebook',
        'datasource' => 'SocialNetwork.SocialNetwork',
    );

Just like that, all your files are included **Automagically!** No
need to place ``App::import()`` at the top of all your files.
