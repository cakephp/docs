TimeHelper
##########

.. php:class:: TimeHelper(View $view, array $settings = array())

The Time Helper does what it says on the tin: saves you time. It
allows for the quick processing of time related information. The
Time Helper has two main tasks that it can perform:

#. It can format time strings.
#. It can test time (but cannot bend time, sorry).

.. versionchanged:: 2.1
   ``TimeHelper`` has been refactored into the :php:class:`CakeTime` class to allow
   easier use outside of the ``View`` layer.
   Within a view, these methods are accessible via the `TimeHelper`
   class and you can call it as you would call a normal helper method:
   ``$this->Time->method($args);``.

Using the Helper
================

A common use of the Time Helper is to offset the date and time to match a
user's time zone. Lets use a forum as an example. Your forum has many users who
may post messages at any time from any part of the world. An easy way to
manage the time is to save all dates and times as GMT+0 or UTC. Uncomment the
line ``date_default_timezone_set('UTC');`` in ``app/Config/core.php`` to ensure
your application's time zone is set to GMT+0.

Next add a time zone field to your users table and make the necessary
modifications to allow your users to set their time zone. Now that we know
the time zone of the logged in user we can correct the date and time on our
posts using the Time Helper::

    echo $this->Time->format(
      'F jS, Y h:i A',
      $post['Post']['created'],
      null,
      $user['User']['time_zone']
    );
    // Will display August 22nd, 2011 11:53 PM for a user in GMT+0
    // August 22nd, 2011 03:53 PM for a user in GMT-8
    // and August 23rd, 2011 09:53 AM GMT+10

Most of the Time Helper methods have a $timezone parameter. The $timezone parameter
accepts a valid timezone identifier string or an instance of `DateTimeZone` class.

.. include:: ../../core-utility-libraries/time.rst
    :start-after: start-caketime
    :end-before: end-caketime


.. meta::
    :title lang=en: TimeHelper
    :description lang=en: The Time Helper will help you format time and test time.
    :keywords lang=en: time helper,format time,timezone,unix epoch,time strings,time zone offset,utc,gmt
