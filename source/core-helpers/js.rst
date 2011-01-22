7.5 Js
------

Since the beginning CakePHP's support for Javascript has been with
Prototype/Scriptaculous. While we still think these are an
excellent Javascript library, the community has been asking for
support for other libraries. Rather than drop Prototype in favour
of another Javascript library. We created an Adapter based helper,
and included 3 of the most requested libraries.
Prototype/Scriptaculous, Mootools/Mootools-more, and jQuery/jQuery
UI. And while the API is not as expansive as the previous
AjaxHelper we feel that the adapter based solution allows for a
more extensible solution giving developers the power and
flexibility they need to address their specific application needs.

Javascript Engines form the backbone of the new JsHelper. A
Javascript engine translates an abstract Javascript element into
concrete Javascript code specific to the Javascript library being
used. In addition they create an extensible system for others to
use.
