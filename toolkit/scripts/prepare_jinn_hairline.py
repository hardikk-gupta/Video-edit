from pathlib import Path
import urllib.request,concurrent.futures,re,json,shutil,subprocess
import argparse
parser=argparse.ArgumentParser(description='Restore only marks and mascots for JinnHairlineRevision; no page screenshots.')
parser.add_argument('source',type=Path)
args=parser.parse_args()
root=Path(__file__).resolve().parents[1];out=root/'public/refs';g=out/'gdd';(g/'logos').mkdir(parents=True,exist_ok=True)
ua={'User-Agent':'Mozilla/5.0'}
urls={
 'dots-key.jpg':'https://designcompass.org/wp-content/uploads/2026/09/openai-dots-9-scaled.jpg',
 'duet-icon.svg':'https://claude.com/static/claude-duet/app-icon-flat.svg',
 'duet-og.jpg':'https://claude.com/static/claude-duet/og.jpg',
 'grokbot.png':'https://x.ai/images/news/introducing-grok-bot-og-2.png',
}
def fetch(pair):
 name,url=pair
 data=urllib.request.urlopen(urllib.request.Request(url,headers=ua),timeout=35).read();p=g/name;p.write_bytes(data);return name,len(data)
for r in concurrent.futures.ThreadPoolExecutor(max_workers=4).map(fetch,urls.items()):print(r)
svg=(g/'duet-icon.svg').read_text()
paths=[re.search(r'd="([^"]+)"',x).group(1) for x in re.findall(r'<path([^>]*)/>',svg)]
(root/'src/duet-paths.json').write_text(json.dumps(paths))
shutil.copy2(args.source,g/'hardik.mp4')
for name,crop in [('dots-word','2048:820:0:660'),('dots-mascots','2048:800:0:1760')]:
 subprocess.run(['ffmpeg','-v','error','-y','-i',str(g/'dots-key.jpg'),'-vf','crop='+crop,'-frames:v','1',str(out/(name+'.png'))],check=True)
# Restore monochrome vector marks from the same public icon collection used earlier.
for key,path in {'openai':'openai','claude':'claude','googlegemini':'gemini','grok':'grok','githubcopilot':'githubcopilot','perplexity':'perplexity','meta':'meta','mistralai':'mistral','deepseek':'deepseek'}.items():
 url='https://raw.githubusercontent.com/lobehub/lobe-icons/master/packages/static-svg/icons/'+path+'.svg'
 try:
  data=urllib.request.urlopen(urllib.request.Request(url,headers=ua),timeout=25).read();assert b'<svg' in data;(g/'logos'/(key+'.svg')).write_bytes(data);print('logo',key)
 except Exception as e:raise RuntimeError(f'Cannot restore {key}') from e

# Complete official transparent mascots, extracted from the supplied OpenAI announcement.
for pair in {'mascot-felipe.webp': 'https://images.ctfassets.net/8su2tbn87fck/5c6KF403NZydjgJI4JRL6V/a51c63d6e728559d5c6069fa3169e0ff/poster-felipe.webp', 'mascot-todd.webp': 'https://images.ctfassets.net/8su2tbn87fck/4YflfkDn7xUsAN4No5LsNf/92ae64f016cfc1efc70745c73029ce6c/poster-todd.webp', 'mascot-alfred.webp': 'https://images.ctfassets.net/8su2tbn87fck/1kV9mVs6c09GY7Fd6Kqe0Y/4cd80b14db0c087697481458a833005e/poster-alfred.webp', 'mascot-iggy.webp': 'https://images.ctfassets.net/8su2tbn87fck/7CWQv0rfN2pMgFb84Q2bC3/f58361d25e71dbaaf21aa91ff1ffa459/poster-iggy.webp'}.items():
 print(fetch(pair))

# White wordmarks keyed from official launch artwork; no product UI is used.
import numpy as np
from PIL import Image
im=np.asarray(Image.open(g/'grokbot.png').convert('RGB')).astype(float)[440:640,540:1380]
a=np.clip((im.min(axis=2)-135)/120,0,1)
Image.fromarray(np.dstack([np.full(a.shape,255)]*3+[a*255]).astype(np.uint8),'RGBA').save(g/'grokbot-logo.png')
im=np.asarray(Image.open(g/'duet-og.jpg').convert('L')).astype(float)[520:740,740:2080]
a=np.clip((241-im)/221,0,1)
Image.fromarray(np.dstack([np.full(a.shape,255)]*3+[a*255]).astype(np.uint8),'RGBA').save(g/'duet-word.png')
for name in ['grokbot-logo','duet-word']:
 im=Image.open(g/(name+'.png'));im.crop(im.getbbox()).save(g/(name+'.png'))

# Rework: equal identity tiles. Use the complete isolated mascot, scaled to the same optical weight.
im=Image.open(g/'mascot-iggy.webp').convert('RGBA');im=im.crop(im.getbbox())
scale=500/max(im.size);im=im.resize((round(im.width*scale),round(im.height*scale)),Image.Resampling.LANCZOS)
bg=Image.new('RGBA',(600,600),'#101010');bg.alpha_composite(im,((600-im.width)//2,(600-im.height)//2));bg.save(g/'tile-dots.png')
bg=Image.open(g/'grokbot.png').convert('RGB').crop((1480,320,1920,760)).resize((600,600),Image.Resampling.LANCZOS)
logo=Image.open(g/'grokbot-logo.png');orb=logo.crop((0,0,logo.height,logo.height)).resize((300,300),Image.Resampling.LANCZOS)
bg.paste(orb,(150,150),orb);bg.save(g/'tile-grok.png')

subprocess.run([__import__('sys').executable,str(root/'scripts/prepare_gdd_audio.py'),str(args.source),str(g/'voice.wav')],check=True)
