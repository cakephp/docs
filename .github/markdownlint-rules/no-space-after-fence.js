"use strict";

module.exports = {
  names: ["no-space-after-fence"],
  description: "Disallow spaces between a fence and the info string.",
  tags: ["code", "fences", "whitespace"],
  function: function noSpaceAfterFence(params, onError) {
    const lines = params.lines || [];

    (params.tokens || []).forEach((token) => {
      if (token.type !== "fence") {
        return;
      }

      if (!token.markup || token.markup[0] !== "`") {
        return;
      }

      if (!token.map || token.map.length === 0) {
        return;
      }

      const lineNumber = token.map[0] + 1;
      const line = lines[lineNumber - 1] || "";

      if (/^\s*`{3,}[ \t]+\S/.test(line)) {
        onError({
          lineNumber,
          detail: "Remove the space between the fence and the info string.",
          context: line.trim()
        });
      }
    });
  }
};
