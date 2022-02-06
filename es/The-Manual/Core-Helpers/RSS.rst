RSS
###

El helper RSS hace que generar XML para un RSS feed sea muy fácil.

Creando un RSS feed con el RssHelper
====================================

Este ejemplo asume que tu tienes creados un controlador de Posts y un
modelo de Post y que quieres hacer una vista alternativa para RSS.

Crear una version xml/rss de posts/index es algo muy fácil con CakePHP
1.2. Despues de unos simples pasos puedes añadir la extension .rss a
post/index haciendo tu URL posts/index.rss. Antes de adelantarnos
tratando de conseguir que nuestro servicio web quede listo, debemos
hacer algunas pequeñas cosas. Primero debemos activar parseExtensions,
esto se hace en app/config/routes.php

::

          Router::parseExtensions('rss');

En segundo lugar una buena idea es agregar RequestHandler al arreglo de
componentes $components de PostsController. Esto permitirá que ocurra
mucha automagia. En la llamanda anterior hemos activado la extension
.rss. Cuando usamos Router::parseExtensions() podemos pasar tantos
argumentos o extensiones como queramos. Esto activará cada
'extension/content-type' para el uso de nuestra aplicación. Ahora,
cuando la dirección posts/index.rss sea requerida obtendrás una versión
xml de posts/index. Sin embargo, lo primero que necesitamos es hacer que
los archivos de vista que crearán nuestro rss/xml feed.

Código para el Controlador
--------------------------

Antes de crear nuestra version RSS de posts/index necesitamos poner
algunas cosas en orden. Es tentador poner el canal de metadatos en la
accion del controlador y pasarlo a nuestas vistas usando la función
Controller::set() pero es es inapropiado. Esta información también ir a
la vista. Pero eso vendrá después, por ahora si tienes alguna lógica
diferente para los datos usados en el RSS feed y los datos que se usan
en la vista html puedes usar el método RequestHandler::isRss(), de otra
forma tu controlador puede quedar igual.

::

    // Modificar la accion del controlador de Posts que corresponde
    // a la cual entrega el rss feed, que en nuestro caso
    // es la accion index

    public function index(){
        if( $this->RequestHandler->isRss() ){
            $posts = $this->Post->find('all', array('limit' => 20, 'order' => 'Post.created DESC'));
            $this->set(compact('posts'));
        } else {
            // esta no es una llamada Rss, entonces entregamos
            // usamos los datos para la salida html
            $this->paginate['Post'] = array('order' = 'Post.created DESC', 'limit' => 10);
            
            $posts = $this->paginate();
            $this->set(compact('posts'));
        }
    }

Con todas las variables de vista configuradas necesitamos crear un
layout rss.

Layout RSS
~~~~~~~~~~

Un layout RSS es muy simple, escribe lo siguiente en
app/view/layouts/rss/default.ctp:

::

    echo $rss->header();
    if (!isset($documentData)) {
        $documentData = array();
    }
    if (!isset($channelData)) {
        $channelData = array();
    }
    if (!isset($channelData['title'])) {
        $channelData['title'] = $title_for_layout;
    } 
    $channel = $rss->channel(array(), $channelData, $content_for_layout);
    echo $rss->document($documentData,$channel);

No parece ser la gran cosa, sin embargo gracias al poder del RssHelper
hara un monton de cosas por nosotros. No hemos configrado $documentData
o $channelData en nuestro controlador, sin embargo, en CakePHP 1.2 tus
vistas pueden pasar variables de vuelta al layout. En este momento
nuestro arreglo $channelData entrará en acción para configurar todos los
metadatos para nuestro feed.

Lo siguiente es el archivo de vista de posts/index. Así como necesitamos
un layout, necesitamos crear el directorio views/posts/rss/ y crear un
nuevo index.ctp dentro. El contenido de ese archivo está mas abajo.

La vista
~~~~~~~~

Nuestra vista comienza por configurar las variables $documentData y
$channelData para el layout, estos contienen todos los metadatos para
nuestro RSS feed. Esto se hace utilizando el método View::set() el cual
es análogo al método Controller::set(). Acá estamos pasando los
metadatos del canal de vuelta al layout.

::

        $this->set('documentData', array(
            'xmlns:dc' => 'http://purl.org/dc/elements/1.1/'));

        $this->set('channelData', array(
            'title' => __("Artículos más leídos", true),
            'link' => $html->url('/', true),
            'description' => __("Artículos más recientes.", true),
            'language' => 'en-us'));

La segunda parte de la vista genera los elementos para los registros del
feed. Esto se consigue haciendo un ciclo a los datos entregados a la
vista ($items) y usando el método RssHelper::item(). El otro método que
puedes usar es, RssHelper::items() el cual toma una llamada y un arreglo
de items para el feed. (El metodo usado para las llamadas siempre a se
ha llamado transformRss()). Hay un punto débil en este método, que es
que no puedes usar ningún método de otro helper para preparar los datos
dentro del metodo de la llamada, porque el ámbito dentro de la llamada
no incluye nada que no se haya entregado desde afuera, lo que no da
acceso al TimeHelper o cualquier otro que necesitemos. El metodo
RssHelper::item() transforma el arreglo asociativo en un elemento para
cada par llave-valor.

::

        foreach ($entries as $entry) {
            $postTime = strtotime($entry['Entry']['created']);
     
            $entryLink = array(
                'controller' => 'entries',
                'action' => 'view',
                'year' => date('Y', $postTime),
                'month' => date('m', $postTime),
                'day' => date('d', $postTime),
                $entry['Entry']['slug']);
            // deberías importar Sanitize
            App::import('Sanitize');
            // Acá es donde se limpia el cuerpo del texto para la salida como la descripción
            // de los items rss, esto necesita tener solo texto para asegurarnos de que valide el feed
            $bodyText = preg_replace('=\(.*?)\=is', '', $entry['Entry']['body']);
            $bodyText = $text->stripLinks($bodyText);
            $bodyText = Sanitize::stripAll($bodyText);
            $bodyText = $text->truncate($bodyText, 400, '...', true, true);
     
            echo  $rss->item(array(), array(
                'title' => $entry['Entry']['title'],
                'link' => $entryLink,
                'guid' => array('url' => $entryLink, 'isPermaLink' => 'true'),
                'description' =>  $bodyText,
                'dc:creator' => $entry['Entry']['author'],
                'pubDate' => $entry['Entry']['created']));
        }

Puedes ver que podemos usar el loop para preparar los datos para ser
transformados en elementos XML. Es importante filtrar cuaquier caracter
que no sea de texto plano, especialmente si estas usando un editor de
html para el cuerpo de tu blog. En el codigo anterior usamos el método
TextHelper::stripLinks() y algunos pocos métodos de la clase Sanitize,
pero recomendamos escribir un helper especializado para dejar el texto
realmente limpio. Una vez que hemos configurado los datos para el feed,
podemos usar el método RssHelper::item() para crear el XML del formato
RSS. Una vez que hayas hecho todo esto, puedes probar tu RSS
dirigiéndote a la direccion /entries/index.rss y verás tu nuevo feed.
Siempre es importante que valides tu RSS feed antes de ponerlo en
produccion. Esto se puede hacer visitando algunos sitios como
FeedValidator o el sitio de w3c en https://validator.w3.org/feed/.
