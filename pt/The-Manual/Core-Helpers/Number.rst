Number
######

O helper Number contém métodos de conveniência para exibição de números
em formatos comuns em suas view. Estes métodos incluem maneiras de
formatar moedas, porcentagens, tamanhos de dados, números com precisão
específica além de lhe dar maior flexibilidade na formatação de números.

Todos estes métodos retornam o número formatado; eles não exibem a saída
automaticamente para a view.

currency
========

``currency(mixed $number, string $currency= 'USD')``

Este método é usado para exibir um número em formatos comuns de moeda
(EUR, GBP, USD). Pode ser usado nas views como:

::

    <?php echo $number->currency($number,$currency); ?>

O primeiro parâmetro, $number, deve ser um número de ponto flutuante que
representa a quantia de dinheiro que você está expressando. O segundo
parâmetro é usado para escolher um formato de moeda predefinido:

+-------------+-----------------------------------------+
| $currency   | 1234.56, formatado pelo typo currency   |
+=============+=========================================+
| EUR         | € 1.236,33                              |
+-------------+-----------------------------------------+
| GBP         | £ 1,236.33                              |
+-------------+-----------------------------------------+
| USD         | $ 1,236.33                              |
+-------------+-----------------------------------------+

Entidades HTML são exibidas conforme necessárias para os símbolos de
moeda.

Se um valor não reconhecido de $currenci for informado, ele será
prefixado com o valor formatado em USD. Por exemplo:

::

    <?php echo $number->currency('1234.56', 'FOO'); ?>
     
    // saída: 
    FOO 1,234.56

precision
=========

``precision (mixed $number, int $precision = 3)``

Este método exibe um número com a precisão especificada (quantidade de
casas decimais). Ele irá arredondá-lo para manter a precisão definida.

::

    <?php echo $number->precision(456.91873645, 2 ); ?>
     
    // saída
    456.92

toPercentage
============

``toPercentage(mixed $number, int $precision = 2)``

Como o precision(), este método formata um número até o total de casas
decimais informado (sendo que os número são arredondados para
corresponder à precisão definida). Este método também expressa o número
como um valor percentual e inclui o símbolo de porcentagem ao final.

::

    <?php echo $number->toPercentage(45.691873645); ?>
     
    // saída:
    45.69%

toReadableSize
==============

``toReadableSize(string $data_size)``

Este método formata tamanhos de dados para formato legível por humanos.
Ele disponibiliza um atalho para converter bytes para KB, MB, GB e TB. O
tamanho é exibido com uma precisão de dois dígitos, de acordo com o
tamanho de dados informado (i.e., tamanhos maiores são expressos em
unidades mais altas):

::

    echo $number->toReadableSize(0);  // 0 Bytes
    echo $number->toReadableSize(1024); // 1 KB
    echo $number->toReadableSize(1321205.76); // 1.26 MB
    echo $number->toReadableSize(5368709120); // 5.00 GB

format
======

``format (mixed $number, mixed $options=false)``

Este método dá a você muito mais controle sobre a formatação de números
para uso em suas views (e é usado como método principal para a maioria
dos outros métodos do helper Number). O uso deste método é algo parecido
com:

::

    $number->format($number, $options);

O parâmetro $number é o número que você pretende formatar para a saída.
Se $options não for informado, um número como 1236.334 será exibido como
1,236. Perceba que a precisão padrão é de zero casas decimais.

O parâmetro $options é onde se encontra a mágica real deste método.

-  Se você passar um número inteiro, então ele passa a definir o total
   de casas decimais para o método.
-  Se você passar um array associativo, você pode usar os seguintes
   índices:

   -  places (inteiro): a precisão desejada
   -  before (string): a ser exibida antes do número formatado
   -  escape (booleano): se você quiser que o valor dados em before seja
      escapado
   -  decimals (string): usada para delimitar as casas decimais do
      número
   -  thousands (string): usada como separador de milhar, milhões… e
      assim por diante

::

    echo $number->format('123456.7890', array(
        'places' => 2,
        'before' => '¥ ',
        'escape' => false,
        'decimals' => '.',
        'thousands' => ','
    ));
    // saída: '¥ 123,456.79'

