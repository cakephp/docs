Cookies
#######

Le Composant Cookie est un *wrapper* de la méthode native PHP setcookie.
Il inclue aussi une foule de nappages délicieux, pour rendre le codage
des cookies dans les contrôleurs très pratique. Avant de se lancer dans
l'utilisation du Composant Cookie, vous devez être sûr que 'Cookie' est
listé dans le tableau $components de vos contrôleurs.

Paramètrage du contrôleur
=========================

Il y a plusieurs variables de contrôleur qui vous permettent de
configurer la façon dont les cookies sont crées et gérés. Définir ces
variables spéciales dans la méthode beforeFilter() de votre contrôleur,
vous permet de définir la façon dont fonctionne le Composant Cookie.

Variable du Cookie

Valeur par défaut

Description

string $name

'CakeCookie'

Le nom du cookie.

string $key

null

Cette chaine est utilisée pour encoder la valeur écrite dans le cookie.
Elle doit être aléatoire et difficile à deviner.

string $domain

''

Le nom de domaine autorisé à accéder au cookie. Par ex : utilisez
'.votredomaine.com' pour autoriser l'accès à tous vos sous-domaines.

int ou string $time

'5 Days'

Le temps d'expiration de votre cookie. Les nombres entiers sont
interprétés comme des secondes et la valeur 0 est équivalente à 'cookie
de session' : c'est à dire que le cookie expire quand le navigateur est
fermé. Si une chaîne est définie, elle sera interprétée avec la fonction
PHP strtotime(). Vous pouvez paramétrer cela directement dans la méthode
write().

string $path

'/'

Le chemin sur le serveur où le cookie sera utilisé. Si $cookiePath est
'/foo/', le cookie sera seulement utilisable dans le dossier /foo/ et
dans tous ses sous-répertoires comme /foo/bar/ de votre domaine. La
valeur par défaut est le domaine entier. Vous pouvez le paramétrer
directement dans la méthode write().

boolean $secure

false

Indique que le cookie doit être transmis seulement par une connexion
sécurisée HTTPS. Quand il vaut true, le cookie sera créé seulement si
une connexion sécurisée existe. Vous pouvez le paramétrer directement
dans la méthode write().

Le fragment de contrôleur suivant montre comment inclure le Composant
Cookie et paramétrer les variables du contrôleur nécessaires pour écrire
un cookie nommé 'boulanger\_id', sur le domaine 'exemple.com' qui
nécessite une connexion sécurisée, accessible via le chemin
'/boulangers/preferences/' et qui expire dans une heure.

::

    var $components    = array('Cookie');
    function beforeFilter() {
      $this->Cookie->name = 'boulanger_id';
      $this->Cookie->time =  3600;  // ou '1 hour'
      $this->Cookie->path = '/boulangers/preferences/'; 
      $this->Cookie->domain = 'exemple.com';   
      $this->Cookie->secure = true;  // envoyé seulement si connexion HTTPS utilisée
      $this->Cookie->key = 'qSI232qs*&sXOw!';
    }

Maintenant, voyons comment utiliser les différentes méthodes du
Composant Cookie.

Utiliser le Composant
=====================

Cette section expose brièvement les méthodes du Composant Cookie.

**write(mixed $key, mixed $value, boolean $encrypt, mixed $expires)**

La méthode write() est le cœur du composant cookie, $key est le nom de
la variable de cookie que vous souhaitez et $value est l'information à
stocker.

::

    $this->Cookie->write('nom','Larry');

Vous pouvez aussi regrouper vos variables en utilisant la notation avec
point pour le paramètre key.

::

    $this->Cookie->write('Utilisateur.nom', 'Larry');
     $this->Cookie->write('Utilisateur.role','Chef');  

Si vous voulez écrire plus d'une valeur pour le cookie en une seule
fois, vous pouvez passer un tableau :

::

    $this->Cookie->write(
      array('nom'=>'Larry','role'=>'Chef')
      );  

Toutes les valeurs du cookie sont cryptées par défaut. Si vous voulez
stocker les valeurs en texte brut, définissez à false le troisième
paramètre de la méthode write().

::

    $this->Cookie->write('nom','Larry',false);

Le dernier paramètre pour write est $expires – nombre de secondes avant
que votre cookie n'expire. Par commodité, ce paramètre peut aussi être
passé sous forme d'une chaîne compréhensible par la fonction php
strtotime() :

::

    // Les deux cookies expirent dans une heure.
      $this->Cookie->write('prenom','Larry',false, 3600);
      $this->Cookie->write('nom','Masters',false, '1 hour');

**read(mixed $key)**

Cette méthode est utilisée pour lire la valeur d'une variable de cookie,
dont le nom est spécifié par $key.

::

    // Affiche "Larry"
      echo $this->Cookie->read('nom');
      
      // Vous pouvez aussi utiliser la notation avec point pour read
      echo $this->Cookie->read('Utilisateur.nom');
      
      // Pour récupérer sous forme de tableau, les variables que vous avez groupées
      // en utilisant la notation avec point, faites quelque chose comme :  
      $this->Cookie->read('Utilisateur');
      
      // ceci affiche quelque chose comme :
    array('nom' => 'Larry', 'role'=>'Chef')

**del(mixed $key)**

Supprime une variable de cookie, dont le nom est $key. Fonctionne pour
la notation avec point.

::

      // Supprime une variable
      $this->Cookie->del('bar')
      
      // Supprime la variable de cookie bar, mais pas tout ce qui se trouve sous foo
      $this->Cookie->del('foo.bar')
     

**destroy()**

Détruit le cookie courant.
