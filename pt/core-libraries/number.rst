Number
######

.. php:namespace:: Cake\I18n

.. php:class:: Number

Se você precisa das funcionalidades do :php:class:`NumberHelper` fora de uma ``View``,
use a classe ``Number``::

    namespace App\Controller;

    use Cake\I18n\Number;

    class UsersController extends AppController
    {
        public function initialize(): void
        {
            parent::initialize();
            $this->loadComponent('Authentication.Authentication');
        }

        public function afterLogin()
        {
            $identity = $this->Authentication->getIdentity();
            $storageUsed = $identity->storage_used;
            if ($storageUsed > 5000000) {
                // Notificar usuários sobre cota
                $this->Flash->success(__('You are using {0} storage', Number::toReadableSize($storageUsed)));
            }
        }
    }

.. start-cakenumber

Todas essas funções retornam o número formatado; elas não
ecoam automaticamente a saída na view.

Formatando Valores de Moeda
============================

.. php:method:: currency(mixed $value, string $currency = null, array $options = [])

Este método é usado para exibir um número em formatos de moeda comuns
(EUR, GBP, USD), com base no código de moeda ISO 4217 de 3 letras. O uso em uma view é assim::

    // Chamado como NumberHelper
    echo $this->Number->currency($value, $currency);

    // Chamado como Number
    echo Number::currency($value, $currency);

O primeiro parâmetro, ``$value``, deve ser um número de ponto flutuante
que representa a quantidade de dinheiro que você está expressando. O segundo
parâmetro é uma string usada para escolher um esquema de formatação de moeda predefinido:

+---------------------+----------------------------------------------------+
| $currency           | 1234.56, formatado por tipo de moeda               |
+=====================+====================================================+
| EUR                 | €1.234,56                                          |
+---------------------+----------------------------------------------------+
| GBP                 | £1,234.56                                          |
+---------------------+----------------------------------------------------+
| USD                 | $1,234.56                                          |
+---------------------+----------------------------------------------------+

O terceiro parâmetro é um array de opções para definir ainda mais a
saída. As seguintes opções estão disponíveis:

+---------------------+----------------------------------------------------+
| Opção               | Descrição                                          |
+=====================+====================================================+
| before              | Texto a exibir antes do número renderizado.        |
+---------------------+----------------------------------------------------+
| after               | Texto a exibir após o número renderizado.          |
+---------------------+----------------------------------------------------+
| zero                | O texto a usar para valores zero; pode ser uma     |
|                     | string ou um número. Ex: 0, 'Grátis!'.             |
+---------------------+----------------------------------------------------+
| places              | Número de casas decimais a usar, ex: 2             |
+---------------------+----------------------------------------------------+
| precision           | Número máximo de casas decimais a usar, ex: 2      |
+---------------------+----------------------------------------------------+
| locale              | O nome da localidade a usar para formatar o        |
|                     | número, ex: "fr_FR".                               |
+---------------------+----------------------------------------------------+
| fractionSymbol      | String a usar para números fracionários,           |
|                     | ex: ' centavos'.                                   |
+---------------------+----------------------------------------------------+
| fractionPosition    | 'before' ou 'after' para posicionar o símbolo de   |
|                     | fração.                                            |
+---------------------+----------------------------------------------------+
| pattern             | Um padrão de número ICU a usar para formatar o     |
|                     | número, ex: #,###.00                               |
+---------------------+----------------------------------------------------+
| useIntlCode         | Defina como ``true`` para substituir o símbolo de  |
|                     | moeda pelo código de moeda internacional.          |
+---------------------+----------------------------------------------------+

Se o valor de ``$currency`` for ``null``, a moeda padrão será recuperada de
:php:meth:`Cake\\I18n\\Number::defaultCurrency()`. Para formatar moedas em um
formato contábil, você deve definir o formato de moeda::

    Number::setDefaultCurrencyFormat(Number::FORMAT_CURRENCY_ACCOUNTING);

Definindo a Moeda Padrão
=========================

.. php:method:: setDefaultCurrency($currency)

