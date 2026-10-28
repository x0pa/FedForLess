(function () {
  var bar = document.getElementById("tierfilter");
  if (!bar) return;
  var list = document.querySelector("ol.index");
  if (!list) return;
  var rows = Array.prototype.slice.call(list.querySelectorAll("li"));
  var original = rows.slice();
  var state = { tier: "all", meal: "all" };
  function apply() {
    rows.forEach(function (li) {
      var tierOk = state.tier === "all" || li.dataset.tier === state.tier;
      var meals = (li.dataset.meals || "").split(" ");
      var mealOk = state.meal === "all" || meals.indexOf(state.meal) >= 0;
      li.style.display = tierOk && mealOk ? "" : "none";
    });
    bar.querySelectorAll("[data-filter]").forEach(function (b) {
      b.classList.toggle("on", b.dataset.filter === state.tier);
    });
    bar.querySelectorAll("[data-meal]").forEach(function (b) {
      b.classList.toggle("on", b.dataset.meal === state.meal);
    });
  }
  bar.addEventListener("click", function (e) {
    var b = e.target.closest("[data-filter]");
    if (b) { state.tier = b.dataset.filter; apply(); return; }
    var m = e.target.closest("[data-meal]");
    if (m) { state.meal = m.dataset.meal; apply(); return; }
    var s = e.target.closest("#sort-cheapest");
    if (s) {
      var sorted = s.classList.toggle("on");
      var order = sorted
        ? rows.slice().sort(function (a, b2) { return parseFloat(a.dataset.cost || 99) - parseFloat(b2.dataset.cost || 99); })
        : original;
      order.forEach(function (li) { list.appendChild(li); });
    }
  });
  var params = new URLSearchParams(location.search);
  var wantedTier = params.get("tier");
  if (wantedTier && ["green", "butter", "tomato"].indexOf(wantedTier) >= 0) state.tier = wantedTier;
  var wantedMeal = params.get("meal");
  if (wantedMeal && ["breakfast", "lunch", "dinner"].indexOf(wantedMeal) >= 0) state.meal = wantedMeal;
  if (state.tier !== "all" || state.meal !== "all") apply();
})();
