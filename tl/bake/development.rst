Pag-Extend ng Bake
##############

Ang Bake ay nagtatampok ng extensible na arkitektura na nagpapahintulot ng iyong aplikasyon o mga plugin upang baguhin o idagdag sa functionality ng base. Ang Bake ay gumagamit ng isang dedikadong klase ng view na ginagamit ang `Twig <https://twig.symfony.com/>`_ na template ng engine.

Mga Kaganapan ng Bake
===========

Bilang isang klase ng view, ang ``BakeView`` ay nagpapalabas ng parehong mga kaganapan tulad ng anumang klase ng view,
kasama ang isang dagdag na pagsisimula ng kaganapan. Gayunpaman, samantalang ang karaniwang view na mga klase ay gumagamit ng prefix ng kaganapan na "View.", ang ``BakeView`` ay gumagamit ng kaganapan ng prefix na "Bake.".

Ang kaganapan ng pag-initialize ay magagamit upang gumawa ng mga pagbabago na ma-apply sa lahat ng baked na output, halimbawa upang magdagdag ng isa pang katulong sa bake na klase ng view ang kaganapang ito ay magagamit::

    <?php
    // config/bootstrap_cli.php

    use Cake\Event\Event;
    use Cake\Event\EventManager;

    EventManager::instance()->on('Bake.initialize', function (Event $event) {
        $view = $event->getSubject();

        // In my bake templates, allow the use of the MySpecial helper
        $view->loadHelper('MySpecial', ['some' => 'config']);

        // And add an $author variable so it's always available
        $view->set('author', 'Andy');

    });

Kung nais mong baguhin ang bake mula sa loob ng isa pang plugin, ang paglagay ng mga kaganapan ng bake sa iyong plugin na ``config/bootstrap.php`` na file ay isang magandang ideya.

Ang mga kaganapan ng Bake ay maaaring madaling gamitin para sa paggawa ng maliliit na mga pagbabago sa umiiral na mga template.
Halimbawa, upang baguhin ang mga pangalan ng variable na ginagamit habang nagbi-bake ng controller/template
na mga file ay maaaring gumamit ng isang function na pakikinig sa ``Bake.beforeRender`` upang baguhin ang mga variable na ginagamit sa mga template ng bake::

    <?php
    // config/bootstrap_cli.php

    use Cake\Event\Event;
    use Cake\Event\EventManager;

    EventManager::instance()->on('Bake.beforeRender', function (Event $event) {
        $view = $event->getSubject();

        // Use $rows for the main data variable in indexes
        if ($view->get('pluralName')) {
            $view->set('pluralName', 'rows');
        }
        if ($view->get('pluralVar')) {
            $view->set('pluralVar', 'rows');
        }

        // Use $theOne for the main data variable in view/edit
        if ($view->get('singularName')) {
            $view->set('singularName', 'theOne');
        }
        if ($view->get('singularVar')) {
            $view->set('singularVar', 'theOne');
        }

    });

Maaari mo ring i-scope ang ``Bake.beforeRender`` at ``Bake.afterRender`` na mga kaganapan sa 
isang tiyak na nabuong file. Halimbawa, kung gusto mong magdagdag ng tiyak na mga aksyon sa 
iyong UsersController kapag bumubuo mula sa isang **Controller/controller.twig** na file,
maaari mong gamitin ang sumusunod na kaganapan::

    <?php
    // config/bootstrap_cli.php

    use Cake\Event\Event;
    use Cake\Event\EventManager;
    use Cake\Utility\Hash;

    EventManager::instance()->on(
        'Bake.beforeRender.Controller.controller',
        function (Event $event) {
            $view = $event->getSubject();
            if ($view->viewVars['name'] == 'Users') {
                // add the login and logout actions to the Users controller
                $view->viewVars['actions'] = [
                    'login',
                    'logout',
                    'index',
                    'view',
                    'add',
                    'edit',
                    'delete'
                ];
            }
        }
    );

Sa pamamagitan ng pagscope ng mga tagapakinig ng kaganapan sa tiyak na mga template ng bake, maaari mong gawing simple ang iyong
lohika ng kaganapan na kaugnay ng at magbigay ng mga callbacks na mas madaling subukan.

