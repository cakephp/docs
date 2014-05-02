Time
####

.. php:namespace:: Cake\Utility

.. php:class:: Time

If you need :php:class:`TimeHelper` functionalities outside of a ``View``,
use the ``Time`` class::

    use Cake\Utility\Time;

    class UsersController extends AppController {

        public $components = array('Auth');

        public function afterLogin() {
            $time = new Time($this->Auth->user('date_of_birth'));
            if ($time->isToday()) {
                // greet user with a happy birthday message
                $this->Session->setFlash(__('Happy birthday to you...'));
            }
        }
    }

.. start-time

Manipulation
============

Formatting
==========

Conversion
==========

Once created, you can convert ``Time`` instances into timestamps or quarter
values::

    $time = new Time('2014-06-15');
    $time->toQuarter();
    $time->toUnixString();

Comparing With the Present
==========================

You can compare a ``Time`` instance with the present in a variety of ways::

    $time = new Time('2014-06-15');
    echo $time->isThisWeek();
    echo $time->isThisMonth();
    echo $time->isThisYear();

Each of the above methods will return true/false based on whether or not the
time instance matches the present.

Comparing With Intervals
========================

You can see if a ``Time`` instance falls within a given range using
``wasWithinLast()``, ``isWithinNext()``::

    $time = new Time('2014-06-15');

    // Within 2 days.
    echo $time->isWithinNext(2);

    // Within 2 next weeks.
    echo $time->isWithinNext('2 weeks');

    // Within past 2 days.
    echo $time->isWithinPast(2);

    // Within past 2 weeks.
    echo $time->isWithinPast('2 weeks');

.. end-time

.. meta::
    :title lang=en: Time
    :description lang=en: Time class helps you format time and test time.
    :keywords lang=en: time,format time,timezone,unix epoch,time strings,time zone offset,utc,gmt
