from pathlib import Path
p=Path('spider-web.html')
s=p.read_text(encoding='utf-8')
old="""  if(distance>38){
    customStrands.push({x1:webPointer.x,y1:webPointer.y,x2:end.x,y2:end.y});
    if(customStrands.length>6)customStrands.shift();
    progress=Math.max(progress,.68);
    lastOutcome='補強糸を張った！ 次は巣をタップして獲物を落とそう';
  }else{
"""
new="""  if(distance>38){
    lastOutcome='補強糸は「🧵 補強糸」を選んでドラッグして張ろう';
  }else{
"""
assert old in s
s=s.replace(old,new,1)
old2="const p=canvasPoint(e);repairDown=p;"
new2="const p=canvasPoint(e);repairDown=null;"
assert old2 in s
s=s.replace(old2,new2,1)
marker="<meta name=\"r78-spider-escaped-prey-fall\" content=\"escaped-prey-not-captured-visible-fall\">"
if marker in s and 'r81-spider-exclusive-reinforcement' not in s:
    s=s.replace(marker,marker+'\n<meta name="r81-spider-exclusive-reinforcement" content="reinforcement-only-in-explicit-mode">',1)
p.write_text(s,encoding='utf-8')
