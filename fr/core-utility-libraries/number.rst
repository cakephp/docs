CakeNumber
##########

.. php:class:: CakeNumber()

Si vous avez besoin des fonctionnalités de :php:class:`NumberHelper` en dehors 
d'une ``View``, utilisez la classe ``CakeNumber``::

    class UsersController extends AppController {

        public $components = array('Auth');

        public function afterLogin() {
            App::uses('CakeNumber', 'Utility');
            $storageUsed = $this->Auth->user('storage_used');
            if ($storageUsed > 5000000) {
                // notify users of quota
                $this->Session->setFlash(__('You are using %s storage', CakeNumber::toReadableSize($storageUsed)));
            }
        }
    }

.. versionadded:: 2.1
    ``CakeNumber`` a été refondu à partir de :php:class:`NumberHelper`.

.. start-cakenumber

Toutes ces fonctions retournent le nombre formaté; Elles n'affichent pas 
automatiqement la sortie dans la vue.

.. php:method:: currency(mixed $number, string $currency = 'USD', array $options = array())

    :param float $number: La valeur à convertir.
    :param string $currency: Le format de monnaie connu à utiliser.
    :param array $options: Options, voir ci-dessous.

    Cette méthode est utilisée pour afficher un nombre dans des formats de 
    monnaie courante (EUR,GBP,USD). L'utilisation dans une vue ressemble à 
    ceci::

        // Appelé par NumberHelper
        echo $this->Number->currency($number, $currency);

        // Appelé par CakeNumber
        App::uses('CakeNumber', 'Utility');
        echo CakeNumber::currency($number, $currency);

    Le premier paramètre, $number, doit être un nombre à virgule qui représente 
    le montant d'argent que vous désirez. Le second paramètre est utilisé pour 
    choisir un schéma de formatage de monnaie courante:

    +---------------------+----------------------------------------------------+
    | $currency           | 1234.56, formaté par le type courant               |
    +=====================+====================================================+
    | EUR                 | € 1.236,33                                         |
    +---------------------+----------------------------------------------------+
    | GBP                 | £ 1,236.33                                         |
    +---------------------+----------------------------------------------------+
    | USD                 | $ 1,236.33                                         |
    +---------------------+----------------------------------------------------+

    The third parameter is an array of options for further defining the
    output. The following options are available:

    +---------------------+----------------------------------------------------+
    | Option              | Description                                        |
    +=====================+====================================================+
    | before              | Le symbole de la monnaie à placer avant les nombres|
    |                     | ex: '$'                                            |
    +---------------------+----------------------------------------------------+
    | after               | Le symbole de la monnaie à placer après les nombres|
    |                     | décimaux                                           |
    |                     | ex: 'c'. Définit le boléeen à false pour utiliser  |
    |                     | aucun symbole décimal                              |
    |                     | ex: 0.35 => $0.35.                                 |
    +---------------------+----------------------------------------------------+
    | zero                | Le texte à utiliser pour des valeurs à zéro, peut  |
    |                     | être une chaîne de caractères ou un nombre.        |
    |                     | ex: 0, 'Free!'                                     |
    +---------------------+----------------------------------------------------+
    | places              | Nombre de décimales à utiliser. ex: 2              |
    +---------------------+----------------------------------------------------+
    | thousands           | Séparateur des milliers ex: ','                    |
    +---------------------+----------------------------------------------------+
    | decimals            | Symbole de Séparateur des décimales. ex: '.'       |
    +---------------------+----------------------------------------------------+
    | negative            | Symbole pour les nombres négatifs. Si égal à '()', |
    |                     | le nombre sera entouré avec ( et )                 |
    +---------------------+----------------------------------------------------+
    | escape              | La sortie doit-elle être échappée de htmlentity?   |
    |                     | Par défaut défini à true                           |
    +---------------------+----------------------------------------------------+
    | wholeSymbol         | La chaîne de caractères à utiliser pour les tous   |
    |                     | nombres. ex: ' dollars'                            |
    +---------------------+----------------------------------------------------+
    | wholePosition       | Soit 'before' soit 'after' pour placer le symbole  |
    |                     | entier                                             |
    +---------------------+----------------------------------------------------+
    | fractionSymbol      | Chaîne de caractères à utiliser pour les nombres   |
    |                     | en fraction. ex: ' cents'                          |
    +---------------------+----------------------------------------------------+
    | fractionPosition    | Soit 'before' soit 'after' pour placer le symbole  |
    |                     | de fraction                                        |
    +---------------------+----------------------------------------------------+

    Si une valeur $currency non reconnue est fournie, elle est préfixée par un 
    nombre formaté en USD. Par exemple::

        // Appelé par NumberHelper
        echo $this->Number->currency('1234.56', 'FOO');

        // Sortie
        FOO 1,234.56

        // Appelé par CakeNumber
        App::uses('CakeNumber', 'Utility');
        echo CakeNumber::currency('1234.56', 'FOO');

