import React, {useLayoutEffect, useRef} from 'react';
import {AbsoluteFill, Audio, Easing, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {__hlStep, branches, exploded, vault, type Figure as HairlineFigure} from './vendor/hairline';
import words from '../../edits/2026-10-26-new-reel/work/captions.json';

const W=1080,H=1920,FPS=30,END=18.11,FRAME_END=Math.ceil(END*FPS),SEAM=960;
const WHITE='#F5F5F3',GRAY='#9B9A98',BG='#000';
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const frameTime=()=>useCurrentFrame()/FPS;
const ease=(t:number,a:number,d:number)=>interpolate(t,[a,a+d],[0,1],{...clamp,easing:Easing.bezier(.16,1,.3,1)});
const FIG={branches,exploded,vault};
type FigureName=keyof typeof FIG;
const Figure:React.FC<{name:FigureName;at:number;left:number;top:number;size:number}> = ({name,at,left,top,size})=>{
 const host=useRef<HTMLDivElement>(null);
 const sim=useRef<{fig:HairlineFigure|null;time:number}>({fig:null,time:0});
 const elapsed=Math.max(0,frameTime()-at)+.65;
 useLayoutEffect(()=>{
  const el=host.current;if(!el)return;
  const s=sim.current;
  if(!s.fig||elapsed<s.time-1e-6){s.fig?.destroy();__hlStep(el,0,0);s.fig=FIG[name](el,{play:true,theme:'dark',intensity:.8});s.time=0;}
  while(s.time+1/60<=elapsed+1e-9){s.time+=1/60;__hlStep(el,1/60,s.time*1000);}
 });
 return <div ref={host} style={{position:'absolute',left,top,width:size,height:size*.8,'--hairline-plate':BG,'--hairline-hi':WHITE,'--hairline-edge':'#CECDD0','--hairline-mid':'#85848A','--hairline-lo':'#3A393F','--hairline-stroke':1.5} as React.CSSProperties}/>;
};
const Grid=()=>{
 const t=frameTime();if(t<2)return null;
 return <svg width={W} height={SEAM} style={{position:'absolute',inset:0,opacity:1-ease(t,END-.35,.35)}}>
  {[60,380,700,1020].map(x=><line key={'v'+x} x1={x} x2={x} y1={120} y2={900} stroke="rgba(199,70,52,.48)" strokeWidth={1.5} strokeDasharray="5 8"/>)}
  {[120,510,900].map(y=><line key={'h'+y} y1={y} y2={y} x1={0} x2={W} stroke="rgba(199,70,52,.48)" strokeWidth={1.5} strokeDasharray="5 8"/>)}
  {[60,380,700,1020].flatMap(x=>[120,510,900].map(y=><circle key={`${x}-${y}`} cx={x} cy={y} r={3.5} fill={WHITE}/>))}
 </svg>;
};
const Label:React.FC<{children:React.ReactNode;top:number;size:number;color?:string}> = ({children,top,size,color=WHITE})=><div style={{position:'absolute',left:64,top,fontFamily:'Inter,sans-serif',fontWeight:600,fontSize:size,lineHeight:1.02,letterSpacing:-size*.04,color}}>{children}</div>;
const Upper=()=>{
 const t=frameTime();if(t<2)return null;
 return <AbsoluteFill style={{height:SEAM,overflow:'hidden',background:BG}}><Grid/>
  {t>=2.65&&t<4.05&&<div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',gap:38,opacity:ease(t,2.65,.35)}}><div style={{width:10,height:118,background:WHITE,borderRadius:8}}/><Label top={420} size={104}>Claude did.</Label></div>}
  {t>=4.35&&t<9.25&&<><Figure name="exploded" at={4.4} left={230} top={125} size={900}/><Label top={296} size={60}>How it</Label><Label top={364} size={60} color={GRAY}>works.</Label></>}
  {t>=9.25&&t<11.85&&<><Figure name="branches" at={9.3} left={250} top={180} size={900}/><Label top={175} size={58}>Every repo</Label><Label top={242} size={58} color={GRAY}>has a path.</Label></>}
  {t>=11.85&&t<13.55&&<><Figure name="vault" at={11.9} left={330} top={170} size={800}/><Label top={225} size={62}>Private</Label><Label top={296} size={62} color={GRAY}>methods.</Label></>}
  {t>=13.55&&<><Label top={170} size={76}>A clearer edit</Label><div style={{position:'absolute',left:112,top:310,width:2,height:450,background:'rgba(245,245,243,.3)',scale:`1 ${ease(t,13.55,.45)}`,transformOrigin:'top'}}/>{[['Plan',13.55],['Cut',14.35],['Frame',15.15],['Caption',16.0]].map(([label,start],i)=>{const p=ease(t,start as number,.32);return <div key={label as string} style={{position:'absolute',left:65,top:310+i*142,display:'flex',alignItems:'center',gap:35,opacity:p,translate:`${(1-p)*24}px 0`}}><div style={{width:100,height:100,borderRadius:50,border:`2px solid ${WHITE}`,display:'grid',placeItems:'center',fontFamily:'Inter,sans-serif',fontWeight:600,fontSize:34,color:WHITE}}>{String(i+1).padStart(2,'0')}</div><div style={{fontFamily:'Inter,sans-serif',fontWeight:600,fontSize:66,letterSpacing:-2,color:WHITE}}>{label}</div></div>;})}</>}
 </AbsoluteFill>;
};
const geometry:{t:number;top:number}[]=[
 {t:-0.34,top:388.2},
 {t:0.16,top:309.3},
 {t:0.66,top:370.2},
 {t:1.16,top:381.5},
 {t:1.66,top:366.2},
 {t:2.16,top:355.4},
 {t:2.66,top:337.4},
 {t:3.16,top:380.6},
 {t:3.66,top:353.1},
 {t:4.16,top:329.3},
 {t:4.66,top:348.0},
 {t:5.16,top:371.1},
 {t:5.66,top:348.4},
 {t:6.16,top:337.5},
 {t:6.66,top:322.1},
 {t:7.16,top:340.6},
 {t:7.66,top:355.1},
 {t:8.16,top:326.4},
 {t:8.66,top:371.4},
 {t:9.16,top:336.5},
 {t:9.66,top:337.8},
 {t:10.16,top:335.5},
 {t:10.66,top:347.7},
 {t:11.16,top:324.6},
 {t:11.66,top:313.9},
 {t:12.16,top:359.8},
 {t:12.66,top:336.2},
 {t:13.16,top:359.2},
 {t:13.66,top:356.9},
 {t:14.16,top:350.2},
 {t:14.66,top:348.6},
 {t:15.16,top:362.4},
 {t:15.66,top:369.0},
 {t:16.16,top:378.0},
 {t:16.66,top:379.9},
 {t:17.16,top:360.0},
 {t:17.66,top:394.7},
 {t:18.16,top:432.0},
];
const Speaker=()=>{
 const t=frameTime();
 if(t<2)return <OffthreadVideo muted src={staticFile('edits/2026-10-26-new-reel/work/selected.mp4')} style={{position:'absolute',inset:0,width:W,height:H}}/>;
 const cropTop=interpolate(t,geometry.map(p=>p.t),geometry.map(p=>p.top),clamp),scale=960/720,mediaWidth=720*scale;
 return <div style={{position:'absolute',left:0,top:SEAM,width:W,height:H-SEAM,overflow:'hidden',background:BG}}><OffthreadVideo muted src={staticFile('edits/2026-10-26-new-reel/work/selected.mp4')} style={{position:'absolute',left:(W-mediaWidth)/2,top:-cropTop*scale,width:mediaWidth,height:1280*scale}}/></div>;
};
type Word={s:number;e:number;w:string};
const groups:{s:number;e:number}[]=[
 {s:.24,e:1.64},{s:1.64,e:2.9},{s:2.9,e:3.64},{s:4.44,e:5.44},{s:5.44,e:6.4},{s:6.4,e:7.54},{s:7.54,e:8.86},{s:8.86,e:10.72},{s:11.04,e:11.9},{s:11.9,e:13.56},{s:13.56,e:16.5},{s:16.5,e:17.94},
];
const Caption=()=>{
 const t=frameTime();const all=words as Word[];const active=all.find(w=>t>=w.s&&t<w.e);if(!active)return null;
 const group=groups.find(g=>t>=g.s&&t<g.e);if(!group)return null;
 const visible=all.filter(w=>w.s>=group.s&&w.s<group.e);
 return <div style={{position:'absolute',left:54,right:54,top:t<2?1550:SEAM,transform:'translateY(-50%)',display:'flex',justifyContent:'center',pointerEvents:'none'}}><div style={{maxWidth:950,padding:'16px 30px',borderRadius:22,background:'#F5F5F3',boxShadow:'0 5px 24px rgba(0,0,0,.28)',fontFamily:'Inter,sans-serif',fontWeight:600,fontSize:42,lineHeight:1.08,letterSpacing:-1.3,color:'#999',textAlign:'center'}}>{visible.map((w,i)=><span key={i} style={{color:w===active?'#111':'#888'}}>{i?' ':''}{w.w}</span>)}</div></div>;
};
export const CreatorHowExplainer=()=> <AbsoluteFill style={{background:BG}}><Speaker/><Upper/><Caption/><Audio src={staticFile('edits/2026-10-26-new-reel/work/selected.mp4')}/><Sequence from={2*FPS}><Audio src={staticFile('sfx/tap.wav')} volume={.035}/></Sequence></AbsoluteFill>;
export {W,H,FRAME_END};
