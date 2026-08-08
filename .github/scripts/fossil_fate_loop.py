from pathlib import Path
import re
p=Path('fossil-formation.html')
s=p.read_text(encoding='utf-8')

def rep(old,new,label):
    global s
    if old not in s:
        raise SystemExit(f'missing {label}')
    s=s.replace(old,new,1)

def sub(pattern,repl,label,flags=re.S):
    global s
    s2,n=re.subn(pattern,repl,s,count=1,flags=flags)
    if n!=1:
        raise SystemExit(f'{label}: {n}')
    s=s2

# Visual layer and suspense UI
rep('</style>\n<script id="r81-taphonomy-direct-script">','''</style>
<style id="r84-fossil-fate-style">
.r81-direct.phase-section #geo{opacity:.035}.r84-gate{margin-top:5px;padding:7px 9px;border:1px solid #806b25;border-radius:10px;background:#17180f;color:#ffe67f;font-size:11px;font-weight:900}.r84-fates{display:flex;gap:5px;overflow:auto;margin-top:6px;padding-bottom:2px}.r84-fate{flex:0 0 auto;min-width:104px;border:1px solid #40556a;border-radius:9px;background:#122131;padding:6px;font-size:9px;line-height:1.35}.r84-fate b{font-size:10px;color:#e9f5ff}.r84-fate.wait{border-color:#7b6d35}.r84-fate.close{border-color:#e1a34f;background:#302315;color:#ffd78a}.r84-fate.lost{border-color:#844b4a;background:#281718;color:#f0aaa2}.r84-fate.fossil{border-color:#e3c64d;background:#302b13;color:#ffe77c}.r84-fate .mini{display:block;margin-top:2px;color:#9fb5c6}.r84-stage-burst{position:absolute;z-index:12;left:50%;top:43%;transform:translate(-50%,-50%);pointer-events:none;padding:12px 18px;border-radius:16px;background:rgba(8,15,21,.91);border:2px solid #ffe061;color:#fff6b4;font-size:18px;font-weight:1000;text-align:center;opacity:0;transition:opacity .15s}.r84-stage-burst.show{opacity:1}.r84-section-label{position:absolute;z-index:10;right:10px;top:48px;background:rgba(5,14,22,.88);border:1px solid #6e8292;border-radius:999px;padding:5px 9px;font-size:10px;font-weight:900;pointer-events:none}.r83-time button{animation:r84pulse 1.55s ease-in-out infinite}.r83-time button:active{transform:translateY(1px)}@keyframes r84pulse{0%,100%{box-shadow:0 0 0 0 rgba(255,215,90,.12)}50%{box-shadow:0 0 0 7px rgba(255,215,90,.10)}}
</style>
<script id="r81-taphonomy-direct-script">''','r84 style')

rep("document.documentElement.dataset.r81Fossil='taphonomy-direct';document.documentElement.dataset.r83Fossil='plan-section-time-identity';","document.documentElement.dataset.r81Fossil='taphonomy-direct';document.documentElement.dataset.r83Fossil='plan-section-time-identity';document.documentElement.dataset.r84Fossil='stationary-horizon-visible-excavation-fate-gates';",'marker')
rep("if(sub)sub.textContent='生物・痕跡を置き、水で流し、埋め、深時間を進め、侵食し、自分の手で発掘するタフォノミー実験場。';","if(sub)sub.textContent='この遺骸は100万年後まで残る？ 水底から埋没・化石化・露出・発掘までを追う化石サバイバル実験。';",'subtitle')
rep('<b>🦴 タフォノミー実験</b><span>昔の世界 → 化石になったもの → 発掘できたもの</span>','<b>🦴 化石サバイバル実験</b><span>この遺骸は100万年後まで残る？</span>','panel title')