.. php:method:: addFormat(string $formatName, array $options)
    
    :param string $formatName: Le nom du format à utiliser dans le futur.
    :param array $options: Le tableau d'options pour ce format.

        - `before` Symbole de monnaie avant le nombre. False pour aucun.
        - `after` Symbole de monnaie après le nombre. False pour aucun.
        - `zero` Le texte à utiliser pour les valeurs à zéro, peut être 
          une chaîne de caractères ou un nombre.
          ex: 0, 'Free!'
        - `places` Nombre de décimal à utiliser. ex. 2.
        - `thousands` Séparateur des milliers. ex: ','.
        - `decimals` Symbole de Séparateur des Decimales. ex: '.'.
        - `negative` Symbole pour les nombres négatifs. Si égal à '()', le 
          nombre sera entouré avec ( et ).
        - `escape` La sortie doit-elle être échappée de htmlentity? Par défaut 
          à true
        - `wholeSymbol` Chaîne de caractères à utiliser pour tous les nombres. 
          ex: ' dollars'.
        - `wholePosition` Soit 'before' soit 'after' pour placer le symbole 
          complet.
        - `fractionSymbol` Chaîne de caractères à utiliser pour les nombres à 
          fraction. ex: ' cents'.
        - `fractionPosition` Soit 'before' soit 'after' pour placer le symbole 
          de fraction.

    Ajouter le format de monnaie au helper Number. Facilite la réutilisation 
    des formats de monnaie.::

        // appelé par NumberHelper
        $this->Number->addFormat('BRR', array('before' => 'R$ '));

        // appelé par CakeNumber
        App::uses('CakeNumber', 'Utility');
        CakeNumber::addFormat('BRR', array('before' => 'R$ '));

    Vous pouvez maintenant utiliser `BRR` de manière courte quand vous 
    formattez les montants de monnaie::

        // appelé par NumberHelper
        echo $this->Number->currency($value, 'BRR');

        // appelé par CakeNumber
        App::uses('CakeNumber', 'Utility');
        echo CakeNumber::currency($value, 'BRR');

    Les formats ajoutés sont fusionnés avec les formats par défaut suivants::

       array(
           'wholeSymbol'      => '',
           'wholePosition'    => 'before',
           'fractionSymbol'   => '',
           'fractionPosition' => 'after',
           'zero'             => 0,
           'places'           => 2,
           'thousands'        => ',',
           'decimals'         => '.',
           'negative'         => '()',
           'escape'           => true
       )

.. php:method:: precision(mixed $number, int $precision = 3)

    :param float $number: La valeur à convertir
    :param integer $precision: Le nombre de décimal à afficher

    Cette méthode affiche un nombre avec le montant de précision spécifié 
    (place de la décimal). Elle arrondira afin de maintenir le niveau de 
    précision défini.:: 

        // appelé par NumberHelper
        echo $this->Number->precision(456.91873645, 2 );

        // Sortie
        456.92

        // appelé par CakeNumber
        App::uses('CakeNumber', 'Utility');
        echo CakeNumber::precision(456.91873645, 2 );


