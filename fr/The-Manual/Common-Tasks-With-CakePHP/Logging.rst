Journalisation (logging)
########################

Bien que les réglages de la Classe Configure du cœur de CakePHP puissent
vraiment vous aider à voir ce qui se passe en arrière plan, vous aurez
besoin certaines fois, de consigner des données sur le disque pour
découvrir ce qui se produit. Dans un monde devenu plus dépendant des
technologies comme SOAP et AJAX, déboguer peut s'avérer difficile.

La journalisation (*logging*) peut aussi être une façon de découvrir ce
qui s'est passé dans votre application à chaque instant. Quels termes de
recherche ont été utilisés ? Quelles sortes d'erreurs mes utilisateurs
ont-il vues ? A quelle fréquence est exécutée une requête particulière ?

La journalisation des données dans CakePHP est facile - la fonction
log() est un élément de la classe Object, qui est l'ancêtre commun de la
plupart des classes CakePHP. Si le contexte est une classe CakePHP
(Modèle, Contrôleur, Composant... n'importe quoi d'autre), vous pouvez
journaliser vos données.

Utiliser la fonction log
========================

La fonction log() prend deux paramètres. Le premier est le message que
vous aimeriez écrire dans le fichier de log. Par défaut, ce message
d'erreur est écrit dans le fichier de log "error", qui se trouve dans
app/tmp/logs/error.log.

::

    // Exécuter ceci dans une classe CakePHP :
     
    $this->log("Quelque chose ne marche pas !");
     
    // Entraîne un ajout dans app/tmp/logs/error.log
     
    2007-11-02 10:22:02 Error: Quelque chose ne marche pas !

Le second paramètre est utilisé pour définir le type de fichier de log
dans lequel vous souhaitez écrire le message. S'il n'est pas précisé, le
type par défaut est LOG\_ERROR, qui écrit dans le fichier de log "error"
mentionné précédemment. Vous pouvez définir ce second paramètre à
LOG\_DEBUG pour écrire vos messages dans un fichier de log alternatif
situé dans app/tmp/logs/debug.log :

::

    // Exécuter ceci dans une classe CakePHP :
     
    $this->log('Un message de débug', LOG_DEBUG);
     
    // Entraîne un ajout dans app/tmp/logs/debug.log (plutôt que dans error.log)
     
    2007-11-02 10:22:02 Error: un message de débug.

Vous pouvez aussi spécifier un nom différent pour le fichier de log, en
définissant le second paramètre avec le nom de ce fichier.

::

    // Exécuter ceci dans une classe CakePHP :
     
    $this->log("Un message spécial pour la journalisation de l'activité", 'activite');
     
    // Entraîne un ajout dans app/tmp/logs/activite.log (plutôt que dans error.log)
     
    2007-11-02 10:22:02 Activite: Un message spécial pour la journalisation de l’activité

Votre dossier app/tmp doit être accessible en écriture par le serveur
web pour que la journalisation fonctionne correctement.
