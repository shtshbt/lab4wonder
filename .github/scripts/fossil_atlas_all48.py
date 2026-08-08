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

# Expose atlas metadata needed to choose plausible excavation-associated finds.
rep(
"window.__lwAtlas={kind:CFG.key,collect:(name,showDetail=true)=>{const x=DATA.find(item=>item.name===name);if(!x)return false;const fresh=!found.has(name);found.add(name);persist();render();if(showDetail)openDetail(x);return fresh;},has:name=>found.has(name),count:()=>found.size};",
"window.__lwAtlas={kind:CFG.key,collect:(name,showDetail=true)=>{const x=DATA.find(item=>item.name===name);if(!x)return false;const fresh=!found.has(name);found.add(name);persist();render();if(showDetail)openDetail(x);return fresh;},has:name=>found.has(name),count:()=>found.size,info:name=>DATA.find(item=>item.name===name)||null,names:()=>DATA.map(item=>item.name)};",
'atlas api metadata')

# Add a small, explicit collection-route panel.
rep(
"const foundTray=document.createElement('section');foundTray.className='r83-foundtray';foundTray.innerHTML='<b>🧺 発掘トレイ</b><div id=\"r83FoundGrid\" class=\"r83-foundgrid\"><span style=\"font-size:10px;color:#9eb0c4\">まだ発掘していません。</span></div>';compare.after(foundTray);",
"const foundTray=document.createElement('section');foundTray.className='r83-foundtray';foundTray.innerHTML='<b>🧺 発掘トレイ</b><div id=\"r83FoundGrid\" class=\"r83-foundgrid\"><span style=\"font-size:10px;color:#9eb0c4\">まだ発掘していません。</span></div>';compare.after(foundTray);const atlasRoute=document.createElement('div');atlasRoute.id='r86AtlasRoute';atlasRoute.className='r86-atlas-route';foundTray.after(atlasRoute);",
'atlas route panel')

# All 48 atlas cards are assigned to at least one plausible excavation setting.
anchor="function atlasCardFor(s){"
if anchor not in s: raise SystemExit('missing atlasCardFor')
pools='''const atlasSitePools={
 lagoon:["魚の骨格","二枚貝","巻貝","昆虫入り琥珀","有孔虫","珪藻","花粉化石","胞子化石","介形虫","魚類の微小歯","植物珪酸体","炭化微粒子","足跡化石","巣穴化石","這い跡","摂食痕","生痕管","根痕","休息痕","珪化木","葉の印象化石","炭化葉","種子化石","琥珀","石炭","ストロマトライト","年輪化石","泥割れ","漣痕"],
 river:["恐竜の骨","魚の骨格","昆虫入り琥珀","マンモスの臼歯","鉱物充填した骨","花粉化石","胞子化石","魚類の微小歯","植物珪酸体","炭化微粒子","足跡化石","巣穴化石","糞化石","摂食痕","恐竜の巣","卵化石","根痕","胃石","休息痕","珪化木","葉の印象化石","炭化葉","種子化石","琥珀","石炭","年輪化石","泥割れ","火山灰層"],
 marine:["三葉虫","アンモナイト","サメの歯","二枚貝","巻貝","腕足類","ウミユリ","有孔虫","放散虫","珪藻","コッコリス","介形虫","コノドント","石灰質ナノ化石","魚類の微小歯","足跡化石","巣穴化石","這い跡","摂食痕","生痕管","穿孔痕","ストロマトライト","漣痕","火山灰層","生物礁石灰岩"]
};
const atlasSiteKey=s=>s.x<320?'lagoon':s.x<640?'river':'marine';
const atlasSiteLabel=k=>k==='lagoon'?'静かな潟':k==='river'?'川・洪水原':'海の堆積物';
function chooseAtlasSideFind(pool){
 const atlas=window.__lwAtlas;if(!atlas)return null;const available=[...new Set(pool)].filter(n=>!atlas.has(n));if(!available.length)return null;
 const weighted=[];available.forEach(n=>{const r=atlas.info(n)?.rarity||3,w=Math.max(1,6-r);for(let i=0;i<w;i++)weighted.push(n)});return weighted[Math.floor(Math.random()*weighted.length)]||available[0];
}
function unlockAtlasFromExcavation(s){
 const atlas=window.__lwAtlas;if(!atlas)return{primary:null,side:[]};const primary=atlasCardFor(s);const primaryFresh=primary&&atlas.collect(primary,false)?primary:null;const pool=atlasSitePools[atlasSiteKey(s)]||[];const side=[];const slots=s.integrity>=.70?2:1;
 for(let i=0;i<slots;i++){const n=chooseAtlasSideFind(pool);if(!n)break;if(atlas.collect(n,false))side.push(n)}
 return{primary:primaryFresh,side};
}
function updateAtlasRoute(){
 const atlas=window.__lwAtlas,el=document.getElementById('r86AtlasRoute');if(!atlas||!el)return;const miss=k=>[...new Set(atlasSitePools[k])].filter(n=>!atlas.has(n)).length;el.innerHTML=`<b>📚 48種すべて本編から収集可能</b><span>発掘成功で主化石＋同じ地層の共伴化石・微化石・生痕・地層手がかりを登録。</span><span>未発見候補：潟 ${miss('lagoon')} ｜ 川 ${miss('river')} ｜ 海 ${miss('marine')} ｜ 全体 ${48-atlas.count()}/48</span>`;
}
'''
s=s.replace(anchor,pools+anchor,1)

