import cv2,json
from pathlib import Path
import argparse
parser=argparse.ArgumentParser(description='Audit the original 478x850 jinn source against the committed framing plan.')
parser.add_argument('source');parser.add_argument('yunet_model');parser.add_argument('output',type=Path)
args=parser.parse_args()
detector=cv2.FaceDetectorYN.create(args.yunet_model,'',(478,850),.75,.3,5000)
v=cv2.VideoCapture(args.source)
records=[]
for n in range(4,112):
 t=n/2;v.set(cv2.CAP_PROP_POS_MSEC,t*1000);ok,img=v.read()
 if not ok:continue
 _,faces=detector.detect(img)
 boxes=[] if faces is None else [list(map(int,a[:4])) for a in faces if a[2]>95]
 if len(boxes):
  x,y,w,h=max(boxes,key=lambda b:b[2]*b[3]);records.append({'t':t,'x':int(x),'y':int(y),'w':int(w),'h':int(h),'head_top':round(y-h*.38),'chin_bottom':round(y+h*1.08)})
 else:records.append({'t':t,'miss':True})
args.output.write_text(json.dumps(records,indent=2))
for start,end in [(1.85,10.4),(10.5,19.55),(19.6,56.2)]:
 r=[a for a in records if start<=a['t']<end and 'miss'not in a]
 print(start,end,'detected',len(r),'minhead',min(a['head_top']for a in r),'maxchin',max(a['chin_bottom']for a in r),'range',max(a['chin_bottom']for a in r)-min(a['head_top']for a in r))
print('misses',[r['t']for r in records if 'miss'in r])

plan=json.loads((Path(__file__).resolve().parents[1]/'src/gdd-framing.json').read_text())
for r in records:
 if 'miss' in r: continue
 p=next(p for p in plan if p['t']==r['t'])
 assert p['top'] <= r['head_top'], f"Hair cut at {r['t']}"
 assert p['top']+p['height'] >= r['chin_bottom'], f"Chin cut at {r['t']}"
print('PASS: all detected samples retain the estimated hair-to-chin bounds. Review misses separately.')
