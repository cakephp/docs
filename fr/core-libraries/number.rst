Number
######

.. php:namespace:: Cake\I18n

.. php:class:: Number

Si vous avez besoin des fonctionnalités de :php:class:`NumberHelper` en-dehors
d'une ``View``, utilisez la classe ``Number``::

    namespace App\Controller;

    use Cake\I18n\Number;

    class UsersController extends AppController
    {

        public function initialize()
        {
            parent::initialize();
            $this->loadComponent('Auth');
        }

        public function afterLogin()
        {
            $storageUsed = $this->Auth->user('storage_used');
            if ($storageUsed > 5000000) {
                // Notify users of quota
                $this->Flash->success(__('You are using {0} storage', Number::toReadableSize($storageUsed)));
            }
        }
    }

.. start-cakenumber

Toutes ces fonctions retournent le nombre formaté; Elles n'affichent pas
automatiquement la sortie dans la vue.

Formatage des Devises
=====================

.. php:method:: currency(mixed $value, string $currency = null, array $options = [])

Cette méthode est utilisée pour afficher un nombre dans des formats de
monnaie courante (EUR,GBP,USD). L'utilisation dans une vue ressemble à
ceci::

    // Appelé avec NumberHelper
    echo $this->Number->currency($value, $currency);

    // Appelé avec Number
    echo CakeNumber::currency($value, $currency);

Le premier paramètre ``$value``, doit être un nombre décimal qui représente
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
| before              | Chaine de caractères à placer avant le nombre.     |
+---------------------+----------------------------------------------------+
| after               | Chaine de caractères à placer après le nombre.     |
+---------------------+----------------------------------------------------+
| zero                | Le texte à utiliser pour des valeurs à zéro, peut  |
|                     | être une chaîne de caractères ou un nombre.        |
|                     | ex: 0, 'Free!'                                     |
+---------------------+----------------------------------------------------+
| places              | Nombre de décimales à utiliser. ex: 2              |
+---------------------+----------------------------------------------------+
| precision           | Nombre maximal de décimale à utiliser. ex :2       |
+---------------------+----------------------------------------------------+
| locale              | Le nom de la locale utilisée pour formatter le     |
|                     | nombre, ie. "fr_FR".                               |
+---------------------+----------------------------------------------------+
| fractionSymbol      | Chaîne de caractères à utiliser pour les nombres   |
|                     | en fraction. ex: ' cents'                          |
+---------------------+----------------------------------------------------+
| fractionPosition    | Soit 'before' soit 'after' pour placer le symbole  |
|                     | de fraction                                        |
+---------------------+----------------------------------------------------+
| pattern             | Un modèle de formatage ICU à utiliser pour         |
|                     | formatter le nombre. ex: #,###.00                  |
+---------------------+----------------------------------------------------+
| useIntlCode         | Mettre à ``true`` pour remplacer le symbole        |
|                     | monétaire par le code monétaire international      |
+---------------------+----------------------------------------------------+

Si la valeur de $currency est ``null``, la devise par défaut est récupérée par
:php:meth:`Cake\\I18n\\Number::defaultCurrency()`.

Paramétrage de la Devise par Défaut
===================================

.. php:method:: defaultCurrency(string $currency)

Setter/getter pour la monnaie par défaut. Ceci retire la nécessité de
toujours passer la monnaie à :php:meth:`Cake\\I18n\\Number::currency()` et
change toutes les sorties de monnaie en définissant les autres par défaut.
Si ``$currency`` est ``false``, cela effacera la valeur actuellement
enregistrée.
Par défaut, cette fonction retourne la valeur ``intl.default_locale`` si définie
et 'en_US' sinon.

Formatage Des Nombres A Virgules Flottantes
===========================================

.. php:method:: precision(float $value, int $precision = 3, array $options = [])

Cette méthode affiche un nombre avec la précision spécifiée (place de la
décimale). Elle arrondira afin de maintenir le niveau de précision défini::

    // Appelé avec NumberHelper
    echo $this->Number->precision(456.91873645, 2 );

    // Sortie
    456.92

    // Appelé avec Number
    echo Number::precision(456.91873645, 2 );

