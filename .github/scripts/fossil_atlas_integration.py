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

# ----- Atlas becomes excavation-driven, not a random reveal button -----
rep('r60-atlas-fossil-progress-v1','r60-atlas-fossil-progress-v2','atlas storage key')
rep('発掘ノート・化石図鑑 48','発掘で集める化石図鑑 48','atlas title')
rep('体化石、微化石、生痕化石、植物化石と地層の手がかりを発掘し、カードごとに観察ノートを残せます。既存の埋没、分解、鉱物化、隆起、侵食の模型は研究モードとして保持しています。','本編の化石サバイバル実験で、100万年の関門を生き残り、実際に地層から発掘できた標本だけが図鑑へ登録されます。未発見カードは押しても開きません。','atlas desc')
rep('"action":"発掘する"','"action":"本編で発掘"','atlas action')
rep('"openLabel":"🦴 発掘図鑑"','"openLabel":"📚 化石図鑑 0/48"','atlas open label')
rep('形だけでなく、どの過程で残ったか、体そのものか行動の跡か、地層の何を示すかをノートへ書こう。','図鑑登録は本編の発掘成功だけ。登録されたカードでは、どの保存過程を生き残ったかをノートに残せます。','atlas zone note')
rep('「🦴 発掘図鑑」を開き、発掘テーマを選んでカードと発掘ノートを集めよう。研究モードでは形成段階を進めよう。','まず本編で遺骸を埋め、100万年の保存関門を通し、地層から発掘しよう。発掘に成功した化石だけが図鑑へ登録されます。','atlas first')
# Correct terminology to match the actual permineralization model.
rep('"name":"鉱物置換した骨","reading":"こうぶつちかんしたほね"','"name":"鉱物充填した骨","reading":"こうぶつじゅうてんしたほね"','permineralized bone card')

# Controls: remove arbitrary discovery and random-card buttons. Keep filter/search only.
sub(r'<button class="primary" id="r60-atlas-scan"[^>]*>.*?</button><button id="r60-atlas-random"[^>]*>.*?</button>', '<span class="r85-atlas-source">🧺 本編の発掘成功で登録</span>', 'remove atlas reveal buttons')
sub(r"const explore=\(\)=>\{.*?\};\nwindow\.__lwAtlas=\{.*?\};\nconst build=", "const explore=()=>toast('本編で化石を発掘すると図鑑へ登録されます');\nwindow.__lwAtlas={kind:CFG.key,collect:(name,showDetail=true)=>{const x=DATA.find(item=>item.name===name);if(!x)return false;const fresh=!found.has(name);found.add(name);persist();render();if(showDetail)openDetail(x);return fresh;},has:name=>found.has(name),count:()=>found.size};\nconst build=", 'atlas API')
sub(r"sec\.querySelector\('#r60-atlas-scan'\)\.onclick=explore;sec\.querySelector\('#r60-atlas-random'\)\.onclick=.*?;if\(CFG\.notes\)", "if(CFG.notes)", 'atlas handlers')
rep("const n=found.size;document.getElementById('r60-atlas-count').textContent=`${n} / ${DATA.length}`;", "const n=found.size;document.getElementById('r60-atlas-count').textContent=`${n} / ${DATA.length}`;const atlasOpen=document.getElementById('r60-atlas-open');if(atlasOpen)atlasOpen.textContent=`📚 化石図鑑 ${n}/${DATA.length}`;", 'atlas button count')

