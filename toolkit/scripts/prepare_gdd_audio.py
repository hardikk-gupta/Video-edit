import subprocess,re,json,hashlib
from pathlib import Path
import argparse,tempfile
parser=argparse.ArgumentParser(description='Keep the 1.85s original hook; level only the following speech.')
parser.add_argument('source',type=Path)
parser.add_argument('output',type=Path)
args=parser.parse_args()
src=str(args.source.resolve());out=str(args.output.resolve())
args.output.parent.mkdir(parents=True,exist_ok=True)
workspace=tempfile.TemporaryDirectory(prefix='gdd-audio-')
base='highpass=f=70,loudnorm=I=-16:TP=-1.5:LRA=8'
r=subprocess.run(['ffmpeg','-hide_banner','-ss','1.85','-i',src,'-vn','-af',base+':print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
m=json.loads(re.findall(r'\{\s*"input_i".*?\}',r.stderr,re.S)[-1]);print('Speech measurement:',json.dumps(m))
norm=base+':measured_I='+m['input_i']+':measured_TP='+m['input_tp']+':measured_LRA='+m['input_lra']+':measured_thresh='+m['input_thresh']+':offset='+m['target_offset']+':linear=true'
scratch=Path(workspace.name)
keep=str(scratch/'opening-audio.wav');speech=str(scratch/'speech-audio.wav')
subprocess.run(['ffmpeg','-v','error','-y','-i',src,'-t','1.85','-vn','-af','aresample=async=1:first_pts=0,apad=whole_dur=1.85,atrim=end=1.85','-c:a','pcm_f32le','-ar','44100','-ac','2',keep],check=True)
subprocess.run(['ffmpeg','-v','error','-y','-ss','1.85','-i',src,'-vn','-af',norm,'-c:a','pcm_f32le','-ar','44100','-ac','2',speech],check=True)
listing=scratch/'audio-parts.txt';listing.write_text("file '"+keep+"'\nfile '"+speech+"'\n")
subprocess.run(['ffmpeg','-v','error','-y','-f','concat','-safe','0','-i',str(listing),'-c:a','copy',out],check=True)
def opening(p):return subprocess.check_output(['ffmpeg','-v','error','-i',p,'-t','1.85','-af','aresample=async=1:first_pts=0','-ac','2','-ar','44100','-f','s16le','-'])
assert opening(src)==opening(out),'Opening PCM changed'
print('Opening audio verified sample-for-sample unchanged before AAC export; speech leveled separately.')
args.output.with_suffix('.measurement.json').write_text(json.dumps(m,indent=2))
workspace.cleanup()
