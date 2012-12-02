Vues Media
==========

.. php:class:: MediaView

Les vues Media vous permettent d'envoyer des fichiers binaires à l'utilisateur. 
Par exemple, vous souhaiteriez avoir un répertoire de fichiers en dehors de 
webroot pour empêcher les utilisateurs de faire un lien direct sur eux. Vous
pouvez utiliser la vue Media pour tirer le fichier à partir d'un fichier spécial
dans /app/, vous permettant d'améliorer l'authentification avant la livraison 
du fichier à l'utilisateur.

Pour utiliser la vue Media, vous avez besoin de dire à votre controller
d'utiliser la classe MediaView au lieu de la classe View par défaut. Après 
ça, passez juste les paramètres en plus pour spécifier où votre fichier 
se trouve::

    class ExempleController extends AppController {
        public function telecharger () {
            $this->viewClass = 'Media';
            // Telecharge app/outside_webroot_dir/exemple.zip
            $params = array(
                'id'        => 'exemple.zip',
                'name'      => 'exemple',
                'download'  => true,
                'extension' => 'zip',
                'path'      => APP . 'outside_webroot_dir' . DS
            );
            $this->set($params);
        }
    }

Ici vous trouvez un exemple de rendu d'un fichier qui a un type mime qui n'est 
pas inclu dans le tableau ``$mimeType`` de MediaView. Nous utilisons aussi un
chemin relatif qui va être par défaut dans votre dossier ``app/webroot``::

    public function telecharger () {
        $this->viewClass = 'Media';
        // Rend app/webroot/files/exemple.docx
        $params = array(
            'id'        => 'exemple.docx',
            'name'      => 'exemple',
            'extension' => 'docx',
            'mimeType'  => array(
                'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ),
            'path'      => 'files' . DS
        );
        $this->set($params);
    }

Parmètres configurables
-----------------------

``id``
    L'ID est le nom du fichier tel qu'il réside sur le serveur de fichiers, y 
    compris l'extension de fichier.

``name``
    Le nom vous permet de spécifier un nom de fichier alternatif à envoyer à
    l'utilisateur. Spécifiez le nom sans l'extension du fichier.

``download``
    Une valeur boléenne indiquant si les en-têtes doivent être définis pour
    forcer le téléchargement.

``extension``
    L'extension du fichier. Ceci est en correspondance avec une liste 
    interne de types mime acceptables. Si le type MIME spécifié n'est
    pas dans la liste (ou envoyé dans le tableau de paramètres mimeType),
    le fichier ne sera pas téléchargé.

``path``
    Le nom du dossier, y compris le séparateur de répertoire finale. 
    Le chemin doit être absolu, mais peut être par rapport au dossier
    ``app/webroot``.

``mimeType``
    Un tableau avec des types MIME supplémentaires à fusionner avec 
    une liste interne dans MediaView de types mime acceptables.

``cache``
    Une valeur booléenne ou entière - Si la valeur est vraie, elle permettra 
    aux navigateurs de mettre en cache le fichier (par défaut à false si non 
    définie), sinon réglez le sur le nombre de secondes dans le futur pour
    lorsque le cache expirera.

.. todo::

    Inclut des exemples sur la façon d'envoyer des fichiers avec Media View.


.. meta::
    :title lang=fr: Vues Media
    :keywords lang=fr: tableau php,extension true,nom zip,chemin du document,mimetype,valeur booléenne,fichiers binaires,webroot,extension du fichier,type mime,vue par défault,fichier serveur,authentification,paramètres