Template ng Bake na Syntax
====================

Ang template ng Bake na mga file ay ginamit ang `Twig <https://twig.symfony.com/doc/2.x/>`__ na syntax ng template.

Isang paraan upang makita/maintindihan kung paano gumagana ang mga template ng bake, lalo na kapag sinusubukang  
baguhin ang mga file na template ng bake, ay magbake na klase at ihambing ang template na ginamit 
na may file ng pre-processed na template na naiwan sa aplikasyon na 
**tmp/bake** na folder.

Kaya, halimbawa, kapag nagbi-bake ng isang shell tulad nito:

.. code-block:: bash

    bin/cake bake shell Foo

Ang template na ginagamit (**vendor/cakephp/bake/src/Template/Bake/Shell/shell.twig**)
ay katulad ng hitsura nito::

    <?php
    namespace {{ namespace }}\Shell;

    use Cake\Console\Shell;

    /**
     * {{ name }} shell command.
     */
    class {{ name }}Shell extends Shell
    {
        /**
         * main() method.
         *
         * @return bool|int Success or error code.
         */
        public function main()
        {
        }

    }

At ang resultant ng baked na klase (**src/Shell/FooShell.php**) ay katulad ng hitsura nito::

    <?php
    namespace App\Shell;

    use Cake\Console\Shell;

    /**
     * Foo shell command.
     */
    class FooShell extends Shell
    {
        /**
         * main() method.
         *
         * @return bool|int Success or error code.
         */
        public function main()
        {
        }

    }

.. tandaan::

    Bago ang bersyon na 1.5.0 ang bake ay gumagamit na isang custom na er-style na mga tag sa loob ng template ng .ctp na mga file.

    * ``<%`` Isang template ng Bake na bukas na tag ng php
    * ``%>`` Isang template ng Bake na sirado na tag ng php
    * ``<%=`` Isang template ng Bake na short-echo na tag ng php
    * ``<%-`` Isang template ng Bake na bukas na tag ng php, pag-alis ng mga nangungunang whitespace
      bago ang tag
    * ``-%>`` Isang template ng Bake na sirado na tag ng php, pag-alis ng mga sumusunod na whitespace pagkatapos
      ng tag

.. _creating-a-bake-theme:

Ang Paglikha ng isang Tema ng Bake
=====================

Kung nais mong baguhin ang output na ginawa ng command ng "bake", maaari kang
lumikha ng iyong sariling 'theme' ng bake na nagpapahintulot sa iyo na palitan ang ilan o lahat ng 
mga template na ginagamit ng bake. Ang pinakamahusay na paraan upang gawin ito ay:

#. Magbake ng isang bagong plugin. Ang pangalan ng plugin ay ang pangalan ng 'theme' ng bake
#. Maglikha ng isang bagong directory **plugins/[name]/src/Template/Bake/Template/**.
#. Kopyahin ang anumang mga template na gusto mong i-override mula sa
   **vendor/cakephp/bake/src/Template/Bake/Template** sa pagtutugma ng mga file sa iyong
   plugin.
#. Kapag nagpapatakbo ng bake gamitin ang ``--theme`` na opsyon upang tiyakin ang bake-theme 
   na gusto mong gamitin. Upang maiwasan ang pagkakaroon ng pagtiyak ng opsyon na ito sa bawat tawag, maaari mo ring
   i-set ang iyong custom na tema na gagamitin bilang isang default na tema::

        <?php
        // in config/bootstrap.php or config/bootstrap_cli.php
        Configure::write('Bake.theme', 'MyTheme');

Ang Pagcustomize ng mga Template ng Bake
==============================

Kung nais mong baguhin ang default na output na ginawa ng command ng "bake", maaari kang
lumikha ng iyong sariling mga template ng bkae sa iyong aplikasyon. Sa ganitong paraan ay hindi ginagamit ang 
``--theme`` na opsyon sa command line habang nagbi-bake. Ang pinakamahusay na paraan upang gawin ito ay:

