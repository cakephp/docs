Time
####

.. php:namespace:: Cake\View\Helper

.. php:class:: TimeHelper(View $view, array $config = [])

The TimeHelper allows for the quick processing of time related information.
The TimeHelper has two main tasks that it can perform:

#. It can format time strings.
#. It can test time.

Using the Helper
================

A common use of the TimeHelper is to offset the date and time to match a
user's time zone. Lets use a forum as an example. Your forum has many users who
may post messages at any time from any part of the world. An easy way to
manage the time is to save all dates and times as GMT+0 or UTC. Uncomment the
line ``date_default_timezone_set('UTC');`` in **config/bootstrap.php** to ensure
your application's time zone is set to GMT+0.

Next add a time zone field to your users table and make the necessary
modifications to allow your users to set their time zone. Now that we know
the time zone of the logged in user we can correct the date and time on our
posts using the TimeHelper::

    echo $this->Time->format(
      $post->created,
      \IntlDateFormatter::FULL,
      null,
      $user->time_zone
    );
    // Will display 'Saturday, August 22, 2011 at 11:53:00 PM GMT'
    // for a user in GMT+0. While displaying,
    // 'Saturday, August 22, 2011 at 03:53 PM GMT-8:00'
    // for a user in GMT-8

Most of TimeHelper's features are intended as backwards compatible interfaces
for applications that are upgrading from older versions of CakePHP. Because the
ORM returns :php:class:`Cake\\I18n\\Time` instances for every ``timestamp``
and ``datetime`` column, you can use the methods there to do most tasks.
For example, to read about the accepted formatting strings take a look at the
`Cake\\I18n\\Time::i18nFormat() 
<https://api.cakephp.org/3.0/class-Cake.I18n.Time.html#_i18nFormat>`_ method.

.. meta::
    :title lang=en: TimeHelper
    :description lang=en: The TimeHelper will help you format time and test time.
    :keywords lang=en: time helper,format time,timezone,unix epoch,time strings,time zone offset,utc,gmt
