// Draw the server stack in an isometric coordinate system.
(() => {
  const canvas = document.getElementById('diagram');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.scale(2, 2);
  const point = ([x,y,z]) => [285 + (x-y)*1.02, 203 + (x+y)*.45-z];
  function path(points, fill, stroke, width=1, close=true) {
    ctx.beginPath();
    points.map(point).forEach(([x,y],i)=>i ? ctx.lineTo(x,y):ctx.moveTo(x,y));
    if (close) ctx.closePath();
    if (fill) {ctx.fillStyle=fill;ctx.fill();}
    if (stroke) {ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}
  }
  function line(points,color,width=1){path(points,null,color,width,false);}
  function dot(p,r,color){const [x,y]=point(p);ctx.beginPath();ctx.arc(x,y,r,0,2*Math.PI);ctx.fillStyle=color;ctx.fill();}
  for (let x=-320;x<340;x+=11) for(let y=-330;y<320;y+=11) dot([x,y,0],.65,'#57705a');
  const traces=[
    [[-60,25,0],[-112,25,0],[-112,65,0],[-173,65,0]],
    [[-25,65,0],[-25,96,0],[-83,96,0],[-83,141,0]],
    [[29,62,0],[29,110,0],[64,110,0],[64,148,0]],
    [[67,30,0],[111,30,0],[111,-4,0],[174,-4,0]],
    [[60,-29,0],[85,-29,0],[85,-90,0],[153,-90,0]],
    [[-47,-60,0],[-47,-105,0],[-109,-105,0],[-109,-148,0]],
    [[-58,-32,0],[-117,-32,0],[-117,-76,0],[-165,-76,0]]
  ];
  for(const p of traces){line(p,'#6c885c',1);dot(p.at(-1),3.2,'#b9d991');dot(p.at(-1),1.6,'#263e2b');}
  function plate(z,h,size,top,front,side,edge){
    let s=size;
    path([[-s,s,z],[s,s,z],[s,s,z-h],[-s,s,z-h]],front,edge);
    path([[s,s,z],[s,-s,z],[s,-s,z-h],[s,s,z-h]],side,edge);
    path([[-s,-s,z],[s,-s,z],[s,s,z],[-s,s,z]],top,edge);
  }
  plate(4,5,77,'#2a3e30','#1b2c23','#203326','#708266');
  for(let k=0;k<3;k++){
    let z=40+k*40, hi=k===2;
    plate(z,24,61,hi?'#bfe78f':'#5c754e',hi?'#7eaa60':'#344b37',hi?'#567a44':'#2a4233',hi?'#c9eaa8':'#9bad88');
    for(let x=-51;x<-38;x+=7)dot([x,61,z-12],1.8,hi?'#213e28':'#c7ed94');
    line([[-26,61,z-12],[5,61,z-12]],hi?'#395c3b':'#9aa889',2.6);
    for(let x=19;x<=51;x+=4)line([[x,61,z-7],[x,61,z-17]],hi?'#486f42':'#82967a',1.3);
    for(let y=-49;y<32;y+=5)line([[61,y,z-7],[61,y,z-16]],hi?'#3c5e37':'#677e66',1.2);
    for(let x of [-51,51]) for(let y of [-51,51]) dot([x,y,z+.2],1.2,'#546e49');
    if(k<2){plate(z+8,7,48,'#465a41','#1d3224','#192d22','#65785a');}
  }
  // The terminal prompt is engraved in the plane of the top cover.
  line([[-23,-8,121],[-8,1,121],[-23,11,121]],'#284a33',4);
  line([[-1,12,121],[18,12,121]],'#284a33',4);
})();