# ----- More useful vertical space in the section -----
rep('const SURFACE_Y=175,HORIZON_Y=365,PROFILE_N=97;','const SURFACE_Y=175,HORIZON_Y=500,PROFILE_N=97;','fossil horizon')
rep('const acted=Array(6).fill(false),flowFx=[],dustFx=[],sedimentMarks=[];','const acted=Array(6).fill(false),flowFx=[],dustFx=[],sedimentMarks=[],strataDeposits=[];','strata history')
rep("const typeNames={fish:'魚',shell:'貝',leaf:'葉',bone:'骨',trace:'足跡'};","const typeNames={fish:'魚',shell:'二枚貝',leaf:'葉',bone:'恐竜の骨',trace:'足跡'};",'type names')
rep("if(phase===0)return[['fish','🐟 魚'],['shell','🐚 貝'],['leaf','🍃 葉'],['bone','🦴 骨'],['trace','👣 足跡']];","if(phase===0)return[['fish','🐟 魚'],['shell','🐚 二枚貝'],['leaf','🍃 葉'],['bone','🦴 恐竜の骨'],['trace','👣 足跡']];",'type tools')
rep("if(phase===2)return[['mud','🟫 泥'],['sand','🏖 砂']];","if(phase===2)return[['mud','🟫 泥'],['sand','🟨 砂']];",'sediment tools')
rep("sectionLabel.textContent='破線＝遺骸が横たわった当時の水底';","sectionLabel.textContent='破線＝当時の水底 ｜ 🟫泥 / 🟨砂';",'section label')

# Deposition keeps exact material bands for rendering.
sub(r"function depositAt\(p\)\{.*?\n\}", '''function depositAt(p){
 const kind=tool==='sand'?'sand':'mud',r=kind==='mud'?92:76,now=performance.now(),fast=now-lastDepositAt<850;lastDepositAt=now;
 const before=surfaceProfile.slice();modifySurface(p.x,r,-(kind==='mud'?18:14));const after=surfaceProfile.slice();
 strataDeposits.push({kind,before,after});if(strataDeposits.length>80)strataDeposits.shift();
 let hit=0,ids=[];specimens.forEach(s=>{ensure(s);if(s.status==='lost')return;const oldOver=Math.max(0,s.stratumY-(before[Math.round(clamp81(s.x/960*(PROFILE_N-1),0,PROFILE_N-1))]||HORIZON_Y)),over=syncBurial(s);if(over>oldOver+2){hit++;ids.push('#'+s.id);s.rapidBurial=clamp81(s.rapidBurial+(fast?.085:.035),0,1)}});
 addFx(dustFx,{x:p.x,y:profileAt(p.x),kind,life:800},70);const mat=kind==='mud'?'🟫 泥':'🟨 砂';markAction(hit?`${mat}の層が上へ積もった。${ids.join('・')} はその場で覆われていく`:`${mat}の層を堆積させた`);draw();updateComparison();
}''','deposit function')