Formatage Des Pourcentages
==========================

.. php:method:: toPercentage(mixed $value, int $precision = 2, array $options = [])

+---------------------+----------------------------------------------------+
| Option              | Description                                        |
+=====================+====================================================+
| multiply            | Booléen pour indiquer si la valeur doit être       |
|                     | multipliée par 100. Utile pour les pourcentages    |
|                     | avec décimale.                                     |
+---------------------+----------------------------------------------------+

Comme :php:meth:`Cake\\I18n\\Number::precision()`, cette méthode formate un
nombre selon la précision fournie (où les nombres sont arrondis pour parvenir
à ce degré de précision). Cette méthode exprime aussi le nombre en tant que
pourcentage et ajoute un signe de pourcent à la sortie::

    // appelé avec NumberHelper. Sortie: 45.69%
    echo $this->Number->toPercentage(45.691873645);

    // appelé avec Number. Sortie: 45.69%
    echo Number::toPercentage(45.691873645);

    // Appelé avec multiply. Sortie: 45.69%
    echo Number::toPercentage(0.45691, 2, [
        'multiply' => true
    ]);

Interagir Avec Des Valeurs Lisibles Par L'Homme
===============================================

.. php:method:: toReadableSize(string $dataSize)

Cette méthode formate les tailles de données dans des formes lisibles
pour l'homme. Elle fournit une manière raccourcie de convertir les
en KB, MB, GB, et TB. La taille est affichée avec un niveau de précision
à deux chiffres, selon la taille de données fournie (ex: les tailles
supérieurs sont exprimées dans des termes plus larges)::

    // Appelé avec NumberHelper
    echo $this->Number->toReadableSize(0); // 0 Byte
    echo $this->Number->toReadableSize(1024); // 1 KB
    echo $this->Number->toReadableSize(1321205.76); // 1.26 MB
    echo $this->Number->toReadableSize(5368709120); // 5 GB

    // Appelé avec Number
    echo Number::toReadableSize(0); // 0 Byte
    echo Number::toReadableSize(1024); // 1 KB
    echo Number::toReadableSize(1321205.76); // 1.26 MB
    echo Number::toReadableSize(5368709120); // 5 GB

Formatage Des Nombres
=====================

.. php:method:: format(mixed $value, array $options=[])

Cette méthode vous donne beaucoup plus de contrôle sur le formatage des
nombres pour l'utilisation dans vos vues (et est utilisée en tant que
méthode principale par la plupart des autres méthodes de NumberHelper).
L'utilisation de cette méthode pourrait ressembler à cela::

    // Appelé avec NumberHelper
    $this->Number->format($value, $options);

    // Appelé avec Number
    Number::format($value, $options);

Le paramètre ``$value`` est le nombre que vous souhaitez formater pour la
sortie. Avec aucun ``$options`` fourni, le nombre 1236.334 sortirait comme
ceci : 1,236. Notez que la précision par défaut est d'aucun chiffre après
la virgule.

Le paramètre ``$options`` est là où réside la réelle magie de cette méthode.

-  Si vous passez un entier alors celui-ci devient le montant de précision
   pour la fonction.
-  Si vous passez un tableau associatif, vous pouvez utiliser les clés
   suivantes:

