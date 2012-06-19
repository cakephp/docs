Comprendre le modèle M-V-C (Model-View-Controller)
###################################

CakePHP suit le motif de conception logicielle `MVC <http://en.wikipedia.org/wiki/Model-view-controller>`_.
Programmer en utilisant MVC sépare votre application en 3 couches principales :
- Le Modèle représente les données de l'application
- La Vue affiche une présentation des données du modèle
- Le Contrôleur intercepte et route les requêtes faites par le client

La couche Modèle
================

La couche Modèle représente la partie de l'application qui implémente la logique métier.
Cela siginifie qu'elle est responsable de récuperer les données, de les convertir selon des concepts chargés de sens pour votre application, tels que le traitement, la validation, l'association et beaucoup d'autres tâches relatives à la manipulation des données

A première vue, l'objet Modèle peut être vu comme la première couche d'intéraction avec n'importe quelle base de données que vous pourriez utiliser pour votre application.
Mais plus globalement, ils font parti des concepts majeurs autour desquels vous allez implémenter votre application.

Dans le cas d'un réseau social, la couche Modèle s'occupe des tâches comme de sauvegarder des données, de sauvegarder des associations d'amis, d'enregistrer et la récupérer les photos des utilisateurs, de trouver des suggestions de nouveaux amis, etc ...
Tandis que les objets Modèles seront "Ami", "Utilisateur", "Commentaire", "Photo"

Le couche Vue
==============

La Vue retourne une présentation des données venant du modèle. Etant séparée par les Objets Modèle, elle est responsable de l'utilisation des informations dont elle dispose pour produire une interface de présentation de votre application.

Par exemple, de la même manière que la couche Modèle retourne un ensemble de données, la Vue utilise ces données pour fournir une page HTML les contenant. Ou un résultat XML formaté pour que d'autres l'utilisent.

La couche Vue n'est pas seulement limitée au HTML ou à la répresentation en texte de données.
Elle peut aussi être utilisée pour offrir une grande variété de formats en fonction de vos besoins, comme les vidéos, la musique, les documents et tout autre format auquel vous pouvez penser.

La couche Controller
====================

La couche Controller gère les requêtes des utilisateurs. 
Elle est responsable de retourner une réponse avec l'aide mutuelle des couches Modèle et Vue.

Les Controllers peuvent être imaginés comme des managers qui ont pour mission que toutes les ressources souhaitées pour accomplir une tâche soient déléguées aux travailleurs corrects. Il attend des pétitions des clients, vérifie leur validité selon l'authentification et les règles d'autorisation, délèguent les données récupérées et traitées par le Modèle, et sélectionne les type de présentation correctes que le client accèpte, pour finalement déléguer le processus d'affichage à la couche Vue.

Cycle de la requête CakePHP
===========================

|Figure 1|
Figure: 1: A Basic MVC Request

Figure: 1 Shows the typical handling of a client request in CakePHP


The typical CakePHP request cycle starts with a user requesting a page or
resource in your application. This request is first processed by a dispatcher
which will select the correct controller object to handle it.

Once the request arrives at the controller, it will communicate with the Model layer
to process any data fetching or saving operation that might be needed.
After this communication is over, the controller will proceed at delegating to the
correct view object the task of generating an output resulting from the data
provided by the model.

Finally, when this output is generated, it is immediately rendered to the user

Almost every request to your application will follow this basic
pattern. We'll add some details later on which are specific to
CakePHP, so keep this in mind as we proceed.

Bénéfices
=========

Pourquoi utiliser MVC? Parce que c'est un logiciel vraiment selon le patron MVC
Why use MVC? Because it is a tried and true software design pattern
that turns an application into a maintainable, modular, rapidly
developed package. Crafting application tasks into separate models,
views, and controllers makes your application very light on its
feet. New features are easily added, and new faces on old features
are a snap. The modular and separate design also allows developers
and designers to work simultaneously, including the ability to
rapidly
`prototype <http://en.wikipedia.org/wiki/Software_prototyping>`_.
Separation also allows developers to make changes in one part of
the application without affecting the others.

If you've never built an application this way, it takes some time
getting used to, but we're confident that once you've built your
first application using CakePHP, you won't want to do it any other
way.

To get started on your first CakePHP application,
:doc:`try the blog tutorial now </tutorials-and-examples/blog/blog>`

.. |Figure 1| image:: /_static/img/basic_mvc.png


.. meta::
    :title lang=fr: Understanding Model-View-Controller
    :keywords lang=fr: model view controller,model layer,formatted result,model objects,music documents,business logic,text representation,first glance,retrieving data,software design,html page,videos music,new friends,interaction,cakephp,interface,photo,presentation,mvc,photos