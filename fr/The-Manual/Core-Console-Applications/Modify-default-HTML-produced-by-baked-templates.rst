Modifier le rendu HTML produit par les templates de "bake"
##########################################################

Si vous voulez modifier le rendu HTML produit par défaut par la commande
"bake", suivez ces simples étapes :

**Pour "cuire" des vues personnalisées :**

#. Allez dans : cake/console/templates/default/views
#. Remarquez les 4 fichiers qui s'y trouvent
#. Copiez les vers votre répertoire :
   app/vendors/shells/templates/[themename]/views
#. Changez le rendu HTML pour contrôler la façon dont "bake" construit
   vos vues.

Le segment de chemin ``[themename]`` devrait correspondre au nom du
thème bake que vous êtes en train de créer. Les noms de thème bake
doivent être uniques, donc n'utilisez pas 'default'.

**Pour "cuire" des projets personnalisés :**

#. Allez dans: cake/console/templates/skel
#. Remarquez les fichiers de base de l'application qui s'y trouvent
#. Copiez les dans votre répertoire : app/vendors/shells/templates/skel
#. Changez le rendu HTML pour contrôler la façon dont "bake" construit
   vos vues.
#. Passez le paramètre 'chemin du squelette' à la tâche project :

   ::

       cake bake project -skel vendors/shells/templates/skel

Notes

-  Vous devez lancer la commande ``cake bake project`` pour que le
   paramètre path puisse être passé.
-  Le chemin du template est relatif au chemin courant de l'Interface de
   Ligne de Commande (CLI).
-  Vu que le chemin absolu vers le squelette nécessite d'être entré
   manuellement, vous pouvez spécifier n'importe quel répertoire
   contenant le template que vous voulez construire, y compris en
   utilisant plusieurs templates (sauf si Cake commence à gérer la
   surcharge du répertoire skel comme il le fait pour les vues)

