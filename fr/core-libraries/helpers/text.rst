TextHelper
##########

.. php:class:: TextHelper(View $view, array $settings = array())

TextHelper possède des méthodes pour rendre le texte plus utilisable et sympa
dans vos vues. Il aide à activer les liens, à formater les URLs, à créer
des extraits de texte autour des mots ou des phrases choisies, mettant en
évidence des mots clés dans des blocs de texte et tronquer élégamment de
longues étendues de texte.

.. versionchanged:: 2.1
   Plusieurs des méthodes de ``TextHelper`` ont été déplacées dans la classe
   :php:class:`String` pour permettre une utilisation plus facile de la couche
   ``View``. Dans une vue, ces méthodes sont accessibles avec la classe
   `TextHelper` et vous pouvez l'appeler comme vous appelleriez une méthode
   normale de helper: ``$this->Text->method($args);``.

.. php:method:: autoLinkEmails(string $text, array $options=array())

    :param string $text: Le texte à convertir.
    :param array $options: Un tableau d' :term:`attributs HTML` pour générer
        les liens.

    Ajoute les liens aux adresses email bien formées dans $text, selon toute
    les options définies dans ``$options`` (regardez
    :php:meth:`HtmlHelper::link()`). ::

        $myText = 'Pour plus d'informations sur nos pâtes et desserts fameux,
            contactez info@example.com';
        $linkedText = $this->Text->autoLinkEmails($myText);

    Sortie::

        Pour plus d'informations sur nos pâtes et desserts fameux,
        contactez <a href="mailto:info@example.com">info@example.com</a>

    .. versionchanged:: 2.1
        Dans 2.1, cette méthode échappe automatiquement ces inputs. Utilisez
        l'option ``escape`` pour la désactiver si nécessaire.

.. php:method:: autoLinkUrls(string $text, array $options=array())

    :param string $text: Le texte à convertir.
    :param array $options: Un tableau d' :term:`attributs HTML` pour
        la génération de liens.

    De même que dans ``autoLinkEmails()``, seule cette méthode cherche les
    chaînes de caractère qui commence par https, http, ftp, ou nntp et
    les liens de manière appropriée.

    .. versionchanged:: 2.1
        Dans 2.1, cette méthode échappe automatiquement son input. Utilisez
        l'option ``escape`` pour la désactiver si nécessaire.

.. php:method:: autoLink(string $text, array $options=array())

    :param string $text: Le texte à lier automatiquement.
    :param array $htmlOptions: Un tableau d' :term:`attributs HTML` pour
        générer les liens.

    Exécute la fonctionnalité dans les deux ``autoLinkUrls()`` et
    ``autoLinkEmails()`` sur le ``$text`` fourni. Tous les URLs et emails
    sont liés de manière appropriée donnée par ``$htmlOptions`` fourni.

    .. versionchanged:: 2.1
        Dans 2.1, cette méthode échappe automatiquement son input. Utilisez
        l'option ``escape`` pour la désactiver si nécessaire.

.. php:method:: autoParagraph(string $text)

    :param string $text: Le texte à convertir.

    Ajoute <p> autour du texte où la double ligne retourne et <br> où une
    simple ligne retourne, sont trouvés. ::

        $myText = 'For more information
        regarding our world-famous pastries and desserts.

        contact info@example.com';
        $formattedText = $this->Text->autoParagraph($myText);

    Output::

        <p>Pour plus d\'information<br />
        selon nos célèbres pâtes et desserts.</p>
        <p>contact info@example.com</p>

    .. versionadded:: 2.4

.. include:: ../../core-utility-libraries/string.rst
    :start-after: start-string
    :end-before: end-string


.. meta::
    :title lang=fr: TextHelper
    :description lang=fr: Le Helper Text contient les méthodes pour rendre le texte plus utilisable et de manière sympa dans vos vues.
    :keywords lang=fr: text helper,autoLinkEmails,autoLinkUrls,autoLink,excerpt,highlight,stripLinks,truncate,string text
