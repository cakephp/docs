<?php
class ImportShell extends Shell {

	protected $_urlStack = array('/');

	protected $_crawled = array();

	public function main() {
		App::import('Core', 'HttpSocket');
		$this->Socket = new HttpSocket();

		while($this->_urlStack) {
			$url = array_shift($this->_urlStack);
			$this->_crawl($url);
		}
	}

	protected function _crawl($url = '') {
		$this->_crawled[] = $url;
		$this->out('Crawling ' . $url);
		if ($url[0] === '/') {
			$url = 'http://book.cakephp.org' . $url;
		}
		$cacheFile = TMP . '/stash/' . md5($url);
		if (file_exists($cacheFile)) {
			$fullContents = file_get_contents($cacheFile);
		} else {
			$fullContents = $this->Socket->get($url);
			exec('mkdir -p ' . dirname($cacheFile));
			file_put_contents($cacheFile, $fullContents);
		}
		$this->_addNextPage($fullContents);

		$filename = $this->_fileName($fullContents);
		$contents = $this->_fileContents($fullContents);
		$this->out('Writing ' . $filename);
		exec('mkdir -p ' . dirname($filename));
		file_put_contents($filename, $contents);
	}

	protected function _addNextPage($contents) {
		preg_match('@<span class="next"><a href="(.*?)".*?>(.*?)</a></span>@s', $contents, $next);
		if ($next && !in_array($next[1], $this->_crawled)) {
			$this->_urlStack[] = $next[1];
		}
	}

	protected function _fileName($contents) {
		preg_match('@<div class="crumbs">\s*<a href="/.*?">.*?</a>&raquo;(.*?)</div>@s', $contents, $crumbs);
		if (!$crumbs || !trim($crumbs[1])) {
			return 'source/index.rst';
		}
		$input = strip_tags(str_replace(array('&raquo;', '&amp;'), array('/', 'and'), $crumbs[1]));

		$pattern = '\x00-\x1f\x26\x3c\x7f-\x9f\x{d800}-\x{dfff}\x{fffe}-\x{ffff}';
		$pattern .= preg_quote(' \'"?!<>\(\).$:;?@=+&%\#', '@');

		$return = preg_replace('@[' . $pattern . ']@Su', '-', $input);
		return 'source/' . trim(mb_strtolower(preg_replace('/-+/', '-', $return), 'UTF-8'), '-') . '.rst';
	}

	protected function _fileContents($contents) {
		$contents = preg_replace('@<div class="options">.*?</div>@s', '', $contents);
		preg_match('@<div class="nodes view">(.*?)<div class="node-nav">@s', $contents, $contents);

		$contents = $this->_convertHtmlToReST($contents);
		return $contents;
	}

	protected function _convertHtmlToReST($html) {
		#@TODO
		return $html;
	}
}