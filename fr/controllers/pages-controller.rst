Le Controller Pages
###################

Le squelette d'application officiel de CakePHP est livré avec un controller par
défaut **PagesController.php**. C'est un controller simple et optionnel qui
permet d'afficher un contenu statique. La page d'accueil que vous voyez juste
après l'installation est d'ailleurs générée à l'aide de ce controller et du
fichier de vue **src/Template/Pages/home.ctp**. Ex : Si vous écrivez un fichier
de vue **src/Template/Pages/a_propos.ctp**, vous pouvez y accéder en utilisant
l'url **http://exemple.com/pages/a_propos**. Vous pouvez modifier le controller
Pages selon vos besoins.

Quand vous "cuisinez" une application avec Composer, le controller Pages est
créé dans votre dossier **src/Controller/**.

.. meta::
    :title lang=fr: Le Controller Pages
    :keywords lang=fr: controller pages,controller par défaut,cakephp,ships,php,fichier dossier
