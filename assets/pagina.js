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

(function(){
  // avanzamento degli esercizi fatti
  var chk=document.querySelectorAll('input[data-fatto]');
  if(chk.length){
    var agg=function(){var n=0;chk.forEach(function(c){if(c.checked)n++});var p=document.getElementById('prog'),b=document.getElementById('progbar');if(p)p.textContent=n;if(b)b.style.width=(n*20)+'%'};
    chk.forEach(function(c){c.addEventListener('change',agg)});agg();
  }
  // «salvato» vicino al foglio
  document.querySelectorAll('textarea[data-k]').forEach(function(t){
    t.addEventListener('input',function(){
      var s=t.closest('.foglio');s=s&&s.querySelector('.salvato');if(!s)return;
      s.textContent='Salvato su questo dispositivo ✓';clearTimeout(t._s);t._s=setTimeout(function(){s.textContent=''},2200);
    });
  });
  // scarica quello che hai scritto (testo semplice, si apre ovunque)
  function oggi(){var d=new Date();return ('0'+d.getDate()).slice(-2)+'/'+('0'+(d.getMonth()+1)).slice(-2)+'/'+d.getFullYear()}
  function scarica(nome,testo){
    var blob=new Blob(['﻿'+testo],{type:'text/plain;charset=utf-8'});
    var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=nome;document.body.appendChild(a);a.click();
    setTimeout(function(){URL.revokeObjectURL(a.href);document.body.removeChild(a)},500);
  }
  document.querySelectorAll('[data-scarica]').forEach(function(b){
    b.addEventListener('click',function(){
      var t='USA IL CERVELLO PRIMA DELL\'AI\ncervello.unlikeacademy.it · Unlike Academy\nScaricato il '+oggi()+'\n\n';
      var nome='usa-il-cervello-';
      if(b.dataset.scarica==='scheda'){
        nome+='scheda.txt';t+='LA MIA SCHEDA CERVELLO\n\n';
        document.querySelectorAll('.scheda-g .bl').forEach(function(bl){
          var h=bl.querySelector('h3'),x=bl.querySelector('textarea');if(!h||!x)return;
          t+=h.textContent.trim().toUpperCase()+'\n'+(x.value.trim()||'[da compilare]')+'\n\n';
        });
      }else{
        nome+='esercizi.txt';t+='I MIEI ESERCIZI\n\n';
        document.querySelectorAll('.es').forEach(function(es){
          var h=es.querySelector('h2'),ck=es.querySelector('input[data-fatto]');
          t+='ESERCIZIO '+es.id.replace('e','')+' · '+h.textContent.trim()+(ck&&ck.checked?'  [fatto]':'')+'\n';
          es.querySelectorAll('.foglio label.f').forEach(function(l){
            var x=document.getElementById(l.getAttribute('for'));
            t+='\n'+l.textContent.trim()+'\n'+((x&&x.value.trim())||'[da compilare]')+'\n';
          });
          t+='\n----------------------------------------\n\n';
        });
      }
      scarica(nome,t);
      var o=b.textContent;b.textContent='Scaricato ✓';setTimeout(function(){b.textContent=o},1800);
    });
  });
})();

/* pulsante «Vai agli esercizi»: nella home compare solo dopo aver scrollato (in alto c'è già quello grande) */
(function(){
  var v=document.querySelector('.vai-es');
  if(!v||document.body.className)return;
  v.style.display='none';
  function chk(){v.style.display=(window.scrollY>650)?'':'none'}
  window.addEventListener('scroll',chk,{passive:true});chk();
})();
