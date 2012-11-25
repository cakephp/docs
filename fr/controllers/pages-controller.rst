Le Controller Pages
###################

Le cœur de CakePHP est livré avec un controller par défaut 
``PagesController.php``. C'est un controller simple et optionnel pour rendre 
un contenu statique. La page d'accueil que vous voyez juste après 
l'installation est d'ailleurs générée à l'aide de ce controller. Ex : Si vous 
écrivez un fichier de vue ``app/View/Pages/a_propos.ctp``, vous pouvez y 
accéder en utilisant l'url ``http://exemple.com/pages/a_propos``. Vous pouvez 
modifier le controller Pages selon vos besoins.

Quand vous "cuisinez" une application avec l'utilitaire console de CakePHP, 
le controller Pages est copié dans votre dossier ``app/Controller/`` et vous 
pouvez le modifier selon vos besoins. Ou vous pouvez simplement copier le 
fichier à partir de 
``lib/Cake/Console/Templates/skel/Controller/PagesController.php``.

.. versionchanged:: 2.1
    Avec CakePHP 2.0, le controller Pages était une partie de ``lib/Cake``. 
    Depuis 2.1, le controller Pages ne fait plus partie du coeur, mais se situe 
    dans le dossier app.

.. warning::

    Ne modifiez directement AUCUN fichier du dossier ``lib/Cake`` pour éviter 
    les problèmes lors des mises à jour du coeur dans le futur.


.. meta::
    :title lang=fr: Le Controller Pages
    :keywords lang=fr: controller pages,controller par défaut,lib,cakephp,ships,php,fichier dossier
