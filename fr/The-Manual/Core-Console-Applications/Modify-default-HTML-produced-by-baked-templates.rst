Modifier le rendu HTML produit par les templates de "bake"
##########################################################

Si vous voulez modifier le rendu HTML produit par défaut par la commande
"bake", suivez ces simples étapes :

**Pour "cuire" des vues personnalisées :**

#. Allez dans : cake/console/libs/templates/views
#. Notez la présence de 4 fichiers
#. Copiez les vers : app/vendors/shells/templates/views
#. Changez le rendu HTML pour contrôler la façon dont "bake" construit
   vos vues.

**Pour "cuire" des projets personnalisés :**

#. Allez dans: cake/console/libs/templates/skel
#. Notez la présence des fichiers de base de l'application
#. Copiez les dans : app/vendors/shells/templates/skel
#. Changez le rendu HTML pour contrôler la façon dont "bake" construit
   vos vues.
#. Passez le paramètre 'chemin du squelette' à la tâche project :

   ::

       cake bake project -skel vendors/shells/templates/skel

Notes

-  Vous devez lancer la commande ``cake bake project`` pour que le
   paramètre path puisse être passé.
-  Le chemin du template est relatif au dossier courant de votre
   interface de ligne de commande.
-  Vu que le chemin absolu vers le squelette nécessite d'être entré
   manuellement, vous pouvez spécifier n'importe quel répertoire
   contenant le template que vous voulez construire, y compris en
   utilisant plusieurs templates. (A moins que Cake commence à gérer la
   surcharge du répertoire skel comme il le fait pour les vues)

