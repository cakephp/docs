CakeNumber
##########

.. php:class:: CakeNumber()

Si vous avez besoin des fonctionnalités de :php:class:`NumberHelper` en-dehors
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

.. php:method:: currency(float $number, string $currency = 'USD', array $options = array())

    :param float $number: La valeur à convertir.
    :param string $currency: Le format de monnaie connu à utiliser.
    :param array $options: Options, voir ci-dessous.

    Cette méthode est utilisée pour afficher un nombre dans des formats de
    monnaie courante (EUR,GBP,USD). L'utilisation dans une vue ressemble à
    ceci::

        // Appelé avec NumberHelper
        echo $this->Number->currency($number, $currency);

        // Appelé avec CakeNumber
        App::uses('CakeNumber', 'Utility');
        echo CakeNumber::currency($number, $currency);

    Le premier paramètre $number, doit être un nombre à virgule qui représente
    le montant d'argent que vous désirez. Le second paramètre est utilisé pour
    choisir un schéma de formatage de monnaie courante:

    +---------------------+----------------------------------------------------+
    | $currency           | 1234.56, formaté par le type courant               |
    +=====================+====================================================+
    | EUR                 | €1.234,56                                          |
    +---------------------+----------------------------------------------------+
    | GBP                 | £1,234.56                                          |
    +---------------------+----------------------------------------------------+
    | USD                 | $1,234.56                                          |
    +---------------------+----------------------------------------------------+

    Le troisième paramètre est un tableau d'options pour définir la sortie. Les
    options suivantes sont disponibles:

    +---------------------+----------------------------------------------------+
    | Option              | Description                                        |
    +=====================+====================================================+
    | before              | Le symbole de la monnaie à placer avant les nombres|
    |                     | ex: '$'                                            |
    +---------------------+----------------------------------------------------+
    | after               | Le symbole de la monnaie à placer après les nombres|
    |                     | décimaux                                           |
    |                     | ex: 'c'. Définit le booléen à false pour utiliser  |
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
    | fractionExponent    | Fraction exponent de cette monnaie spécifique.     |
    |                     | Par défaut à 2.                                    |
    +---------------------+----------------------------------------------------+

    Si une valeur $currency non reconnue est fournie, elle est préfixée par un
    nombre formaté en USD. Par exemple::

        // Appelé avec NumberHelper
        echo $this->Number->currency('1234.56', 'FOO');

        // Sortie
        FOO 1,234.56

        // Appelé avec CakeNumber
        App::uses('CakeNumber', 'Utility');
        echo CakeNumber::currency('1234.56', 'FOO');

.. php:method:: defaultCurrency(string $currency)

    :param string $currency: Défini une monnaie connu pour
        :php:meth:`CakeNumber::currency()`.

    Setter/getter pour la monnaie par défaut. Ceci retire la nécessité de
    toujours passer la monnaie à :php:meth:`CakeNumber::currency()` et change
    toutes les sorties de monnaie en définissant les autres par défaut.

    .. versionadded:: 2.3 Cette méthode a été ajoutée dans 2.3.

