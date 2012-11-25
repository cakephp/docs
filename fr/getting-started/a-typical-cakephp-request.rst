Une requête CakePHP typique
###########################

Nous avons découvert les ingrédients de bases de CakePHP, regardons
maintenant comment chaque objet travaille avec les autres pour répondre
à une requête simple. Poursuivons sur notre exemple original de requête,
imaginons que notre ami Ricardo vient de cliquer sur le lien "Achetez un 
Cake personnalisé maintenant !" sur la page d'accueil d'une application 
CakePHP.

.. figure:: /_static/img/typical-cake-request.png
   :align: center
   :alt: Diagramme représentant une requête CakePHP typique.

   Diagramme représentant une requête CakePHP typique.

Figure: 2. Typical Cake Request.

Noir = élément obligatoire, Gris = élément optionnel, Bleu = rappel (callback)

#. Ricardo clique sur le lien pointant vers http://www.exemple.com/cakes/buy 
   et son navigateur envoie une requête au serveur Web.
#. Le routeur analyse l'URL afin d'extraire les paramètres de cette requête 
   : le controller, l'action et tout argument qui affectera la logique métier 
   pendant cette requête.
#. En utilisant les routes, l'URL d'une requête est liée à une action d'un 
   controller (une méthode d'une classe controller spécifique). Dans notre 
   exemple, il s'agit de la méthode buy() du Controller Cakes. La fonction 
   de rappel du controller, beforeFilter(), est appelée avant que toute logique 
   de l'action du controller ne soit exécutée.
#. Le controller peut utiliser des models pour accéder aux données de 
   l'application. Dans cet exemple, le controller utilise un model pour 
   récupérer les derniers achats de Ricardo depuis la base de données. Toute 
   méthode de rappel du model, tous behaviors ou sources de données 
   peuvent s'appliquer pendant cette opération. Bien que l'utilisation du 
   model ne soit pas obligatoire, tous les controllers CakePHP nécessitent 
   au départ, au moins un model.
#. Une fois que le model a récupéré les données, elles sont retournées au 
   controller. Des fonctions de rappel du model peuvent s'exécuter.
#. Le controller peut faire usage de components pour affiner les données ou 
   pour effectuer d'autres opérations (manipulation de session, 
   authentification ou envoi de mails par exemple).
#. Une fois que le controller a utilisé les models et components pour préparer 
   suffisamment les données, ces données sont passées à la vue grâce à la 
   méthode set(). Les méthodes de rappel (callbacks) du controller peuvent être 
   appliquées avant l'envoi des données. La logique de la vue est exécutée, 
   laquelle peut inclure l'utilisation d'éléments et/ou d'assistants. 
   Par défaut, la vue est rendue à travers une mise en page (layout).
#. D'autres fonctions de rappel (callbacks) du controller (comme afterFilter) 
   peuvent être exécutées. La vue complète et finale est envoyée au navigateur 
   de Ricardo.


.. meta::
    :title lang=fr: Une requête CakePHP typique
    :keywords lang=fr: élement optionnel,model utilisation,controller classe,custom cake,business logic,exemple requête,requête url,flow diagram,ingrédients basiques,bases de données,envoyer emails,callback,cakes,manipulation,authentification,router,serveur web,paramètres,cakephp,models
