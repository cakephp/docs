NumberHelper 
############

.. php:class:: NumberHelper(View $view, array $settings = array())

Le helper nombre (number) contient des méthodes pratiques qui permettent
l'affichage des nombres dans divers formats communs dans vos vues. Ces méthodes 
contiennent des moyens pour formater les devises, pourcentages, taille des 
données, le format des nombres avec précisions et aussi de vous donner 
davantage de souplesse en matière de formatage des nombres.

.. versionchanged:: 2.1
   ``NumberHelper`` a été remanié dans une classe :php:class:`CakeNumber` pour 
   permettre une utilisation plus facile a l'extérieur de la couche ``Vue``.
   Dans une vue, ces méthodes sont accessibles via la classe `NumberHelper`
   et vous pouvez l'appeler comme vous pourriez appeler une méthode de helper 
   normale: ``$this->Number->method($args);``.

.. include:: ../../core-utility-libraries/number.rst
    :start-after: start-cakenumber
    :end-before: end-cakenumber


.. meta::
    :title lang=fr: NumberHelper
    :description lang=fr: NumberHelper contient des méthodes convenience qui permettent d'afficher des nombres dans des formats communs dans les vues.
    :keywords lang=fr: number helper,currency,number format,number precision,format file size,format numbers
