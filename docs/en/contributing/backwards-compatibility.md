# Backwards Compatibility Guide

Ensuring that you can upgrade your applications easily and smoothly is important
to us. That's why we only break compatibility at major release milestones.
You might be familiar with [semantic versioning](https://semver.org/), which is
the general guideline we use on all CakePHP projects. In short, semantic
versioning means that only major releases (such as 2.0, 3.0, 4.0) can break
backwards compatibility. Minor releases (such as 2.1, 3.1, 3.2) may introduce
new features, but are not allowed to break compatibility. Bug fix releases
(such as 2.1.2, 3.0.1) do not add new features, but fix bugs or enhance
performance only.

> [!NOTE]
> CakePHP started following semantic versioning in 2.0.0. These rules do not
> apply to 1.x.

To clarify what changes you can expect in each release tier we have more
detailed information for developers using CakePHP, and for developers working on
CakePHP that helps set expectations of what can be done in minor releases. Major
releases can have as many breaking changes as required.

## Migration Guides

For each major and minor release, the CakePHP team will provide a migration
guide. These guides explain the new features and any breaking changes that are
in each release. They can be found in the [Appendices](../appendices) section of the
cookbook.

## Using CakePHP

If you are building your application with CakePHP, the following guidelines
explain the stability you can expect.

### Interfaces

Outside of major releases, interfaces provided by CakePHP will **not** have any
existing methods changed and new methods will **not** be added to any existing
interfaces.

### Classes

Classes provided by CakePHP can be constructed and have their public methods and
properties used by application code and outside of major releases backwards
compatibility is ensured.

> [!NOTE]
> Some classes in CakePHP are marked with the `@internal` API doc tag. These
> classes are **not** stable and do not have any backwards compatibility
> promises.

In minor releases (3.x.0), new methods may be added to classes, and existing
methods may have new arguments added. Any new arguments will have default
values, but if you've overidden methods with a differing signature you may see
errors. Methods that have new arguments added will be documented in the
migration guide for that release.

The following table outlines several use cases and what compatibility you can
expect from CakePHP:

<table style="width:82%;">
<colgroup>
<col style="width: 44%" />
<col style="width: 37%" />
</colgroup>
<thead>
<tr>
<th>If you...</th>
<th>Backwards compatibility?</th>
</tr>
</thead>
<tbody>
<tr>
<td>Typehint against the class</td>
<td>Yes</td>
</tr>
<tr>
<td>Create a new instance</td>
<td>Yes</td>
</tr>
<tr>
<td>Extend the class</td>
<td>Yes</td>
</tr>
<tr>
<td>Access a public property</td>
<td>Yes</td>
</tr>
<tr>
<td>Call a public method</td>
<td>Yes</td>
</tr>
<tr>
<td colspan="2"><strong>Extend a class and...</strong></td>
</tr>
<tr>
<td>Call a protected method</td>
<td>No<a href="#fn1" class="footnote-ref" id="fnref1" role="doc-noteref"><sup>1</sup></a></td>
</tr>
<tr>
<td>Override a protected property</td>
<td>No<a href="#fn2" class="footnote-ref" id="fnref2" role="doc-noteref"><sup>2</sup></a></td>
</tr>
<tr>
<td>Override a protected method</td>
<td>No<a href="#fn3" class="footnote-ref" id="fnref3" role="doc-noteref"><sup>3</sup></a></td>
</tr>
<tr>
<td>Access a protected property</td>
<td>No<a href="#fn4" class="footnote-ref" id="fnref4" role="doc-noteref"><sup>4</sup></a></td>
</tr>
<tr>
<td>Call a public method</td>
<td>Yes</td>
</tr>
<tr>
<td>Override a public method</td>
<td>Yes<a href="#fn5" class="footnote-ref" id="fnref5" role="doc-noteref"><sup>5</sup></a></td>
</tr>
<tr>
<td>Override a public property</td>
<td>Yes</td>
</tr>
<tr>
<td>Add a public property</td>
<td>No</td>
</tr>
<tr>
<td>Add a public method</td>
<td>No</td>
</tr>
<tr>
<td>Add an argument to an overridden method</td>
<td>No<a href="#fn6" class="footnote-ref" id="fnref6" role="doc-noteref"><sup>6</sup></a></td>
</tr>
<tr>
<td>Add a default argument to an existing method</td>
<td>Yes</td>
</tr>
</tbody>
</table>
<section id="footnotes" class="footnotes footnotes-end-of-document" role="doc-endnotes">
<hr />
<ol>
<li id="fn1"><p>Your code <em>may</em> be broken by minor releases. Check the migration guide for details.<a href="#fnref1" class="footnote-back" role="doc-backlink">↩︎</a></p></li>
<li id="fn2"><p>Your code <em>may</em> be broken by minor releases. Check the migration guide for details.<a href="#fnref2" class="footnote-back" role="doc-backlink">↩︎</a></p></li>
<li id="fn3"><p>Your code <em>may</em> be broken by minor releases. Check the migration guide for details.<a href="#fnref3" class="footnote-back" role="doc-backlink">↩︎</a></p></li>
<li id="fn4"><p>Your code <em>may</em> be broken by minor releases. Check the migration guide for details.<a href="#fnref4" class="footnote-back" role="doc-backlink">↩︎</a></p></li>
<li id="fn5"><p>Your code <em>may</em> be broken by minor releases. Check the migration guide for details.<a href="#fnref5" class="footnote-back" role="doc-backlink">↩︎</a></p></li>
<li id="fn6"><p>Your code <em>may</em> be broken by minor releases. Check the migration guide for details.<a href="#fnref6" class="footnote-back" role="doc-backlink">↩︎</a></p></li>
</ol>
</section>

## Working on CakePHP

If you are helping make CakePHP even better please keep the following guidelines
in mind when adding/changing functionality:

In a minor release you can:

<table style="width:82%;">
<colgroup>
<col style="width: 44%" />
<col style="width: 37%" />
</colgroup>
<thead>
<tr>
<th colspan="2">In a minor release can you...</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2"><strong>Classes</strong></td>
</tr>
<tr>
<td>Remove a class</td>
<td>No</td>
</tr>
<tr>
<td>Remove an interface</td>
<td>No</td>
</tr>
<tr>
<td>Remove a trait</td>
<td>No</td>
</tr>
<tr>
<td>Make final</td>
<td>No</td>
</tr>
<tr>
<td>Make abstract</td>
<td>No</td>
</tr>
<tr>
<td>Change name</td>
<td>Yes<a href="#fn1" class="footnote-ref" id="fnref1" role="doc-noteref"><sup>1</sup></a></td>
</tr>
<tr>
<td colspan="2"><strong>Properties</strong></td>
</tr>
<tr>
<td>Add a public property</td>
<td>Yes</td>
</tr>
<tr>
<td>Remove a public property</td>
<td>No</td>
</tr>
<tr>
<td>Add a protected property</td>
<td>Yes</td>
</tr>
<tr>
<td>Remove a protected property</td>
<td>Yes<a href="#fn2" class="footnote-ref" id="fnref2" role="doc-noteref"><sup>2</sup></a></td>
</tr>
<tr>
<td colspan="2"><strong>Methods</strong></td>
</tr>
<tr>
<td>Add a public method</td>
<td>Yes</td>
</tr>
<tr>
<td>Remove a public method</td>
<td>No</td>
</tr>
<tr>
<td>Add a protected method</td>
<td>Yes</td>
</tr>
<tr>
<td>Move member to parent class</td>
<td>Yes</td>
</tr>
<tr>
<td>Remove a protected method</td>
<td>Yes<a href="#fn3" class="footnote-ref" id="fnref3" role="doc-noteref"><sup>3</sup></a></td>
</tr>
<tr>
<td>Reduce visibility</td>
<td>No</td>
</tr>
<tr>
<td>Change method name</td>
<td>Yes<a href="#fn4" class="footnote-ref" id="fnref4" role="doc-noteref"><sup>4</sup></a></td>
</tr>
<tr>
<td>Add default value to existing argument</td>
<td>No</td>
</tr>
<tr>
<td>Add argument with default value</td>
<td>Yes</td>
</tr>
<tr>
<td>Add required argument</td>
<td>No</td>
</tr>
</tbody>
</table>
<section id="footnotes" class="footnotes footnotes-end-of-document" role="doc-endnotes">
<hr />
<ol>
<li id="fn1"><p>You can change a class/method name as long as the old name remains available. This is generally avoided unless renaming has significant benefit.<a href="#fnref1" class="footnote-back" role="doc-backlink">↩︎</a></p></li>
<li id="fn2"><p>Avoid whenever possible. Any removals need to be documented in the migration guide.<a href="#fnref2" class="footnote-back" role="doc-backlink">↩︎</a></p></li>
<li id="fn3"><p>Avoid whenever possible. Any removals need to be documented in the migration guide.<a href="#fnref3" class="footnote-back" role="doc-backlink">↩︎</a></p></li>
<li id="fn4"><p>You can change a class/method name as long as the old name remains available. This is generally avoided unless renaming has significant benefit.<a href="#fnref4" class="footnote-back" role="doc-backlink">↩︎</a></p></li>
</ol>
</section>
