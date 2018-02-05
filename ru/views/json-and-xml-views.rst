Представления JSON и XML
########################

``JsonView`` и ``XmlView`` позволяют вам создавать ответы JSON и XML,
и интегрировать его с
:php:class:`Cake\\Controller\\Component\\RequestHandlerComponent`.

Активируя ``RequestHandlerComponent`` в вашем приложении, а также поддержку
расширений ``json`` и/или ``xml``, вы можете автоматически использовать
новые классы представлений. ``JsonView`` и ``XmlView`` будут далее именоваться
просто как представления данных в этом разделе.

Существует два способа, с помощью которых вы можете создать представления
данных. Первый - используя ключ ``_serialize``, и второй - создав обычные
файлы шаблонов.

Активация представлений данных в вашем приложении
=================================================

Прежде чем вы сможете использовать классы представлений данных, вам нужно
сначала загрузить
:php:class:`Cake\\Controller\\Component\\RequestHandlerComponent` в вашем
контроллере::

    public function initialize()
    {
        ...
        $this->loadComponent('RequestHandler');
    }

Это может быть сделано в вашем ``AppController``, и активирует автоматическое
переключение классов представлений, в зависимости от типа содержимого. Вы
также можете настроить компонент с помощью опции ``viewClassMap``, чтобы
сопоставить типы вашим кастомным классам и/или добавить сопоставления также и
для других типов данных (отличных от JSON и XML).

Вы опционально можете включить поддержку расширений json и/или xml, используя
:ref:`маршрутизацию по расширениям файлов <file-extensions>`. Это позволит вам
получать доступ к данным в определенном формате, будь то ``JSON``, ``XML`` или
какой-либо другой формат, используя URL, оканчивающийся на имя типа ответа, как
если бы это было расширением файла. К примеру
``http://example.com/articles.json``.

По умолчанию, когда не включена
:ref:`маршрутизацию по расширениям файлов <file-extensions>`, запрос, для
которого использовался заголовок ``Accept``, определяет какого типа формат
должен быть выведен пользователю. Например, формат ``Accept``, используемый для
вывода ответа в формате ``JSON`` - ``application/json``.

Использование представлений данных с ключом Serialize
=====================================================

Ключ ``_serialize`` - это особая переменная представления, указывающая, какие
другие переменные представления должны быть сериализованы при использовании
представлений данных. Это позволяет вам избежать определение файлов шаблонов
для экшенов ваших контроллеров, если вам не требуется какое-то особое
форматирование перед тем, как ваши данные будут сконвертированы в json/xml.

Если вам необходимо совершить какие-либо манипуляции с вашими переменными
представления перед генерированием ответа - используйте файлы шаблонов.
Значением переменной ``_serialize`` может быть как строка, так и массив
переменных представления для сериализации::

    namespace App\Controller;

    class ArticlesController extends AppController
    {
        public function initialize()
        {
            parent::initialize();
            $this->loadComponent('RequestHandler');
        }

        public function index()
        {
            // Установить переменные представления, которые должны
            // быть сериализованы.
            $this->set('articles', $this->paginate());
            // Указываем, какие переменные представления JsonView
            // должен сериализовать.
            $this->set('_serialize', 'articles');
        }
    }


Вы можете также определить ``_serialize`` как массив переменных
представления, которые нам нужно совместить::

    namespace App\Controller;

    class ArticlesController extends AppController
    {
        public function initialize()
        {
            parent::initialize();
            $this->loadComponent('RequestHandler');
        }

        public function index()
        {
            // Какой-то код, создавший $articles и $comments

            // Установливаем переменные представления, которые должны
            // быть сериализованы.
            $this->set(compact('articles', 'comments'));

            // Указываем, какие переменные представления JsonView
            // должен сериализовать.
            $this->set('_serialize', ['articles', 'comments']);
        }
    }

