Mga Helper ng Shell
#############

.. versionadded:: 3.1
    Shell Helpers were added in 3.1.0

Ang mga Helper ng Shell ay hinahayaan kang i-package ang kumplikadong output ng generation na code. Ang 
mga Helper ng Shell ay maaaring ma-access at magamit mula sa anumang shell o gawain::

    // Output some data as a table.
    $this->helper('Table')->output($data);

    // Get a helper from a plugin.
    $this->helper('Plugin.HelperName')->output($data);

Maaari ka ring makakuha ng mga instance ng mga helper at tawagin ang anumang publikong mga paraan sa mga ito::

    // Get and use the Progress Helper.
    $progress = $this->helper('Progress');
    $progress->increment(10);
    $progress->draw();

Paglikha ng mga Helper
================

Habang ang CakePHP ay may ilang mga helper ng shell maaari kang lumikha ng higit pa sa iyong 
aplikasyon o mga plugin. Bilang isang halimbawa, tayo ay lilikha ng isang simpleng helper para makabuo 
ng mga magarbong heading. Una ilikha ang **src/Shell/Helper/HeadingHelper.php** at ilagay 
ang sumusunod sa loob nito::

    <?php
    namespace App\Shell\Helper;

    use Cake\Console\Helper;

    class HeadingHelper extends Helper
    {
        public function output($args)
        {
            $args += ['', '#', 3];
            $marker = str_repeat($args[1], $args[2]);
            $this->_io->out($marker . ' ' . $args[0] . ' ' . $marker);
        }
    }

Maari nating gamitin ang bagong helper na ito sa isa sa ating mga command ng shell sa pamamagitan ng pagtawag nito::

    // With ### on either side
    $this->helper('Heading')->output(['It works!']);

    // With ~~~~ on either side
    $this->helper('Heading')->output(['It works!', '~', 4]);

Ang mga Helper sa pangkalahatan ay ipapatupad ang ``output()`` na paraan na kukuha ng isang array ng 
mga parameter. Gayunpaman, dahil ang mga Helper ng Console ay mga class ng vanilla magagawa nilang 
ipatupad ang mga karagdagang paraan na kukuha ng anumang form ng mga argumento.

Mga Helper na Built-In
================

Helper ng Table
------------

Ang TableHelper ay tumutulong sa paggawa ng mahusay na format ng ASCII na mga table ng sining. Ang paggamit nito ay 
simple lang::

        $data = [
            ['Header 1', 'Header', 'Long Header'],
            ['short', 'Longish thing', 'short'],
            ['Longer thing', 'short', 'Longest Value'],
        ];
        $this->helper('Table')->output($data);

        // Outputs
        +--------------+---------------+---------------+
        | Header 1     | Header        | Long Header   |
        +--------------+---------------+---------------+
        | short        | Longish thing | short         |
        | Longer thing | short         | Longest Value |
        +--------------+---------------+---------------+

Helper ng Pag-unlad
---------------

Ang ProgressHelper ay maaaring gamitin sa dalawang magkaibang paraan. Ang simple na mode ay hinahayaan kang 
magbigay ng isang callback nai-invoke hanggang makumpleto ang pag-unlad::

    $this->helper('Progress')->output(['callback' => function ($progress) {
        // Do work here.
        $progress->increment(20);
        $progress->draw();
    }]);

Maaari mong kontrolin ang progress bar nang higit pa sa pamamagitan ng pagbigay na mga karagdagang opsyon:

- ``total`` Ang kabuuang bilang ng mga item sa progress bar. Ang default ay
  100.
- ``width`` Ang lawak ng progress bar. Ang default ay 80.
- ``callback`` Ang callback na tatawagan sa isang loop upang i-advance ang 
  progress bar.

Ang isang halimbawa ng lahat ng mga opsyon na ginagamit ay magiging::

    $this->helper('Progress')->output([
        'total' => 10,
        'width' => 20,
        'callback' => function ($progress) {
            $progress->increment(2);
            $progress->draw();
        }
    ]);

Ang helper ng pag-unlad ay maaari ring gamitin ng manu-mano upang dagdagan at muling i-render ang 
progress bar kung kinakailangan::

    $progress = $this->helper('Progress');
    $progress->init([
        'total' => 10,
        'width' => 20,
    ]);

    $progress->increment(4);
    $progress->draw();