.. php:method:: addFormat(string $formatName, array $options)

    :param string $formatName: Le nom du format à utiliser dans le futur.
    :param array $options: Le tableau d'options pour ce format. Utilise les
        mêmes clés ``$options`` comme :php:meth:`CakeNumber::currency()`.

        - `before` Symbole de monnaie avant le nombre. False pour aucun.
        - `after` Symbole de monnaie après le nombre. False pour aucun.
        - `zero` Le texte à utiliser pour les valeurs à zéro, peut être
          une chaîne de caractères ou un nombre.
          ex: 0, 'Free!'
        - `places` Nombre de décimal à utiliser. ex. 2.
        - `thousands` Séparateur des milliers. ex: ','.
        - `decimals` Symbole de Séparateur des décimales. ex: '.'.
        - `negative` Symbole pour les nombres négatifs. Si égal à '()', le
          nombre sera entouré avec ( et ).
        - `escape` La sortie doit-elle être échappée de htmlentity? Par défaut
          à true.
        - `wholeSymbol` Chaîne de caractères à utiliser pour tous les nombres.
          ex: ' dollars'.
        - `wholePosition` Soit 'before' soit 'after' pour placer le symbole
          complet.
        - `fractionSymbol` Chaîne de caractères à utiliser pour les nombres à
          fraction. ex: ' cents'.
        - `fractionPosition` Soit 'before' soit 'after' pour placer le symbole
          de fraction.

    Ajoute le format de monnaie au helper Number. Facilite la réutilisation
    des formats de monnaie. ::

        // appelé par NumberHelper
        $this->Number->addFormat('BRL', array('before' => 'R$', 'thousands' => '.', 'decimals' => ','));

        // appelé par CakeNumber
        App::uses('CakeNumber', 'Utility');
        CakeNumber::addFormat('BRL', array('before' => 'R$', 'thousands' => '.', 'decimals' => ','));

    Vous pouvez maintenant utiliser `BRL` de manière courte quand vous
    formatez les montants de monnaie::

        // appelé par NumberHelper
        echo $this->Number->currency($value, 'BRL');

        // appelé par CakeNumber
        App::uses('CakeNumber', 'Utility');
        echo CakeNumber::currency($value, 'BRL');

    Les formats ajoutés sont fusionnés avec les formats par défaut suivants::

       array(
           'wholeSymbol'      => '',
           'wholePosition'    => 'before',
           'fractionSymbol'   => false,
           'fractionPosition' => 'after',
           'zero'             => 0,
           'places'           => 2,
           'thousands'        => ',',
           'decimals'         => '.',
           'negative'         => '()',
           'escape'           => true,
           'fractionExponent' => 2
       )

.. php:method:: precision(mixed $number, int $precision = 3)

    :param float $number: La valeur à convertir
    :param integer $precision: Le nombre de décimal à afficher

    Cette méthode affiche un nombre avec le montant de précision spécifié
    (place de la décimal). Elle arrondira afin de maintenir le niveau de
    précision défini. ::

        // appelé avec NumberHelper
        echo $this->Number->precision(456.91873645, 2 );

        // Sortie
        456.92

        // appelé avec CakeNumber
        App::uses('CakeNumber', 'Utility');
        echo CakeNumber::precision(456.91873645, 2 );


.. php:method:: toPercentage(mixed $number, int $precision = 2, array $options = array())

    :param float $number: La valeur à convertir.
    :param integer $precision: Le nombre de décimal à afficher.
    :param array $options: Options, voir ci-dessous.

    +---------------------+----------------------------------------------------+
    | Option              | Description                                        |
    +=====================+====================================================+
    | multiply            | Booléen pour indiquer si la valeur doit être       |
    |                     | multipliée par 100. Utile pour les pourcentages    |
    |                     | avec décimal.                                      |
    +---------------------+----------------------------------------------------+

    Comme precision(), cette méthode formate un nombre selon la précision
    fournie (où les nombres sont arrondis pour parvenir à ce degré de
    précision). Cette méthode exprime aussi le nombre en tant que
    pourcentage et préfixe la sortie avec un signe de pourcent. ::

        // appelé avec NumberHelper. Sortie: 45.69%
        echo $this->Number->toPercentage(45.691873645);

        // appelé avec CakeNumber. Sortie: 45.69%
        App::uses('CakeNumber', 'Utility');
        echo CakeNumber::toPercentage(45.691873645);

        // Appelé avec multiply. Sortie: 45.69%
        echo CakeNumber::toPercentage(0.45691, 2, array(
            'multiply' => true
        ));

    .. versionadded:: 2.4
        L'argument ``$options`` avec l'option ``multiply`` a été ajouté.