# Guides
rep("{name:'③ 地層に埋まる',icon:'🟫',guide:'ここで断面図へ切り替わる。水底をタップ／なぞると新しい地層が積もり、標本が下へ埋まる。',gesture:'👆 水底に新しい地層を積む'}","{name:'③ 上から埋まる',icon:'🟫',guide:'ここで断面図へ。標本はその場所から動かない。泥・砂を置くと地表が上へ積み上がり、標本が覆われる。',gesture:'👆 標本の上に地層を積む'}",'phase3')
rep("{name:'④ 地中で化石化',icon:'⏳',guide:'黄色い「時間を進める」を押す。各標本が「化石形成」または「消失」に分かれる。地下水も試せる。',gesture:'⏩ ボタンで時間を進める'}","{name:'④ 生き残るか？',icon:'⏳',guide:'黄色い「次の関門へ」を押す。腐敗・散逸・圧密・続成作用を1つずつ通過し、最後まで残れば化石になる。',gesture:'⏩ 1関門ずつ運命を見る'}",'phase4')
rep("{name:'⑤ 地層を削る',icon:'⛰',guide:'断面の表面をこする。化石へ近づくと金色に光るが、削りすぎると壊れる。',gesture:'☝↔ 表面をこすって削る'}","{name:'⑤ 地表へ近づく',icon:'⛰',guide:'地表をこすると、本当に地表線が下がる。化石の層へ近づくまで侵食させる。',gesture:'☝↔ 地表線を削る'}",'phase5')
rep("{name:'⑥ 化石を発掘',icon:'🖌',guide:'番号の付いた化石を粗掘り／ブラシで露出する。発掘した番号は下の「発掘トレイ」に残る。',gesture:'🖌 番号を見ながら発掘'}","{name:'⑥ 掘り出す',icon:'🖌',guide:'粗掘り／ブラシで地表を局所的に削る。土が実際に減り、化石が露出したら取り出せる。',gesture:'🖌 地表を削って化石を出す'}",'phase6')

# State and specimen model
rep("let phase=0,tool='fish',pointer=null,holdTimer=null,holdInterval=null,holdStart=0,directAge=0,xray=true,focusSpecimenId=null,focusUntil=0;\nconst SURFACE_Y=175,DEPTH_SCALE=225;","let phase=0,tool='fish',pointer=null,holdTimer=null,holdInterval=null,holdStart=0,directAge=0,xray=true,focusSpecimenId=null,focusUntil=0,fateStep=0,trialSeed=1,burstUntil=0;\nconst SURFACE_Y=175,HORIZON_Y=365,PROFILE_N=97;\nlet surfaceProfile=Array(PROFILE_N).fill(HORIZON_Y);\nconst fateGates=[{age:0,label:'開始',risk:'まだ遺骸・痕跡'},{age:1/365,label:'1日',risk:'腐敗・掃除屋'},{age:1,label:'1年',risk:'散逸・埋没'},{age:1e4,label:'1万年',risk:'圧密・変形'},{age:1e5,label:'10万年',risk:'続成作用'},{age:1e6,label:'100万年',risk:'化石記録へ'}];",'state')
rep("Object.assign(s,{r81:true,integrity:1,articulation:s.type==='fish'?.92:1,transport:0,abrasion:0,organic:1,burialDepth:0,rapidBurial:0,groundwater:0,preserved:false,preservationMode:'',exposure:0,discovery:0,found:false,digDamage:0,createdPhase:0,planY:s.y});","Object.assign(s,{r81:true,integrity:1,articulation:s.type==='fish'?.92:1,transport:0,abrasion:0,organic:1,burialDepth:0,rapidBurial:0,groundwater:0,preserved:false,preservationMode:'',exposure:0,discovery:0,found:false,digDamage:0,createdPhase:0,planY:s.y,stratumY:HORIZON_Y,fateState:'?',fateNote:'まだ判定前'});",'ensure')

