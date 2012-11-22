TextHelper
##########

.. php:class:: TextHelper(View $view, array $settings = array())

TextHelper possède des méthodes pour rendre le texte plus utilisable et sympa 
dans vos vues. Il aide à activer les liens, formater les urls, à créer des 
des extraits de texte autour des mots ou des phrases choisies, mettant en 
évidence des mots clés dans des blocs de texte et tronquer élegamment de  
longues étendues de texte.

.. versionchanged:: 2.1
   Plusieurs des méthodes de ``TextHelper`` ont été déplacées dans la classe 
   :php:class:`String` pour permettre une utilisation plus facile de la couche 
   ``View``. Dans une vue, ces méthodes sont accessibles avec la classe 
   `TextHelper` et vous pouvez l'appeler comme vous appelleriez une méthode 
   normale de helper: ``$this->Text->method($args);``.

.. php:method:: autoLinkEmails(string $text, array $options=array())
    
    :param string $text: Le texte à convertir.
    :param array $options: Un tableau de :term:`html attributes` pour générer 
        les liens.

    Ajoute les liens aux adresses email bien formées dans $text, selon toute 
    les options définies dans ``$htmlOptions`` (regardez 
    :php:meth:`HtmlHelper::link()`).::

        $my_text = 'Pour plus d'informations sur nos pâtes et desserts fameux, contactez info@example.com';
        $linked_text = $this->Text->autoLinkEmails($my_text);

    Sortie::

        Pour plus d'informations sur nos pâtes et desserts fameux, 
        contactez <a href="mailto:info@example.com">info@example.com</a>

    .. versionchanged:: 2.1
        Dans 2.1, cette méthode echappe automatiquement ces inputs. Utilisez 
        l'option ``escape`` pour la désactiver si nécéssaire.

.. php:method:: autoLinkUrls(string $text, array $htmlOptions=array())

    :param string $text: Le texte à convertir.
    :param array $htmlOptions: Un tableau de :term:`html attributes` pour 
        la génération de liens

    De même que dans ``autoLinkEmails()``, seule cette méthode cherche les 
    chaînes de caractère qui commence par https, http, ftp, ou nntp et les 
    les lie de manière appropriée.

    .. versionchanged:: 2.1
        Dans 2.1, cette méthode echappe automatiquement son input. Utilisez 
        l'option ``escape`` pour la désactiver si nécéssaire.

.. php:method:: autoLink(string $text, array $htmlOptions=array())

    :param string $text: Le texte à lier automatiquement.
    :param array $htmlOptions: Un tableau de :term:`html attributes` pour
        générer les liens

    Execute la fonctionnalité dans les deux ``autoLinkUrls()`` et 
    ``autoLinkEmails()`` sur le ``$text`` fourni. Tous les URLs et emails 
    sont liés de manière appropriée donnée par ``$htmlOptions`` fourni.

    .. versionchanged:: 2.1
        Dans 2.1, cette méthode echappe automatiquement son input. Utilisez 
        l'option ``escape`` pour la désactiver si nécéssaire.

.. include:: ../../core-utility-libraries/string.rst
    :start-after: start-string
    :end-before: end-string


.. meta::
    :title lang=fr: TextHelper
    :description lang=fr: The Text Helper contains methods to make text more usable and friendly in your views.
    :keywords lang=fr: text helper,autoLinkEmails,autoLinkUrls,autoLink,excerpt,highlight,stripLinks,truncate,string text
