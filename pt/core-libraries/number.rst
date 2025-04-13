Número
######

.. php:namespace:: Cake\I18n

.. php:class:: Number

Se você precisa das funcionalidades do :php:class:`NumberHelper` fora da ``View``,
use a classe ``Number`` ::

    namespace App\Controller;

    use Cake\I18n\Number;

    class UsersController extends AppController
    {
        public function initialize(): void
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

Todas essas funções retornam o número formatado; eles não
são impressas automaticamente na visualização de saída.

Formatação de Valores Monetários
================================

.. php:method:: currency(mixed $value, string $currency = null, array $options = [])

Este método é usado para exibir um número em formatos monetários comuns
(EUR, GBP, USD), com base no código de moeda ISO 4217 de 3 letras. O uso em uma view se parece com::

    // Called as NumberHelper
    echo $this->Number->currency($value, $currency);

    // Called as Number
    echo Number::currency($value, $currency);

O primeiro parâmetro, ``$value``, deve ser um número de ponto flutuante
que representa a quantidade de dinheiro que você está expressando.
O segundo parâmetro é uma string usada para escolher um esquema de
formatação de monetária predefinida:

+---------------------+----------------------------------------------------+
| $ moeda           | 1234.56, formatação pelo tipo monetário              |
+=====================+====================================================+
| EUR                 | €1.234,56                                          |
+---------------------+----------------------------------------------------+
| GBP                 | £1,234.56                                          |
+---------------------+----------------------------------------------------+
| USD                 | $1,234.56                                          |
+---------------------+----------------------------------------------------+

O terceiro parâmetro é um conjunto de opções para definir melhor a saída.
As seguintes opções estão disponíveis:

+---------------------+----------------------------------------------------+
| Opção               | Descrição                                          |
+=====================+====================================================+
| before              | Texto a ser exibido antes do número renderizado.   |
+---------------------+----------------------------------------------------+
| after               | Texto a ser exibido após o número renderizado.     |
+---------------------+----------------------------------------------------+
| zero                | O texto a ser usado para valores zero; pode ser    |
|                     | uma string ou um número. ou seja, 0, 'Grátis!'.    |
+---------------------+----------------------------------------------------+
| places              | Número de casas decimais a serem usadas, ou seja, 2|
+---------------------+----------------------------------------------------+
| precision           | Número máximo de casas decimais a serem usadas,    |
|                     | ou seja, 2                                         |
+---------------------+----------------------------------------------------+
| locale              | O nome do local a ser usado para formatar o número,|
|                     | ou seja. “Fr_FR”.                                  |
+---------------------+----------------------------------------------------+
| fractionSymbol      | String a ser usada para números fracionários, ou   |
|                     | seja, 'centavos'.                                  |
+---------------------+----------------------------------------------------+
| fractionPosition    | Ou 'antes' ou 'depois' para colocar o símbolo de   |
|                     | fração.                                            |
+---------------------+----------------------------------------------------+
| pattern             | Um padrão de número ICU a ser usado para formatar  |
|                     | o número, ou seja. #, ###. 00                      |
+---------------------+----------------------------------------------------+
| useIntlCode         | Defina como ``true`` para substituir o símbolo da  |
|                     | moeda pelo código de moeda internacional           |
+---------------------+----------------------------------------------------+

Se de ``$currency`` for ``null``, a moeda padrão será retornada em
:php:meth:`Cake\\I18n\\Number::defaultCurrency()`. Para formatar moedas em um
formato de contabilidade, você deve definir o formato da moeda::

    Number::setDefaultCurrencyFormat(Number::FORMAT_CURRENCY_ACCOUNTING);

Definição da moeda padrão
=========================

.. php:method:: setDefaultCurrency($currency)

Atribui a moeda padrão. Isso elimina a necessidade de sempre passar a moeda
para :php:meth:`Cake\\I18n\\Number::currency()` e alterar todas as saídas de
moeda definindo outro padrão. Se ``$currency`` atribuído o valor ``null``,
ele apagará o valor armazenado no momento.

Obtendo a moeda padrão
======================

.. php:method:: getDefaultCurrency()

Obtem a moeda padrão. Se a moeda padrão foi definida anteriormente usando
``setDefaultCurrency()``, então esse valor será retornado. Por padrão, ele irá
retornar o valor ``intl.default_locale`` do ini se estiver atribuído e ``'en_US'`` se não estiver.

Formatando números de ponto flutuante
=====================================

.. php:method:: precision(float $value, int $precision = 3, array $options = [])

Este método exibe um número com a quantidade especificada de precisão (casas decimais).
Ele será arredondado para manter o nível de precisão definido. ::

    // Called as NumberHelper
    echo $this->Number->precision(456.91873645, 2);

    // Outputs
    456.92

    // Called as Number
    echo Number::precision(456.91873645, 2);

Formatação de Porcentagens
==========================

.. php:method:: toPercentage(mixed $value, int $precision = 2, array $options = [])

+---------------------+--------------------------------------------------------+
| Opção              | Descrição                                               |
+=====================+========================================================+
| multiply            | Booleano para indicar se o valor deve ser              |
|                     | multiplicado por 100. Útil para porcentagens decimais. |
+---------------------+--------------------------------------------------------+

Da mesma forma :php:meth:`Cake\\I18n\\Number::precision()`, ste método formata um
número de acordo com a precisão fornecida (onde os números são arredondados para
atender à precisão fornecida). Este método também expressa o número como uma
porcentagem e anexa a saída com um sinal de porcentagem. ::

    // Called as NumberHelper. Output: 45.69%
    echo $this->Number->toPercentage(45.691873645);

    // Called as Number. Output: 45.69%
    echo Number::toPercentage(45.691873645);

    // Called with multiply. Output: 45.7%
    echo Number::toPercentage(0.45691, 1, [
        'multiply' => true
    ]);

Interagindo com valores legíveis para humanos
=============================================

.. php:method:: toReadableSize(string $size)

Este método formata o tamanho dos dados em formatos legíveis
por humanos. Ele fornece uma forma de atalho para converter bytes
em KB, MB, GB e TB. O tamanho é exibido com um nível de precisão de dois dígitos,
de acordo com o tamanho dos dados fornecidos (ou seja, tamanhos maiores são
expressos em termos maiores) ::

    // Called as NumberHelper
    echo $this->Number->toReadableSize(0); // 0 Byte
    echo $this->Number->toReadableSize(1024); // 1 KB
    echo $this->Number->toReadableSize(1321205.76); // 1.26 MB
    echo $this->Number->toReadableSize(5368709120); // 5 GB

    // Called as Number
    echo Number::toReadableSize(0); // 0 Byte
    echo Number::toReadableSize(1024); // 1 KB
    echo Number::toReadableSize(1321205.76); // 1.26 MB
    echo Number::toReadableSize(5368709120); // 5 GB

Formatando Números
==================

.. php:method:: format(mixed $value, array $options = [])

Este método fornece muito mais controle sobre a formatação de números
para uso em suas visualizações (e é usado como o método principal pela
maioria dos outros métodos NumberHelper). Usar este método pode ser
parecido com::

    // Called as NumberHelper
    $this->Number->format($value, $options);

    // Called as Number
    Number::format($value, $options);

O parâmetro ``$value`` é o número que você está planejando formatar para
saída. Sem o formatting for output. Sem o ``$options``, o número
1236.334 produzirá a saída 1,236.  Observe que a precisão padrão
é zero casas decimais.

O parâmetro ``$options``  é onde reside a verdadeira magia desse método.

-  Se você passar um número inteiro, isso se tornará a quantidade de precisão ou casas para a função.
-  Se você passar uma matriz associada, você pode usar as seguintes chaves:

+---------------------+----------------------------------------------------+
| Opção              | Descrição                                           |
+=====================+====================================================+
| places              | Número de casas decimais a serem usadas, ou seja, 2|
+---------------------+----------------------------------------------------+
| precision           | Número máximo de casas decimais a serem usadas, ou |
|                     | seja, 2                                            |
+---------------------+----------------------------------------------------+
| pattern             | Um padrão de número ICU a ser usado para formatar  |
|                     | o número, ou seja. #, ###. 00                      |
+---------------------+----------------------------------------------------+
| locale              | O nome do local a ser usado para formatar o número,|
|                     | ou seja. “Fr_FR”.                                  |
+---------------------+----------------------------------------------------+
| before              | Texto a ser exibido antes do número renderizado.   |
+---------------------+----------------------------------------------------+
| after               | Texto a ser exibido após o número renderizado.     |
+---------------------+----------------------------------------------------+

Exemplo::

    // Called as NumberHelper
    echo $this->Number->format('123456.7890', [
        'places' => 2,
        'before' => '¥ ',
        'after' => ' !'
    ]);
    // Output '¥ 123,456.79 !'

    echo $this->Number->format('123456.7890', [
        'locale' => 'fr_FR'
    ]);
    // Output '123 456,79 !'

    // Called as Number
    echo Number::format('123456.7890', [
        'places' => 2,
        'before' => '¥ ',
        'after' => ' !'
    ]);
    // Output '¥ 123,456.79 !'

    echo Number::format('123456.7890', [
        'locale' => 'fr_FR'
    ]);
    // Output '123 456,79 !'

.. php:method:: ordinal(mixed $value, array $options = [])

Este método irá gerar um número ordinal.

Exemplos::

    echo Number::ordinal(1);
    // Output '1st'

    echo Number::ordinal(2);
    // Output '2nd'

    echo Number::ordinal(2, [
        'locale' => 'fr_FR'
    ]);
    // Output '2e'

    echo Number::ordinal(410);
    // Output '410th'

Diferenças de formato
=====================

.. php:method:: formatDelta(mixed $value, array $options = [])

Este método exibe diferenças de valor como um número assinado::

    // Called as NumberHelper
    $this->Number->formatDelta($value, $options);

    // Called as Number
    Number::formatDelta($value, $options);

O parâmetro ``$value`` é o número que você está planejando formatar
para saída. Sem o ``$options`` ,  1236.334 produziria como saída 1,236.
Observe que a precisão padrão é zero casas decimais.

O parâmetro ``$options``  usa as mesmas chaves que :php:meth:`Number::format()`:

+---------------------+----------------------------------------------------+
| Opção              | Descrição                                           |
+=====================+====================================================+
| places              | Número de casas decimais a serem usadas, ou seja, 2|
+---------------------+----------------------------------------------------+
| precision           | Número máximo de casas decimais a serem usadas, ou |
|                     | seja, 2                                            |
+---------------------+----------------------------------------------------+
| locale              | O nome do local a ser usado para formatar o número,|
|                     | ou seja. “Fr_FR”.                                  |
+---------------------+----------------------------------------------------+
| before              | Texto a ser exibido antes do número renderizado.   |
+---------------------+----------------------------------------------------+
| after               | Texto a ser exibido após o número renderizado.     |
+---------------------+----------------------------------------------------+

Exemplo::

    // Called as NumberHelper
    echo $this->Number->formatDelta('123456.7890', [
        'places' => 2,
        'before' => '[',
        'after' => ']'
    ]);
    // Output '[+123,456.79]'

    // Called as Number
    echo Number::formatDelta('123456.7890', [
        'places' => 2,
        'before' => '[',
        'after' => ']'
    ]);
    // Output '[+123,456.79]'

.. end-cakenumber

Configurar formatadores
=======================

.. php:method:: config(string $locale, int $type = NumberFormatter::DECIMAL, array $options = [])

Este método permite configurar padrões do formatador que persistem nas chamadas para vários métodos.

Exemplo::

    Number::config('en_IN', \NumberFormatter::CURRENCY, [
        'pattern' => '#,##,##0'
    ]);

.. meta::
    :title lang=pt: NumberHelper
    :description lang=pt: O Helper Number contém métodos convenientes que permitem a exibição de números em formatos comuns em suas visualizações.
    :keywords lang=pt: number helper, moeda, formato de número, precisão de número, tamanho do arquivo de formato, números de formato