# Time panel suspense content
rep("timePanel.innerHTML='<button id=\"r83Advance\" type=\"button\">⏩ 時間を進める</button><div class=\"meta\"><b id=\"r83Age\">0年 — まだ遺骸・痕跡</b><div class=\"track\"><div id=\"r83TimeFill\" class=\"fill\"></div></div><div class=\"ticks\"><span>現在</span><span>1万年</span><span>10万年</span><span>100万年+</span></div></div>';","timePanel.innerHTML='<button id=\"r83Advance\" type=\"button\">⏩ 次の関門へ</button><div class=\"meta\"><b id=\"r83Age\">まだ判定前</b><div class=\"track\"><div id=\"r83TimeFill\" class=\"fill\"></div></div><div class=\"ticks\"><span>遺骸</span><span>埋没</span><span>圧密</span><span>続成</span><span>化石</span></div><div id=\"r84Gate\" class=\"r84-gate\">次の関門：腐敗・掃除屋</div><div id=\"r84Fates\" class=\"r84-fates\"></div></div>';",'time panel')
rep("const foundTray=document.createElement('section');foundTray.className='r83-foundtray';","const burst=document.createElement('div');burst.className='r84-stage-burst';stage.appendChild(burst);const sectionLabel=document.createElement('div');sectionLabel.className='r84-section-label';sectionLabel.textContent='破線＝遺骸が横たわった当時の水底';stage.appendChild(sectionLabel);\nconst foundTray=document.createElement('section');foundTray.className='r83-foundtray';",'burst')

# Guide/setPhase
sub(r"function setPhase\(i\)\{.*?\n\}",'''function setPhase(i){
 phase=clamp81(i,0,5);tool=defaultTool(phase);pointer=null;clearHold();
 if(phase>=2)specimens.forEach(s=>{ensure(s);s.stratumY=HORIZON_Y;s.y=HORIZON_Y;syncBurial(s)});
 renderTools();updateGuide();if(phase===3)running=false;if(phase===5)updateComparison();
}''','setPhase')

# Utility functions inserted after markAction
rep("function markAction(msg){acted[phase]=true;if(msg){status.textContent=msg;status.classList.remove('pop');void status.offsetWidth;status.classList.add('pop')}}","function markAction(msg){acted[phase]=true;if(msg){status.textContent=msg;status.classList.remove('pop');void status.offsetWidth;status.classList.add('pop')}}\nfunction profileAt(x){const u=clamp81(x/960*(PROFILE_N-1),0,PROFILE_N-1),i=Math.floor(u),f=u-i;return surfaceProfile[i]*(1-f)+surfaceProfile[Math.min(PROFILE_N-1,i+1)]*f}\nfunction syncBurial(s){const over=Math.max(0,(s.stratumY||HORIZON_Y)-profileAt(s.x));s.burialDepth=clamp81(over/150,0,1.5);s.exposure=clamp81(1-over/42,0,1.4);s.y=s.stratumY||HORIZON_Y;return over}\nfunction modifySurface(x,r,dy){for(let i=0;i<PROFILE_N;i++){const px=i*960/(PROFILE_N-1),d=Math.abs(px-x);if(d>r)continue;const w=.5+.5*Math.cos(Math.PI*d/r);surfaceProfile[i]=clamp81(surfaceProfile[i]+dy*w,82,500)}}\nfunction fateRoll(s,step){const z=Math.sin((trialSeed+s.id*9176+step*13121)*.0174533)*43758.5453;return z-Math.floor(z)}\nfunction showBurst(text){burst.textContent=text;burst.classList.add('show');burstUntil=performance.now()+1550;setTimeout(()=>{if(performance.now()>=burstUntil-20)burst.classList.remove('show')},1600)}",'utils')

# stationary burial
sub(r"function depositAt\(p\)\{.*?\n\}",'''function depositAt(p){
 const kind=tool==='sand'?'sand':'mud',r=kind==='mud'?92:76,now=performance.now(),fast=now-lastDepositAt<850;lastDepositAt=now;
 const before=surfaceProfile.slice();modifySurface(p.x,r,-(kind==='mud'?18:14));
 let hit=0,ids=[];specimens.forEach(s=>{ensure(s);if(s.status==='lost')return;const oldOver=Math.max(0,s.stratumY-(before[Math.round(clamp81(s.x/960*(PROFILE_N-1),0,PROFILE_N-1))]||HORIZON_Y)),over=syncBurial(s);if(over>oldOver+2){hit++;ids.push('#'+s.id);s.rapidBurial=clamp81(s.rapidBurial+(fast?.085:.035),0,1)}});
 addFx(dustFx,{x:p.x,y:profileAt(p.x),kind,life:800},70);markAction(hit?`🟫 地表が上へ積もった。${ids.join('・')} はその場で覆われていく`:'🟫 新しい地層が上へ積もった');draw();updateComparison();
}''','deposit')

