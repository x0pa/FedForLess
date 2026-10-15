---
title: "Recipe Cost Calculator"
description: "Turn package prices into ingredient costs: enter a package price, its size, and how much the recipe uses, line by line, and get the batch total."
---

This is the exact arithmetic behind every Fed For Less breakdown. For each ingredient, enter the package price, the package size, and the amount your recipe uses, in the same unit (grams with grams, millilitres with millilitres). Add lines as needed.

<div class="toolbox nums">
  <div id="rc-lines"></div>
  <button id="rc-add" style="background:var(--denim);color:#fff;border:none;font-weight:800;padding:.7rem 1.2rem;border-radius:6px;cursor:pointer;font:inherit;margin-top:.8rem;">Add an ingredient line</button>
  <label for="rc-servings">Servings the recipe makes</label>
  <input id="rc-servings" type="number" min="1" step="1" value="4">
  <div class="out" id="rc-out">Batch total: $0.00 · Per serving: —</div>
</div>

<script>
(function(){
  var wrap=document.getElementById('rc-lines'), out=document.getElementById('rc-out'),
      serv=document.getElementById('rc-servings');
  function line(){
    var d=document.createElement('div');
    d.style.display='grid'; d.style.gridTemplateColumns='1fr 1fr 1fr 1fr'; d.style.gap='.6rem'; d.style.marginTop='.6rem';
    d.innerHTML='<input type="number" min="0" step="0.01" placeholder="Pkg price $" class="rc-p">'+
      '<input type="number" min="0" step="any" placeholder="Pkg size" class="rc-s">'+
      '<input type="number" min="0" step="any" placeholder="Amount used" class="rc-u">'+
      '<input type="text" readonly class="rc-r" placeholder="$0.00" style="background:#F2F5F9;">';
    wrap.appendChild(d);
    d.querySelectorAll('input').forEach(function(i){ i.addEventListener('input',go); });
  }
  function go(){
    var total=0;
    wrap.querySelectorAll('div').forEach(function(d){
      var p=parseFloat(d.querySelector('.rc-p').value), s=parseFloat(d.querySelector('.rc-s').value),
          u=parseFloat(d.querySelector('.rc-u').value), r=d.querySelector('.rc-r');
      if(p>=0 && s>0 && u>=0){ var v=p*u/s; r.value='$'+v.toFixed(2); total+=v; }
      else r.value='';
    });
    var sv=parseFloat(serv.value);
    out.textContent='Batch total: $'+total.toFixed(2)+' · Per serving: '+(sv>0 ? '$'+(total/sv).toFixed(2) : '—');
  }
  document.getElementById('rc-add').addEventListener('click',function(){ line(); });
  serv.addEventListener('input',go);
  line(); line(); line();
})();
</script>

## The basket cost, too

The calculator gives you the cost of what you used. The basket cost is simpler and ruder: add up the full price of every package on the shopping list. A recipe can be gentle per serving and still need a forty dollar basket the first time. Both numbers matter, which is why every recipe here shows both.
