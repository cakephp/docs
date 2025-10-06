Data e Hora
###########

.. php:namespace:: Cake\I18n

.. php:class:: DateTime

Se você precisa das funcionalidades do :php:class:`TimeHelper` fora de uma ``View``,
use a classe ``DateTime``::

    use Cake\I18n\DateTime;

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
            $time = new DateTime($identity->date_of_birth);
            if ($time->isToday()) {
                // Cumprimente o usuário com uma mensagem de feliz aniversário
                $this->Flash->success(__('Feliz aniversário...'));
            }
        }
    }

Por baixo dos panos, o CakePHP usa `Chronos <https://github.com/cakephp/chronos>`_
para alimentar seu utilitário ``DateTime``. Qualquer coisa que você possa fazer com ``Chronos`` e
``DateTimeImmutable`` do PHP, você pode fazer com ``DateTime``.

Para mais detalhes sobre Chronos, consulte `a documentação da API
<https://api.cakephp.org/chronos/>`_.

.. start-time

Criando Instâncias DateTime
============================

``DateTime`` são objetos imutáveis, pois a imutabilidade previne mudanças acidentais
aos dados e evita problemas de dependência baseados em ordem.

Existem algumas maneiras de criar instâncias ``DateTime``::

    use Cake\I18n\DateTime;

    // Criar a partir de uma string datetime.
    $time = DateTime::createFromFormat(
        'Y-m-d H:i:s',
        '2021-01-31 22:11:30',
        'America/New_York'
    );

    // Criar a partir de um timestamp e definir timezone
    $time = DateTime::createFromTimestamp(1612149090, 'America/New_York');

    // Obter o horário atual.
    $time = DateTime::now();

    // Ou apenas use 'new'
    $time = new DateTime('2021-01-31 22:11:30', 'America/New_York');

    $time = new DateTime('2 hours ago');

O construtor da classe ``DateTime`` pode receber qualquer parâmetro que a classe interna ``DateTimeImmutable``
do PHP pode receber. Ao passar um número ou string numérica, ele será interpretado
como um timestamp UNIX.

Em casos de teste, você pode simular ``now()`` usando ``setTestNow()``::

    // Fixar o horário.
    $time = new DateTime('2021-01-31 22:11:30');
    DateTime::setTestNow($time);

    // Saída '2021-01-31 22:11:30'
    $now = DateTime::now();
    echo $now->i18nFormat('yyyy-MM-dd HH:mm:ss');

    // Saída '2021-01-31 22:11:30'
    $now = DateTime::parse('now');
    echo $now->i18nFormat('yyyy-MM-dd HH:mm:ss');

Manipulação
===========

Lembre-se, instâncias ``DateTime`` sempre retornam uma nova instância dos setters
em vez de se modificarem::

    $time = DateTime::now();

    // Criar e reatribuir uma nova instância
    $newTime = $time->year(2013)
        ->month(10)
        ->day(31);
    // Saída '2013-10-31 22:11:30'
    echo $newTime->i18nFormat('yyyy-MM-dd HH:mm:ss');

Você também pode usar os métodos fornecidos pela classe ``DateTime`` integrada do PHP::

    $time = $time->setDate(2013, 10, 31);

Falhar em reatribuir as novas instâncias ``DateTime`` resultará no uso da
instância original, não modificada::

    $time->year(2013)
        ->month(10)
        ->day(31);
    // Saída '2021-01-31 22:11:30'
    echo $time->i18nFormat('yyyy-MM-dd HH:mm:ss');

Você pode criar outra instância com datas modificadas, através de subtração e
adição de seus componentes::

    $time = DateTime::create(2021, 1, 31, 22, 11, 30);
    $newTime = $time->subDays(5)
        ->addHours(-2)
        ->addMonth(1);
    // Saída '2/26/21, 8:11 PM'
    echo $newTime;

    // Usando strings strtotime.
    $newTime = $time->modify('+1 month -5 days -2 hours');
    // Saída '2/26/21, 8:11 PM'
    echo $newTime;