# suspense fate progression
sub(r"function advanceDeepTime\(\)\{.*?\n\}",'''function advanceDeepTime(){
 if(fateStep>=fateGates.length-1){markAction('✨ 判定完了。次は地層を削って、残った化石を探そう');return}
 fateStep++;const gate=fateGates[fateStep];directAge=gate.age;const O=typeof lowOxy!=='undefined'?+lowOxy.value/100:.7,S=typeof scav!=='undefined'?+scav.value/100:.35;let survived=[],close=[],lost=[];
 specimens.forEach(s=>{ensure(s);if(s.status==='lost'||s.preserved||s.found)return;const b=clamp81(s.burialDepth,0,1),h=hardFactor[s.type]??.4;let prob=.8;
   if(fateStep===1)prob=.34+.30*b+.20*h+.15*O-.19*S+.10*s.integrity;
   else if(fateStep===2)prob=.30+.43*b+.13*s.rapidBurial+.12*h+.10*s.integrity;
   else if(fateStep===3)prob=.50+.20*b+.12*h+.08*s.groundwater+.08*s.integrity;
   else if(fateStep===4)prob=.55+.16*b+.10*h+.11*s.groundwater+.06*s.integrity;
   else prob=.70+.12*b+.08*h+.05*s.integrity;
   prob=clamp81(prob,.08,.97);const roll=fateRoll(s,fateStep);
   if(roll>prob){s.status='lost';s.fateState='lost';s.reason=fateStep===1?'腐敗・掃除屋で失われた':fateStep===2?'埋没前に散逸した':fateStep===3?'圧密・変形で記録が失われた':fateStep===4?'続成作用で保存されなかった':'化石記録として残らなかった';s.fateNote='× '+s.reason;lost.push(s)}
   else if(fateStep===fateGates.length-1){s.preserved=true;s.status='success';s.stage=4;s.preservationMode=preservationMode(s);s.fateState='fossil';s.fateNote='★ '+s.preservationMode;survived.push(s)}
   else {const margin=prob-roll;s.fateState=margin<.13?'close':'survive';s.fateNote=margin<.13?'⚠ 危ない…まだ残った':'● 関門を通過';(margin<.13?close:survived).push(s)}
 });
 const live=specimens.filter(s=>s.status!=='lost'&&!s.preserved).length,formed=specimens.filter(s=>s.preserved).length;
 if(fateStep===fateGates.length-1){showBurst(formed?`✨ ${formed}個が化石になった！`:'今回は化石が残らなかった…');markAction(formed?`✨ 100万年後：${specimens.filter(s=>s.preserved).map(s=>'#'+s.id+' '+typeIcons[s.type]).join('・')} が化石になった！`:'100万年後まで残った標本はなかった。条件を変えて再挑戦できる')}
 else {showBurst(`${gate.label}：${gate.risk} を通過できる？`);markAction(`⏳ ${gate.label}｜残った ${live}｜消失 ${lost.length}${close.length?'｜危ない '+close.map(s=>'#'+s.id).join('・'):''}`)}
 const f=survived[0]||close[0]||lost[0];if(f){focusSpecimenId=f.id;focusUntil=performance.now()+1900}draw();updateComparison();updateTimePanel();
}''','advance')

