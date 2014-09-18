TextHelper
##########

.. php:class:: TextHelper(View $view, array $config = [])

TextHelper possède des méthodes pour rendre le texte plus utilisable et sympa
dans vos vues. Il aide à activer les liens, à formater les URLs, à créer
des extraits de texte autour des mots ou des phrases choisies, mettant en
évidence des mots clés dans des blocs de texte et tronquer élegamment de
longues étendues de texte.

.. php:method:: autoLinkEmails(string $text, array $options=[])

    :param string $text: Le texte à convertir.
    :param array $options: Un tableau d' :term:`attributs HTML` pour générer
        les liens.

    Ajoute les liens aux adresses email bien formées dans $text, selon toute
    les options définies dans ``$htmlOptions`` (regardez
    :php:meth:`HtmlHelper::link()`).::

        $myText = 'Pour plus d'informations sur nos pâtes et desserts fameux,
            contactez info@example.com';
        $linkedText = $this->Text->autoLinkEmails($myText);

    Sortie::

        Pour plus d'informations sur nos pâtes et desserts fameux,
        contactez <a href="mailto:info@example.com">info@example.com</a>

    Cette méthode echappe automatiquement ces inputs. Utilisez l'option
    ``escape`` pour la désactiver si nécessaire.

.. php:method:: autoLinkUrls(string $text, array $htmlOptions=[])

    :param string $text: Le texte à convertir.
    :param array $htmlOptions: Un tableau d' :term:`attributs HTML` pour
        la génération de liens.

    De même que dans ``autoLinkEmails()``, seule cette méthode cherche les
    chaînes de caractère qui commence par https, http, ftp, ou nntp et
    les liens de manière appropriée.

    Cette méthode échappe automatiquement son input. Utilisez l'option
    ``escape`` pour la désactiver si nécessaire.

.. php:method:: autoLink(string $text, array $htmlOptions=[])

    :param string $text: Le texte à lier automatiquement.
    :param array $htmlOptions: Un tableau d' :term:`attributs HTML` pour
        générer les liens.

    Execute la fonctionnalité dans les deux ``autoLinkUrls()`` et
    ``autoLinkEmails()`` sur le ``$text`` fourni. Tous les URLs et emails
    sont liés de manière appropriée donnée par ``$htmlOptions`` fourni.

    Cette méthode échappe automatiquement son input. Utilisez l'option
    ``escape`` pour la désactiver si nécessaire.

.. php:method:: autoParagraph(string $text)

    :param string $text: Le texte à convertir.

    Ajoute <p> autour du texte où la double ligne retourne et <br> où une
    simple ligne retourne, sont trouvés.::

        $myText = 'For more information
        regarding our world-famous pastries and desserts.

        contact info@example.com';
        $formattedText = $this->Text->autoParagraph($myText);

    Output::

        <p>Pour plus d\'information<br />
        selon nos célèbres pâtes et desserts.<p>
        <p>contact info@example.com</p>

.. include:: ../../core-utility-libraries/string.rst
    :start-after: start-string
    :end-before: end-string


.. meta::
    :title lang=fr: TextHelper
    :description lang=fr: Le Helper Text contient les méthodes pour rendre le texte plus utilisable et de manière sympa dans vos vues.
    :keywords lang=fr: text helper,autoLinkEmails,autoLinkUrls,autoLink,excerpt,highlight,stripLinks,truncate,string text
