'use strict';
const Q={count:10,criterion:[
  {id:'p',label:'① 2組の対辺がそれぞれ平行'},
  {id:'s',label:'② 2組の対辺がそれぞれ等しい'},
  {id:'ps',label:'③ 1組の対辺が平行で、その長さが等しい'},
  {id:'d',label:'④ 対角線がそれぞれの中点で交わる'},
  {id:'a',label:'⑤ 2組の対角がそれぞれ等しい'}
]};
const rng=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=rng(0,i);[a[i],a[j]]=[a[j],a[i]];}return a;};
// 図の∠DABは鋭角で統一しているため、与える∠DABも鋭角に限定する。
// となりあう角を問うときは 180°−∠DAB となり、図の見た目とも整合する。
const angle=()=>pick([30,35,40,45,50,55,60,65,70,75,80]);
function nQ(type,kind,text,answer,fig,hints,extra={}){return {id:`${type}-${Math.random().toString(36).slice(2)}`,type,kind,text,answer,fig,hints,...extra};}
function qA(){const pair=pick([['AB','DC'],['BC','AD']]),v=rng(2,15);return nQ('A','number',`平行四辺形ABCDで、\\(${pair[0]}=${v}\\,\\mathrm{cm}\\) です。\\(${pair[1]}\\) の長さを求めなさい。`,v,{mode:'para',side:{known:pair[0],ask:pair[1],value:v}},[`向かい合う2辺を <b>対辺</b> というよ。`,`平行四辺形では、2組の対辺はそれぞれ等しい。\\(${pair[0]}=${pair[1]}\\)`,`\\(${pair[1]}=${v}\\,\\mathrm{cm}\\)`],{unit:'cm',solution:`${pair[0]} と ${pair[1]} は対辺だから等しい。`,wrong:v=>`隣り合う辺ではなく、${pair[0]} と ${pair[1]} は向かい合う対辺だよ。`});}
function qB(){const known=angle(),rel=pick(['opposite','adjacent']);const ask=rel==='opposite'?known:180-known;const labels=rel==='opposite'?['∠DAB','∠BCD','対角']:['∠DAB','∠ABC','となりあう角'];return nQ('B','number',`平行四辺形ABCDで、\\(${labels[0]}=${known}^\\circ\\) です。\\(${labels[1]}\\) の大きさを求めなさい。`,ask,{mode:'para',angle:{known:labels[0],ask:labels[1],knownVertex:'A',askVertex:rel==='opposite'?'C':'B',value:known,relation:rel}},[`\\(${labels[0]}\\) と \\(${labels[1]}\\) は <b>${labels[2]}</b> だよ。`,rel==='opposite'?`平行四辺形の対角は等しい。\\(${labels[0]}=${labels[1]}\\)`:`\\(AD \\parallel BC\\) だから、\\(${labels[0]}+${labels[1]}=180^\\circ\\)（平行線の同じ側にある内角の和）。\\(${labels[1]}=180^\\circ-${known}^\\circ\\)`, `\\(${labels[1]}=${ask}^\\circ\\)`],{unit:'°',solution:rel==='opposite'?'対角は等しい。':'AD ∥ BC だから、となりあう角の和は180°。',wrong:v=>v===(rel==='opposite'?180-known:known)?(rel==='opposite'?'今回は対角だから、180°から引かず同じ大きさだよ。':'今回はとなりあう角だから、同じ大きさではなく180°から引こう。'):'対角か、となりあう角かを図で確かめよう。'});}
function qC(){const diagonal=pick(['AC','BD']),half=rng(2,10),whole=half*2,mode=pick(['whole','half']);const parts=diagonal==='AC'?['AO','OC']:['BO','OD'];if(mode==='whole')return nQ('C','number',`平行四辺形ABCDの対角線の交点をOとします。\\(${parts[0]}=${half}\\,\\mathrm{cm}\\) のとき、\\(${diagonal}\\) の長さを求めなさい。`,whole,{mode:'para',diagonal:{name:diagonal,known:parts[0],ask:diagonal,value:half,part:true}},['対角線は、それぞれの中点で交わるよ。',`Oは\\(${diagonal}\\)の中点だから、\\(${parts[0]}=${parts[1]}=${half}\\)`,`\\(${diagonal}=${half}+${half}=${whole}\\,\\mathrm{cm}\\)`],{unit:'cm',solution:'対角線全体は半分の2倍。',wrong:v=>v===half?`Oは中点。${diagonal}は半分の2倍だよ。`:'対角線の半分と全体を確かめよう。'});return nQ('C','number',`平行四辺形ABCDの対角線の交点をOとします。\\(${diagonal}=${whole}\\,\\mathrm{cm}\\) のとき、\\(${parts[0]}\\) の長さを求めなさい。`,half,{mode:'para',diagonal:{name:diagonal,known:diagonal,ask:parts[0],value:whole,part:false}},['対角線は、それぞれの中点で交わるよ。',`Oは\\(${diagonal}\\)の中点。\\(${parts[0]}=${diagonal}\\div2\\)`,`\\(${parts[0]}=${whole}\\div2=${half}\\,\\mathrm{cm}\\)`],{unit:'cm',solution:'Oは中点なので、全体を2で割る。',wrong:v=>v===whole?'Oは中点だから、半分は対角線全体を2で割るよ。':'対角線の半分と全体を確かめよう。'});}
// 否定問題は「条件表にないから」ではなく「反例があるから いえない」で示す。反例図は diagram.js の COUNTER_EXAMPLES と対応。
const BAD_CASES=[
  {info:'AB = BC、BC = CD',id:'bad-sides',shape:'AD だけ長さのちがう四角形',
   counter:'AB = BC = CD を保ったまま、AD だけ長さのちがう四角形がかける'},
  {info:'AB ∥ DC',id:'bad-parallel',shape:'台形',
   counter:'AB ∥ DC でも、AD と BC が平行でない台形がかける'},
  {info:'AC = BD',id:'bad-equaldiag',shape:'等脚台形',
   counter:'AC = BD でも、AB と DC が平行でない等脚台形がかける'},
  {info:'AC ⊥ BD',id:'bad-perp',shape:'たこ形',
   counter:'AC ⊥ BD でも、対角線が互いを2等分しないたこ形がかける'}
];
function qD(positive=true,forced){let id=forced||pick(Q.criterion.map(x=>x.id));let info,fig;if(positive){const map={p:['AB ∥ DC、AD ∥ BC','p'],s:['AB = DC、AD = BC','s'],ps:['AB ∥ DC、AB = DC','ps'],d:['AO = OC、BO = OD','d'],a:['∠DAB = ∠BCD、∠ABC = ∠CDA','a']};[info,id]=map[id];fig={mode:'generic',criterion:id};return nQ('D','judge',`四角形ABCDで、${info} が成り立っています。平行四辺形になるといえるか判定し、根拠となる条件を選びなさい。`,{yes:true,criterion:id},fig,['まず、平行四辺形になるための5条件を思い出そう。',`図の印は「${Q.criterion.find(x=>x.id===id).label}」に当てはまる。`,`この条件が成り立つので、平行四辺形になるといえる。`],{solution:`なる。根拠：${Q.criterion.find(x=>x.id===id).label}`,wrong:()=>`図の印で示された条件だけを使おう。`});}const bad=pick(BAD_CASES);fig={mode:'generic',criterion:bad.id};return nQ('D','judge',`四角形ABCDで、${bad.info} が成り立っています。この情報だけで、平行四辺形になるといえるか判定しなさい。`,{yes:false},fig,['「いえない」と示すには、条件は満たすのに平行四辺形にならない図（反例）を1つ見つければよい。',`${bad.counter}。そんな図がかけないか、実際にかいて確かめよう。`,`${bad.shape}という反例があるので、平行四辺形になるとはいえない。`],{solution:`下の反例がかけるので、平行四辺形とはいえない。`,wrong:()=>`下の反例のような形も作れるから、いえないよ。`});}
function qE(kind){const data={rect:pick([['∠DAB = 90°','right'],['AC = BD','equalDiag']]),rhomb:pick([['AB = BC','adjacentEqual'],['AC ⊥ BD','perpDiag']]),square:pick([['∠DAB = 90° かつ AB = BC','squareMarks'],['AC = BD かつ AC ⊥ BD','squareDiag']])}[kind];const answer={rect:'長方形',rhomb:'ひし形',square:'正方形'}[kind];return nQ('E','choice',`平行四辺形ABCDで、${data[0]} が成り立っています。ここから必ずいえる、最も具体的な四角形を選びなさい。`,answer,{mode:'interactive',target:data[1],condition:data[0]},['青い点B・Dを動かして、表示される角度や長さを条件に近づけよう。',kind==='rect'?'1つの角が直角、または対角線が等しい平行四辺形は長方形。':kind==='rhomb'?'隣辺が等しい、または対角線が垂直な平行四辺形はひし形。':'直角になる条件と、4辺が等しい条件の両方がそろっている。',`答えは <b>${answer}</b>。`],{choices:['長方形','ひし形','正方形'],solution:kind==='square'?'両方の条件があるので正方形。':`${answer}。条件を満たす形には正方形も含まれるが、この条件だけから必ずいえる分類は${answer}。`,wrong:()=>kind==='square'?'直角と等辺（または対角線の2条件）が両方あるから、正方形までいえるよ。':'作った1つの形だけでなく、与えられた条件から必ずいえる分類を考えよう。'});}
function makeSession(level){let types=level===1?['A','A','A','A','B','B','B','B','B','B']:level===2?['A','A','B','B','C','C','C','D','D','D']:['A','A','B','B','C','C','D','D','E','E'];let dPos=shuffle(Q.criterion.map(x=>x.id)),dModes=level===3?shuffle([true,false]):shuffle([true,true,false]),eKinds=level===3?shuffle(['rect','rhomb','square']).slice(0,2):[];let di=0,ei=0;return shuffle(types.map(t=>t==='A'?qA():t==='B'?qB():t==='C'?qC():t==='D'?qD(dModes[di],dPos[di++]):qE(eKinds[ei++])));}