# Time panel renderer
sub(r"function updateTimePanel\(\)\{.*?\}\ndocument.getElementById\('r83Advance'\).*?;",'''function updateTimePanel(){
 const fossilN=specimens.filter(s=>s.preserved&&s.status!=='lost').length,lostN=specimens.filter(s=>s.status==='lost').length,age=document.getElementById('r83Age'),fill=document.getElementById('r83TimeFill'),gate=document.getElementById('r84Gate'),fates=document.getElementById('r84Fates'),btn=document.getElementById('r83Advance');
 if(age)age.textContent=fateStep?`${fateGates[fateStep].label} — 残存 ${Math.max(0,specimens.length-lostN)} / 消失 ${lostN} / 化石 ${fossilN}`:'まだ判定前 — まず埋没させよう';if(fill)fill.style.width=`${Math.round(fateStep/(fateGates.length-1)*100)}%`;
 if(gate)gate.textContent=fateStep>=fateGates.length-1?'判定完了：次は地表へ露出させよう':`次の関門：${fateGates[fateStep+1].label}｜${fateGates[fateStep+1].risk}`;
 if(btn)btn.textContent=fateStep>=fateGates.length-1?'✓ 化石化判定 完了':`⏩ 次の関門へ：${fateGates[fateStep+1].risk}`;
 if(fates)fates.innerHTML=specimens.map(s=>{ensure(s);const cls=s.preserved?'fossil':s.status==='lost'?'lost':s.fateState==='close'?'close':'wait';return `<div class="r84-fate ${cls}"><b>#${s.id} ${typeIcons[s.type]||'🦴'}</b><span class="mini">${s.preserved?'★ 化石になった':s.status==='lost'?'× 消失':s.fateNote||'? まだわからない'}</span></div>`}).join('');
}
document.getElementById('r83Advance').onclick=()=>{advanceDeepTime();acted[3]=true;updateTimePanel()};''','time renderer')

# surface-removing erosion/excavation
sub(r"function erodeSegment\(a,b,strength=.1\)\{.*?\n\}",'''function erodeSegment(a,b,strength=.1){
 const len=Math.hypot(b.x-a.x,b.y-a.y);if(len<2)return;const steps=Math.max(2,Math.ceil(len/24));for(let k=0;k<=steps;k++){const t=k/steps,x=a.x+(b.x-a.x)*t;modifySurface(x,58,7+strength*34)}
 let near=0;specimens.forEach(s=>{ensure(s);if(!s.preserved||s.status==='lost'||s.found)return;const over=syncBurial(s);if(over<75){near++;if(over<8){s.integrity=clamp81(s.integrity-strength*.12,0,1);if(s.integrity<.16){s.status='lost';s.preserved=false;s.reason='侵食で化石が壊れた'}}}});
 addFx(dustFx,{x:b.x,y:profileAt(b.x),kind:'erosion',life:650},70);markAction(near?'⛰ 地表が下がり、化石層が近い。削りすぎ注意。':'⛰ 地表が目に見えて下がった');draw();updateComparison();
}''','erode')
sub(r"function digSegment\(a,b\)\{.*?\n\}",'''function digSegment(a,b){
 const coarse=tool==='coarse',len=Math.hypot(b.x-a.x,b.y-a.y),steps=Math.max(2,Math.ceil(len/18)),cut=coarse?11:4;for(let k=0;k<=steps;k++){const t=k/steps,x=a.x+(b.x-a.x)*t;modifySurface(x,coarse?46:32,cut)}
 let msg=coarse?'✋ 土を大きく取り除いた':'🖌 表面を薄く払った';specimens.forEach(s=>{ensure(s);if(!s.preserved||s.status==='lost'||s.found)return;const over=syncBurial(s);if(Math.abs(s.x-b.x)>95)return;
   if(coarse&&over<28){s.digDamage+=.1;s.integrity=clamp81(s.integrity-.06,0,1);msg='⚠️ 化石のすぐ上を粗掘り：傷つくかも'}
   if(!coarse&&over<18){s.discovery=clamp81(s.discovery+.24,0,1);if(s.discovery>=.72){s.found=true;showFound(s);msg=`✨ #${s.id} を地層から取り出した！`}}
 });addFx(dustFx,{x:b.x,y:profileAt(b.x),kind:coarse?'coarse':'brush',life:520},70);markAction(msg);draw();updateComparison();
}''','dig')

# found card wording
rep("foundCard.classList.add('show');foundCard.innerHTML=`<b>✨ 発掘成功：#${s.id} ${typeIcons[s.type]} ${typeNames[s.type]}</b>","foundCard.classList.add('show');showBurst(`🧺 #${s.id} を取り出した！`);foundCard.innerHTML=`<b>✨ 地層から取り出した：#${s.id} ${typeIcons[s.type]} ${typeNames[s.type]}</b>",'found wording')

