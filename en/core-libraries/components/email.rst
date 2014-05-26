EmailComponent
##############

:php:class:`EmailComponent` is now deprecated, but it will keep working.
Internally this class is using :php:class:`CakeEmail` to send emails.
Unfortunately, you will need to move your files from ``app/views/elements/emails``
to ``app/View/Emails``. Also, rename the directory ``email`` to ``Emails`` in the
layouts path. If it affects others places in your application, we recommend to
you create symbolic links.

We recommend to you upgrade your code to use :php:class:`CakeEmail` class
instead of the :php:class:`EmailComponent`. Below some tips about the migration.

-  The headers are not changed to be X-... What you set is what is used. So,
   remember to put X- in your custom headers.
-  The ``send()`` method receives only the message content. The template and
   layout should be set using :php:meth:`CakeEmail::template()` method.
-  The list of attachments should be an array of filenames (that will appear in
   email) as key and value the full path to real file.
-  At any error, :php:class:`CakeEmail` will throw an exception instead of
   return false. We recommend to you use try/catch to ensure
   your messages are delivered correctly.

Below some examples of using ``EmailComponent ($component)`` and now with
``CakeEmail ($lib)``:

-  From ``$component->to = 'some@example.com';`` to
   ``$lib->to('some@example.com');``
-  From ``$component->to = 'Alias <some@example.com>';`` to
   ``$lib->to('some@example.com', 'Alias');`` or
   ``$lib->to(array('some@example.com' => 'Alias'));``
-  From ``$component->subject = 'My subject';`` to
   ``$lib->subject('My subject');``
-  From ``$component->date = 'Sun, 25 Apr 2011 01:00:00 -0300';`` to
   ``$lib->addHeaders(array('Date' => 'Sun, 25 Apr 2011 01:00:00 -0300'));``
-  From ``$component->header['Custom'] = 'only my';`` to
   ``$lib->addHeaders(array('X-Custom' => 'only my'));``
-  From ``$component->send(null, 'template', 'layout');`` to
   ``$lib->template('template', 'layout')->send();``
-  From ``$component->delivery = 'smtp';`` to ``$lib->transport('Smtp');``
-  From ``$component->smtpOptions = array('host' => 'smtp.example.com');`` to
   ``$lib->config(array('host' => 'smtp.example.com'));``
-  From ``$sent = $component->httpMessage;`` to
   ``$sent = $lib->message(CakeEmail::MESSAGE_HTML);``

For more information you should read the :doc:`/core-utility-libraries/email`
documentation.


.. meta::
    :title lang=en: EmailComponent
    :keywords lang=en: component subject,component delivery,php class,template layout,custom headers,template method,filenames,alias,lib,array,email,migration,attachments,elements,sun