Setter para a moeda padrão. Isso remove a necessidade de sempre passar a
moeda para :php:meth:`Cake\\I18n\\Number::currency()` e alterar todas
as saídas de moeda definindo outro padrão. Se ``$currency`` for definido como ``null``,
isso limpará o valor armazenado atualmente.

Obtendo a Moeda Padrão
=======================

.. php:method:: getDefaultCurrency()

Getter para a moeda padrão. Se a moeda padrão foi definida anteriormente usando
``setDefaultCurrency()``, então esse valor será retornado. Por padrão, ele
recuperará o valor ini ``intl.default_locale`` se definido e ``'en_US'`` se não.

Formatando Números de Ponto Flutuante
======================================

.. php:method:: precision(float $value, int $precision = 3, array $options = [])

Este método exibe um número com a quantidade especificada de
precisão (casas decimais). Ele arredondará para manter o
nível de precisão definido. ::

    // Chamado como NumberHelper
    echo $this->Number->precision(456.91873645, 2);

    // Saída
    456.92

    // Chamado como Number
    echo Number::precision(456.91873645, 2);

Formatando Porcentagens
========================

.. php:method:: toPercentage(mixed $value, int $precision = 2, array $options = [])

+---------------------+----------------------------------------------------+
| Opção               | Descrição                                          |
+=====================+====================================================+
| multiply            | Booleano para indicar se o valor deve ser          |
|                     | multiplicado por 100. Útil para porcentagens       |
|                     | decimais.                                          |
+---------------------+----------------------------------------------------+

Como :php:meth:`Cake\\I18n\\Number::precision()`, este método formata um número
de acordo com a precisão fornecida (onde os números são arredondados para atender à
precisão fornecida). Este método também expressa o número como uma porcentagem
e acrescenta a saída com um sinal de porcentagem. ::

    // Chamado como NumberHelper. Saída: 45.69%
    echo $this->Number->toPercentage(45.691873645);

    // Chamado como Number. Saída: 45.69%
    echo Number::toPercentage(45.691873645);

    // Chamado com multiply. Saída: 45.7%
    echo Number::toPercentage(0.45691, 1, [
        'multiply' => true
    ]);

Interagindo com Valores Legíveis para Humanos
==============================================

.. php:method:: toReadableSize(string $size)

Este método formata tamanhos de dados em formas legíveis para humanos. Ele fornece
um atalho para converter bytes em KB, MB, GB e TB. O tamanho é
exibido com um nível de precisão de dois dígitos, de acordo com o tamanho
dos dados fornecidos (ou seja, tamanhos maiores são expressos em termos
maiores)::

    // Chamado como NumberHelper
    echo $this->Number->toReadableSize(0); // 0 Byte
    echo $this->Number->toReadableSize(1024); // 1 KB
    echo $this->Number->toReadableSize(1321205.76); // 1.26 MB
    echo $this->Number->toReadableSize(5368709120); // 5 GB

    // Chamado como Number
    echo Number::toReadableSize(0); // 0 Byte
    echo Number::toReadableSize(1024); // 1 KB
    echo Number::toReadableSize(1321205.76); // 1.26 MB
    echo Number::toReadableSize(5368709120); // 5 GB

Formatando Números
==================

.. php:method:: format(mixed $value, array $options = [])

Este método oferece muito mais controle sobre a formatação de
números para uso em suas views (e é usado como método principal por
a maioria dos outros métodos do NumberHelper). Usar este método pode
parecer assim::

    // Chamado como NumberHelper
    $this->Number->format($value, $options);

    // Chamado como Number
    Number::format($value, $options);

O parâmetro ``$value`` é o número que você está planejando
formatar para saída. Sem ``$options`` fornecidas, o número
1236.334 seria exibido como 1,236. Observe que a precisão padrão é
zero casas decimais.

O parâmetro ``$options`` é onde a verdadeira mágica deste método
reside.

-  Se você passar um inteiro, então isso se torna a quantidade de precisão
   ou casas para a função.
-  Se você passar um array associativo, você pode usar as seguintes chaves:

