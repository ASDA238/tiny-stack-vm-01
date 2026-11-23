import{readdirSync as a,readFileSync as b,writeFileSync as c,mkdirSync as d}from"node:fs";const S="01146:;?0000000099999995999599909990000000000000044000000000000058000000000000004414";
const F=[(a,b)=>a+b|0,(a,b)=>a-b|0,Math.imul,(a,b)=>(a/b)|0,(a,b)=>a%b|0,(a,b)=>(a>>>0)/(b>>>0)|0,(a,b)=>(a>>>0)%(b>>>0)|0,0,(a,b)=>a&b,(a,b)=>a|b,(a,b)=>a^b,0,(a,b)=>a<<(b&31),(a,b)=>a>>(b&31),(a,b)=>a>>>(b&31)|0,0,(a,b)=>+(a==b),(a,b)=>+(a<b),(a,b)=>+((a>>>0)<(b>>>0))];
function r(p,q){let s=[],t=[],m=[],o=[],x=0,y=0,n=0,f=e=>({o,e});
for(;;){if(n==1e6)return f(10);if(x<0||x>=p.length)return f(9);let g=p[x],h=g==1?1:g==2?4:g>47&&g<52?2:0;
if(g>7&&g<16||g==31||g>34&&g<48||g>52&&g<64||g>65&&g<80||g>83)return f(5);if(x+h>=p.length)return f(9);n++;let v=x+1+h,k=S.charCodeAt(g)-48,w=k>>2,z=k&3;
if(s.length<w)return f(2);if(s.length-w+z>256)return f(3);x=v;
if(g==0)return{o,e:0};
if(g==1){s.push(p[v-1]<<24>>24);continue}
if(g==2){s.push(p[v-4]|p[v-3]<<8|p[v-2]<<16|p[v-1]<<24);continue}
if(g==3){s.pop();continue}
if(g==4){s.push(s.at(-1));continue}
if(g==5){s.push(s.splice(-2,1)[0]);continue}
if(g==6){s.push(s.at(-2));continue}
if(g==7){s.push(s.splice(-3,1)[0]);continue}
if(g==23){s[s.length-1]=-s.at(-1)|0;continue}
if(g==27){s[s.length-1]=~s.at(-1)|0;continue}
if(g>15&&g<35){let b=s.pop(),a=s.pop();if(g>18&&g<23&&!b)return f(4);s.push(F[g-16](a,b));continue}
if(g>47&&g<52){let u=(p[v-2]|p[v-1]<<8)<<16>>16;
if(g==48){x=v+u;continue}
if(g==51){if(t.length==64)return f(7);t.push(v);x=p[v-2]|p[v-1]<<8;continue}
if((g==49)==(s.pop()==0)){x=v+u}continue}
if(g==52){if(t.length==0)return f(8);x=t.pop();continue}
if(g==64){let a=s.at(-1);if(a<0||a>255)return f(6);s[s.length-1]=m[a]|0;continue}
if(g==65){let a=s.pop(),b=s.pop();if(a<0||a>255)return f(6);m[a]=b;continue}
if(g==80){let u=""+s.at(-1);if(o.length+u.length>65536)return f(11);s.pop();for(let c of u)o.push(c.charCodeAt(0));continue}
if(g==81){if(o.length+1>65536)return f(11);o.push(s.pop()&255);continue}
if(g==82){s.push(y<q.length?q[y++]:-1);continue}
return{o,e:s.pop()&255}}}
const I=process.env.MAKEFUN_INPUT_DIR??"/input",O=process.env.MAKEFUN_OUTPUT_DIR??"/output";
for(let id of a(I)){let u=r(b(I+"/"+id+"/program.bin"),b(I+"/"+id+"/input.bin"));d(O+"/"+id,{recursive:true});c(O+"/"+id+"/stdout.bin",Buffer.from(u.o));c(O+"/"+id+"/exit.txt",u.e+"\n")}