# reset state
rep("running=false;directAge=0;sedimentMarks.length=0;flowFx.length=0;dustFx.length=0;for(let i=0;i<acted.length;i++)acted[i]=false;specimens=[];nextId=1;","running=false;directAge=0;fateStep=0;trialSeed=Math.floor(Math.random()*900000)+1000;surfaceProfile=Array(PROFILE_N).fill(HORIZON_Y);sedimentMarks.length=0;flowFx.length=0;dustFx.length=0;for(let i=0;i<acted.length;i++)acted[i]=false;specimens=[];nextId=1;",'reset state')
rep("const s=createSpecimen(x,SURFACE_Y,t);ensure(s);s.surfaceY=SURFACE_Y;s.planY=py;specimens.push(s)","const s=createSpecimen(x,SURFACE_Y,t);ensure(s);s.surfaceY=HORIZON_Y;s.stratumY=HORIZON_Y;s.planY=py;s.fateState='?';s.fateNote='? まだわからない';specimens.push(s)",'reset specimens')

# drawing: add section scene and replace section overlay core
insert='''function drawSectionScene(now){
 oc.fillStyle='#183947';oc.fillRect(0,0,960,620);oc.fillStyle='#25333a';oc.fillRect(0,HORIZON_Y,960,620-HORIZON_Y);
 for(let y=HORIZON_Y+42;y<620;y+=42){oc.fillStyle=((y-HORIZON_Y)/42)%2<1?'rgba(142,108,73,.23)':'rgba(102,82,64,.23)';oc.fillRect(0,y,960,41)}
 oc.beginPath();oc.moveTo(0,surfaceProfile[0]);for(let i=1;i<PROFILE_N;i++)oc.lineTo(i*960/(PROFILE_N-1),surfaceProfile[i]);oc.lineTo(960,HORIZON_Y);oc.lineTo(0,HORIZON_Y);oc.closePath();oc.fillStyle='rgba(139,103,67,.92)';oc.fill();
 for(const f of [.25,.5,.75]){oc.beginPath();for(let i=0;i<PROFILE_N;i++){const x=i*960/(PROFILE_N-1),y=surfaceProfile[i]+(HORIZON_Y-surfaceProfile[i])*f;i?oc.lineTo(x,y):oc.moveTo(x,y)}oc.strokeStyle='rgba(238,210,160,.28)';oc.lineWidth=2;oc.stroke()}
 oc.beginPath();for(let i=0;i<PROFILE_N;i++){const x=i*960/(PROFILE_N-1),y=surfaceProfile[i];i?oc.lineTo(x,y):oc.moveTo(x,y)}oc.strokeStyle='#e2bf83';oc.lineWidth=4;oc.stroke();
 oc.setLineDash([8,7]);oc.strokeStyle='rgba(151,220,255,.62)';oc.lineWidth=2;oc.beginPath();oc.moveTo(0,HORIZON_Y);oc.lineTo(960,HORIZON_Y);oc.stroke();oc.setLineDash([]);oc.fillStyle='#c8efff';oc.font='900 11px sans-serif';oc.textAlign='left';oc.fillText('遺骸が横たわった水底',14,HORIZON_Y+18);
 specimens.forEach(s=>{ensure(s);syncBurial(s);const over=Math.max(0,s.stratumY-profileAt(s.x));if(s.found){oc.save();oc.strokeStyle='#78e3b1';oc.setLineDash([5,4]);oc.beginPath();oc.arc(s.x,s.stratumY,24,0,Math.PI*2);oc.stroke();oc.setLineDash([]);oc.fillStyle='#baf7dc';oc.textAlign='center';oc.font='900 10px sans-serif';oc.fillText(`#${s.id} 取り出した跡`,s.x,s.stratumY+38);oc.restore();return}
   const visible=over<8||xray||s.preserved||s.status==='lost';if(!visible)return;oc.save();oc.globalAlpha=s.status==='lost'?.22:(over>8&&xray?.72:1);oc.font='25px sans-serif';oc.textAlign='center';oc.fillStyle='#fff';oc.fillText(typeIcons[s.type]||'🦴',s.x,s.stratumY+8);oc.font='900 11px sans-serif';oc.fillStyle=s.preserved?'#ffe56e':s.status==='lost'?'#dc887e':'#d8f4ff';const tag=s.preserved?'★ 化石':s.status==='lost'?'× 消失':over>8?`${Math.round(over)}px 覆われた`:'水底';oc.fillText(`#${s.id} ${tag}`,s.x,s.stratumY+35);if(focusSpecimenId===s.id&&now<focusUntil){oc.strokeStyle='#ffe25c';oc.lineWidth=5;oc.beginPath();oc.arc(s.x,s.stratumY,39+5*Math.sin(now/120),0,Math.PI*2);oc.stroke()}oc.restore()})
}
'''
rep("function drawOverlay(now){\n oc.clearRect(0,0,960,620);if(phase<=1){drawPlanView(now);drawGesture(now);requestAnimationFrame(drawOverlay);return}",insert+"function drawOverlay(now){\n oc.clearRect(0,0,960,620);if(phase<=1){drawPlanView(now);drawGesture(now);requestAnimationFrame(drawOverlay);return}\n drawSectionScene(now);",'section draw insert')