Você pode obter os componentes internos de uma data acessando suas propriedades::

    $time = DateTime::create(2021, 1, 31, 22, 11, 30);
    echo $time->year; // 2021
    echo $time->month; // 1
    echo $time->day; // 31
    echo $time->timezoneName; // America/New_York

Formatação
==========

.. php:staticmethod:: setJsonEncodeFormat($format)

Este método define o formato padrão usado ao converter um objeto para json::

    DateTime::setJsonEncodeFormat('yyyy-MM-dd HH:mm:ss');  // Para qualquer DateTime imutável
    Date::setJsonEncodeFormat('yyyy-MM-dd HH:mm:ss');  // Para qualquer Date mutável

    $time = DateTime::parse('2021-01-31 22:11:30');
    echo json_encode($time);   // Saída '2021-01-31 22:11:30'

    Date::setJsonEncodeFormat(static function($time) {
        return $time->format(DATE_ATOM);
    });

.. note::
    Este método deve ser chamado estaticamente.

.. note::
    Esteja ciente de que este não é um formato de string de data do PHP! Você precisa usar uma
    string de formatação de data ICU conforme especificado no seguinte recurso:
    https://unicode-org.github.io/icu/userguide/format_parse/datetime/#datetime-format-syntax.

.. versionchanged:: 4.1.0
    O tipo de parâmetro ``callable`` foi adicionado.


.. php:method:: i18nFormat($format = null, $timezone = null, $locale = null)

Uma coisa muito comum a fazer com instâncias ``Time`` é imprimir datas formatadas.
O CakePHP torna isso muito fácil::

    $time = DateTime::parse('2021-01-31 22:11:30');

    // Imprime um timestamp datetime localizado. Saída '1/31/21, 10:11 PM'
    echo $time;

    // Saída '1/31/21, 10:11 PM' para a localidade en-US
    echo $time->i18nFormat();

    // Use o formato completo de data e hora. Saída 'Sunday, January 31, 2021 at 10:11:30 PM Eastern Standard Time'
    echo $time->i18nFormat(\IntlDateFormatter::FULL);

    // Use data completa mas formato de hora curto. Saída 'Sunday, January 31, 2021 at 10:11 PM'
    echo $time->i18nFormat([\IntlDateFormatter::FULL, \IntlDateFormatter::SHORT]);

    // Saída '2021-Jan-31 22:11:30'
    echo $time->i18nFormat('yyyy-MMM-dd HH:mm:ss');

É possível especificar o formato desejado para a string a ser exibida.
Você pode passar `constantes IntlDateFormatter
<https://www.php.net/manual/en/class.intldateformatter.php>`_ como o primeiro
argumento desta função, ou passar uma string completa de formatação de data ICU conforme
especificado no seguinte recurso:
https://unicode-org.github.io/icu/userguide/format_parse/datetime/#datetime-format-syntax.

Você também pode formatar datas com calendários não-gregorianos::

    // Na versão ICU 66.1
    $time = DateTime::create(2021, 1, 31, 22, 11, 30);

    // Saída 'Sunday, Bahman 12, 1399 AP at 10:11:30 PM Eastern Standard Time'
    echo $time->i18nFormat(\IntlDateFormatter::FULL, null, 'en-IR@calendar=persian');

    // Saída 'Sunday, January 31, 3 Reiwa at 10:11:30 PM Eastern Standard Time'
    echo $time->i18nFormat(\IntlDateFormatter::FULL, null, 'en-JP@calendar=japanese');

    // Saída 'Sunday, Twelfth Month 19, 2020(geng-zi) at 10:11:30 PM Eastern Standard Time'
    echo $time->i18nFormat(\IntlDateFormatter::FULL, null, 'en-CN@calendar=chinese');

    // Saída 'Sunday, Jumada II 18, 1442 AH at 10:11:30 PM Eastern Standard Time'
    echo $time->i18nFormat(\IntlDateFormatter::FULL, null, 'en-SA@calendar=islamic');

Os seguintes tipos de calendário são suportados:

* japanese
* buddhist
* chinese
* persian
* indian
* islamic
* hebrew
* coptic
* ethiopic

