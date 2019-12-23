# Makefile for Sphinx documentation
#

# You can set these variables from the command line.
SPHINXOPTS    =
SPHINXBUILD   = sphinx-build
PAPER         =
BUILDDIR      = ../build
CONFDIR       = ../config
PYTHON        = python3
LANG          = tr
SPHINX_LANG   = tr

# Internal variables.
PAPEROPT_a4     = -D latex_paper_size=a4
PAPEROPT_letter = -D latex_paper_size=letter
ALLSPHINXOPTS   = -d $(BUILDDIR)/doctrees/$(LANG) -c $(CONFDIR) -D language=$(SPHINX_LANG) $(PAPEROPT_$(PAPER)) $(SPHINXOPTS) .

.PHONY: help clean html dirhtml singlehtml pickle json htmlhelp qthelp devhelp epub latex latexpdf text man changes linkcheck doctest

help:
	@echo "Litfen\`make <target>' kullanın. <target> aşağıdaki seçeneklerden biridir"
	@echo "  html       tekbaşına HTML dosyaları üretmek için"
	@echo "  dirhtml    dizinlerle ayrılmış index.html ve HTML dosyaları oluşturmak için"
	@echo "  singlehtml tek büyük bir HTML dosyası oluşturmak için"
	@echo "  pickle     pickle dosyaları oluşturmak için"
	@echo "  json       JSON dosyaları oluşturmak için"
	@echo "  htmlhelp   HTML dosyaları ve bir HTML help projesi oluşturmak için."
	@echo "  qthelp     HTML dosyaları ve bir qthelp projesi oluşturmak için."
	@echo "  devhelp    HTML dosyaları ve bir Devhelp projesi oluşturmak için."
	@echo "  epub       epub oluşturmak için."
	@echo "  latex      LaTeX dosyaları oluşturmak için. PAPER=a4 veya PAPER=letter seçebilirsiniz."
	@echo "  latexpdf   LaTeX dosyaları and run them through pdflatex oluşturmak için."
	@echo "  text       metin dosyaları oluşturmak için."
	@echo "  man        klavuz sayfaları oluşturmak için."
	@echo "  changes    tüm değişmiş/eklenmiş/yürürlükten kalmış bileşenlerin özetini oluşturmak için."
	@echo "  linkcheck  tüm dış bağlantıları bütünlük için kontrol etme"
	@echo "  doctest    dokümantasyona iliştirilimiş tüm doctests'i çalıştırmak için (etkinleştirildiyse)"

