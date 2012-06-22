Une requête CakePHP typique
###########################

Nous avons découvert les ingrédients de bases de CakePHP, regardons
maintenant comment chaque objet travaille avec les autres pour répondre
à une requête simple. Poursuivons sur notre exemple original de requête,
imaginons que notre ami Ricardo vient de cliquer sur le lien "Achetez un 
Cake personnalisé maintenant !" sur la page d'accueil d'une application 
CakePHP.
   
   Flow diagram showing a typical CakePHP request
.. figure:: /_static/img/typical-cake-request.gif
   :align: center
   :alt:Diagramme représentant une requête CakePHP typique.

Noir = élément obligatoire, Gris = élément optionnel, Bleu = rappel (callback)

#. Ricardo clique sur le lien pointant vers http://www.example.com/cakes/buy 
   et son navigateur envoie une requête au serveur Web.
#. Le routeur analyse l'URL afin d'extraire les paramètres de cette requête 
   : le contrôleur, l'action et tout argument qui affectera la logique métier 
   pendant cette requête.
#. En utilisant les routes, l'URL d'une requête est liée à une action d'un 
   contrôleur (une méthode d'une classe contrôleur spécifique). Dans notre exemple,
   il s'agit de la méthode buy() du Contrôleur Cakes. La fonction de rappel du 
   contrôleur, beforeFilter(), est appelée avant que toute logique de l'action du
   contrôleur ne soit exécutée.
#. Le contrôleur peut utiliser des modèles pour accéder aux données de l'application.
   Dans cet exemple, le contrôleur utilise un modèle pour récupérer les derniers 
   achats de Ricardo depuis la base de données. Toute méthode de rappel du modèle,
   tout comportements ou sources de données peuvent s'appliquer pendant cette opération. 
   Bien que l'utilisation du modèle ne soit pas obligatoire, tous les contrôleurs
   CakePHP nécessitent au départ, au moins un modèle.
#. Une fois que le modèle a récupéré les données, elles sont retournées au contrôleur.
   Des fonctions de rappel du modèle peuvent s'exécuter.
#. Le contrôleur peut faire usage de composants pour affiner les données ou pour 
   effectuer d'autres opérations (manipulation de session, authentification ou envoi
   de mails par exemple).
#. Une fois que le contrôleur a utilisé les modèles et composants pour préparer suffisamment
   les données, ces données sont passées à la vue grâce à la méthode set(). Les méthodes 
   de rappel du contrôleur peuvent être appliquées avant l'envoi des données. La logique 
   de la vue est exécutée, laquelle peut inclure l'utilisation d'éléments et/ou d'assistants. 
   Par défaut, la vue est rendue à travers une mise en page (layout).
#. D'autres fonctions de rappel (callbacks) du contrôleur (comme afterFilter) peuvent être
   exécutées. La vue complète et final est envoyée au navigateur de Ricardo.


.. meta::
    :title lang=fr: Une requête CakePHP typique
    :keywords lang=fr: élement optionnel,modèle utilisation,contrôleur classe,custom cake,business logic,exemple requête,requête url,flow diagram,ingrédients basiques,bases de données,envoyer emails,callback,cakes,manipulation,authentification,router,web server,paramètres,cakephp,modèles