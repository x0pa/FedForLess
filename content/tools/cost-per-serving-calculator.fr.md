---
title: "Calculateur de coût par portion"
description: "Additionnez le coût des ingrédients d'une recette et divisez par le nombre réel de portions. Le chiffre le plus honnête de la cuisine économique."
---

Entrez ce qu'ont coûté les ingrédients que vous avez utilisés, au total, et combien de vraies portions la recette a données. Vraie veut dire la portion qu'un adulte qui a faim mange, pas la portion qui rend le chiffre joli.

<div class="toolbox nums">
  <label for="cps-total">Coût total des ingrédients de la recette ($)</label>
  <input id="cps-total" type="number" min="0" step="0.01" placeholder="8,02">
  <label for="cps-servings">Portions que la recette a vraiment données</label>
  <input id="cps-servings" type="number" min="1" step="1" placeholder="6">
  <div class="out" id="cps-out">Coût par portion : —</div>
  <p id="cps-tier" style="font-weight:700;color:#2C3138;"></p>
</div>

<script>
(function(){
  var t=document.getElementById('cps-total'), s=document.getElementById('cps-servings'),
      o=document.getElementById('cps-out'), tier=document.getElementById('cps-tier');
  function fmt(v){ return v.toFixed(2).replace('.',',')+' $'; }
  function go(){
    var tv=parseFloat(t.value), sv=parseFloat(s.value);
    if(tv>=0 && sv>0){
      var per=tv/sv;
      o.textContent='Coût par portion : '+fmt(per);
      tier.textContent = per<=1.50 ? "Palier Fed For Less : Vert (jusqu'à 1,50 $)." :
        per<=2.50 ? "Palier Fed For Less : Beurre (de 1,51 $ à 2,50 $)." :
        per<=3.25 ? "Palier Fed For Less : Tomate (de 2,51 $ à 3,25 $), une petite folie rassasiante." :
        "Au dessus du palier tomate de Fed For Less. Pensez à une protéine moins chère ou à une plus grosse recette.";
    } else { o.textContent='Coût par portion : —'; tier.textContent=''; }
  }
  t.addEventListener('input',go); s.addEventListener('input',go);
})();
</script>

## Comment obtenir le coût de la recette

Chiffrez chaque ingrédient selon la quantité utilisée : le prix de l'emballage divisé par la taille de l'emballage, multiplié par la quantité que la recette prend. Un demi sac coûte la moitié du prix. Ajoutez une petite allocation pour les épices, l'huile, le sel et l'ail plutôt que de prétendre qu'ils sont gratuits. Ce total est le coût de la recette, et le calculateur ci dessus fait le reste.
