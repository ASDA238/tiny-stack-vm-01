import {readdirSync,readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
// Valid opcodes: 0-7, 16-30, 32-34, 48-52, 64-65, 80-83. Byte 31 traps 5.
const V=o=>o<=7||(o>=16&&o<=30)||(o>=32&&o<=34)||(o>=48&&o<=52)||o===64||o===65||(o>=80&&o<=83);
// Per-opcode [imm, pops, pushes] packed as one char each: code = imm*16+pops*4+pushes, offset by '0'.
// Slots for invalid bytes are '0' and never decoded, because V() rejects them first.
const T="0Aq46:;?"+"00000000"+"9999999"+"5"+"999"+"5"+"999"+"0"+"999"+"0000000000000"+"PTTP0"+"00000000000"+"58"+"00000000000000"+"4414";
const enc=new TextEncoder();
const B={16:(a,b)=>a+b|0,17:(a,b)=>a-b|0,18:(a,b)=>Math.imul(a,b),
19:(a,b)=>a===-2147483648&&b===-1?a:(a/b)|0,20:(a,b)=>b===-1?0:a%b|0,
21:(a,b)=>Math.floor((a>>>0)/(b>>>0))|0,22:(a,b)=>(a>>>0)%(b>>>0)|0,
24:(a,b)=>a&b,25:(a,b)=>a|b,26:(a,b)=>a^b,
28:(a,b)=>a<<(b&31),29:(a,b)=>a>>(b&31),30:(a,b)=>(a>>>(b&31))|0,
32:(a,b)=>a===b?1:0,33:(a,b)=>a<b?1:0,34:(a,b)=>(a>>>0)<(b>>>0)?1:0};
function run(p,inp){
 const S=new Int32Array(256);let sp=0;
 const C=new Int32Array(64);let cp=0;
 const M=new Int32Array(256);
 const out=new Uint8Array(65536);let ol=0,ip=0,pc=0;
 const fin=c=>[out.subarray(0,ol),c];
 for(let st=0;;){
  if(st===1000000)return fin(10);
  if(pc<0||pc>=p.length)return fin(9);
  const op=p[pc];
  if(!V(op))return fin(5);
  const v=T.charCodeAt(op)-48,im=v/16|0,po=v%16/4|0,pu=v%4;
  if(pc+im>=p.length)return fin(9);
  st++;
  const nx=pc+1+im;
  if(sp<po)return fin(2);
  if(sp-po+pu>256)return fin(3);
  pc=nx;
  switch(op){
   case 0:return fin(0);
   case 1:S[sp++]=(p[nx-1]<<24)>>24;break;
   case 2:S[sp++]=p[nx-4]|p[nx-3]<<8|p[nx-2]<<16|p[nx-1]<<24;break;
   case 3:sp--;break;
   case 4:S[sp]=S[sp-1];sp++;break;
   case 5:{const t=S[sp-1];S[sp-1]=S[sp-2];S[sp-2]=t;break;}
   case 6:S[sp]=S[sp-2];sp++;break;
   case 7:{const a=S[sp-3];S[sp-3]=S[sp-2];S[sp-2]=S[sp-1];S[sp-1]=a;break;}
   case 23:S[sp-1]=-S[sp-1]|0;break;
   case 27:S[sp-1]=~S[sp-1];break;
   case 16:case 17:case 18:case 19:case 20:case 21:case 22:case 24:case 25:case 26:case 28:case 29:case 30:case 32:case 33:case 34:{
    const b=S[sp-1],a=S[sp-2];
    if(b===0&&op>=19&&op<=22)return fin(4);
    sp-=2;S[sp++]=B[op](a,b);break;}

   case 48:case 49:case 50:{
    const rel=((p[nx-2]|p[nx-1]<<8)<<16)>>16;
    if(op===48||(S[--sp]===0)===(op===49))pc=nx+rel;
    break;}
   case 51:
    if(cp===64)return fin(7);
    C[cp++]=nx;pc=p[nx-2]|p[nx-1]<<8;break;
   case 52:
    if(cp===0)return fin(8);
    pc=C[--cp];break;
   case 64:{
    const a=S[sp-1];
    if(a<0||a>255)return fin(6);
    S[sp-1]=M[a];break;}
   case 65:{
    const a=S[sp-1],v=S[sp-2];
    if(a<0||a>255)return fin(6);
    sp-=2;M[a]=v;break;}

   case 80:{
    const b=enc.encode(String(S[sp-1]));
    if(ol+b.length>65536)return fin(11);
    sp--;out.set(b,ol);ol+=b.length;break;}
   case 81:
    if(ol>=65536)return fin(11);
    out[ol++]=S[--sp]&255;break;
   case 82:S[sp++]=ip<inp.length?inp[ip++]:-1;break;
   case 83:return fin(S[--sp]&255);

  }
 }
}
const I=process.env.MAKEFUN_INPUT_DIR??'/input';
const O=process.env.MAKEFUN_OUTPUT_DIR??'/output';
for(const id of readdirSync(I).sort()){
 const d=join(I,id),[out,code]=run(readFileSync(d+'/program.bin'),readFileSync(d+'/input.bin'));
 mkdirSync(join(O,id),{recursive:true});
 writeFileSync(join(O,id,'stdout.bin'),out);
 writeFileSync(join(O,id,'exit.txt'),code+'\n');
}

