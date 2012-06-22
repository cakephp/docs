Le Contôrleur Pages
###################

Le cœur de CakePHP est livré avec un contrôleur par défaut ``PagesController.php``.
C'est un contrôleur simple et optionnel pour rendre de contenu statique.
La page d'accueil que vous voyez juste après l'installation est d'ailleurs 
générée à l'aide de ce contrôleur. Ex : Si vous écrivez un fichier de vue 
``app/View/Pages/a_propos.ctp``, vous pouvez y accéder en utilisant l'url 
``http://example.com/pages/a_propos``. Vous pouvez modifier le contrôleur
Pages selon vos besoins.

Quand vous "cuisinez" une applications avec l'utilitaire console de CakePHP,
le contrôleur Pages est copié dans votre dossier ``app/Controller/`` et vous pouvez
le modifier selon vos besoin. Ou vous pouvez simplement copier le fichier à 
partir de ``lib/Cake/Console/Templates/skel/Controller/PagesController.php``.

.. versionchanged:: 2.1
    Avec CakePHP 2.0 le contrôleur Pages était une partie de ``lib/Cake``. Depuis 2.1,
    le contrôleur Pages ne fait plus parti du coeur, mais se situe dans le dossier app.

.. warning::

    Ne modifiez directement AUCUN fichier du dossier ``lib/Cake`` pour éviter les
    problèmes lors des mises à jour du coeur dans le futur.


.. meta::
    :title lang=fr: Le Contrôleur Pages
    :keywords lang=fr: contrôleur pages,contrôleur par défault,lib,cakephp,ships,php,fichier dossier