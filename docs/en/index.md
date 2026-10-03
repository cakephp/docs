---
title: "|cakefullversion| Cookbook"
description: "Find your way around the CakePHP Cookbook: learn the fundamentals, build your first application, explore the guides, or upgrade an existing app."
pageClass: docs-home
aside: false
outline: false
prev: false
next: false
---

<script setup>
import HomeWelcome from '../../.vitepress/theme/components/HomeWelcome.vue'
import HomeCard from '../../.vitepress/theme/components/HomeCard.vue'
</script>

<HomeWelcome>

<p class="home-version">|cakefullversion| Documentation</p>

# Welcome to the CakePHP 6 Cookbook

Learn the fundamentals, build your first application, or find the guide you need.

</HomeWelcome>

## Find your starting point

A little guidance for wherever you are in your CakePHP journey.

<div class="home-grid home-paths">

<HomeCard href="/intro.html">

<h3>New to CakePHP?</h3>

Get to know the framework, its conventions, and how the pieces fit together.

</HomeCard>

<HomeCard href="/tutorials-and-examples/cms/installation.html">

<h3>Build an application</h3>

Learn by doing with a step-by-step content management system tutorial.

</HomeCard>

<HomeCard href="/appendices/6-0-upgrade-guide.html">

<h3>Upgrade your application</h3>

Prepare your existing application for CakePHP 6.

</HomeCard>

</div>

<div class="home-quickstart">
<div class="home-quickstart-copy">

## Quick start

Have PHP |minphpversion|+ and Composer installed? Create an application and start the development server.

[Installation guide →](installation)

</div>
<div class="home-quickstart-commands">

```bash:no-line-numbers
composer create-project --prefer-dist cakephp/app:~|cakeversion| my_app
cd my_app
bin/cake server
```

Then open [localhost:8765](http://localhost:8765).

</div>
</div>

## Explore the guides

Jump straight to the part of your application you're working on.

<div class="home-grid home-guides">

<HomeCard href="/controllers.html">

<h3>HTTP</h3>

Handle requests and responses with controllers and components.

</HomeCard>

<HomeCard href="/orm.html">

<h3>Database</h3>

Work with tables, queries, associations, and application data.

</HomeCard>

<HomeCard href="/views.html">

<h3>Views</h3>

Create templates, layouts, and reusable helpers.

</HomeCard>

<HomeCard href="/security.html">

<h3>Security</h3>

Explore the tools for protecting your application.

</HomeCard>

<HomeCard href="/development/testing.html">

<h3>Testing</h3>

Build confidence with unit tests and integration tests.

</HomeCard>

<HomeCard href="/deployment.html">

<h3>Deployment</h3>

Get your application ready for production.

</HomeCard>

</div>

<div class="home-more">

[All topics →](topics)

[API reference ↗](https://api.cakephp.org/)

</div>

<div class="home-help">

## Get Help

You don't have to figure it all out on your own. Find support or help improve the Cookbook.

<div class="home-more">

[Find help →](intro/where-to-get-help)

[Community forum ↗](https://discourse.cakephp.org/)

[Contribute →](contributing)

</div>

</div>
