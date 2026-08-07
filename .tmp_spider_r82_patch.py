from pathlib import Path
p=Path('spider-web.html')
s=p.read_text(encoding='utf-8')
old="capture=Math.max(0,Math.min(1,progress*(.25+.6*p.sticky)*(.55+.45*Math.min(1,p.spir/18))*(1-Math.max(0,tension-1)*.35)+reinforce))"
new="capture=Math.max(0,Math.min(1,progress*(.30+.75*p.sticky)*(.55+.45*Math.min(1,p.spir/18))*(1-Math.max(0,tension-1)*.35)+reinforce))"
assert old in s
s=s.replace(old,new,1)
old_block="""/* Outcome rule unchanged: inside the capture face and capture probability at or above .46. */
function resolveOutcome(){
  if(!prey||prey.result||prey.t<=1.15)return;
  const st=stats(),inside=Math.hypot(prey.x-center.x,(prey.y-center.y)/.64)<305;
  prey.result=inside&&st.capture>=.46?'caught':'escaped';
  if(prey.result==='caught'){setNote('ねばる糸に からまった！ もがく ゆれが つづく','good');return}
  prey.free=true;prey.escapeT=prey.t;const fallA=Math.atan2(prey.y-center.y,prey.x-center.x);prey.vx+=Math.cos(fallA)*34;prey.vy=Math.max(prey.vy,105);fx.flash=1;
  ring(prey.x,prey.y,110,.6,'rgba(255,150,150,.85)',3);
  setNote('もがいて 糸から はずれた！ 下へ おちていく','bad');
  if(spider.state==='move'||spider.state==='alert')spider.state='return';
}
"""
new_block="""/* Capture is stochastic and uses the same probability shown in the meter. */
function resolveOutcome(){
  if(!prey||prey.result||prey.t<=1.15)return;
  const st=stats(),chance=Math.max(0,Math.min(.98,st.capture));
  prey.captureChance=chance;
  prey.result=prey.hit&&r49Rand()<chance?'caught':'escaped';
  if(prey.result==='caught'){
    setNote(`ねばる糸に からまった！ この条件の捕獲率は約 ${Math.round(chance*100)}%`,'good');
    return;
  }
  prey.free=true;prey.escapeT=prey.t;const fallA=Math.atan2(prey.y-center.y,prey.x-center.x);prey.vx+=Math.cos(fallA)*34;prey.vy=Math.max(prey.vy,105);fx.flash=1;
  ring(prey.x,prey.y,110,.6,'rgba(255,150,150,.85)',3);
  setNote(prey.hit?`もがいて 糸から はずれた（捕獲率 約 ${Math.round(chance*100)}%）。下へ おちていく`:'巣の糸に うまく当たらず、下へ おちていく','bad');
  if(spider.state==='move'||spider.state==='alert')spider.state='return';
}
"""
assert old_block in s
s=s.replace(old_block,new_block,1)
marker='<meta name="r81-spider-exclusive-reinforcement" content="reinforcement-only-in-explicit-mode">'
if marker in s and 'r82-spider-probabilistic-capture' not in s:
    s=s.replace(marker,marker+'\n<meta name="r82-spider-probabilistic-capture" content="meter-matches-stochastic-outcome-default-balanced">',1)
p.write_text(s,encoding='utf-8')
