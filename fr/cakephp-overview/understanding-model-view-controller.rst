Comprendre le système M-V-C (Model-View-Controller)
###################################################

CakePHP suit le motif de conception logicielle
`MVC <https://en.wikipedia.org/wiki/Model-view-controller>`_.
Programmer en utilisant MVC sépare votre application en 3 couches principales :

La couche Model
===============

La couche Model représente la partie de l'application qui exécute la logique
métier. Cela signifie qu'elle est responsable de récupérer les données, de les
convertir selon des concepts chargés de sens pour votre application, tels que
le traitement, la validation, l'association et beaucoup d'autres tâches
concernant la manipulation des données.

A première vue, l'objet Model peut être vu comme la première couche
d'interaction avec n'importe quelle base de données que vous pourriez utiliser
pour votre application. Mais plus globalement, il fait partie des concepts
majeurs autour desquels vous allez exécuter votre application.

Dans le cas d'un réseau social, la couche Model s'occupe des tâches comme de
sauvegarder des données, de sauvegarder des associations d'amis,
d'enregistrer et de récupérer les photos des utilisateurs,
de trouver des suggestions de nouveaux amis, etc ...
Tandis que les objets Models seront "Ami", "User", "Commentaire", "Photo".

La couche Vue
=============

La Vue retourne une présentation des données venant du model. Etant séparée par
les Objets Model, elle est responsable de l'utilisation des informations dont
elle dispose pour produire une interface de présentation de votre application.

Par exemple, de la même manière que la couche Model retourne un ensemble de
données, la Vue utilise ces données pour fournir une page HTML les contenant.
Ou un résultat XML formaté pour que d'autres l'utilisent.

La couche Vue n'est pas seulement limitée au HTML ou à la répresentation en
texte de données. Elle peut aussi être utilisée pour offrir une grande variété
de formats en fonction de vos besoins, comme les vidéos, la musique, les
documents et tout autre format auquel vous pouvez penser.

La couche Controller
====================

La couche Controller gère les requêtes des utilisateurs.
Elle est responsable de retourner une réponse avec l'aide mutuelle des couches
Model et Vue.

Les Controllers peuvent être imaginés comme des managers qui ont pour mission
que toutes les ressources souhaitées pour accomplir une tâche soient déléguées
aux travailleurs corrects.
Il attend des requêtes des clients, vérifie leur validité selon
l'authentification et les règles d'autorisation,
délèguent les données récupérées et traitées par le Model, et sélectionne
les type de présentation correctes que le client accepte, pour finalement
déléguer le processus d'affichage à la couche Vue.

Cycle de la requête CakePHP
===========================

|Figure 1|
Figure: 1: Une requête MVC basique

Figure: 1 Montre la gestion typique d'une requête client dans CakePHP

Le cycle d'une requête CakePHP typique débute avec une requête utilisateur
qui demande une page ou une ressource dans votre application. Cette requête
est d'abord traitée par le dispatcheur, qui va sélectionner l'objet controller
correct traitant la requête.

Une fois que la requête arrive au controller, celui-ci va communiquer avec
la couche Model pour traiter la récupération de données ou les opérations
de sauvegarde qui seraient nécessaires. Cette communication terminée,
le controller va donner à l'objet vue correct, la tâche de générer une
sortie résultant des données fournies par le model.

Finalement, quand cette sortie est générée, elle est immédiatement rendue
à l'utilisateur.

Presque chaque requête de votre application va suivre ce schéma classique.
Nous ajouterons des détails plus tard qui sont spécifiques à CakePHP,
donc gardez cela à l'esprit pour la suite.

Bénéfices
=========

Pourquoi utiliser CakePHP ? Parce que c'est un logiciel vraiment construit selon le
patron MVC, qui transforme une application en un dossier élaboré maintenable,
modulable et rapide. Elaborer les tâches de l'application en séparant les
models, vues et controllers, allègent votre application. De nouvelles
fonctionnalités sont ajoutées facilement, et les améliorations sur les vieilles
fonctionnalités se font en un clin d'œil. La conception modulable et séparée
permet aussi aux développeurs et designeurs de travailler simultanément, avec
la possibilité de
`prototyper <https://en.wikipedia.org/wiki/Software_prototyping>`_ rapidement :
La séparation permet aussi aux développeurs de faire des changements dans une
seule partie de l'application sans affecter les autres.

Si vous n'avez jamais construit une application de cette manière, cela prend
quelques temps pour s'habituer, mais nous sommes confiants qu'une fois votre
première application construite avec CakePHP, vous ne voudrez plus faire d'une
autre façon.

Pour commencer votre première application CakePHP,
:doc:`Essayez le tutoriel du Blog maintenant </tutorials-and-examples/blog/blog>`

.. |Figure 1| image:: /_static/img/basic_mvc.png


.. meta::
    :title lang=fr: Comprendre le système MVC (Model-View-Controller)
    :keywords lang=fr: modèle vue controller,couche modèle,résultat formaté,objets modèles,music documents,business logic,représentation du texte,first glance,récupération des données,software design,page html,videos music,nouveaux amis,interaction,cakephp,interface,photo,presentation,mvc,photos
