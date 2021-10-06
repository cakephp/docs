付録
####

ここでは、各バージョンで導入された新機能に関する情報と、
バージョン間の移行手順を解説します。

4.x 移行ガイド
==============

.. toctree::
    :maxdepth: 1

    appendices/4-0-migration-guide
    appendices/4-0-upgrade-guide
    appendices/4-1-migration-guide
    appendices/4-2-migration-guide

後方互換性の補完
================

3.x の振舞いとの補完が必要な場合、または段階的に部分的な移行が必要な場合、
`Shim プラグイン <https://github.com/dereuromark/cakephp-shim>`__ を確認してください。
後方互換性を損なう変更を移行するのに役立ちます。

前方互換性の補完
================

前方互換性の補完は、次のメジャーリリース (4.x) のために、3.x アプリを準備できます。

既存の 3.x で 4.x の振舞いに合わせたい場合、
`Shim プラグイン <https://github.com/dereuromark/cakephp-shim>`__ を確認してください。
後方互換性を損なう変更を移行するのに役立ちます。
3.x アプリが 4.x に近いほど、変更の差分は小さくなり、最終的なアップグレードはよりスムーズになります。


一般的な情報
============

.. toctree::
    :maxdepth: 1

    appendices/cakephp-development-process
    appendices/glossary

.. meta::
    :title lang=ja: 付録
    :keywords lang=ja: 移行ガイド,移行手順,新機能,用語集