Определяя ``_serialize`` как массив, мы получаем преимущество автоматического
добавления элемента верхнего уровня ``<response>`` при использовании
:php:class:`XmlView`. Если вы используете строковое значение для
``_serialize`` и XmlView, убедитесь в том, что ваша переменная представления
имеет единственный элемент верхнего уровня. Если элементов верхнего уровня
будет больше одного, Xml не сможет сгенерироваться.

Использование представления данных с файлами шаблонов
=====================================================

Вы должны использовать файлы шаблонов, если вам нужно сделать какие-либо
манипуляции с содержимым вашего представления перед созданием окончательного
вывода. Например, если бы у нас были статьи, у которых было бы поле,
содержащее сгенерированный HTML, мы, вероятно, хотели бы исключить это из
ответа JSON. Это как раз та ситуация, когда файл представления будет полезен::

    // Код контроллера
    class ArticlesController extends AppController
    {
        public function index()
        {
            $articles = $this->paginate('Articles');
            $this->set(compact('articles'));
        }
    }

    // Код представления - src/Template/Articles/json/index.ctp
    foreach ($articles as &$article) {
        unset($article->generated_html);
    }
    echo json_encode(compact('articles'));

You can do more complex manipulations, or use helpers to do formatting as well.
The data view classes don't support layouts. They assume that the view file will
output the serialized content.

.. note::
    As of 3.1.0 AppController, in the application skeleton automatically adds
    ``'_serialize' => true`` to all XML/JSON requests. You will need to remove
    this code from the beforeRender callback or set ``'_serialize' => false`` in
    your controller's action if you want to use view files.

Creating XML Views
==================

.. php:class:: XmlView

By default when using ``_serialize`` the XmlView will wrap your serialized
view variables with a ``<response>`` node. You can set a custom name for
this node using the ``_rootNode`` view variable.

The XmlView class supports the ``_xmlOptions`` variable that allows you to
customize the options used to generate XML, e.g. ``tags`` vs ``attributes``.

Creating JSON Views
===================

.. php:class:: JsonView

The JsonView class supports the ``_jsonOptions`` variable that allows you to
customize the bit-mask used to generate JSON. See the
`json_encode <http://php.net/json_encode>`_ documentation for the valid
values of this option.

For example, to serialize validation error output of CakePHP entities in a consistent form of JSON do::

    // In your controller's action when saving failed
    $this->set('errors', $articles->errors());
    $this->set('_jsonOptions', JSON_FORCE_OBJECT);
    $this->set('_serialize', ['errors']);

JSONP Responses
---------------

When using ``JsonView`` you can use the special view variable ``_jsonp`` to
enable returning a JSONP response. Setting it to ``true`` makes the view class
check if query string parameter named "callback" is set and if so wrap the json
response in the function name provided. If you want to use a custom query string
parameter name instead of "callback" set ``_jsonp`` to required name instead of
``true``.

Example Usage
=============

While the :doc:`RequestHandlerComponent
</controllers/components/request-handling>` can automatically set the view based
on the request content-type or extension, you could also handle view
mappings in your controller::

    // src/Controller/VideosController.php
    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Network\Exception\NotFoundException;

    class VideosController extends AppController
    {
        public function export($format = '')
        {
            $format = strtolower($format);

            // Format to view mapping
            $formats = [
              'xml' => 'Xml',
              'json' => 'Json',
            ];

            // Error on unknown type
            if (!isset($formats[$format])) {
                throw new NotFoundException(__('Unknown format.'));
            }

            // Set Out Format View
            $this->viewBuilder()->className($formats[$format]);

            // Get data
            $videos = $this->Videos->find('latest');

            // Set Data View
            $this->set(compact('videos'));
            $this->set('_serialize', ['videos']);

            // Set Force Download
            // Prior to 3.4.0
            // $this->response->download('report-' . date('YmdHis') . '.' . $format);
            return $this->response->withDownload('report-' . date('YmdHis') . '.' . $format);
        }
    }