.. php:method:: toPercentage(mixed $number, int $precision = 2)

    :param float $number: La valeur à convertir
    :param integer $precision: Le nomnbre de décimal à afficher

    Comme precision(), cette méthode formate un nombre selon la précision 
    fournie (où les nombres sont arrondis pour parvenir à ce degré de 
    précision). Cette méthode exprime aussi le nombre en tant que 
    pourcentage et préfixe la sortie avec un signe de pourcent.::
    
        // appelé par NumberHelper
        echo $this->Number->toPercentage(45.691873645);

        // Sortie
        45.69%

        // appelé par CakeNumber
        App::uses('CakeNumber', 'Utility');
        echo CakeNumber::toPercentage(45.691873645);

.. php:method:: toReadableSize(string $data_size)

    :param string $data_size: Le nombre de bytes pour le rendre lisible. 

    Cette méthode formate les tailles de données dans des formes lisibles 
    pour l'homme. Elle fournit une manière raccourcie de convertir les 
    en KB, MB, GB, et TB. La taille est affichée avec un niveau de précision 
    à deux chiffres, selon la taille de données fournie (ex: les tailles 
    supérieurs sont exprimées dans des termes plus larges)::

        // appelé par NumberHelper
        echo $this->Number->toReadableSize(0); // 0 Bytes
        echo $this->Number->toReadableSize(1024); // 1 KB
        echo $this->Number->toReadableSize(1321205.76); // 1.26 MB
        echo $this->Number->toReadableSize(5368709120); // 5.00 GB

        // appelé par CakeNumber
        App::uses('CakeNumber', 'Utility');
        echo CakeNumber::toReadableSize(0); // 0 Bytes
        echo CakeNumber::toReadableSize(1024); // 1 KB
        echo CakeNumber::toReadableSize(1321205.76); // 1.26 MB
        echo CakeNumber::toReadableSize(5368709120); // 5.00 GB

.. php:method:: format(mixed $number, mixed $options=false)

    Cette méthode vous donne beaucoup plus de contrôle sur le formatage des 
    nombres pour l'utilisation dans vos vues (et est utilisée en tant que 
    méthode principale par la plupart des autres méthodes de NumberHelper). 
    L'utilisation de cette méthode pourrait ressembler à cela::

        // appelé par NumberHelper
        $this->Number->format($number, $options);

        // appelé par CakeNumber
        CakeNumber::format($number, $options);

    Le paramètre $number est le nombre que vous souhaitez formater pour la 
    sortie. Avec aucun $options fourni, le nombre 1236.334 sortirait comme 
    ceci : 1,236. Notez que la précision par défaut est d'aucun chiffre après 
    la virgule.

    Le paramètre $options est là où réside la réelle magie de cette méthode.


    -  Si vous passez un entier alors celui-ci devient le montant de précision 
       pour la fonction.
    -  Si vous passez un tableau associatif, vous pouvez utiliser les clés 
       suivantes:

       -  places (integer): le montant de précision désiré.
       -  before (string): à mettre avant le nombre à sortir.
       -  escape (boolean): si vous voulez la valeur avant d'être échappée
       -  decimals (string): utilisé pour délimiter les places des décimales 
          dans le nombre.
       -  thousands (string): utilisé pour marquer les milliers, millions, …

    Exemple::

        // appelé par NumberHelper
        echo $this->Number->format('123456.7890', array(
            'places' => 2,
            'before' => '¥ ',
            'escape' => false,
            'decimals' => '.',
            'thousands' => ','
        ));
        // sortie '¥ 123,456.79'

        // appelé par CakeNumber
        App::uses('CakeNumber', 'Utility');
        echo CakeNumber::format('123456.7890', array(
            'places' => 2,
            'before' => '¥ ',
            'escape' => false,
            'decimals' => '.',
            'thousands' => ','
        ));
        // sortie '¥ 123,456.79'

.. end-cakenumber


.. meta::
    :title lang=fr: NumberHelper
    :description lang=fr: Le Helper Number contient des méthodes pratiques qui permettent l'affichage de nombres dans des formats habituels dans vos vues.
    :keywords lang=fr: number helper,monnaie,format nombre,précision nombre,format fichier taille,format nombres