# Successful excavation now unlocks the direct specimen plus associated finds from that actual site.
sub(r"function showFound\(s\)\{.*?\n\}", '''function showFound(s){
 focusSpecimenId=s.id;focusUntil=performance.now()+3500;const unlocked=unlockAtlasFromExcavation(s),primaryName=atlasCardFor(s),freshNames=[...(unlocked.primary?[unlocked.primary]:[]),...unlocked.side];foundCard.classList.add('show');
 if(freshNames.length)showBurst(`📚 新規登録 +${freshNames.length}！ ${freshNames[0]}`);else showBurst(`🧺 #${s.id} を取り出した！`);
 const sideText=unlocked.side.length?`<span>🔎 同じ${atlasSiteLabel(atlasSiteKey(s))}の地層から：${unlocked.side.join('・')}</span>`:'';
 foundCard.innerHTML=`<b>✨ 地層から取り出した：#${s.id} ${typeIcons[s.type]} ${typeNames[s.type]}</b><span>保存：${s.preservationMode||'化石'}</span><span>運搬距離：${Math.round(s.transport)} ｜ 完整度：${Math.round(s.integrity*100)}%</span><span>場所：${positionName(s.x)}</span>${primaryName?`<span>${unlocked.primary?'📚 主化石を新規登録':'📚 主化石は登録済み'}：${primaryName}</span>`:''}${sideText}`;
 updateAtlasRoute();setTimeout(()=>foundCard.classList.remove('show'),6200);
}''','showFound')

# Keep route counts live whenever specimen state refreshes.
rep('document.getElementById(\'r81Question\').textContent=totalFossil?', 'updateAtlasRoute();document.getElementById(\'r81Question\').textContent=totalFossil?', 'route refresh')

# Clarify that collecting 48/48 is a real gameplay objective, not a menu action.
rep('図鑑登録は本編の発掘成功だけ。登録されたカードでは、どの保存過程を生き残ったかをノートに残せます。','図鑑登録は本編の発掘成功だけ。主化石に加え、同じ地層から見つかる共伴化石・微化石・生痕・地層の手がかりも登録され、3環境を発掘すれば48種すべてに到達できます。','atlas route explanation')

# Styling for the route panel.
css='''\n<style id="r86-fossil-atlas-all48-style">\n.r86-atlas-route{margin:8px 0 10px;padding:9px 11px;border:1px solid #567b6a;border-radius:12px;background:#0d211b;display:flex;gap:5px 12px;align-items:center;flex-wrap:wrap;font-size:10px;color:#c9e6d9}.r86-atlas-route b{color:#83efbd;font-size:11px}.r86-atlas-route span:last-child{margin-left:auto;color:#ffe078;font-weight:900}@media(max-width:620px){.r86-atlas-route{display:grid}.r86-atlas-route span:last-child{margin-left:0}}\n</style>\n'''
marker='<style id="r82-fossil-clarity-style">'
if marker not in s: raise SystemExit('missing css marker')
s=s.replace(marker,css+marker,1)

# Marker.
s=s.replace("document.documentElement.dataset.r85Fossil='compact-section-material-layers-excavation-atlas';","document.documentElement.dataset.r85Fossil='compact-section-material-layers-excavation-atlas';document.documentElement.dataset.r86Fossil='all-48-reachable-via-excavation';",1)

# Static coverage guard: every atlas name in the known 48 list occurs in at least one pool.
all48=["三葉虫","アンモナイト","恐竜の骨","サメの歯","魚の骨格","二枚貝","巻貝","腕足類","ウミユリ","昆虫入り琥珀","マンモスの臼歯","鉱物充填した骨","有孔虫","放散虫","珪藻","コッコリス","花粉化石","胞子化石","介形虫","コノドント","石灰質ナノ化石","魚類の微小歯","植物珪酸体","炭化微粒子","足跡化石","巣穴化石","糞化石","這い跡","摂食痕","生痕管","恐竜の巣","卵化石","根痕","穿孔痕","胃石","休息痕","珪化木","葉の印象化石","炭化葉","種子化石","琥珀","石炭","ストロマトライト","年輪化石","泥割れ","漣痕","火山灰層","生物礁石灰岩"]
for name in all48:
    if name not in pools: raise SystemExit('unreachable atlas card: '+name)
if len(all48)!=48 or len(set(all48))!=48: raise SystemExit('atlas list is not 48 unique')

p.write_text(s,encoding='utf-8')
print('patched all-48 atlas reachability')
