Comprendre le modèle M-V-C
##########################

CakePHP suit le motif de conception logicielle
`MVC <http://fr.wikipedia.org/wiki/Mod%C3%A8le-Vue-Contr%C3%B4leur>`_.
Programmer en utilisant MVC sépare votre application en 3 parties
principales :

Le Modèle représente les données de l'application

La Vue affiche une présentation des données du modèle

Le Contrôleur intercepte et route les requêtes faites par le client

.. figure:: /_static/img/basic_mvc.png
   :align: center
   :alt: Figure 1

   Figure 1

La figure 1 montre un exemple de requête MVC sommaire avec CakePHP. Pour
illustrer cela, supposons qu'un client nommé "Ricardo" a simplement
cliqué le lien "Achetez un Cake personnalisé maintenant !" sur la page
d’accueil de votre application.

-  Ricardo clique le lien qui pointe vers
   *http://www.exemple.com/cakes/acheter* et son navigateur envoie une
   requête à votre serveur web.
-  Le répartiteur (*dispatcher*) analyse l’URL (/cakes/acheter) et
   transmet la requête au contrôleur concerné
-  Le contrôleur exécute la logique spécifique de l’application. Par
   exemple, il peut vérifier si Ricardo s’est identifié.
-  Le contrôleur utilise aussi les modèles pour obtenir l’accès aux
   données de l’application. Le plus souvent, les modèles représentent
   une table de la base de données, mais ils peuvent aussi représenter
   des entrées `LDAP <https://en.wikipedia.org/wiki/Ldap>`_, des flux
   `RSS <https://en.wikipedia.org/wiki/Rss>`_ ou des fichiers sur
   l’ordinateur. Dans cet exemple, le contrôleur utilise un modèle qui
   récupère, dans la base de données, les derniers achats de Ricardo.
-  Une fois que le contrôleur a effectué ses traitements « magiques »
   sur les données, il les transmet à une vue. La vue récupère ces
   données et les formate pour les présenter à l’utilisateur. Les vues
   dans CakePHP sont le plus souvent au format HTML, mais une vue
   pourrait tout aussi bien être, en fonction de vos besoins, un
   document PDF ou XML, ou bien un objet JSON.
-  Une fois que la vue a utilisé les données du contrôleur pour
   construire une vue de rendu complète, le contenu de cette vue est
   renvoyé au navigateur de Ricardo.

Presque chaque requête à votre application suivra ce schéma de base.
Nous le retrouverons plus tard, dans de nombreux cas particuliers de
Cake, gardez-le donc dans un coin de votre esprit tandis que nous
poursuivons.

Avantages
=========

Pourquoi utiliser MVC ?

Parce que c'est un vrai motif de conception logiciel éprouvé, qui
transforme une application en un ensemble maintenable, modulaire et
rapidement développé. Façonner les tâches applicatives dans des modèles,
vues et contrôleurs séparés, permet à votre application de se sentir
très "à l'aise dans ses baskets". Les nouvelles fonctionnalités sont
ajoutées facilement et modifier les anciennes est un jeu d'enfant !
L'architecture modulaire et séparée offre également aux développeurs et
designers, la possibilité de travailler en parallèle, avec la capacité
de créer rapidement un
`prototype <https://en.wikipedia.org/wiki/Software_prototyping>`_. La
séparation permet aussi aux développeurs de faire des modifications sur
une partie de l'application sans affecter les autres.

Si vous n'avez jamais développé une application de cette manière, cela
demande un peu de pratique, mais nous sommes certains qu'une fois votre
première application construite avec CakePHP, vous ne voudrez jamais
revenir en arrière.
