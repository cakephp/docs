Data Sanitization (Nettoyage des Données)
#########################################

.. php:class:: Sanitize

La classe Sanitize de CakePHP peut être utilisée pour rid user-submitted data
of malicious data and d'autres informations non souhaitées. Sanitize est une
librairie du coeur, donc elle peut être utilisée n'importe où à l'intérieur de
votre code, mais est probablement mieux utilisée dans les controllers ou les
models.

CakePHP vous protège déjà contre les Injections SQL **si** vous utilisez
les méthodes ORM de CakePHP (comme find() et save()) et la notation de
tableau appropriée (par ex: array('field' => $value)) au lieu d'un raw SQL.
Pour la sanitization contre XSS, il est généralement meilleur de sauvegarder
le raw HTML dans la base de données sans modification et sanitize au moment
de la sortie/affichage.

Tout ce dont vous avez besoin est d'inclure la librairie du coeur Sanitize
(par ex: avant la définition de la classe de controller)::

    App::uses('Sanitize', 'Utility');
    
    class MyController extends AppController {
        ...
        ...
    }

Uen fois qu c'est fait, vous pouvez faire des appels statiquement de Sanitize.

.. php:staticmethod:: Sanitize::clean($data, $options)

    :param mixed $data: Données à nettoyer.
    :param mixed $options: Options à utiliser pour le nettoyage, voir
        ci-dessous.

    Cette fonction est une force industrielle, multi-purpose cleaner,
    amenée à être utilisée pour des tableaux entiers (comme $this->data,
    par exemple). Cette fonction prend un tableau (ou une chaîne) et
    retourne la version propre. Les opérations de nettoyage suivants
    sont effectuées sur chaque élément dans le tableau (de façon
    récursive):

    -  Espaces étranges (incluant 0xCA) sont remplacés par des espaces
       réguliers.
    -  Double-vérification des chars spéciaux et supprimer les retours chariot
       pour augmenter la sécurité SQL.
    -  Ajout de slashes pour SQL (appelle juste la fonction sql soulignée
       ci-dessus).
    -  Echange des entrées anti-slash des utilisateurs avec des backslashes.

    L'argument $options peut être soit une chaîne, soit un tableau. Quand
    une chaîne est fournie, c'est le nom de la connection à la base de
    données. Si un tableau est fourni il sera fusionné avec les options
    suivantes:


    -  connection
    -  odd\_spaces
    -  encode
    -  dollar
    -  carriage
    -  unicode
    -  escape
    -  backslash
    -  remove\_html (doit être utilisé en conjonction avec le paramètre encode)

    L'utilisation de clean() avec options ressemble à ce qui suit::

        $this->data = Sanitize::clean($this->data, array('encode' => false));


.. php:staticmethod:: Sanitize::escape($string, $connection)

    :param string $string: Données à nettoyer.
    :param string $connection: Le nom de la base de données comme nommé
        dans votre fichier app/Config/database.php.

    Utilisé pour échapper les requêtes SQL en ajoutant les slashes, selon la
    configuration de magic\_quotes\_gpc su système courant.


.. php:staticmethod:: Sanitize::html($string, $options = array())

    :param string $string: Données à nettoyer.
    :param array $options: Un tableau d'options à utiliser, voir ci-dessous.

    Cette méthode prépare des données soumis à l'utilisateur pour l'affichage
    à l'intérieur du HTML. C'est particulièrement utilise si vous ne voulez
    pas que les utilisateurs soient capables de casser vos layouts ou d'insérer
    des images ou scripts à l'intérieur de vos pages HTML. Si l'option $remove
    est définie à true, le contenu HTML détecté est retiré plutôt que rendu en
    entités HTML::

        $badString = '<font size="99" color="#FF0000">HEY</font><script>...</script>';
        echo Sanitize::html($badString);
        // output: &lt;font size=&quot;99&quot; color=&quot;#FF0000&quot;&gt;HEY&lt;/font&gt;&lt;script&gt;...&lt;/script&gt;
        echo Sanitize::html($badString, array('remove' => true));
        // sort: HEY...

    Echapper le contenu HTML en utilisant :php:func:`h` est souvent une
    meilleur stratégie par rapport à la sanitization, puisqu'elle laisse
    moins de place aux erreurs, et n'est pas vulnérable aux nouveaux types
    d'attaques, que la fonction d'échappement ne connait pas.

.. php:staticmethod:: Sanitize::paranoid($string, $allowedChars)

    :param string $string: Données à nettoyer.
    :param string $allowedChars: Un tableau de caractères non alpha numériques
        autorisé.

    Cette fonction enlève tout de la cible $string qui n'est pas un caractère
    plain-jane alphanumeric. La fonction peut être faite pour négliger certains
    caractères en les faisant passer dans un tableau $allowedChars::

        $badString = ";:<script><html><   // >@@#";
        echo Sanitize::paranoid($badString);
        // sort: scripthtml
        echo Sanitize::paranoid($badString, array(' ', '@'));
        // sort: scripthtml    @@


.. meta::
    :title lang=fr: Data Sanitization (Nettoyage des Données)
    :keywords lang=fr: notation tableau,sécurité sql,fonction sql,donnée malicieuse,classe controller,donnée options,raw html,librairie du coeur,carriage returns,connection base de données,orm,industrial strength,slashes,chars,multi purpose,arrays,cakephp,element,models