.. php:method:: fromReadableSize(string $size, $default)

    :param string $size: La valeur formatée lisible par un humain.

    Cette méthode enlève le format d'un nombre à partir d'une taille de byte
    lisible par un humain en un nombre entier de bytes.

    .. versionadded:: 2.3
        Cette méthode a été ajoutée dans 2.3

.. php:method:: toReadableSize(string $dataSize)

    :param string $data_size: Le nombre de bytes pour le rendre lisible.

    Cette méthode formate les tailles de données dans des formes lisibles
    pour l'homme. Elle fournit une manière raccourcie de convertir les
    en KB, MB, GB, et TB. La taille est affichée avec un niveau de précision
    à deux chiffres, selon la taille de données fournie (ex: les tailles
    supérieurs sont exprimées dans des termes plus larges)::

        // appelé avec NumberHelper
        echo $this->Number->toReadableSize(0); // 0 Bytes
        echo $this->Number->toReadableSize(1024); // 1 KB
        echo $this->Number->toReadableSize(1321205.76); // 1.26 MB
        echo $this->Number->toReadableSize(5368709120); // 5.00 GB

        // appelé avec CakeNumber
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

        // appelé avec NumberHelper
        $this->Number->format($number, $options);

        // appelé avec CakeNumber
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
       -  escape (boolean): si vous voulez la valeur avant d'être échappée.
       -  decimals (string): utilisé pour délimiter les places des décimales
          dans le nombre.
       -  thousands (string): utilisé pour marquer les milliers, millions, …

    Exemple::

        // appelé avec NumberHelper
        echo $this->Number->format('123456.7890', array(
            'places' => 2,
            'before' => '¥ ',
            'escape' => false,
            'decimals' => '.',
            'thousands' => ','
        ));
        // sortie '¥ 123,456.79'

        // appelé avec CakeNumber
        App::uses('CakeNumber', 'Utility');
        echo CakeNumber::format('123456.7890', array(
            'places' => 2,
            'before' => '¥ ',
            'escape' => false,
            'decimals' => '.',
            'thousands' => ','
        ));
        // sortie '¥ 123,456.79'

.. php:method:: formatDelta(mixed $number, mixed $options=array())

    Cette méthode affiche les différences en valeur comme un nombre signé::

        // appelé avec NumberHelper
        $this->Number->formatDelta($number, $options);

        // appelé avec CakeNumber
        CakeNumber::formatDelta($number, $options);

    Le paramètre $number est le nombre que vous planifiez sur le formatage
    de sortie. Avec aucun $options fourni, le nombre 1236.334 sortirait
    1,236. Notez que la valeur de précision par défaut est aucune décimale.

    Le paramètre $options prend les mêmes clés que
    :php:meth:`CakeNumber::format()` lui-même:

    -  places (integer): le montant de precision souhaité.
    -  before (string): à mettre avant le nombre sorti.
    -  after (string): à mettre après le nombre sorti.
    -  decimals (string): utilisé pour délimiter les places de la décimal
       dans un nombre.
    -  thousands (string): utilisé pour marquer les places des centaines,
       millions, …

    Exemple::

        // appelé avec NumberHelper
        echo $this->Number->formatDelta('123456.7890', array(
            'places' => 2,
            'decimals' => '.',
            'thousands' => ','
        ));
        // sortie '+123,456.79'

        // appelé avec CakeNumber
        App::uses('CakeNumber', 'Utility');
        echo CakeNumber::formatDelta('123456.7890', array(
            'places' => 2,
            'decimals' => '.',
            'thousands' => ','
        ));
        // sortie '+123,456.79'

    .. versionadded:: 2.3
        Cette méthode a été ajoutée dans 2.3.

.. end-cakenumber


.. meta::
    :title lang=fr: NumberHelper
    :description lang=fr: Le Helper Number contient des méthodes pratiques qui permettent l'affichage de nombres dans des formats habituels dans vos vues.
    :keywords lang=fr: number helper,monnaie,format nombre,précision nombre,format fichier taille,format nombres