clean:
	-rm -rf $(BUILDDIR)/*

html:
	$(SPHINXBUILD) -b html $(ALLSPHINXOPTS) $(BUILDDIR)/html/$(LANG)
	@echo
	@echo "Oluşturma bitti. HTML dosyaları $(BUILDDIR)/html/$(LANG) konumunda."

dirhtml:
	$(SPHINXBUILD) -b dirhtml $(ALLSPHINXOPTS) $(BUILDDIR)/dirhtml
	@echo
	@echo "Oluşturma bitti. HTML dosyaları $(BUILDDIR)/dirhtml konumunda."

singlehtml:
	$(SPHINXBUILD) -b singlehtml $(ALLSPHINXOPTS) $(BUILDDIR)/singlehtml
	@echo
	@echo "Oluşturma bitti. HTML dosyası $(BUILDDIR)/singlehtml konumunda."

pickle:
	$(SPHINXBUILD) -b pickle $(ALLSPHINXOPTS) $(BUILDDIR)/pickle
	@echo
	@echo "Oluşturma bitti; şimdi pickle doyalarını işleyebilirsiniz."

json:
	$(SPHINXBUILD) -b json $(ALLSPHINXOPTS) $(BUILDDIR)/json
	@echo
	@echo "Oluşturma bitti; şimdi JSON doyalarını işleyebilirsiniz."

htmlhelp:
	$(SPHINXBUILD) -b htmlhelp $(ALLSPHINXOPTS) $(BUILDDIR)/htmlhelp/$(LANG)
	@echo
	@echo "Oluşturma bitti; HTML Help Workshop'u $(BUILDDIR)/htmlhelp/$(LANG) konumundaki" \
	      ".hhp proje dosyası ile çalıştırabilisiniz."

qthelp:
	$(SPHINXBUILD) -b qthelp $(ALLSPHINXOPTS) $(BUILDDIR)/qthelp
	@echo
	@echo "Oluşturma bitti; "qcollectiongenerator" u, $(BUILDDIR)/qthelp konumundaki" \
	      ".qhcp proje dosyası ile çalıştırabilirsiniz. Örneğin:"
	@echo "# qcollectiongenerator $(BUILDDIR)/qthelp/CakePHPCookbook.qhcp"
	@echo "Yardım dosyasını görmek için:"
	@echo "# assistant -collectionFile $(BUILDDIR)/qthelp/CakePHPCookbook.qhc"

devhelp:
	$(SPHINXBUILD) -b devhelp $(ALLSPHINXOPTS) $(BUILDDIR)/devhelp
	@echo
	@echo "Oluşturma bitti."
	@echo "Yardım dosyasını görmek için:"
	@echo "# mkdir -p $$HOME/.local/share/devhelp/CakePHPCookbook"
	@echo "# ln -s $(BUILDDIR)/devhelp $$HOME/.local/share/devhelp/CakePHPCookbook"
	@echo "# devhelp"

epub:
	$(SPHINXBUILD) -b epub -D master_doc='epub-contents' $(ALLSPHINXOPTS) $(BUILDDIR)/epub/$(LANG)
	@echo
	@echo "Oluşturma bitti. epub dosyasyı $(BUILDDIR)/epub/$(LANG) konumunda"

latex:
	$(SPHINXBUILD) -b latex $(ALLSPHINXOPTS) $(BUILDDIR)/latex/$(LANG)
	@echo
	@echo "Oluşturma bitti; LaTeX dosyaları $(BUILDDIR)/latex/$(LANG) konumunda."
	@echo "Dizinde (pdf)latex ile kullanmak için \`make' komutunu çalıştırın." \
	      "İşlemi otomatik olarak yapmak için ( \`make latexpdf' kullanın)."

latexpdf:
	$(SPHINXBUILD) -b latex $(ALLSPHINXOPTS) $(BUILDDIR)/latex/$(LANG)
	@echo "LaTeX dosyaları pdflatex ile çalıştırılıyor..."
	make -C $(BUILDDIR)/latex/$(LANG) all-pdf
	@echo "pdflatex bitti; PDF dosyaları $(BUILDDIR)/latex/$(LANG) konumunda."

text:
	$(SPHINXBUILD) -b text $(ALLSPHINXOPTS) $(BUILDDIR)/text
	@echo
	@echo "Oluşturma bitti. The text dosyaları $(BUILDDIR)/text konumunda."

man:
	$(SPHINXBUILD) -b man $(ALLSPHINXOPTS) $(BUILDDIR)/man
	@echo
	@echo "Oluşturma bitti. The manual pages are in $(BUILDDIR)/man konumunda"

changes:
	$(SPHINXBUILD) -b changes $(ALLSPHINXOPTS) $(BUILDDIR)/changes
	@echo
	@echo "The overview file is in $(BUILDDIR)/changes konumunda"

linkcheck:
	$(SPHINXBUILD) -b linkcheck $(ALLSPHINXOPTS) $(BUILDDIR)/linkcheck
	@echo
	@echo "Bağlantı kontrolü tamamlandı; herhangi bir hata için çıktıya bakınız " \
	      "or in $(BUILDDIR)/linkcheck/output.txt konumunda"

doctest:
	$(SPHINXBUILD) -b doctest $(ALLSPHINXOPTS) $(BUILDDIR)/doctest
	@echo "Kaynaklardaki doctest'lerin testr edilmesi tamamlandı, sonuçlar için " \
	      "$(BUILDDIR)/doctest/output.txt konumuna bakınız"