.. note::
    Para strings constantes, ou seja, IntlDateFormatter::FULL, o Intl usa a biblioteca ICU
    que alimenta seus dados do CLDR (https://cldr.unicode.org/) cuja versão
    pode variar dependendo da instalação do PHP e dar resultados diferentes.

.. php:method:: nice()

Imprimir um formato 'nice' predefinido::

    $time = DateTime::parse('2021-01-31 22:11:30', new \DateTimeZone('America/New_York'));

    // Saída 'Jan 31, 2021, 10:11 PM' em en-US
    echo $time->nice();

Você pode alterar o timezone no qual a data é exibida sem alterar o
próprio objeto ``DateTime``. Isso é útil quando você armazena datas em um timezone, mas
quer exibi-las no timezone de um usuário::

    // Saída 'Monday, February 1, 2021 at 4:11:30 AM Central European Standard Time'
    echo $time->i18nFormat(\IntlDateFormatter::FULL, 'Europe/Paris');

    // Saída 'Monday, February 1, 2021 at 12:11:30 PM Japan Standard Time'
    echo $time->i18nFormat(\IntlDateFormatter::FULL, 'Asia/Tokyo');

    // Timezone não é alterado. Saída 'America/New_York'
    echo $time->timezoneName;

Deixar o primeiro parâmetro como ``null`` usará a string de formatação padrão::

    // Saída '2/1/21, 4:11 AM'
    echo $time->i18nFormat(null, 'Europe/Paris');

Finalmente, é possível usar uma localidade diferente para exibir uma data::

    // Saída 'lundi 1 février 2021 à 04:11:30 heure normale d'Europe centrale'
    echo $time->i18nFormat(\IntlDateFormatter::FULL, 'Europe/Paris', 'fr-FR');

    // Saída '1 févr. 2021 à 04:11'
    echo $time->nice('Europe/Paris', 'fr-FR');

Definindo a Localidade e String de Formato Padrão
--------------------------------------------------

A localidade padrão na qual as datas são exibidas ao usar ``nice``
``i18nFormat`` é obtida da diretiva
`intl.default_locale <https://www.php.net/manual/en/intl.configuration.php#ini.intl.default-locale>`_.
Você pode, no entanto, modificar este padrão em tempo de execução::

    DateTime::setDefaultLocale('es-ES');
    Date::setDefaultLocale('es-ES');

    // Saída '31 ene. 2021 22:11'
    echo $time->nice();

A partir de agora, datetimes serão exibidos no formato preferido em espanhol, a menos que
uma localidade diferente seja especificada diretamente no método de formatação.

Da mesma forma, é possível alterar a string de formatação padrão a ser usada para
``i18nFormat``::

    DateTime::setToStringFormat(\IntlDateFormatter::SHORT); // Para qualquer DateTime
    Date::setToStringFormat(\IntlDateFormatter::SHORT); // Para qualquer Date

    // O mesmo método existe em Date, e DateTime
    DateTime::setToStringFormat([
        \IntlDateFormatter::FULL,
        \IntlDateFormatter::SHORT
    ]);
    // Saída 'Sunday, January 31, 2021 at 10:11 PM'
    echo $time;

    // O mesmo método existe em Date e DateTime
    DateTime::setToStringFormat("EEEE, MMMM dd, yyyy 'at' KK:mm:ss a");
    // Saída 'Sunday, January 31, 2021 at 10:11:30 PM'
    echo $time;

É recomendado sempre usar as constantes em vez de passar diretamente uma string
de formato de data.

.. note::
    Esteja ciente de que este não é um formato de string de data do PHP! Você precisa usar uma
    string de formatação de data ICU conforme especificado no seguinte recurso:
    https://unicode-org.github.io/icu/userguide/format_parse/datetime/#datetime-format-syntax.

Formatando Horários Relativos
------------------------------

.. php:method:: timeAgoInWords(array $options = [])

Frequentemente é útil imprimir horários relativos ao presente::

    $time = new DateTime('Jan 31, 2021');
    // Em 12 de junho de 2021, isso exibiria '4 months, 1 week, 6 days ago'
    echo $time->timeAgoInWords(
        ['format' => 'MMM d, YYY', 'end' => '+1 year']
    );

A opção ``end`` permite definir em que ponto após o qual horários relativos
devem ser formatados usando a opção ``format``. A opção ``accuracy`` permite
controlar qual nível de detalhe deve ser usado para cada intervalo de alcance::

    // Saída '4 months ago'
    echo $time->timeAgoInWords([
        'accuracy' => ['month' => 'month'],
        'end' => '1 year'
    ]);

Ao definir ``accuracy`` como uma string, você pode especificar qual é o nível máximo
de detalhe que você deseja na saída::

    $time = new DateTime('+23 hours');
    // Saída 'in about a day'
    echo $time->timeAgoInWords([
        'accuracy' => 'day'
    ]);

Conversão
=========

.. php:method:: toQuarter()

Uma vez criadas, você pode converter instâncias ``DateTime`` em timestamps ou valores de
trimestre::

    $time = new DateTime('2021-01-31');
    echo $time->toQuarter();  // Saída '1'
    echo $time->toUnixString();  // Saída '1612069200'

Comparando com o Presente
==========================

.. php:method:: isYesterday()
.. php:method:: isThisWeek()
.. php:method:: isThisMonth()
.. php:method:: isThisYear()

Você pode comparar uma instância ``DateTime`` com o presente de várias maneiras::

    $time = new DateTime('+3 days');

    debug($time->isYesterday());
    debug($time->isThisWeek());
    debug($time->isThisMonth());
    debug($time->isThisYear());

Cada um dos métodos acima retornará ``true``/``false`` baseado em se
a instância ``DateTime`` corresponde ao presente ou não.

Comparando com Intervalos
==========================

.. php:method:: isWithinNext($interval)

Você pode ver se uma instância ``DateTime`` está dentro de um determinado intervalo usando
``wasWithinLast()`` e ``isWithinNext()``::

    $time = new DateTime('+3 days');

    // Dentro de 2 dias. Saída 'false'
    debug($time->isWithinNext('2 days'));

    // Dentro das próximas 2 semanas. Saída 'true'
    debug($time->isWithinNext('2 weeks'));

.. php:method:: wasWithinLast($interval)

Você também pode comparar uma instância ``DateTime`` dentro de um intervalo no passado::

    $time = new DateTime('-72 hours');

    // Dentro dos últimos 2 dias. Saída 'false'
    debug($time->wasWithinLast('2 days'));

    // Dentro dos últimos 3 dias. Saída 'true'
    debug($time->wasWithinLast('3 days'));

    // Dentro das últimas 2 semanas. Saída 'true'
    debug($time->wasWithinLast('2 weeks'));

.. end-time

Date
====

.. php:class:: Date

A classe imutável ``Date`` no CakePHP representa datas de calendário não afetadas por
hora e timezones. A classe ``Date`` envolve a classe ``Cake\\Chronos\\ChronosDate``.

.. note::

    Diferentemente da classe ``DateTime``, ``Date`` não estende a ``DateTimeInterface``.
    Portanto, você não pode comparar diretamente uma instância ``Date`` com uma instância ``DateTime``.
    Mas você pode fazer comparações como ``$dateTime->toNative() > $date->toNative()``.

Time
====

.. php:class:: Time

A classe ``Time`` representa horários de relógio independentes de data ou timezones.
Similar às classes ``DateTime`` e ``Date``, a classe ``Time`` também é imutável.
Ela envolve a classe ``Cake\\Chronos\\ChronosTime``.

Aceitando Dados de Requisição Localizados
==========================================

Ao criar inputs de texto que manipulam datas, você provavelmente vai querer aceitar
e analisar strings de datetime localizadas. Veja :ref:`parsing-localized-dates`.

.. meta::
    :title lang=pt: Tempo
    :description lang=pt: A classe Time ajuda você a formatar tempo e testar tempo.
    :keywords lang=pt: time,format time,timezone,unix epoch,time strings,time zone offset,utc,gmt

Timezones Suportados
====================

O CakePHP suporta todos os timezones válidos do PHP. Para uma lista de timezones suportados, `consulte esta página <https://php.net/manual/en/timezones.php>`_.
