Text
####

.. php:namespace:: Cake\View\Helper

.. php:class:: TextHelper(View $view, array $config = [])

TextHelper possède des méthodes pour rendre le texte plus utilisable et sympa
dans vos vues. Il aide à activer les liens, à formater les URLs, à créer
des extraits de texte autour des mots ou des phrases choisies, mettant en
évidence des mots clés dans des blocs de texte et tronquer élégamment de
longues étendues de texte.

Lier les Adresses Email
=======================

.. php:method:: autoLinkEmails(string $text, array $options = [])

Ajoute les liens aux adresses email bien formées dans $text, selon toutes
les options définies dans ``$options`` (regardez
:php:meth:`HtmlHelper::link()`)::

    $myText = 'Pour plus d'informations sur nos pâtes et desserts fameux,
        contactez info@example.com';
    $linkedText = $this->Text->autoLinkEmails($myText);

Sortie::

    Pour plus d'informations sur nos pâtes et desserts fameux,
    contactez <a href="mailto:info@example.com">info@example.com</a>

Cette méthode échappe automatiquement ces inputs. Utilisez l'option
``escape`` pour la désactiver si nécessaire.

Lier les URLs
=============

.. php:method:: autoLinkUrls(string $text, array $options = [])

De même que dans ``autoLinkEmails()``, seule cette méthode cherche les
chaînes de caractères qui commence par https, http, ftp, ou nntp et
les liens de manière appropriée.

Cette méthode échappe automatiquement son input. Utilisez l'option
``escape`` pour la désactiver si nécessaire.

Lier à la fois les URLs et les Adresses Email
=============================================

.. php:method:: autoLink(string $text, array $options = [])

Exécute la fonctionnalité dans les deux ``autoLinkUrls()`` et
``autoLinkEmails()`` sur le ``$text`` fourni. Tous les URLs et emails
sont liés de manière appropriée donnée par ``$options`` fourni.

Cette méthode échappe automatiquement son input. Utilisez l'option
``escape`` pour la désactiver si nécessaire.

Convertir du Texte en Paragraphes
=================================

.. php:method:: autoParagraph(string $text)

Ajoute <p> autour du texte où la double ligne retourne et <br> où une
simple ligne retourne, sont trouvés::

    $myText = 'For more information
    regarding our world-famous pastries and desserts.

    contact info@example.com';
    $formattedText = $this->Text->autoParagraph($myText);

Output::

    <p>Pour plus d\'information<br />
    selon nos célèbres pâtes et desserts.</p>
    <p>contact info@example.com</p>

.. include:: /core-libraries/text.rst
    :start-after: start-text
    :end-before: end-text

.. meta::
    :title lang=fr: TextHelper
    :description lang=fr: Le TextHelper contient les méthodes pour rendre le texte plus utilisable et de manière sympa dans vos vues.
    :keywords lang=fr: text helper,autoLinkEmails,autoLinkUrls,autoLink,excerpt,highlight,stripLinks,truncate,string text