# Remove old local sediment cover + duplicate specimen overlay block; keep FX and gesture.
sub(r" sedimentMarks\.forEach\(m=>\{.*?\n specimens\.forEach\(s=>\{ensure\(s\);if\(s\.burialDepth>0&&!s\.found\)\{.*?\n \}\);\n drawGesture\(now\);requestAnimationFrame\(drawOverlay\);",''' flowFx.forEach(f=>{const age=now-f.t;if(age>f.life)return;const a=1-age/f.life;oc.save();oc.globalAlpha=a;drawArrow(oc,f.a,f.b,f.water?'#79cfff':'#6fe7ff');oc.restore()});
 dustFx.forEach(f=>{const age=now-f.t;if(age>f.life)return;const a=1-age/f.life;oc.save();oc.globalAlpha=a;oc.fillStyle=f.kind==='erosion'||f.kind==='coarse'?'#d8b27c':f.kind==='brush'?'#e7ddc8':'#a98560';for(let i=0;i<7;i++){const ang=i*2.4+f.t*.001;oc.beginPath();oc.arc(f.x+Math.cos(ang)*age*.045*(i+1),f.y-Math.sin(ang)*age*.025-8,3+(i%3),0,Math.PI*2);oc.fill()}oc.restore()});
 drawGesture(now);requestAnimationFrame(drawOverlay);''','old overlay core')

# gesture wording
rep("oc.fillText('👆 タップ／なぞって土砂をかぶせる',510,255)","oc.fillText('👆 上から地層を積む（標本は動かない）',510,255)",'gesture3')
rep("oc.fillText('⏩ 上の黄色い「時間を進める」を押す',500,115)","oc.fillText('⏩ 黄色いボタンで1関門ずつ進む',500,115)",'gesture4')
rep("oc.fillText('☝ 地層をこすって削る',510,235)","oc.fillText('☝ 地表線をこすって下げる',510,235)",'gesture5')
rep("oc.fillText('🖌 化石の上をやさしくなぞる',500,270)","oc.fillText('🖌 土を削って化石を露出する',500,270)",'gesture6')

# formatAge supports day
rep("function formatAge(y){return y<1e3?`${Math.round(y)}年`:y<1e6?`${Math.round(y/1e3)}千年`:`${(y/1e6).toFixed(y<1e7?1:0)}百万年`}","function formatAge(y){if(y>0&&y<1)return`${Math.max(1,Math.round(y*365))}日`;return y<1e3?`${Math.round(y)}年`:y<1e6?`${Math.round(y/1e3)}千年`:`${(y/1e6).toFixed(y<1e7?1:0)}百万年`}",'format age')

p.write_text(s,encoding='utf-8')
print('patched fossil fate loop')
