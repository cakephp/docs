<?php 
header('HTTP/1.1 301 Moved Permanently');

if (preg_match('#/1\.1/(en)/view/305/?.*$#', $_SERVER['REQUEST_URI'],  $match)) {
    header("Location: https://book.cakephp.org/1.1/$match[1]/index.html");
    exit;
}
if (preg_match('#/1\.1/view/305/?.*$#', $_SERVER['REQUEST_URI'], $match)) {
    header("Location: https://book.cakephp.org/1.1/en/index.html");
    exit;
}
if (preg_match('#/1\.1/[a-z]{2, 3}/view/305/?.*$#', $_SERVER['REQUEST_URI'], $match)) {
    header("Location: https://book.cakephp.org/1.1/en/index.html");
    exit;
}
if (preg_match('#/1\.1/(en)/view/306/?.*$#', $_SERVER['REQUEST_URI'],  $match)) {
    header("Location: https://book.cakephp.org/1.1/$match[1]/preface.html");
    exit;
}
if (preg_match('#/1\.1/view/306/?.*$#', $_SERVER['REQUEST_URI'], $match)) {
    header("Location: https://book.cakephp.org/1.1/en/preface.html");
    exit;
}
if (preg_match('#/1\.1/[a-z]{2, 3}/view/306/?.*$#', $_SERVER['REQUEST_URI'], $match)) {
    header("Location: https://book.cakephp.org/1.1/en/preface.html");
    exit;
}
if (preg_match('#/1\.1/(en)/view/307/?.*$#', $_SERVER['REQUEST_URI'],  $match)) {
    header("Location: https://book.cakephp.org/1.1/$match[1]/introduction-to-cakephp.html");
    exit;
}
if (preg_match('#/1\.1/view/307/?.*$#', $_SERVER['REQUEST_URI'], $match)) {
    header("Location: https://book.cakephp.org/1.1/en/introduction-to-cakephp.html");
    exit;
}
if (preg_match('#/1\.1/[a-z]{2, 3}/view/307/?.*$#', $_SERVER['REQUEST_URI'], $match)) {
    header("Location: https://book.cakephp.org/1.1/en/introduction-to-cakephp.html");
    exit;
}
if (preg_match('#/1\.1/(en)/view/309/?.*$#', $_SERVER['REQUEST_URI'],  $match)) {
    header("Location: https://book.cakephp.org/1.1/$match[1]/basic-concepts.html");
    exit;
}
if (preg_match('#/1\.1/view/309/?.*$#', $_SERVER['REQUEST_URI'], $match)) {
    header("Location: https://book.cakephp.org/1.1/en/basic-concepts.html");
    exit;
}
if (preg_match('#/1\.1/[a-z]{2, 3}/view/309/?.*$#', $_SERVER['REQUEST_URI'], $match)) {
    header("Location: https://book.cakephp.org/1.1/en/basic-concepts.html");
    exit;
}
if (preg_match('#/1\.1/(en)/view/308/?.*$#', $_SERVER['REQUEST_URI'],  $match)) {
    header("Location: https://book.cakephp.org/1.1/$match[1]/installing-cakephp.html");
    exit;
}
if (preg_match('#/1\.1/view/308/?.*$#', $_SERVER['REQUEST_URI'], $match)) {
    header("Location: https://book.cakephp.org/1.1/en/installing-cakephp.html");
    exit;
}
if (preg_match('#/1\.1/[a-z]{2, 3}/view/308/?.*$#', $_SERVER['REQUEST_URI'], $match)) {
    header("Location: https://book.cakephp.org/1.1/en/installing-cakephp.html");
    exit;
}
if (preg_match('#/1\.1/(en)/view/310/?.*$#', $_SERVER['REQUEST_URI'],  $match)) {
    header("Location: https://book.cakephp.org/1.1/$match[1]/configuration.html");
    exit;
}
if (preg_match('#/1\.1/view/310/?.*$#', $_SERVER['REQUEST_URI'], $match)) {
    header("Location: https://book.cakephp.org/1.1/en/configuration.html");
    exit;
}
if (preg_match('#/1\.1/[a-z]{2, 3}/view/310/?.*$#', $_SERVER['REQUEST_URI'], $match)) {
    header("Location: https://book.cakephp.org/1.1/en/configuration.html");
    exit;
}
if (preg_match('#/1\.1/(en)/view/311/?.*$#', $_SERVER['REQUEST_URI'],  $match)) {
    header("Location: https://book.cakephp.org/1.1/$match[1]/scaffolding.html");
    exit;
}
if (preg_match('#/1\.1/view/311/?.*$#', $_SERVER['REQUEST_URI'], $match)) {
    header("Location: https://book.cakephp.org/1.1/en/scaffolding.html");
    exit;
}
if (preg_match('#/1\.1/[a-z]{2, 3}/view/311/?.*$#', $_SERVER['REQUEST_URI'], $match)) {
    header("Location: https://book.cakephp.org/1.1/en/scaffolding.html");
    exit;
}
if (preg_match('#/1\.1/(en)/view/312/?.*$#', $_SERVER['REQUEST_URI'],  $match)) {
    header("Location: https://book.cakephp.org/1.1/$match[1]/models.html");
    exit;
}
if (preg_match('#/1\.1/view/312/?.*$#', $_SERVER['REQUEST_URI'], $match)) {
    header("Location: https://book.cakephp.org/1.1/en/models.html");
    exit;
}
if (preg_match('#/1\.1/[a-z]{2, 3}/view/312/?.*$#', $_SERVER['REQUEST_URI'], $match)) {
    header("Location: https://book.cakephp.org/1.1/en/models.html");
    exit;
}
if (preg_match('#/1\.1/(en)/view/313/?.*$#', $_SERVER['REQUEST_URI'],  $match)) {
    header("Location: https://book.cakephp.org/1.1/$match[1]/controllers.html");
    exit;
}
if (preg_match('#/1\.1/view/313/?.*$#', $_SERVER['REQUEST_URI'], $match)) {
    header("Location: https://book.cakephp.org/1.1/en/controllers.html");
    exit;
}
if (preg_match('#/1\.1/[a-z]{2, 3}/view/313/?.*$#', $_SERVER['REQUEST_URI'], $match)) {
    header("Location: https://book.cakephp.org/1.1/en/controllers.html");
    exit;
}
if (preg_match('#/1\.1/(en)/view/314/?.*$#', $_SERVER['REQUEST_URI'],  $match)) {
    header("Location: https://book.cakephp.org/1.1/$match[1]/views.html");
    exit;
}
if (preg_match('#/1\.1/view/314/?.*$#', $_SERVER['REQUEST_URI'], $match)) {
    header("Location: https://book.cakephp.org/1.1/en/views.html");
    exit;
}
if (preg_match('#/1\.1/[a-z]{2, 3}/view/314/?.*$#', $_SERVER['REQUEST_URI'], $match)) {
    header("Location: https://book.cakephp.org/1.1/en/views.html");
    exit;
}
if (preg_match('#/1\.1/(en)/view/315/?.*$#', $_SERVER['REQUEST_URI'],  $match)) {
    header("Location: https://book.cakephp.org/1.1/$match[1]/components.html");
    exit;
}
if (preg_match('#/1\.1/view/315/?.*$#', $_SERVER['REQUEST_URI'], $match)) {
    header("Location: https://book.cakephp.org/1.1/en/components.html");
    exit;
}
if (preg_match('#/1\.1/[a-z]{2, 3}/view/315/?.*$#', $_SERVER['REQUEST_URI'], $match)) {
    header("Location: https://book.cakephp.org/1.1/en/components.html");
    exit;
}
if (preg_match('#/1\.1/(en)/view/316/?.*$#', $_SERVER['REQUEST_URI'],  $match)) {
    header("Location: https://book.cakephp.org/1.1/$match[1]/helpers.html");
    exit;
}
if (preg_match('#/1\.1/view/316/?.*$#', $_SERVER['REQUEST_URI'], $match)) {
    header("Location: https://book.cakephp.org/1.1/en/helpers.html");
    exit;
}
if (preg_match('#/1\.1/[a-z]{2, 3}/view/316/?.*$#', $_SERVER['REQUEST_URI'], $match)) {
    header("Location: https://book.cakephp.org/1.1/en/helpers.html");
    exit;
}
if (preg_match('#/1\.1/(en)/view/317/?.*$#', $_SERVER['REQUEST_URI'],  $match)) {
    header("Location: https://book.cakephp.org/1.1/$match[1]/cakes-global-constants-and-functions.html");
    exit;
}
if (preg_match('#/1\.1/view/317/?.*$#', $_SERVER['REQUEST_URI'], $match)) {
    header("Location: https://book.cakephp.org/1.1/en/cakes-global-constants-and-functions.html");
    exit;
}
if (preg_match('#/1\.1/[a-z]{2, 3}/view/317/?.*$#', $_SERVER['REQUEST_URI'], $match)) {
    header("Location: https://book.cakephp.org/1.1/en/cakes-global-constants-and-functions.html");
    exit;
}
if (preg_match('#/1\.1/(en)/view/318/?.*$#', $_SERVER['REQUEST_URI'],  $match)) {
    header("Location: https://book.cakephp.org/1.1/$match[1]/data-validation.html");
    exit;
}
if (preg_match('#/1\.1/view/318/?.*$#', $_SERVER['REQUEST_URI'], $match)) {
    header("Location: https://book.cakephp.org/1.1/en/data-validation.html");
    exit;
}
if (preg_match('#/1\.1/[a-z]{2, 3}/view/318/?.*$#', $_SERVER['REQUEST_URI'], $match)) {
    header("Location: https://book.cakephp.org/1.1/en/data-validation.html");
    exit;
}
if (preg_match('#/1\.1/(en)/view/319/?.*$#', $_SERVER['REQUEST_URI'],  $match)) {
    header("Location: https://book.cakephp.org/1.1/$match[1]/plugins.html");
    exit;
}
if (preg_match('#/1\.1/view/319/?.*$#', $_SERVER['REQUEST_URI'], $match)) {
    header("Location: https://book.cakephp.org/1.1/en/plugins.html");
    exit;
}
if (preg_match('#/1\.1/[a-z]{2, 3}/view/319/?.*$#', $_SERVER['REQUEST_URI'], $match)) {
    header("Location: https://book.cakephp.org/1.1/en/plugins.html");
    exit;
}
if (preg_match('#/1\.1/(en)/view/320/?.*$#', $_SERVER['REQUEST_URI'],  $match)) {
    header("Location: https://book.cakephp.org/1.1/$match[1]/access-control-lists.html");
    exit;
}
if (preg_match('#/1\.1/view/320/?.*$#', $_SERVER['REQUEST_URI'], $match)) {
    header("Location: https://book.cakephp.org/1.1/en/access-control-lists.html");
    exit;
}
if (preg_match('#/1\.1/[a-z]{2, 3}/view/320/?.*$#', $_SERVER['REQUEST_URI'], $match)) {
    header("Location: https://book.cakephp.org/1.1/en/access-control-lists.html");
    exit;
}
if (preg_match('#/1\.1/(en)/view/321/?.*$#', $_SERVER['REQUEST_URI'],  $match)) {
    header("Location: https://book.cakephp.org/1.1/$match[1]/data-sanitation-the-sanitize-class.html");
    exit;
}
if (preg_match('#/1\.1/view/321/?.*$#', $_SERVER['REQUEST_URI'], $match)) {
    header("Location: https://book.cakephp.org/1.1/en/data-sanitation-the-sanitize-class.html");
    exit;
}
if (preg_match('#/1\.1/[a-z]{2, 3}/view/321/?.*$#', $_SERVER['REQUEST_URI'], $match)) {
    header("Location: https://book.cakephp.org/1.1/en/data-sanitation-the-sanitize-class.html");
    exit;
}
if (preg_match('#/1\.1/(en)/view/322/?.*$#', $_SERVER['REQUEST_URI'],  $match)) {
    header("Location: https://book.cakephp.org/1.1/$match[1]/the-cake-session-component.html");
    exit;
}
if (preg_match('#/1\.1/view/322/?.*$#', $_SERVER['REQUEST_URI'], $match)) {
    header("Location: https://book.cakephp.org/1.1/en/the-cake-session-component.html");
    exit;
}
if (preg_match('#/1\.1/[a-z]{2, 3}/view/322/?.*$#', $_SERVER['REQUEST_URI'], $match)) {
    header("Location: https://book.cakephp.org/1.1/en/the-cake-session-component.html");
    exit;
}
if (preg_match('#/1\.1/(en)/view/323/?.*$#', $_SERVER['REQUEST_URI'],  $match)) {
    header("Location: https://book.cakephp.org/1.1/$match[1]/the-request-handler-component.html");
    exit;
}
if (preg_match('#/1\.1/view/323/?.*$#', $_SERVER['REQUEST_URI'], $match)) {
    header("Location: https://book.cakephp.org/1.1/en/the-request-handler-component.html");
    exit;
}
if (preg_match('#/1\.1/[a-z]{2, 3}/view/323/?.*$#', $_SERVER['REQUEST_URI'], $match)) {
    header("Location: https://book.cakephp.org/1.1/en/the-request-handler-component.html");
    exit;
}
if (preg_match('#/1\.1/(en)/view/324/?.*$#', $_SERVER['REQUEST_URI'],  $match)) {
    header("Location: https://book.cakephp.org/1.1/$match[1]/the-security-component.html");
    exit;
}
if (preg_match('#/1\.1/view/324/?.*$#', $_SERVER['REQUEST_URI'], $match)) {
    header("Location: https://book.cakephp.org/1.1/en/the-security-component.html");
    exit;
}
if (preg_match('#/1\.1/[a-z]{2, 3}/view/324/?.*$#', $_SERVER['REQUEST_URI'], $match)) {
    header("Location: https://book.cakephp.org/1.1/en/the-security-component.html");
    exit;
}
if (preg_match('#/1\.1/(en)/view/304/?.*$#', $_SERVER['REQUEST_URI'],  $match)) {
    header("Location: https://book.cakephp.org/1.1/$match[1]/x1-1-collection.html");
    exit;
}
if (preg_match('#/1\.1/view/304/?.*$#', $_SERVER['REQUEST_URI'], $match)) {
    header("Location: https://book.cakephp.org/1.1/en/x1-1-collection.html");
    exit;
}
if (preg_match('#/1\.1/[a-z]{2, 3}/view/304/?.*$#', $_SERVER['REQUEST_URI'], $match)) {
    header("Location: https://book.cakephp.org/1.1/en/x1-1-collection.html");
    exit;
}
if (preg_match('#/1\.1/(en).*$#', $_SERVER['REQUEST_URI'], $match)) { header("Location: https://book.cakephp.org/1.1/$match[1]/"); exit; }

if (preg_match('#/1\.1.*$#', $_SERVER['REQUEST_URI'], $match)) { header("Location: https://book.cakephp.org/1.1/en/"); exit; }

