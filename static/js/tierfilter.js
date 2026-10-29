(function () {
  var bar = document.getElementById("tierfilter");
  var list = document.querySelector(".rindex ol.index");
  if (!bar || !list) return;
  var rows = Array.prototype.slice.call(list.querySelectorAll("li"));
  var countEl = document.getElementById("ri-count");
  var emptyEl = document.getElementById("ri-empty");
  var moreBtn = document.getElementById("ri-more");
  var featSec = document.getElementById("ri-feat");
  var sortSel = document.getElementById("sortsel");
  var input = document.getElementById("site-search-input");
  var BATCH = 6;
  var state = { tier: "all", meal: "all", sort: "newest", q: "", shown: BATCH };

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
  function isDefault() {
    return state.tier === "all" && state.meal === "all" && state.sort === "newest" && state.q.trim() === "";
  }
  function matches(li) {
    if (state.tier !== "all" && li.dataset.tier !== state.tier) return false;
    if (state.meal !== "all") {
      var meals = (li.dataset.meals || "").split(" ");
      if (meals.indexOf(state.meal) < 0) return false;
    }
    var q = state.q.trim().toLowerCase();
    if (q) {
      var cap = priceCap(q);
      if (cap !== null && parseFloat(li.dataset.cost || 99) > cap) return false;
      var rest = cleanQuery(q, cap);
      if (rest) {
        var blob = (li.dataset.search || "") + " " + (li.dataset.title || "");
        var toks = rest.split(/\s+/);
        for (var i = 0; i < toks.length; i++) {
          if (blob.indexOf(toks[i]) === -1) return false;
        }
      }
    }
    return true;
  }
  function sortPool(pool) {
    var s = state.sort;
    pool.sort(function (a, b) {
      if (s === "low") return parseFloat(a.dataset.cost || 99) - parseFloat(b.dataset.cost || 99);
      if (s === "high") return parseFloat(b.dataset.cost || 99) - parseFloat(a.dataset.cost || 99);
      if (s === "oldest") return parseInt(a.dataset.date || 0, 10) - parseInt(b.dataset.date || 0, 10);
      if (s === "az") return (a.dataset.title || "").localeCompare(b.dataset.title || "");
      return parseInt(b.dataset.date || 0, 10) - parseInt(a.dataset.date || 0, 10); // newest
    });
  }
  function render() {
    var def = isDefault();
    var pool = rows.filter(function (li) {
      if (!matches(li)) return false;
      if (def && li.dataset.featured === "1") return false;
      return true;
    });
    sortPool(pool);
    pool.forEach(function (li) { list.appendChild(li); });
    var shownCount = 0;
    rows.forEach(function (li) { li.style.display = "none"; });
    pool.forEach(function (li, i) {
      if (i < state.shown) { li.style.display = ""; shownCount++; }
    });
    if (countEl) {
      countEl.textContent = countEl.dataset.tpl.replace("{x}", shownCount).replace("{y}", pool.length);
    }
    if (emptyEl) emptyEl.hidden = pool.length !== 0;
    if (moreBtn) moreBtn.hidden = !(pool.length > shownCount);
    if (featSec) featSec.style.display = def ? "" : "none";
    bar.querySelectorAll("[data-filter]").forEach(function (b) {
      var on = b.dataset.filter === state.tier;
      b.classList.toggle("on", on); b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    bar.querySelectorAll("[data-meal]").forEach(function (b) {
      var on = b.dataset.meal === state.meal;
      b.classList.toggle("on", on); b.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }
  function changed(resetBatch) {
    if (resetBatch) state.shown = BATCH;
    render();
  }

  bar.addEventListener("click", function (e) {
    var b = e.target.closest("[data-filter]");
    if (b) { state.tier = b.dataset.filter; changed(true); return; }
    var m = e.target.closest("[data-meal]");
    if (m) { state.meal = m.dataset.meal; changed(true); }
  });
  if (sortSel) sortSel.addEventListener("change", function () { state.sort = sortSel.value; changed(true); });
  if (input) {
    var deb = null;
    input.addEventListener("input", function () {
      window.clearTimeout(deb);
      deb = window.setTimeout(function () { state.q = input.value; changed(true); }, 120);
    });
    var btn = document.getElementById("site-search-btn");
    if (btn) btn.addEventListener("click", function () { state.q = input.value; changed(true); input.focus(); });
  }
  if (moreBtn) moreBtn.addEventListener("click", function () { state.shown += BATCH; render(); });
  var clearBtn = document.getElementById("ri-clear");
  if (clearBtn) clearBtn.addEventListener("click", function () {
    state.tier = "all"; state.meal = "all"; state.sort = "newest"; state.q = "";
    if (input) input.value = "";
    if (sortSel) sortSel.value = "newest";
    changed(true);
  });

  var params = new URLSearchParams(location.search);
  var wantedTier = params.get("tier");
  if (wantedTier && ["green", "butter", "tomato"].indexOf(wantedTier) >= 0) state.tier = wantedTier;
  var wantedMeal = params.get("meal");
  if (wantedMeal && ["breakfast", "lunch", "dinner"].indexOf(wantedMeal) >= 0) state.meal = wantedMeal;
  render();
})();