# Replace section renderer: compact older-strata band, exact mud/sand layers, no dead lower half.
sub(r"function drawSectionScene\(now\)\{.*?\n\}\nfunction drawOverlay", '''function drawSectionScene(now){
 oc.fillStyle='#183947';oc.fillRect(0,0,960,620);
 // Compact older strata: only the bottom ~120 px are below the fossil horizon.
 oc.fillStyle='#29343a';oc.fillRect(0,HORIZON_Y,960,620-HORIZON_Y);
 for(let y=HORIZON_Y+28;y<620;y+=28){oc.fillStyle=((y-HORIZON_Y)/28)%2<1?'rgba(142,108,73,.30)':'rgba(87,73,63,.32)';oc.fillRect(0,y,960,27)}
 oc.fillStyle='rgba(213,231,238,.72)';oc.font='900 10px sans-serif';oc.textAlign='right';oc.fillText('↓ より古い地層',944,606);
 // Base overburden.
 oc.beginPath();oc.moveTo(0,surfaceProfile[0]);for(let i=1;i<PROFILE_N;i++)oc.lineTo(i*960/(PROFILE_N-1),surfaceProfile[i]);oc.lineTo(960,HORIZON_Y);oc.lineTo(0,HORIZON_Y);oc.closePath();oc.fillStyle='#725a47';oc.fill();
 // Clip every historical deposit to what has not yet been eroded/excavated.
 oc.save();oc.beginPath();oc.moveTo(0,surfaceProfile[0]);for(let i=1;i<PROFILE_N;i++)oc.lineTo(i*960/(PROFILE_N-1),surfaceProfile[i]);oc.lineTo(960,620);oc.lineTo(0,620);oc.closePath();oc.clip();
 strataDeposits.forEach((d,di)=>{oc.beginPath();for(let i=0;i<PROFILE_N;i++){const x=i*960/(PROFILE_N-1),y=d.after[i];i?oc.lineTo(x,y):oc.moveTo(x,y)}for(let i=PROFILE_N-1;i>=0;i--){const x=i*960/(PROFILE_N-1);oc.lineTo(x,d.before[i])}oc.closePath();oc.fillStyle=d.kind==='sand'?'#c7a567':'#5e4a43';oc.fill();oc.strokeStyle=d.kind==='sand'?'rgba(255,226,151,.55)':'rgba(184,157,146,.50)';oc.lineWidth=1.3;oc.stroke();
   // Different textures make material legible even without color alone.
   oc.save();oc.globalAlpha=.55;if(d.kind==='sand'){oc.fillStyle='#f1d697';for(let i=(di%4)+3;i<PROFILE_N;i+=8){const x=i*960/(PROFILE_N-1),top=d.after[i],bot=d.before[i];if(bot-top>2){oc.beginPath();oc.arc(x,(top+bot)/2,1.8,0,Math.PI*2);oc.fill()}}}else{oc.strokeStyle='#342d2a';oc.lineWidth=1;for(let i=(di%3)+4;i<PROFILE_N;i+=10){const x=i*960/(PROFILE_N-1),top=d.after[i],bot=d.before[i];if(bot-top>3){oc.beginPath();oc.moveTo(x-7,(top+bot)/2);oc.lineTo(x+7,(top+bot)/2);oc.stroke()}}}oc.restore();
 });oc.restore();
 // Current surface and original fossil horizon.
 oc.beginPath();for(let i=0;i<PROFILE_N;i++){const x=i*960/(PROFILE_N-1),y=surfaceProfile[i];i?oc.lineTo(x,y):oc.moveTo(x,y)}oc.strokeStyle='#f2d79f';oc.lineWidth=4;oc.stroke();
 oc.setLineDash([8,7]);oc.strokeStyle='rgba(151,220,255,.68)';oc.lineWidth=2;oc.beginPath();oc.moveTo(0,HORIZON_Y);oc.lineTo(960,HORIZON_Y);oc.stroke();oc.setLineDash([]);oc.fillStyle='#c8efff';oc.font='900 11px sans-serif';oc.textAlign='left';oc.fillText('遺骸が横たわった水底',14,HORIZON_Y+18);
 specimens.forEach(s=>{ensure(s);syncBurial(s);const over=Math.max(0,s.stratumY-profileAt(s.x));if(s.found){oc.save();oc.strokeStyle='#78e3b1';oc.setLineDash([5,4]);oc.beginPath();oc.arc(s.x,s.stratumY,24,0,Math.PI*2);oc.stroke();oc.setLineDash([]);oc.fillStyle='#baf7dc';oc.textAlign='center';oc.font='900 10px sans-serif';oc.fillText(`#${s.id} 取り出した跡`,s.x,s.stratumY+38);oc.restore();return}
   const visible=over<8||xray||s.preserved||s.status==='lost';if(!visible)return;oc.save();oc.globalAlpha=s.status==='lost'?.22:(over>8&&xray?.72:1);oc.font='25px sans-serif';oc.textAlign='center';oc.fillStyle='#fff';oc.fillText(typeIcons[s.type]||'🦴',s.x,s.stratumY+8);oc.font='900 11px sans-serif';oc.fillStyle=s.preserved?'#ffe56e':s.status==='lost'?'#dc887e':'#d8f4ff';const tag=s.preserved?'★ 化石':s.status==='lost'?'× 消失':over>8?`${Math.round(over)}px 覆われた`:'水底';oc.fillText(`#${s.id} ${tag}`,s.x,s.stratumY+35);if(focusSpecimenId===s.id&&now<focusUntil){oc.strokeStyle='#ffe25c';oc.lineWidth=5;oc.beginPath();oc.arc(s.x,s.stratumY,39+5*Math.sin(now/120),0,Math.PI*2);oc.stroke()}oc.restore()})
}
function drawOverlay''','section renderer')

