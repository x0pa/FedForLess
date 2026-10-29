(function () {
  var input = document.getElementById("site-search-input");
  if (!input) return;
  var box = input.closest(".searchbox");
  var results = document.getElementById("site-search-results");
  var status = document.getElementById("site-search-status");
  var lang = (document.documentElement.lang || "en").toLowerCase();
  var isFr = lang.indexOf("fr") === 0;
  var idx = null, timer = null;

  function fmtPrice(n) {
    var s = n.toFixed(2);
    return isFr ? s.replace(".", ",") + " $" : "$" + s;
  }
  function setStatus(n, q) {
    if (!status) return;
    if (timer) window.clearTimeout(timer);
    timer = window.setTimeout(function () {
      if (n === null) { status.textContent = ""; return; }
      var tpl = n === 1 ? box.dataset.one : box.dataset.many;
      status.textContent = tpl.replace("{n}", n) + " \u2014 " + q;
    }, 250);
  }
  function priceCap(q) {
    var m = q.match(/(?:under|below|less than|max|moins de|sous les|sous)\s*\$?\s*(\d+(?:[.,]\d+)?)/);
    if (m) return parseFloat(m[1].replace(",", "."));
    if (/\b(a|one|un|une)\s+(dollar|dollars)\b/.test(q) || /\bunder a dollar\b/.test(q)) return 1;
    if (/\b(two|deux)\s+(dollars)\b/.test(q)) return 2;
    if (/\b(three|trois)\s+(dollars)\b/.test(q)) return 3;
    return null;
  }
  function cleanQuery(q, cap) {
    if (cap === null) return q;
    return q.replace(/(?:under|below|less than|max|moins de|sous les|sous)\s*\$?\s*\d+(?:[.,]\d+)?/g, " ")
            .replace(/\b(a|one|un|une|two|deux|three|trois)\s+(dollar|dollars)\b/g, " ")
            .replace(/\b(under|below|max|moins|sous|dollar|dollars)\b/g, " ")
            .replace(/\$/g, " ").replace(/\s+/g, " ").trim();
  }
  function render(items, cap) {
    results.innerHTML = "";
    var found = 0;
    items.slice(0, 10).forEach(function (it) {
      var a = document.createElement("a");
      a.className = "sres"; a.href = it.url;
      if (it.kind === "recipe" && it.image) {
        var img = document.createElement("img");
        img.src = it.image; img.alt = ""; a.appendChild(img);
      }
      var mid = document.createElement("div");
      var t = document.createElement("div"); t.className = "st"; t.textContent = it.title;
      var s = document.createElement("div"); s.className = "ss";
      s.textContent = it.kind === "tool" ? box.dataset.tool
        : it.tier + " \u00B7 " + it.servings + (isFr ? " portions" : " servings") + " \u00B7 " + it.time;
      mid.appendChild(t); mid.appendChild(s); a.appendChild(mid);
      if (it.kind === "recipe" && it.cost) {
        var p = document.createElement("div"); p.className = "sp";
        p.textContent = fmtPrice(parseFloat(it.cost));
        var per = document.createElement("small"); per.textContent = box.dataset.perserving;
        p.appendChild(per); a.appendChild(p);
      }
      results.appendChild(a); found++;
    });
    if (!found) {
      var d = document.createElement("div"); d.className = "snone";
      d.textContent = box.dataset.noresults; results.appendChild(d);
    }
    return found;
  }
  function search() {
    var raw = input.value.trim();
    var q = raw.toLowerCase();
    if (q.length < 2) { results.innerHTML = ""; setStatus(null); return; }
    var cap = priceCap(q);
    var rest = cleanQuery(q, cap);
    var tokens = rest ? rest.split(/\s+/) : [];
    var hits = idx.items.filter(function (it) {
      if (cap !== null) {
        if (it.kind !== "recipe" || !it.cost || parseFloat(it.cost) > cap) return false;
      }
      for (var i = 0; i < tokens.length; i++) {
        if (it.text.indexOf(tokens[i]) === -1) return false;
      }
      return true;
    });
    hits.sort(function (a, b) {
      if (a.kind !== b.kind) return a.kind === "recipe" ? -1 : 1;
      return parseFloat(a.cost || 99) - parseFloat(b.cost || 99);
    });
    setStatus(render(hits, cap), raw);
  }
  fetch(box.dataset.index).then(function (r) { return r.json(); })
    .then(function (data) {
      idx = data;
      input.addEventListener("input", search);
      var btn = document.getElementById("site-search-btn");
      if (btn) btn.addEventListener("click", function () { search(); input.focus(); });
      document.querySelectorAll(".chip[data-q]").forEach(function (chip) {
        chip.addEventListener("click", function () {
          input.value = chip.getAttribute("data-q");
          search();
          input.focus();
        });
      });
      if (input.value) search();
    })
    .catch(function () { /* search stays silent if the index cannot load */ });
})();
