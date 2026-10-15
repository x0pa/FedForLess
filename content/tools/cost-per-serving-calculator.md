---
title: "Cost Per Serving Calculator"
description: "Add up a recipe's ingredient costs and divide by real servings. The simplest honest number in budget cooking, calculated for you."
---

Enter what the ingredients you used cost, in total, and how many real servings the recipe made. Real means the portion a hungry adult eats, not the portion that makes the number pretty.

<div class="toolbox nums">
  <label for="cps-total">Total ingredient cost of the batch ($)</label>
  <input id="cps-total" type="number" min="0" step="0.01" placeholder="8.02">
  <label for="cps-servings">Servings the batch actually made</label>
  <input id="cps-servings" type="number" min="1" step="1" placeholder="6">
  <div class="out" id="cps-out">Cost per serving: —</div>
  <p id="cps-tier" style="font-weight:700;color:#2C3138;"></p>
</div>

<script>
(function(){
  var t=document.getElementById('cps-total'), s=document.getElementById('cps-servings'),
      o=document.getElementById('cps-out'), tier=document.getElementById('cps-tier');
  function go(){
    var tv=parseFloat(t.value), sv=parseFloat(s.value);
    if(tv>=0 && sv>0){
      var per=tv/sv;
      o.textContent='Cost per serving: $'+per.toFixed(2);
      tier.textContent = per<=1.50 ? 'Fed For Less tier: Green (up to $1.50).' :
        per<=2.50 ? 'Fed For Less tier: Butter ($1.51 to $2.50).' :
        per<=3.25 ? 'Fed For Less tier: Tomato ($2.51 to $3.25), a filling splurge.' :
        'Above the Fed For Less tomato tier. Worth a cheaper protein or a bigger batch.';
    } else { o.textContent='Cost per serving: —'; tier.textContent=''; }
  }
  t.addEventListener('input',go); s.addEventListener('input',go);
})();
</script>

## How to get the batch cost

Price each ingredient by the amount used: the package price divided by the package size, times the amount the recipe takes. Half a bag is half the price. Add a small allowance for spices, oil, salt, and garlic rather than pretending they are free. That total is the batch cost, and the calculator above does the rest.
