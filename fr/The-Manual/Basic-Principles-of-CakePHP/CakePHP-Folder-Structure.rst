Structure de fichiers dans CakePHP
##################################

Après avoir téléchargé et extrait CakePHP, voici les fichiers et
répertoires que vous devriez voir :

-  app
-  cake
-  vendors
-  plugins
-  .htaccess
-  index.php
-  README

 

Vous remarquerez trois dossiers principaux :

-  Le dossier *app* sera celui où vous exercerez votre magie : c'est là
   que vous placerez les fichiers de votre application.
-  Le dossier *cake* est l'endroit où nous avons exercé notre propre
   magie. Engagez-vous personnellement à **ne pas** modifier les
   fichiers dans ce dossier. Nous ne pourrons pas vous aider si vous
   avez modifié le cœur du framework.
-  Enfin, le dossier *vendors* est l'endroit où vous placerez vos
   librairies PHP tierces dont vous avez besoin pour vos applications
   CakePHP.

Le répertoire App
=================

Le répertoire app de CakePHP est l'endroit où vous réaliserez la
majorité du développement de votre application. Regardons de plus près
le contenu de ce répertoire.

config

Contient les (quelques) fichiers de configuration utilisés par CakePHP.
Informations de connexion à la base de données, démarrage, fichiers de
configuration de base et tous fichiers du même genre doivent être rangés
ici.

controllers

Contient vos contrôleurs et leurs composants.

locale

Stocke les fichiers pour l'internationalisation.

models

Pour les modèles, comportements et sources de données de votre
application.

plugins

Contient les packages des Plugins.

tmp

C'est ici que CakePHP enregistre les données temporaires. La manière
dont sont stockées les données actuelles dépend de la configuration que
vous avez effectuée, mais ce répertoire est habituellement utilisé pour
déposer les descriptions de modèles, les logs et parfois les
informations de session.

vendors

Toutes classes ou librairies tierces doivent être mises ici, de sorte
qu'il sera facile d'y accéder par la fonction vendors(). Les
observateurs avisés noteront que cela semble redondant avec le
répertoire "vendors" à la racine de l'arborescence. Nous aborderons les
différences entre les deux lorsque nous discuterons de la gestion
multi-applications et des configurations systèmes plus complexes.

views

Les fichiers de présentation sont placés ici : éléments, pages d'erreur,
assistants, mises en page et vues.

webroot

Dans un environnement de production, ce dossier doit être la racine de
votre application. Les sous-répertoires sont utilisés pour les feuilles
de style CSS, les images et les fichiers Javascript.