#. Maglikha ng bagong directory **/src/Template/Bake/**.
#. Kopyahin ang anumang mga template ang gusto mong i-override mula sa 
   **vendor/cakephp/bake/src/Template/Bake/** sa pagtutugma ng mga file sa iyong 
   aplikasyon.

Maglikha ng Bagong Command ng Bake na mga Opsyon
=================================

Posibleng magdagdag ng bagong command ng bake na mga opsyon, o i-override ang mga binigay ng 
CakePHP sa pamamagitan ng paglikha ng mga gawain sa iyong aplikasyon o mga plugin. Sa pagpapalawak ng 
``Bake\Shell\Task\BakeTask``, ang bake ay maghahanap ng iyong bagong gawain at isama ito bilang 
bahagi ng bake.

Bilang halimbawa, tayo ay gagawa ng gawain na lumilikha ng isang arbitraryo na klase ng foo. Una,
lumikha ng file ng gawain **src/Shell/Task/FooTask.php**. Ipapalawak natin ang 
``SimpleBakeTask`` para sa ngayon bilang ating gawain ng shell ay magiging simple. Ang ``SimpleBakeTask``
ay abstract at nangangailangan sa atin upang tukuyin ang 3 mga pamamaraan na sabihin sa bake kung ano ang gawain na 
tinatawag, kung saan ang mga file na nabuo nito ay dapat pupunta, at kung anung template ang gagamitin. Ang ating 
FooTask.php na file ay dapat magmukhang::

    <?php
    namespace App\Shell\Task;

    use Bake\Shell\Task\SimpleBakeTask;

    class FooTask extends SimpleBakeTask
    {
        public $pathFragment = 'Foo/';

        public function name()
        {
            return 'foo';
        }

        public function fileName($name)
        {
            return $name . 'Foo.php';
        }

        public function template()
        {
            return 'foo';
        }

    }

Sa sandaling nalikha ang file na ito, Kailangan nating lumikha ng isang template na maaaring gamitin ng bake
kapag bumubuo ng code. Lumikha ng **src/Template/Bake/foo.twig**. Sa file na ito tayo ay 
magdagdag ng sumusunod na nilalaman::

    <?php
    namespace {{ namespace }}\Foo;

    /**
     * {{ $name }} foo
     */
    class {{ name }}Foo
    {
        // Add code.
    }

Dapat mo na ngayong makita ang bago mong gawain sa output ng ``bin/cake bake``. Kaya mong 
patakbuhin ang iyong bagong gawain sa pamamagitan ng pagpapatakbo ng ``bin/cake bake foo Example``.
Ito ay bubuo ng isang bagong klase ng ``ExampleFoo`` sa **src/Foo/ExampleFoo.php**
para gamitin sa iyong aplikasyon.

Kung nais mo na ang ``bake`` na tawag ay maglikha din ng isang test na file para sa iyong 
klase ng ``ExampleFoo``, kailangan mong i-overwrite ang ``bakeTest()`` na paraan sa 
klase ng ``FooTask`` upang irehistro ang suffix ng klase at namespace para sa iyong custom
na pangalan ng command::

    public function bakeTest($className)
    {
        if (!isset($this->Test->classSuffixes[$this->name()])) {
          $this->Test->classSuffixes[$this->name()] = 'Foo';
        }

        $name = ucfirst($this->name());
        if (!isset($this->Test->classTypes[$name])) {
          $this->Test->classTypes[$name] = 'Foo';
        }

        return parent::bakeTest($className);
    }

* Ang **class suffix** ay malalagay sa pangalan na binigay sa iyong ``bake``
  na tawag. Sa nakaraang halimbawa, lilikha ito ng isang ``ExampleFooTest.php`` na file.
* Ang **class type** ay ang sub-namespace na ginamit na hahantong sa iyong
  file (relative sa app o sa plugin na iyong binibake). Sa nakaraang
  halimbawa, lilikha ito ng iyong test na may namespace na ``App\Test\TestCase\Foo``
  .

.. meta::
    :title lang=en: Extending Bake
    :keywords lang=en: command line interface,development,bake view, bake template syntax,twig,erb tags,percent tags