+---------------------+----------------------------------------------------+
| Opção               | Descrição                                          |
+=====================+====================================================+
| places              | Número de casas decimais a usar, ex: 2             |
+---------------------+----------------------------------------------------+
| precision           | Número máximo de casas decimais a usar, ex: 2      |
+---------------------+----------------------------------------------------+
| pattern             | Um padrão de número ICU a usar para formatar o     |
|                     | número, ex: #,###.00                               |
+---------------------+----------------------------------------------------+
| locale              | O nome da localidade a usar para formatar o        |
|                     | número, ex: "fr_FR".                               |
+---------------------+----------------------------------------------------+
| before              | Texto a exibir antes do número renderizado.        |
+---------------------+----------------------------------------------------+
| after               | Texto a exibir após o número renderizado.          |
+---------------------+----------------------------------------------------+

Exemplo::

    // Chamado como NumberHelper
    echo $this->Number->format('123456.7890', [
        'places' => 2,
        'before' => '¥ ',
        'after' => ' !'
    ]);
    // Saída '¥ 123,456.79 !'

    echo $this->Number->format('123456.7890', [
        'locale' => 'fr_FR'
    ]);
    // Saída '123 456,79 !'

    // Chamado como Number
    echo Number::format('123456.7890', [
        'places' => 2,
        'before' => '¥ ',
        'after' => ' !'
    ]);
    // Saída '¥ 123,456.79 !'

    echo Number::format('123456.7890', [
        'locale' => 'fr_FR'
    ]);
    // Saída '123 456,79 !'

.. php:method:: ordinal(mixed $value, array $options = [])

Este método produzirá um número ordinal.

Exemplos::

    echo Number::ordinal(1);
    // Saída '1st'

    echo Number::ordinal(2);
    // Saída '2nd'

    echo Number::ordinal(2, [
        'locale' => 'fr_FR'
    ]);
    // Saída '2e'

    echo Number::ordinal(410);
    // Saída '410th'

Diferenças de Formato
=====================

.. php:method:: formatDelta(mixed $value, array $options = [])

Este método exibe diferenças de valor como um número com sinal::

    // Chamado como NumberHelper
    $this->Number->formatDelta($value, $options);

    // Chamado como Number
    Number::formatDelta($value, $options);

O parâmetro ``$value`` é o número que você está planejando
formatar para saída. Sem ``$options`` fornecidas, o número
1236.334 seria exibido como 1,236. Observe que a precisão padrão é
zero casas decimais.

O parâmetro ``$options`` recebe as mesmas chaves que :php:meth:`Number::format()`:

+---------------------+----------------------------------------------------+
| Opção               | Descrição                                          |
+=====================+====================================================+
| places              | Número de casas decimais a usar, ex: 2             |
+---------------------+----------------------------------------------------+
| precision           | Número máximo de casas decimais a usar, ex: 2      |
+---------------------+----------------------------------------------------+
| locale              | O nome da localidade a usar para formatar o        |
|                     | número, ex: "fr_FR".                               |
+---------------------+----------------------------------------------------+
| before              | Texto a exibir antes do número renderizado.        |
+---------------------+----------------------------------------------------+
| after               | Texto a exibir após o número renderizado.          |
+---------------------+----------------------------------------------------+

Exemplo::

    // Chamado como NumberHelper
    echo $this->Number->formatDelta('123456.7890', [
        'places' => 2,
        'before' => '[',
        'after' => ']'
    ]);
    // Saída '[+123,456.79]'

    // Chamado como Number
    echo Number::formatDelta('123456.7890', [
        'places' => 2,
        'before' => '[',
        'after' => ']'
    ]);
    // Saída '[+123,456.79]'

.. end-cakenumber

Configurar Formatadores
=======================

.. php:method:: config(string $locale, int $type = NumberFormatter::DECIMAL, array $options = [])

Este método permite configurar padrões de formatador que persistem entre chamadas
para vários métodos.

Exemplo::

    Number::config('en_IN', \NumberFormatter::CURRENCY, [
        'pattern' => '#,##,##0'
    ]);

.. meta::
    :title lang=pt: NumberHelper
    :description lang=pt: O Number Helper contém métodos de conveniência que permitem exibir números em formatos comuns em suas views.
    :keywords lang=pt: number helper,currency,number format,number precision,format file size,format numbers
