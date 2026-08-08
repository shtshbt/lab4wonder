from pathlib import Path
p=Path('fossil-formation.html')
s=p.read_text(encoding='utf-8')
bad="document.getElementById('r83Advance').onclick=()=>{advanceDeepTime();acted[3]=true;updateTimePanel()};acted[3]=true;updateTimePanel()};"
good="document.getElementById('r83Advance').onclick=()=>{advanceDeepTime();acted[3]=true;updateTimePanel()};"
if bad not in s:
    raise SystemExit('duplicate time-handler tail not found')
p.write_text(s.replace(bad,good,1),encoding='utf-8')
print('fixed duplicate time handler')
