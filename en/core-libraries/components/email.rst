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

Below some examples of using ``EmailComponent (Component $Component)`` and now with
``CakeEmail ($Lib)``:

-  From ``$Component->to = 'some@example.com';`` to
   ``$Lib->to('some@example.com');``
-  From ``$Component->to = 'Alias <some@example.com>';`` to
   ``$Lib->to('some@example.com', 'Alias');`` or
   ``$Lib->to(array('some@example.com' => 'Alias'));``
-  From ``$Component->subject = 'My subject';`` to
   ``$Lib->subject('My subject');``
-  From ``$Component->date = 'Sun, 25 Apr 2011 01:00:00 -0300';`` to
   ``$Lib->addHeaders(array('Date' => 'Sun, 25 Apr 2011 01:00:00 -0300'));``
-  From ``$Component->header['Custom'] = 'only my';`` to
   ``$Lib->addHeaders(array('X-Custom' => 'only my'));``
-  From ``$Component->send(null, 'template', 'layout');`` to
   ``$Lib->template('template', 'layout')->send();``
-  From ``$Component->delivery = 'smtp';`` to ``$Lib->transport('smtp');``
-  From ``$Component->smtpOptions = array('host' => 'smtp.example.com');`` to
   ``$Lib->config(array('host' => 'smtp.example.com'));``
-  From ``$sent = $Component->httpMessage;`` to
   ``$sent = $Lib->message(CakeEmail::MESSAGE_HTML);``

For more information you should read the :doc:`/core-utility-libraries/email`
documentation.
