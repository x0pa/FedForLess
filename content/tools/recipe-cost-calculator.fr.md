---
title: "Calculateur de coût de recette"
description: "Transformez le prix des emballages en coût des ingrédients : prix, taille et quantité utilisée, ligne par ligne, et obtenez le total de la recette."
---

Voici les calculs exacts derrière chaque détail de coûts de Fed For Less. Pour chaque ingrédient, entrez le prix de l'emballage, la taille de l'emballage et la quantité que votre recette utilise, dans la même unité (grammes avec grammes, millilitres avec millilitres). Ajoutez des lignes au besoin.

<div class="toolbox nums">
  <div id="rc-lines"></div>
  <button id="rc-add" style="background:var(--denim);color:#fff;border:none;font-weight:800;padding:.7rem 1.2rem;border-radius:6px;cursor:pointer;font:inherit;margin-top:.8rem;">Ajouter une ligne d'ingrédient</button>
  <label for="rc-servings">Portions que la recette donne</label>
  <input id="rc-servings" type="number" min="1" step="1" value="4">
  <div class="out" id="rc-out">Total de la recette : 0,00 $ · Par portion : —</div>
</div>

<script>
(function(){
  var wrap=document.getElementById('rc-lines'), out=document.getElementById('rc-out'),
      serv=document.getElementById('rc-servings');
  function fmt(v){ return v.toFixed(2).replace('.',',')+' $'; }
  function line(){
    var d=document.createElement('div');
    d.style.display='grid'; d.style.gridTemplateColumns='1fr 1fr 1fr 1fr'; d.style.gap='.6rem'; d.style.marginTop='.6rem';
    d.innerHTML='<input type="number" min="0" step="0.01" placeholder="Prix emballage $" class="rc-p">'+
      '<input type="number" min="0" step="any" placeholder="Taille emballage" class="rc-s">'+
      '<input type="number" min="0" step="any" placeholder="Quantité utilisée" class="rc-u">'+
      '<input type="text" readonly class="rc-r" placeholder="0,00 $" style="background:#F2F5F9;">';
    wrap.appendChild(d);
    d.querySelectorAll('input').forEach(function(i){ i.addEventListener('input',go); });
  }
  function go(){
    var total=0;
    wrap.querySelectorAll('div').forEach(function(d){
      var p=parseFloat(d.querySelector('.rc-p').value), s=parseFloat(d.querySelector('.rc-s').value),
          u=parseFloat(d.querySelector('.rc-u').value), r=d.querySelector('.rc-r');
      if(p>=0 && s>0 && u>=0){ var v=p*u/s; r.value=fmt(v); total+=v; }
      else r.value='';
    });
    var sv=parseFloat(serv.value);
    out.textContent='Total de la recette : '+fmt(total)+' · Par portion : '+(sv>0 ? fmt(total/sv) : '—');
  }
  document.getElementById('rc-add').addEventListener('click',function(){ line(); });
  serv.addEventListener('input',go);
  line(); line(); line();
})();
</script>

## Le coût du panier, aussi

Le calculateur vous donne le coût de ce que vous avez utilisé. Le coût du panier est plus simple et plus brutal : additionnez le prix complet de chaque emballage de la liste d'achats. Une recette peut être douce par portion et exiger quand même un panier de quarante dollars la première fois. Les deux chiffres comptent, et c'est pourquoi chaque recette ici affiche les deux.
