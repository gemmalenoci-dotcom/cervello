/* cervello.unlikeacademy.it · copia dei prompt, spunte e fogli salvati solo in questo browser, stampa, copia della scheda */
(function(){
  var CH='cervello-v1';
  var stato={};
  function leggi(){try{stato=JSON.parse(localStorage.getItem(CH)||'{}')||{}}catch(e){stato={}}}
  function salva(){try{localStorage.setItem(CH,JSON.stringify(stato))}catch(e){}}
  leggi();

  function riserva(t,fatto){var a=document.createElement('textarea');a.value=t;a.style.position='fixed';a.style.opacity='0';document.body.appendChild(a);a.select();try{document.execCommand('copy')}catch(e){}document.body.removeChild(a);fatto()}
  function copia(t,btn,etichetta){
    var fatto=function(){var o=btn.textContent;btn.textContent=etichetta||'Copiato ✓';btn.classList.add('done');setTimeout(function(){btn.textContent=o;btn.classList.remove('done')},1800)};
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(fatto).catch(function(){riserva(t,fatto)})}else{riserva(t,fatto)}
  }

  document.querySelectorAll('.copy').forEach(function(b){
    b.addEventListener('click',function(e){
      e.preventDefault();
      var p=document.getElementById(b.dataset.target);if(!p)return;
      copia(p.innerText,b);
    });
  });

  // spunte (autotest e riassunto)
  document.querySelectorAll('input[type=checkbox][id]').forEach(function(c){
    if(stato['c_'+c.id])c.checked=true;
    c.addEventListener('change',function(){stato['c_'+c.id]=c.checked;salva()});
  });

  // fogli: restano solo su questo dispositivo
  function altezza(t){t.style.height='auto';t.style.height=Math.max(t.scrollHeight,t.dataset.min?+t.dataset.min:32)+'px'}
  document.querySelectorAll('textarea[data-k]').forEach(function(t){
    var k='t_'+t.dataset.k;
    if(stato[k])t.value=stato[k];
    altezza(t);
    t.addEventListener('input',function(){stato[k]=t.value;salva();altezza(t)});
  });

  // stampa
  document.querySelectorAll('[data-stampa]').forEach(function(b){
    b.addEventListener('click',function(){
      document.querySelectorAll('textarea[data-k]').forEach(altezza);
      window.print();
    });
  });

  // copia la scheda compilata
  document.querySelectorAll('[data-copia-scheda]').forEach(function(b){
    b.addEventListener('click',function(){
      var righe=[];
      document.querySelectorAll('.scheda-g .bl').forEach(function(bl){
        var h=bl.querySelector('h3'),t=bl.querySelector('textarea');
        if(!h||!t)return;
        righe.push(h.textContent.trim().toUpperCase()+'\n'+(t.value.trim()||'[da compilare]'));
      });
      copia('LA MIA SCHEDA\n\n'+righe.join('\n\n'),b,'Scheda copiata ✓');
    });
  });

  // svuota
  document.querySelectorAll('[data-svuota]').forEach(function(b){
    b.addEventListener('click',function(){
      if(!window.confirm('Vuoi cancellare quello che hai scritto in questa pagina? Su questo dispositivo non si può recuperare'))return;
      document.querySelectorAll('textarea[data-k]').forEach(function(t){t.value='';delete stato['t_'+t.dataset.k];altezza(t)});
      salva();
    });
  });
})();
