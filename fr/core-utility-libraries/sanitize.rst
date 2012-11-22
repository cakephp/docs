Data Sanitization
#################

.. php:class:: Sanitize

La classe Sanitize de CakePHP peut être utilisée pour rid user-submitted data
of malicious data and other unwanted information. Sanitize est une librairie du 
coeur, donc elle peut être utilisée n'importe où à l'intérieur de votre code, 
mais est probablement mieux utilisée dans les controllers ou les models.

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

    :param mixed $data: Donnée à nettoyer.
    :param mixed $options: Options à utiliser pour le nettoyage, voir 
        ci-dessous.

    Cette fonction est une force industrielle, multi-purpose cleaner,
    amené à être utilisé pour des tableaux entiers (comme $this->data, 
    par exemple). Cette fonction prend un tableau (ou une chaîne) et 
    retourne la version propre. Les opérations de nettoyage suivants 
    sont effectuées sur chaque élément dans le tableau (de façon 
    récursive):

    -  Espaces étranges (incluant 0xCA) sont remplacés par des espaces 
       réguliers.
    -  Double-vérification des chars spéciaux et removal of carriage 
       returns pour augmenter la sécurité SQL.
    -  Ajout de slashes pour SQL (appelle justela fonction sql outlined
       ci-dessus).
    -  Swapping of user-inputted backslashes with trusted backslashes.

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

    :param string $string: Donnée à nettoyer.
    :param string $connection: Le nom de la base de données to quote the 
        string for, as named in your app/Config/database.php file.

    Utilisé pour échapper les requêtes SQL en ajoutant les slashes, selon la 
    configuration de magic\_quotes\_gpc su système courant.


.. php:staticmethod:: Sanitize::html($string, $options = array())

    :param string $string: Donnée à nettoyer.
    :param array $options: Un tableau d'options à utiliser, voir ci-dessous.

    Cette méthode prépare user-submitted data pour l'affichage à l'intérieur 
    du HTML. C'est particulièrement utilise si vous ne voulez pas que les 
    utilisateurs soient capables de casser vos layouts ou d'insérer des images 
    ou scripts à l'intérieur de vos pages HTML/ Si l'option $remove est définie 
    à true, le contenu HTML détecté est retiré plutôt que rendu en entités 
    HTML::

        $badString = '<font size="99" color="#FF0000">HEY</font><script>...</script>';
        echo Sanitize::html($badString);
        // output: &lt;font size=&quot;99&quot; color=&quot;#FF0000&quot;&gt;HEY&lt;/font&gt;&lt;script&gt;...&lt;/script&gt;
        echo Sanitize::html($badString, array('remove' => true));
        // output: HEY...

    Escaping is often a better strategy than stripping, as it has less room
    for error, and isn't vulnerable to new types of attacks, the stripping 
    function does not know about.

.. php:staticmethod:: Sanitize::paranoid($string, $allowedChars)

    :param string $string: Donnée à nettoyer.
    :param string $allowedChars: Un tableau de caractères non alpha numériques 
        autorisé.

    Cette fonction strips anything out of the target $string that is not
    a plain-jane alphanumeric character. The function can be made to
    overlook certain characters by passing them in $allowedChars
    array::

        $badString = ";:<script><html><   // >@@#";
        echo Sanitize::paranoid($badString);
        // sort: scripthtml
        echo Sanitize::paranoid($badString, array(' ', '@'));
        // sort: scripthtml    @@


.. meta::
    :title lang=fr: Data Sanitization
    :keywords lang=fr: notation tableau,sécurité sql,fonction sql,donnée malicieuse,classe controller,donnée options,raw html,librairie du coeur,carriage returns,connection base de données,orm,industrial strength,slashes,chars,multi purpose,arrays,cakephp,element,models
