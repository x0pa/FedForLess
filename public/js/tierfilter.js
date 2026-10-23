(function () {
  var bar = document.getElementById("tierfilter");
  if (!bar) return;
  var list = document.querySelector("ol.index");
  if (!list) return;
  var rows = Array.prototype.slice.call(list.querySelectorAll("li"));
  var original = rows.slice();
  function apply(f) {
    rows.forEach(function (li) {
      li.style.display = (f === "all" || li.dataset.tier === f) ? "" : "none";
    });
    bar.querySelectorAll("[data-filter]").forEach(function (b) {
      b.classList.toggle("on", b.dataset.filter === f);
    });
  }
  bar.addEventListener("click", function (e) {
    var b = e.target.closest("[data-filter]");
    if (b) { apply(b.dataset.filter); return; }
    var s = e.target.closest("#sort-cheapest");
    if (s) {
      var sorted = s.classList.toggle("on");
      var order = sorted
        ? rows.slice().sort(function (a, b2) { return parseFloat(a.dataset.cost || 99) - parseFloat(b2.dataset.cost || 99); })
        : original;
      order.forEach(function (li) { list.appendChild(li); });
    }
  });
  var wanted = new URLSearchParams(location.search).get("tier");
  if (wanted && ["green", "butter", "tomato"].indexOf(wanted) >= 0) apply(wanted);
})();