# Atlas mapping is based on what was actually excavated, including preservation mode.
rep('function showFound(s){', '''function atlasCardFor(s){
 const mode=s.preservationMode||'';
 if(s.type==='fish')return '魚の骨格';
 if(s.type==='shell')return '二枚貝';
 if(s.type==='leaf')return mode.includes('炭化')?'炭化葉':'葉の印象化石';
 if(s.type==='bone')return mode.includes('鉱物')?'鉱物充填した骨':'恐竜の骨';
 if(s.type==='trace')return '足跡化石';
 return null;
}
function showFound(s){''','atlas mapping')
sub(r"function showFound\(s\)\{.*?\n\}", '''function showFound(s){
 focusSpecimenId=s.id;focusUntil=performance.now()+3500;const atlasName=atlasCardFor(s),fresh=atlasName&&window.__lwAtlas?.collect?.(atlasName,false);foundCard.classList.add('show');showBurst(fresh?`📚 図鑑に新規登録！ ${atlasName}`:`🧺 #${s.id} を取り出した！`);foundCard.innerHTML=`<b>✨ 地層から取り出した：#${s.id} ${typeIcons[s.type]} ${typeNames[s.type]}</b><span>保存：${s.preservationMode||'化石'}</span><span>運搬距離：${Math.round(s.transport)} ｜ 完整度：${Math.round(s.integrity*100)}%</span><span>場所：${positionName(s.x)}</span>${atlasName?`<span>${fresh?'📚 図鑑に新規登録':'📚 図鑑登録済み'}：${atlasName}</span>`:''}`;
 setTimeout(()=>foundCard.classList.remove('show'),5200);
}''','showFound')

# Reset the new visual stratigraphy too.
rep('surfaceProfile=Array(PROFILE_N).fill(HORIZON_Y);sedimentMarks.length=0;','surfaceProfile=Array(PROFILE_N).fill(HORIZON_Y);strataDeposits.length=0;sedimentMarks.length=0;','reset strata')

# CSS for material distinction and excavation-driven atlas source label.
rep('</style>\n<style id="r81-taphonomy-style">','''</style>
<style id="r85-fossil-atlas-integration-style">
#r60-atlas .controls{grid-template-columns:minmax(140px,.65fr) auto minmax(180px,1.35fr)!important}.r85-atlas-source{display:flex;align-items:center;justify-content:center;min-height:42px;padding:7px 10px;border:1px solid #4e7f69;border-radius:10px;background:#102d25;color:#bff5da;font-size:11px;font-weight:900;text-align:center}.r81-tools button[data-tool="mud"]{background:#5e4a43!important;border-color:#9f7c70!important;color:#fff!important}.r81-tools button[data-tool="sand"]{background:#b89456!important;border-color:#e2c47d!important;color:#211a00!important}.r81-tools button[data-tool="mud"].on,.r81-tools button[data-tool="sand"].on{box-shadow:0 0 0 3px rgba(255,220,120,.25)!important}@media(max-width:640px){#r60-atlas .controls{grid-template-columns:1fr!important}.r85-atlas-source{min-height:38px}}
</style>
<style id="r81-taphonomy-style">''','r85 css')

# Release marker.
rep("document.documentElement.dataset.r84Fossil='stationary-horizon-visible-excavation-fate-gates';","document.documentElement.dataset.r84Fossil='stationary-horizon-visible-excavation-fate-gates';document.documentElement.dataset.r85Fossil='compact-section-material-layers-excavation-atlas';",'r85 marker')

p.write_text(s,encoding='utf-8')
print('patched fossil atlas integration')
