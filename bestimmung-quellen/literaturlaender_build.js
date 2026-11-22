// Länder aus der Fachliteratur je Art: genannte Länder (L.c) + Länder der Literatur-Fundorte mit Koordinaten
const R=__dirname+"/../data/";
global.window={};for(const f of["weltkarte","literaturorte","species"])require(R+f+".js");
const M=window.MANTODEA_MAP,L=window.MANTODEA_LITORTE,SP=window.MANTODEA.species;const S=5;
const polys={};
for(const[cc,d]of Object.entries(M.p)){const rings=[];let cur=null,x=0,y=0;
  const toks=d.match(/[Mlz]|-?\d+(\.\d+)?/g);let cmd=null,buf=[];
  const flush=()=>{};
  for(let i=0;i<toks.length;i++){const t=toks[i];
    if(t==="M"){cmd="M";continue} if(t==="l"){cmd="l";continue} if(t==="z"){if(cur)rings.push(cur);cur=null;continue}
    const a=+t,b=+toks[++i];
    if(cmd==="M"){x=a;y=b;cur=[[x,y]];cmd="l";} else {x+=a;y+=b;cur.push([x,y]);}
  } if(cur)rings.push(cur); polys[cc]=rings;}
const inside=(px,py,rings)=>{let c=false;for(const r of rings)for(let i=0,j=r.length-1;i<r.length;j=i++){const[xi,yi]=r[i],[xj,yj]=r[j];if((yi>py)!==(yj>py)&&px<(xj-xi)*(py-yi)/(yj-yi)+xi)c=!c}return c};
const segd=(px,py,[ax,ay],[bx,by])=>{const dx=bx-ax,dy=by-ay,l=dx*dx+dy*dy;let t=l?((px-ax)*dx+(py-ay)*dy)/l:0;t=Math.max(0,Math.min(1,t));const qx=ax+t*dx-px,qy=ay+t*dy-py;return Math.sqrt(qx*qx+qy*qy)};
const where=(lat,lon)=>{const px=lon*S,py=-lat*S;for(const[cc,r]of Object.entries(polys))if(inside(px,py,r))return cc;
  let best=null,bd=4;for(const[cc,rs]of Object.entries(polys))for(const r of rs)for(let i=0;i<r.length;i++){const d=segd(px,py,r[i],r[(i+1)%r.length]);if(d<bd){bd=d;best=cc}}return best};
const byK={};SP.forEach(s=>byK[s.k]=s);
const out={};let nNeu=0,nPkt=0,ohne=0;
for(const[k,x]of Object.entries(L)){const s=byK[k];if(!s)continue;const have=new Set(s.ct||[]);
  const cs=new Set((x.c||[]).filter(c=>M.p[c]));
  for(const p of x.p||[]){const cc=where(p[0],p[1]);if(cc){cs.add(cc);nPkt++}else ohne++}
  const neu=[...cs].filter(c=>!have.has(c)||!((s.cn||{})[c]||[])[2]);
  if(neu.length){out[k]=neu.sort();nNeu+=neu.filter(c=>!have.has(c)).length}}
require("fs").writeFileSync(R+"literaturlaender.js","// Länder aus der Fachliteratur (genannte Länder und Fundorte mit Koordinaten), je Art; ergänzt Länderliste, Karte und Ländersuche\nwindow.MANTODEA_LITLAND="+JSON.stringify(out)+";\n");
console.log("Arten",Object.keys(out).length,"neue Länder",nNeu,"Punkte zugeordnet",nPkt,"ohne Land",ohne);
const k=SP.find(s=>s.n==="Hierodula maculata").k;console.log(out[k]);
