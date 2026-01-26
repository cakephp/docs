# A Typical CakePHP Request

We've covered the basic ingredients in CakePHP, so let's look at
how objects work together to complete a basic request. Continuing
with our original request example, let's imagine that our friend
Ricardo just clicked on the "Buy A Custom Cake Now!" link on a
CakePHP application's landing page.

<figure class="align-center">
<img src="/typical-cake-request.png" alt="Flow diagram showing a typical CakePHP request" />
<figcaption aria-hidden="true">Flow diagram showing a typical CakePHP request</figcaption>
</figure>

Figure: 2. Typical CakePHP Request.

Black = required element, Gray = optional element, Blue = callback

1.  Ricardo clicks the link pointing to
    <http://www.example.com/cakes/buy>, and his browser makes a request
    to your web server.
2.  The Router parses the URL in order to extract the parameters for
    this request: the controller, action, and any other arguments that
    will affect the business logic during this request.
3.  Using routes, a request URL is mapped to a controller action (a
    method in a specific controller class). In this case, it's the
    buy() method of the CakesController. The controller's
    beforeFilter() callback is called before any controller action
    logic is executed.
4.  The controller may use models to gain access to the
    application's data. In this example, the controller uses a model to
    fetch Ricardo's last purchases from the database. Any applicable
    model callbacks, behaviors, and DataSources may apply during this
    operation. While model usage is not required, all CakePHP
    controllers initially require at least one model.
5.  After the model has retrieved the data, it is returned to the
    controller. Model callbacks may apply.
6.  The controller may use components to further refine the data or
    perform other operations (session manipulation, authentication, or
    sending emails, for example).
7.  Once the controller has used models and components to prepare
    the data sufficiently, that data is handed to the view using the
    controller's set() method. Controller callbacks may be applied
    before the data is sent. The view logic is performed, which may
    include the use of elements and/or helpers. By default, the view is
    rendered inside a layout.
8.  Additional controller callbacks (like `~Controller::afterFilter`) may be
    applied. The complete, rendered view code is sent to Ricardo's
    browser.
