// Formats and repairs a broken JSON-like string into valid JSON and returns the parsed object.
// Handles: literal \n / \" escapes, stray code fences, trailing commas, unterminated strings,
// and unbalanced braces/brackets (appends missing closers).
function formatToProperJson(raw) {
  let s = String(raw ?? "").trim();

  // Strip accidental markdown fences/BOM
  s = s
    .replace(/^\uFEFF/, "")
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  // If content looks like an escaped blob (\" or \n outside strings), decode it first by
  // parsing as a JSON string literal.
  if (/\\[nrt"\\]/.test(s)) {
    try {
      s = JSON.parse('"' + s.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"');
    } catch (_) {
      /* keep original if decoding fails */
    }
  }

  // Normalize newlines
  s = s.replace(/\r/g, "");
  // Replace raw line breaks with spaces when not escaped (prevents broken strings)
  s = s.replace(/([^\\])\n/g, "$1 ");

  // Remove trailing commas before closing } or ]
  s = s.replace(/,\s*([}\]])/g, "$1");

  // Close an unterminated string at the end, if any
  (function closeTrailingString() {
    let inStr = false,
      esc = false;
    for (let i = 0; i < s.length; i++) {
      const ch = s[i];
      if (inStr) {
        if (esc) {
          esc = false;
          continue;
        }
        if (ch === "\\") {
          esc = true;
          continue;
        }
        if (ch === '"') inStr = false;
      } else {
        if (ch === '"') inStr = true;
      }
    }
    if (inStr) s += '"';
  })();

  // Balance braces/brackets ignoring string contents
  (function balanceBrackets() {
    let inStr = false,
      esc = false;
    const stack = [];
    let out = "";
    for (let i = 0; i < s.length; i++) {
      const ch = s[i];
      if (inStr) {
        out += ch;
        if (esc) {
          esc = false;
          continue;
        }
        if (ch === "\\") {
          esc = true;
          continue;
        }
        if (ch === '"') inStr = false;
        continue;
      }
      if (ch === '"') {
        inStr = true;
        out += ch;
        continue;
      }
      if (ch === "{") {
        stack.push("}");
        out += ch;
      } else if (ch === "[") {
        stack.push("]");
        out += ch;
      } else if (ch === "}" || ch === "]") {
        if (stack.length) {
          stack.pop();
          out += ch;
        } else {
          // skip unmatched closer
        }
      } else {
        out += ch;
      }
    }
    // remove trailing comma at EOF safely (outside strings)
    out = out.replace(/,\s*$/, "");
    while (stack.length) out += stack.pop();
    s = out;
  })();

  // Final attempt
  return JSON.parse(s);
}

/* Usage:
const raw = "{\n  \\\"summary\\\": \\\"...\\\", ... \"engagement_insights\": \"... also have a";
const obj = formatToProperJson(raw);
console.log(JSON.stringify(obj, null, 2));
*/

module.exports = { formatToProperJson };
