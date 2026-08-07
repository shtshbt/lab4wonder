from pathlib import Path
p=Path('spider-web.html')
s=p.read_text(encoding='utf-8')
assert 'r76-spider-direct-interaction' in s
assert 'r78-spider-escaped-prey-fall' in s
layer=r'''
<script id="r80-spider-action-modes">
(()=>{
  if(window.__r80SpiderActionModes)return;window.__r80SpiderActionModes=true;
  const toolbar=document.querySelector('.toolbar'),stage=document.querySelector('.stage'),cv=document.getElementById('mainCv');
  const preyBtn=document.getElementById('preyBtn'),stimBtn=document.getElementById('stimBtn'),gustBtn=document.getElementById('gustBtn'),scenarioBtn=document.getElementById('scenarioBtn');
  if(!toolbar||!stage||!cv||!preyBtn||!stimBtn||!gustBtn)return;

  const actionBar=document.createElement('div');actionBar.id='spiderActionBar';actionBar.setAttribute('role','group');actionBar.setAttribute('aria-label','巣を直接ためす操作');
  const repairBtn=document.createElement('button');repairBtn.id='repairBtn';repairBtn.type='button';repairBtn.textContent='🧵 補強糸';
  [preyBtn,stimBtn,gustBtn,repairBtn].forEach(b=>{b.classList.add('spiderAction');actionBar.appendChild(b)});
  toolbar.insertBefore(actionBar,scenarioBtn);
  gustBtn.textContent='💨 突風';
  const status=document.createElement('div');status.id='spiderActionStatus';status.className='callout';status.innerHTML='<b>選択中：</b> 🪰 獲物を置く — 巣の好きな場所をタップ';
  toolbar.insertAdjacentElement('afterend',status);

  stage.style.position='relative';
  const repairLayer=document.createElement('canvas');repairLayer.id='repairLayer';repairLayer.width=cv.width;repairLayer.height=cv.height;repairLayer.setAttribute('aria-label','補強糸を描く操作レイヤー');repairLayer.style.cssText='position:absolute;inset:0;width:100%;height:100%;z-index:8;background:transparent;pointer-events:none;touch-action:none;cursor:crosshair';stage.appendChild(repairLayer);
  const rg=repairLayer.getContext('2d');
  let repairActive=false,repairStart=null,repairNow=null,gustFx=null,lastReinforceAt=0,lastReinforce=null;
  const point=(e,el=repairLayer)=>{const r=el.getBoundingClientRect();return{x:(e.clientX-r.left)*el.width/r.width,y:(e.clientY-r.top)*el.height/r.height}};
  const setStatus=(icon,title,text)=>{status.innerHTML=`<b>選択中：</b> ${icon} ${title} — ${text}`};
  const endRepairMode=()=>{repairActive=false;repairLayer.style.pointerEvents='none';repairBtn.classList.remove('on');repairBtn.setAttribute('aria-pressed','false');rg.clearRect(0,0,repairLayer.width,repairLayer.height)};
  const enterRepairMode=()=>{repairActive=true;repairLayer.style.pointerEvents='auto';repairBtn.classList.add('on');repairBtn.setAttribute('aria-pressed','true');preyBtn.classList.remove('on');stimBtn.classList.remove('on');setStatus('🧵','補強糸','糸の上をドラッグ。切断点をまたぐと修復');setNote('補強糸モード：巣の上をドラッグして新しい糸を張ろう。赤い×をまたぐと修復できる','info');draw()};
  repairBtn.addEventListener('click',()=>repairActive?endRepairMode():enterRepairMode());
  preyBtn.addEventListener('pointerdown',()=>{endRepairMode();setStatus('🪰','獲物を置く','巣の好きな場所をタップ')});
  stimBtn.addEventListener('pointerdown',()=>{endRepairMode();setStatus('☝','巣をゆらす','好きな糸をタップして振動を見る')});

  const damageXY=d=>({x:center.x+Math.cos(d.a)*d.r*300,y:center.y+Math.sin(d.a)*d.r*190});
  const segDist=(px,py,a,b)=>{const dx=b.x-a.x,dy=b.y-a.y,l2=dx*dx+dy*dy||1,t=Math.max(0,Math.min(1,((px-a.x)*dx+(py-a.y)*dy)/l2)),x=a.x+t*dx,y=a.y+t*dy;return Math.hypot(px-x,py-y)};
  const preview=()=>{rg.clearRect(0,0,repairLayer.width,repairLayer.height);if(!repairStart||!repairNow)return;rg.save();rg.setLineDash([12,8]);rg.strokeStyle='#72e7ff';rg.lineWidth=5;rg.shadowColor='#72e7ff';rg.shadowBlur=10;rg.beginPath();rg.moveTo(repairStart.x,repairStart.y);rg.lineTo(repairNow.x,repairNow.y);rg.stroke();rg.setLineDash([]);for(const p of [repairStart,repairNow]){rg.fillStyle='#bff7ff';rg.beginPath();rg.arc(p.x,p.y,7,0,Math.PI*2);rg.fill()}rg.fillStyle='rgba(7,17,29,.9)';const mx=(repairStart.x+repairNow.x)/2,my=(repairStart.y+repairNow.y)/2;rg.fillRect(mx-44,my-30,88,24);rg.fillStyle='#9ceeff';rg.font='bold 12px system-ui';rg.textAlign='center';rg.fillText('補強糸',mx,my-13);rg.restore()};
  repairLayer.addEventListener('pointerdown',e=>{if(!repairActive)return;e.preventDefault();repairStart=repairNow=point(e);repairLayer.setPointerCapture?.(e.pointerId);preview()});
  repairLayer.addEventListener('pointermove',e=>{if(!repairStart)return;e.preventDefault();repairNow=point(e);preview()});
  const finishRepair=e=>{if(!repairStart)return;e.preventDefault();const end=point(e),dist=Math.hypot(end.x-repairStart.x,end.y-repairStart.y);rg.clearRect(0,0,repairLayer.width,repairLayer.height);if(dist>38){const strand={x1:repairStart.x,y1:repairStart.y,x2:end.x,y2:end.y};customStrands.push(strand);if(customStrands.length>6)customStrands.shift();progress=Math.max(progress,.68);const before=damage.length;damage=damage.filter(d=>{const q=damageXY(d);return segDist(q.x,q.y,repairStart,end)>34});const repaired=before-damage.length;lastReinforce=strand;lastReinforceAt=performance.now();ring(end.x,end.y,90,.65,'rgba(114,231,255,.9)',3);setNote(repaired?`補強糸を張って、切断点を ${repaired}か所 修復した！`:'補強糸を張った。水色の太い糸と両端の結び目を見よう','good');buzz(18)}else setNote('補強糸はドラッグして張ろう','info');repairStart=repairNow=null;draw()};
  repairLayer.addEventListener('pointerup',finishRepair);repairLayer.addEventListener('pointercancel',()=>{repairStart=repairNow=null;rg.clearRect(0,0,repairLayer.width,repairLayer.height)});

  const gustStyle=document.createElement('style');gustStyle.textContent=`
    #spiderActionBar{display:flex;gap:7px;flex-wrap:wrap;align-items:center;padding:4px;border:1px solid #35516e;border-radius:12px;background:#0b1725}
    #spiderActionBar .spiderAction{min-width:116px;position:relative}
    #spiderActionBar .spiderAction.on{background:#ffd85a;color:#241c00;border-color:#ffd85a;box-shadow:0 0 0 2px rgba(255,216,90,.22)}
    #spiderActionBar #gustBtn.gusting{background:#72d9ff;color:#06233a;border-color:#b9efff;box-shadow:0 0 0 3px rgba(114,217,255,.28);animation:r80gustBtn .22s ease-in-out 6 alternate}
    #spiderActionStatus{margin:-2px 0 10px;border-color:#416a8c;background:#102338}
    .stage.r80-gusting canvas#mainCv{animation:r80webShake .12s ease-in-out 8 alternate;transform-origin:center center}
    @keyframes r80webShake{from{transform:translateX(-5px) skewX(-.35deg)}to{transform:translateX(7px) skewX(.45deg)}}
    @keyframes r80gustBtn{from{transform:translateX(-2px)}to{transform:translateX(3px)}}
    @media(max-width:560px){#spiderActionBar{width:100%;display:grid;grid-template-columns:1fr 1fr}#spiderActionBar .spiderAction{min-width:0}}
  `;document.head.appendChild(gustStyle);

  const burstGust=()=>{endRepairMode();const before=damage.length;gust=Math.max(gust,1);const st=stats(),stress=st.tension;let cuts=0;if(progress>.35&&stress>1.12)cuts=1+(stress>2.05?1:0);for(let i=0;i<cuts;i++){damage.push({a:(r49Rand()*.62-.31)+(r49Rand()<.5?0:Math.PI),r:.38+r49Rand()*.52});if(damage.length>12)damage.shift()}const broken=damage.length-before,dir=r49Rand()<.5?-1:1;gustFx={start:performance.now(),life:1900,dir,broken,stress};gustBtn.classList.add('gusting');gustBtn.classList.add('on');gustBtn.setAttribute('aria-pressed','true');stage.classList.add('r80-gusting');setStatus('💨','突風 発生中',broken?`巣が大きくたわみ、糸が ${broken}か所 切れた`:'巣が大きくたわんだが、今回は切れずに耐えた');setNote(broken?`突風！ 巣がたわみ、赤い×の糸切れが ${broken}か所 増えた`:`突風！ 巣全体がたわんだ。今回は糸切れなし（張力 ${stress.toFixed(2)}）`,broken?'bad':'good');for(let i=Math.max(0,damage.length-broken);i<damage.length;i++){const q=damageXY(damage[i]);ring(q.x,q.y,78,.7,'rgba(255,116,116,.95)',4)}buzz(45);if(!running){running=true;document.getElementById('playPause').textContent='⏸ 一時停止';last=performance.now()}setTimeout(()=>{gustBtn.classList.remove('gusting','on');gustBtn.setAttribute('aria-pressed','false');stage.classList.remove('r80-gusting');if(gustFx&&performance.now()-gustFx.start>1500){gust=Math.min(gust,.25);setStatus('🪰','獲物を置く','巣の好きな場所をタップ')}},1950);draw()};
  gustBtn.onclick=burstGust;

  const baseDrawR80=draw;
  draw=()=>{baseDrawR80();const now=performance.now();c.save();
    customStrands.forEach((s,i)=>{c.lineCap='round';c.strokeStyle='rgba(40,218,255,.22)';c.lineWidth=10;c.beginPath();c.moveTo(s.x1,s.y1);c.lineTo(s.x2,s.y2);c.stroke();c.strokeStyle='#72e7ff';c.lineWidth=3.4;c.beginPath();c.moveTo(s.x1,s.y1);c.lineTo(s.x2,s.y2);c.stroke();for(const p of [{x:s.x1,y:s.y1},{x:s.x2,y:s.y2}]){c.fillStyle='#c9f9ff';c.beginPath();c.arc(p.x,p.y,5,0,Math.PI*2);c.fill();c.strokeStyle='#2abddd';c.lineWidth=2;c.stroke()}});
    if(lastReinforce&&now-lastReinforceAt<2800){const s=lastReinforce,mx=(s.x1+s.x2)/2,my=(s.y1+s.y2)/2,a=1-(now-lastReinforceAt)/2800;c.globalAlpha=Math.max(.15,a);c.fillStyle='rgba(4,27,38,.92)';c.fillRect(mx-48,my-34,96,25);c.fillStyle='#9ceeff';c.font='bold 12px system-ui';c.textAlign='center';c.fillText('🧵 補強糸',mx,my-17);c.globalAlpha=1}
    if(gustFx){const age=now-gustFx.start;if(age<gustFx.life){const t=age/gustFx.life,dir=gustFx.dir;c.save();c.globalAlpha=.92*(1-t*.45);c.strokeStyle='#8de5ff';c.fillStyle='#bcefff';c.lineWidth=5;c.lineCap='round';for(let j=0;j<6;j++){const yy=112+j*68,travel=((age*.42+j*73)%1050)-120,x0=dir>0?travel:900-travel,x1=x0+dir*(150+30*Math.sin(j+t*8));c.beginPath();c.moveTo(x0,yy);c.bezierCurveTo(x0+dir*50,yy-12,x1-dir*35,yy+15,x1,yy);c.stroke();c.beginPath();c.moveTo(x1,yy);c.lineTo(x1-dir*18,yy-9);c.lineTo(x1-dir*16,yy+11);c.closePath();c.fill()}c.fillStyle='rgba(4,25,40,.9)';c.fillRect(320,66,300,50);c.fillStyle='#aeeeff';c.font='bold 20px system-ui';c.textAlign='center';c.fillText(`💨 突風！ 張力 ${gustFx.stress.toFixed(2)}`,470,90);c.font='bold 12px system-ui';c.fillStyle=gustFx.broken?'#ff9b9b':'#b9f1cf';c.fillText(gustFx.broken?`糸切れ +${gustFx.broken}（赤い×）`:'糸切れなし：巣が耐えた',470,108);c.restore()}else gustFx=null}
    c.restore()};

  const guide=document.getElementById('webDamageGuide');if(guide)guide.innerHTML='<b>👆 4つの操作：</b> <b>🪰獲物を置く</b>／<b>☝巣をゆらす</b>／<b>💨突風</b>／<b style="color:#8eeeff">🧵補強糸</b>。補強糸は水色の太い線と結び目で表示されます。<b style="color:#ff7474">赤い×は切断点</b>。突風では風の流れと巣の揺れを見て、切れた場所を補強してみよう。';
  const marker=document.createElement('meta');marker.name='r80-spider-action-modes';marker.content='four-equal-actions-visible-reinforcement-enhanced-gust';document.head.appendChild(marker);
})();
</script>
'''
assert '</body>' in s
s=s.replace('</body>',layer+'\n</body>',1)
p.write_text(s,encoding='utf-8')