+---------------------+----------------------------------------------------+
| Option              | Description                                        |
+=====================+====================================================+
| places              | Nombre de décimales à utiliser. ex: 2              |
+---------------------+----------------------------------------------------+
| precision           | Nombre maximal de décimale à utiliser. ex :2       |
+---------------------+----------------------------------------------------+
| pattern             | Un modèle de formatage ICU à utiliser pour         |
|                     | formatter le nombre. ex: #,###.00                  |
+---------------------+----------------------------------------------------+
| locale              | Le nom de la locale utilisée pour formatter le     |
|                     | nombre, ie. "fr_FR".                               |
+---------------------+----------------------------------------------------+
| before              | Chaine de caractères à placer avant le nombre.     |
+---------------------+----------------------------------------------------+
| after               | Chaine de caractères à placer après le nombre.     |
+---------------------+----------------------------------------------------+

 Exemple::

    // Appelé avec NumberHelper
    echo $this->Number->format('123456.7890', [
        'places' => 2,
        'before' => '¥ ',
        'after' => ' !'
    ]);
    // Sortie '¥ 123,456.79 !'

    echo $this->Number->format('123456.7890', [
        'locale' => 'fr_FR'
    ]);
    // Sortie '123 456,79 !'

    // Appelé avec Number
    echo Number::format('123456.7890', [
        'places' => 2,
        'before' => '¥ ',
        'after' => ' !'
    ]);
    // Sortie '¥ 123,456.79 !'

    echo Number::format('123456.7890', [
        'locale' => 'fr_FR'
    ]);
    // Sortie '123 456,79 !'

.. php:method:: ordinal(mixed $value, array $options = [])

Cette méthode va afficher un nombre ordinal.

Exemples::

    echo Number::ordinal(1);
    // Affiche '1st'

    echo Number::ordinal(2);
    // Affiche '2nd'

    echo Number::ordinal(2, [
        'locale' => 'fr_FR'
    ]);
    // Affiche '2e'

    echo Number::ordinal(410);
    // Affiche '410th'

Formatage Des Différences
=========================

.. php:method:: formatDelta(mixed $value, mixed $options=[])

Cette méthode affiche les différences en valeur comme un nombre signé::

    // Appelé avec NumberHelper
    $this->Number->formatDelta($value, $options);

    // Appelé avec Number
    Number::formatDelta($value, $options);

Le paramètre ``$value`` est le nombre que vous planifiez sur le formatage
de sortie. Avec aucun ``$options`` fourni, le nombre 1236.334 sortirait
1,236. Notez que la valeur de precision par défaut est aucune décimale.

Le paramètre ``$options`` prend les mêmes clés que :php:meth:`Number::format()`
lui-même:

+---------------------+----------------------------------------------------+
| Option              | Description                                        |
+=====================+====================================================+
| places              | Nombre de décimales à utiliser. ex: 2              |
+---------------------+----------------------------------------------------+
| precision           | Nombre maximal de décimale à utiliser. ex :2       |
+---------------------+----------------------------------------------------+
| pattern             | Un modèle de formatage ICU à utiliser pour         |
|                     | formatter le nombre. ex: #,###.00                  |
+---------------------+----------------------------------------------------+
| locale              | Le nom de la locale utilisée pour formatter le     |
|                     | nombre, ie. "fr_FR".                               |
+---------------------+----------------------------------------------------+
| before              | Chaine de caractères à placer avant le nombre.     |
+---------------------+----------------------------------------------------+
| after               | Chaine de caractères à placer après le nombre.     |
+---------------------+----------------------------------------------------+

Example::

    // Appelé avec NumberHelper
    echo $this->Number->formatDelta('123456.7890', [
        'places' => 2,
        'before' => '[',
        'after' => ']'
    ]);
    // Sortie '[+123,456.79]'

    // Appelé avec Number
    echo Number::formatDelta('123456.7890', [
        'places' => 2,
        'before' => '[',
        'after' => ']'
    ]);
    // Sortie '[+123,456.79]'

.. end-cakenumber

Configurer le Formatage
=======================

.. php:method:: config(string $locale, int $type = NumberFormatter::DECIMAL, array $options = [])

Cette méthode vous permet de configurer le formatage par défaut qui sera
utilisé de façon persistante à travers toutes les méthodes.

Par exemple::

    Number::config('en_IN', \NumberFormatter::CURRENCY, [
        'pattern' => '#,##,##0'
    ]);

.. meta::
    :title lang=fr: NumberHelper
    :description lang=fr: Le Helper Number contient des méthodes pratiques qui permettent l'affichage de nombres dans des formats habituels dans vos vues.
    :keywords lang=fr: number helper,monnaie,format nombre,précision nombre,format fichier taille,format nombres
