from pathlib import Path
import re

p=Path('fossil-formation.html')
s=p.read_text(encoding='utf-8')

def sub(pattern,repl,label):
    global s
    s2,n=re.subn(pattern,repl,s,count=1,flags=re.S)
    if n!=1:
        raise SystemExit(f'{label}: {n}')
    s=s2

def rep(old,new,label):
    global s
    if old not in s:
        raise SystemExit(f'missing {label}')
    s=s.replace(old,new,1)

sub(r"function chooseAtlasSideFind\(pool\)\{.*?\n\}\nfunction unlockAtlasFromExcavation\(s\)\{.*?\n\}", '''const atlasRarityWeight={1:16,2:8,3:4,4:2,5:1};
function chooseAtlasSideFind(pool){
 const atlas=window.__lwAtlas;if(!atlas)return null;const candidates=[...new Set(pool)];if(!candidates.length)return null;
 let total=0;const weighted=candidates.map(name=>{const rarity=Math.max(1,Math.min(5,atlas.info(name)?.rarity||3)),weight=atlasRarityWeight[rarity]||1;total+=weight;return{name,rarity,weight,cum:total}});
 let roll=Math.random()*total;return weighted.find(x=>roll<x.cum)||weighted[weighted.length-1];
}
function unlockAtlasFromExcavation(s){
 const atlas=window.__lwAtlas;if(!atlas)return{primary:null,side:[]};const primaryName=atlasCardFor(s),primary=primaryName?{name:primaryName,fresh:atlas.collect(primaryName,false),rarity:atlas.info(primaryName)?.rarity||3}:null;const pool=atlasSitePools[atlasSiteKey(s)]||[],side=[];const slots=s.integrity>=.70?2:1;
 for(let i=0;i<slots;i++){const hit=chooseAtlasSideFind(pool);if(!hit)break;const fresh=atlas.collect(hit.name,false);side.push({...hit,fresh})}
 return{primary,side};
}''','rarity draw functions')

sub(r"function showFound\(s\)\{.*?\n\}", '''function showFound(s){
 focusSpecimenId=s.id;focusUntil=performance.now()+3500;const unlocked=unlockAtlasFromExcavation(s),primaryName=unlocked.primary?.name||atlasCardFor(s),freshNames=[...(unlocked.primary?.fresh?[unlocked.primary.name]:[]),...unlocked.side.filter(x=>x.fresh).map(x=>x.name)];foundCard.classList.add('show');
 if(freshNames.length)showBurst(`📚 新規登録 +${freshNames.length}！ ${freshNames[0]}`);else showBurst(`🧺 #${s.id} を取り出した！ 図鑑は再発見`);
 const sideText=unlocked.side.length?`<span>🔎 同じ${atlasSiteLabel(atlasSiteKey(s))}の地層から：${unlocked.side.map(x=>`${x.fresh?'🆕':'↻'} ${x.name} ${'★'.repeat(x.rarity)}`).join(' ・ ')}</span>`:'';
 foundCard.innerHTML=`<b>✨ 地層から取り出した：#${s.id} ${typeIcons[s.type]} ${typeNames[s.type]}</b><span>保存：${s.preservationMode||'化石'}</span><span>運搬距離：${Math.round(s.transport)} ｜ 完整度：${Math.round(s.integrity*100)}%</span><span>場所：${positionName(s.x)}</span>${primaryName?`<span>${unlocked.primary?.fresh?'📚 主化石を新規登録':'↻ 主化石は再発見'}：${primaryName}</span>`:''}${sideText}`;
 updateAtlasRoute();setTimeout(()=>foundCard.classList.remove('show'),6200);
}''','show found duplicate display')

rep("el.innerHTML=`<b>📚 48種すべて本編から収集可能</b><span>発掘成功で主化石＋同じ地層の共伴化石・微化石・生痕・地層手がかりを登録。</span><span>未発見候補：潟 ${miss('lagoon')} ｜ 川 ${miss('river')} ｜ 海 ${miss('marine')} ｜ 全体 ${48-atlas.count()}/48</span>`;",
    "el.innerHTML=`<b>📚 48種すべて本編から収集可能</b><span>共伴発見は重複あり。★が1つ増えるごとに出現重みは半分（16→8→4→2→1）。</span><span>未発見候補：潟 ${miss('lagoon')} ｜ 川 ${miss('river')} ｜ 海 ${miss('marine')} ｜ 全体 ${48-atlas.count()}/48</span>`;",
    'route rarity explanation')

rep("document.documentElement.dataset.r86Fossil='all-48-reachable-via-excavation';","document.documentElement.dataset.r86Fossil='all-48-reachable-via-excavation';document.documentElement.dataset.r87Fossil='star-rarity-weighted-duplicates';",'marker')

p.write_text(s,encoding='utf-8')
print('patched star rarity weighting')
