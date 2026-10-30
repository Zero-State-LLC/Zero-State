import { readFileSync } from 'node:fs';
const ids = ['scene','era-header','era-title','era-sub','progress-track','progress-fill','resource-bar','stage','world-canvas','world-prompt','world-menu','controls-hint','settings-screen','settings-form','nav-rail','toast'];
const nodes = new Map();
class N {
  constructor(tag) { this.tagName=tag; this.children=[]; this.style={}; this.dataset={}; this.hidden=false; this.attrs={}; this._cls=''; this.listeners={}; }
  set className(v){ this._cls=v; } get className(){ return this._cls; }
  get classList(){ const s=this; return { add:c=>{s._cls=(s._cls+' '+c).trim()}, remove:c=>{s._cls=s._cls.replace(c,'')}, contains:c=>(s._cls||'').includes(c) }; }
  set textContent(v){ this._t=String(v); this.children=[]; } get textContent(){ return this._t||''; }
  append(...ns){ this.children.push(...ns); } replaceChildren(...ns){ this.children=[...ns]; }
  addEventListener(ev,fn){ (this.listeners[ev] ||= []).push(fn); } removeEventListener(){}
  setAttribute(k,v){ this.attrs[k]=v; } getAttribute(k){ return this.attrs[k]; }
  getBoundingClientRect(){ return {x:0,y:0,width:1280,height:720,top:0,left:0}; }
  focus(){} click(){ this.listeners.click?.forEach(f=>f()); } remove(){}
  get isConnected(){ return true; }
  getContext(){ return { canvas:this, fillStyle:'', fillRect(){}, drawImage(){}, fillText(){}, beginPath(){}, arc(){}, fill(){}, stroke(){}, moveTo(){}, lineTo(){}, save(){}, restore(){}, translate(){}, setTransform(){}, clearRect(){}, getImageData:()=>({data:new Uint8ClampedArray(4)}), createLinearGradient:()=>({addColorStop(){}}) }; }
  set width(v){ this._w=v; } get width(){ return this._w||1280; }
  set height(v){ this._h=v; } get height(){ return this._h||720; }
}
function mk(id){ const n=new N('div'); n.id=id; return n; }
for (const id of ids) nodes.set('#'+id, mk(id));
globalThis.document = {
  getElementById:(id)=>nodes.get('#'+id)||mk(id),
  querySelector:(sel)=>nodes.get(sel)||mk(sel),
  querySelectorAll:()=>[],
  createElement:(t)=>new N(t),
  addEventListener:()=>{}, removeEventListener:()=>{},
  documentElement:{ dataset:{} }, body:new N('body'), hidden:false,
};
globalThis.window = { devicePixelRatio:1, addEventListener(){}, location:{ href:'local' } };
globalThis.localStorage = { getItem:()=>null, setItem:()=>{}, removeItem:()=>{} };
globalThis.matchMedia = () => ({ matches:false });
globalThis.performance = { now:()=>0 };
globalThis.Image = class { set src(v){ this._s=v; setImmediate(()=>this.onload?.()); } get src(){ return this._s; } };
globalThis.fetch = async (u) => { throw new Error('offline'); };
const { bootScroller, setPalettes } = await import('../src/ui/scroller-boot.js');
const eras = JSON.parse(readFileSync('src/data/eras.json','utf8'));
bootScroller({
  erasData: eras,
  content: { encounters: [], stones: [], arcs: [] },
  canvas: nodes.get('#world-canvas'),
  hudRoot: nodes.get('#resource-bar'),
  promptRoot: nodes.get('#world-prompt'),
  menuRoot: nodes.get('#world-menu'),
  toastRoot: nodes.get('#toast'),
});
console.log('BOOT OK — no throw');
