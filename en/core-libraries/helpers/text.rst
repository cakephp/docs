TextHelper
##########

.. php:class:: TextHelper(View $view, array $settings = array())

The TextHelper contains methods to make text more usable and
friendly in your views. It aids in enabling links, formatting urls,
creating excerpts of text around chosen words or phrases,
highlighting key words in blocks of text, and to gracefully
truncating long stretches of text.

.. versionchanged:: 2.1
   Several of ``TextHelper`` methods have been moved into :php:class:`String`
   class to allow easier use outside of the ``View`` layer.
   Within a view, these methods are accessible via the `TextHelper`
   class and you can called it as you would call a normal helper method:
   ``$this->Text->method($args);``.

.. php:method:: autoLinkEmails(string $text, array $options=array())
    
    :param string $text: The text to convert.
    :param array $options: An array of :term:`html attributes` for the generated links.

    Adds links to the well-formed email addresses in $text, according
    to any options defined in ``$htmlOptions`` (see
    :php:meth:`HtmlHelper::link()`).::

        <?php
        $myText = 'For more information regarding our world-famous pastries and desserts, contact info@example.com';
        $linkedText = $this->Text->autoLinkEmails($myText);

    Output::

        For more information regarding our world-famous pastries and desserts,
        contact <a href="mailto:info@example.com">info@example.com</a>

    .. versionchanged:: 2.1
        In 2.1 this method automatically escapes its input. Use the ``escape``
        option to disable this if necessary.

.. php:method:: autoLinkUrls(string $text, array $htmlOptions=array())

    :param string $text: The text to convert.
    :param array $htmlOptions: An array :term:`html attributes` for the generated links

    Same as in ``autoLinkEmails()``, only this method searches for
    strings that start with https, http, ftp, or nntp and links them
    appropriately.

    .. versionchanged:: 2.1
        In 2.1 this method automatically escapes its input. Use the ``escape``
        option to disable this if necessary.

.. php:method:: autoLink(string $text, array $htmlOptions=array())

    :param string $text: The text to autolink.
    :param array $htmlOptions: An array :term:`html attributes` for the generated links

    Performs the functionality in both ``autoLinkUrls()`` and
    ``autoLinkEmails()`` on the supplied ``$text``. All URLs and emails
    are linked appropriately given the supplied ``$htmlOptions``.

    .. versionchanged:: 2.1
        In 2.1 this method automatically escapes its input. Use the ``escape``
        option to disable this if necessary.

.. include:: ../../core-utility-libraries/string.rst
    :start-after: start-string
    :end-before: end-string

.. meta::
    :title lang=en: TextHelper
    :description lang=en: The Text Helper contains methods to make text more usable and friendly in your views.
    :keywords lang=en: text helper,autoLinkEmails,autoLinkUrls,autoLink,excerpt,highlight,stripLinks,truncate,string text
