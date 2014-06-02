TextHelper
##########

.. php:class:: TextHelper(View $view, array $config = [])

The TextHelper contains methods to make text more usable and
friendly in your views. It aids in enabling links, formatting URLs,
creating excerpts of text around chosen words or phrases,
highlighting key words in blocks of text, and to gracefully
truncating long stretches of text.

.. php:method:: autoLinkEmails(string $text, array $options=[])

    :param string $text: The text to convert.
    :param array $options: An array of :term:`html attributes` for the generated links.

    Adds links to the well-formed email addresses in $text, according
    to any options defined in ``$htmlOptions`` (see
    :php:meth:`HtmlHelper::link()`).::

        $myText = 'For more information regarding our world-famous ' .
            'pastries and desserts, contact info@example.com';
        $linkedText = $this->Text->autoLinkEmails($myText);

    Output::

        For more information regarding our world-famous pastries and desserts,
        contact <a href="mailto:info@example.com">info@example.com</a>

    This method automatically escapes its input. Use the ``escape``
    option to disable this if necessary.

.. php:method:: autoLinkUrls(string $text, array $htmlOptions=[])

    :param string $text: The text to convert.
    :param array $htmlOptions: An array :term:`html attributes` for the generated links

    Same as in ``autoLinkEmails()``, only this method searches for
    strings that start with https, http, ftp, or nntp and links them
    appropriately.

    This method automatically escapes its input. Use the ``escape``
    option to disable this if necessary.

.. php:method:: autoLink(string $text, array $htmlOptions=[])

    :param string $text: The text to autolink.
    :param array $htmlOptions: An array :term:`html attributes` for the generated links

    Performs the functionality in both ``autoLinkUrls()`` and
    ``autoLinkEmails()`` on the supplied ``$text``. All URLs and emails
    are linked appropriately given the supplied ``$htmlOptions``.

    This method automatically escapes its input. Use the ``escape``
    option to disable this if necessary.

.. php:method:: autoParagraph(string $text)

    :param string $text: The text to convert.

    Adds proper <p> around text where double-line returns and <br> where single-line returns
    are found.::

        $myText = 'For more information
        regarding our world-famous pastries and desserts.

        contact info@example.com';
        $formattedText = $this->Text->autoParagraph($myText);

    Output::

        <p>For more information<br />
        regarding our world-famous pastries and desserts.<p>
        <p>contact info@example.com</p>

.. include:: ../../core-utility-libraries/string.rst
    :start-after: start-string
    :end-before: end-string

.. meta::
    :title lang=en: TextHelper
    :description lang=en: The Text Helper contains methods to make text more usable and friendly in your views.
    :keywords lang=en: text helper,autoLinkEmails,autoLinkUrls,autoLink,excerpt,highlight,stripLinks,truncate,string text
