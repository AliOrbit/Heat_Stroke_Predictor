import fs from 'node:fs';
import * as k from './kit/iso-kit.mjs';
const source=fs.readFileSync(process.argv[2] || 'dashboard-base.html','utf8');
const W=840,H=550;
const P=k.fitProjection([[-70,-145,0],[70,145,0],[-65,-60,185],[65,60,185]],W,H,{pad:40,azimuth:48,elevation:34});
const groups=[];let solids=0;
const solid=(x,y,w,d,z,h,tone='mid',r=1)=>{solids++;return k.solidSvg(k.slabOf({x,y,w,d,r},z,h,P,5,.55),{tone})};
const ring=(x,y,z,r=1.3)=>k.lineSvg(k.ring(x,y,r,z,P,20),{tone:'lo'});
const dot=(x,y,z,size=.5)=>k.dotsSvg([k.iso([x,y,z],P)],{size,tone:'hi'});
const line=(a,b,z,tone='lo')=>k.lineSvg(k.lineOnTop(a,b,z,P),{tone});
function add(id,label,center,move,body){groups.push({id,label,center,move,body});}
let s='';
for(const y of [-139,54]){s+=solid(-21,y,42,85,1,3,'lo',4);for(let i=0;i<9;i++)s+=k.lineSvg(k.planOutline({x:-3,y:y+8+i*7,w:6,d:3,r:1.2},4,P),{tone:'faint'});s+=solid(-24,y<0?-64:54,48,10,2,4,'mid',2);}
add('strap','سوار التثبيت',[0,0,0],[0,0,0],s);
s=solid(-39,-53,78,106,4,5,'mid',7);
s+=solid(-39,-53,78,4,9,19,'mid',2)+solid(-39,-49,4,98,9,19,'mid',2);
for(const [x,y]of [[-31,-45],[31,-45],[-31,45],[31,45]])s+=solid(x-2,y-2,4,4,9,17,'lo',1)+ring(x,y,26);
add('shell','الغلاف المطبوع',[0,-30,10],[0,0,0],s);
s=solid(-28,-35,56,68,9,8,'lo',3)+solid(-25,-32,50,62,17,.6,'mid',2);
for(let i=0;i<3;i++)s+=solid(-18+i*12,-38,7,3,10,2,'hi',.2);
s+=k.lineSvg(k.planOutline({x:-21,y:-24,w:42,d:46,r:2},17.6,P),{tone:'faint'});
add('power','وحدة الطاقة',[0,0,15],[0,0,35],s);
s=solid(-28,-38,56,76,19,2,'mid',2);
s+=solid(-16,-25,30,32,21,2.5,'hi',1)+solid(-14,-23,26,28,23.5,.6,'mid',.7);
s+=solid(-20,11,18,16,21,3,'hi',1);
for(const x of [-25,22])for(let i=0;i<12;i++){const y=-33+i*6;s+=solid(x,y,3,2.2,21,.8,'hi',.15);}
for(let i=0;i<7;i++)s+=solid(2+i*3,15,1,18,21,.2,'lo',.1);
for(let i=0;i<5;i++)s+=solid(-13+i*7,9,4,2,21,1,'lo',.3);
s+=solid(-31,-5,6,12,20,4,'hi',1)+solid(-31,-3,2,8,21,1,'lo',.3);
for(const [x,y]of [[-23,-33],[23,-33],[-23,33],[23,33]])s+=ring(x,y,21)+dot(x,y,21);
add('esp','ESP32-C3 والمعالجة',[0,0,23],[0,0,72],s);
function sensor(id,label,x,y,w,d,type,move){let t=solid(x,y,w,d,25,1.6,'hi',1);t+=solid(x+3,y+3,w-6,d-6,26.6,2,'mid',.7);if(type==='optical'){t+=solid(x+4,y+4,5,8,28.6,.7,'hi',.5)+solid(x+11,y+4,5,8,28.6,.7,'lo',.5);t+=solid(x+4,y+13,12,3,28.6,.4,'lo',.4);}else{t+=solid(x+5,y+5,w-10,d-10,28.6,.6,'lo',.4);}for(let i=0;i<4;i++)t+=dot(x+2+i*(w-4)/3,y+d-1,26.7,.8);add(id,label,[x+w/2,y+d/2,28],move,t);}
sensor('ppg','MAX30102 · النبض والأكسجين',4,-29,23,24,'optical',[35,0,108]);
sensor('temp','MAX30205 · حرارة التلامس',-26,-27,24,20,'temp',[-35,0,108]);
sensor('env','BME280 · البيئة',-11,11,22,22,'env',[0,32,108]);
s=solid(-39,-53,78,5,29,3,'hi',2)+solid(-39,48,78,5,29,3,'hi',2)+solid(-39,-48,5,96,29,3,'hi',2)+solid(34,-48,5,96,29,3,'hi',2);
s+=solid(-34,-4,68,9,29,3,'hi',1)+solid(-34,37,68,11,29,3,'hi',1);
for(const [x,y]of [[-30,-47],[30,-47],[-30,46],[30,46]])s+=ring(x,y,32)+dot(x,y,32);
for(let i=0;i<5;i++)s+=k.lineSvg(k.planOutline({x:-23+i*10,y:40,w:5,d:5,r:2},32,P),{tone:'lo'});
add('lid','الغطاء والفتحات',[0,0,31],[0,0,157],s);
s=solid(35,-49,4,98,9,19,'mid',1)+solid(-35,49,70,4,9,19,'mid',1);
add('front','واجهة الغلاف',[0,50,12],[0,0,0],s);
groups.sort((a,b)=>k.depthOf(a.center,P)-k.depthOf(b.center,P));
const svg=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="رسم تعليمي إيزومتري للجهاز القابل للارتداء، مع غلاف وسوار ولوحة معالجة وثلاث وحدات حساسات. ترتيب الداخل تقريبي."><ellipse cx="420" cy="462" rx="220" ry="32" fill="currentColor" opacity=".07"/>${groups.map(g=>`<g data-assembly="${g.id}" data-selected="false" role="button" tabindex="0" aria-label="${g.label}">${g.body}</g>`).join('')}</svg>`;
const panel=`<section id="anatomy-panel" role="tabpanel" aria-labelledby="tab-anatomy" class="page" hidden><div class="anatomy-head"><div><div class="eyebrow">ANATOMY / HSP</div><h2>من الحساس إلى الإنذار</h2><p class="sub">استكشف أجزاء الجهاز، ثم تتبّع كيف تتحول القراءات إلى درجة خطر.</p></div><button id="hsp-fullscreen">ملء الشاشة</button></div><div class="anatomy-layout"><div class="anatomy-figure iso" id="hsp-figure" data-theme="dark"><div class="figure-heading"><span>FIG. 01</span><span id="hsp-pose">الجهاز مجمّع</span></div>${svg}<div class="explode-controls"><button id="hsp-explode" aria-pressed="false">استكشف الداخل</button><label for="hsp-spread">تفكيك توضيحي</label><input id="hsp-spread" type="range" min="0" max="100" value="0"><button id="hsp-theme">فاتح / داكن</button></div><p class="figure-caption">الرسم مبني على شكل النموذج في الصور ومكوّنات الكود. مواضع الداخل ووحدة الطاقة توضيحية؛ ليس نموذج CAD مطابقًا أو توصيلًا كهربائيًا.</p></div><aside class="anatomy-info"><span class="eyebrow">اكتشف المكوّن</span><h3 id="hsp-part-title">الجهاز القابل للارتداء</h3><p id="hsp-part-text">سوار يجمع القياسات الحيوية والبيئية ويعالجها محليًا ثم يرسلها بالبلوتوث. اضغط مكوّنًا أو اختر من القائمة.</p><div class="part-buttons">${[['shell','الغلاف والسوار'],['power','وحدة الطاقة'],['esp','ESP32-C3'],['ppg','النبض والأكسجين'],['temp','حرارة التلامس'],['env','البيئة'],['lid','الغطاء']].map(([id,label])=>`<button data-hsp-select="${id}" aria-pressed="false">${label}</button>`).join('')}</div><div class="hsp-fact" id="hsp-part-fact">التجربة هنا تشرح المكوّنات؛ لا تولّد قياسات صحية.</div></aside></div><div class="hsp-journey"><div><span class="eyebrow">DATA JOURNEY</span><h3>رحلة القرار</h3><p class="sub">اضغط الخطوات بنفسك؛ الإضاءة توضّح مسار المعلومة ولا تمثّل إشارة حية.</p></div><div class="journey-buttons">${['القياس','جودة الإشارة','الحساب','الإنذار والاتصال'].map((t,i)=>`<button data-hsp-step="${i}" aria-pressed="${i===0}"><span>0${i+1}</span>${t}</button>`).join('')}</div><p id="hsp-step-text">تلتقط حساسات التلامس والضوء والبيئة الإشارات التي يستخدمها النظام.</p></div><div class="hsp-pitch"><h3>مسار العرض أمام اللجنة · ٨ دقائق</h3><details><summary>افتح خطة تقديم المشروع</summary><table><thead><tr><th>الوقت</th><th>الرسالة</th><th>وسيلة العرض</th></tr></thead><tbody><tr><td>0:00–0:45</td><td>المشكلة والفئة المستهدفة: العاملون والمتدربون في البيئات الحارة.</td><td>افتتاح قصير</td></tr><tr><td>0:45–1:30</td><td>فكرة جهاز قابل للارتداء يجمع مؤشرات الجسم والبيئة.</td><td>الجهاز الحقيقي</td></tr><tr><td>1:30–3:00</td><td>المكوّنات ووظيفة كل حساس.</td><td>تفكيك Anatomy</td></tr><tr><td>3:00–4:00</td><td>جودة الإشارة ثم درجة الخطر والتنبيه.</td><td>رحلة القرار</td></tr><tr><td>4:00–5:15</td><td>التجارب الفعلية ونتائجها وحدودها؛ لا تُذكر دقة دون دليل.</td><td>جلسة محفوظة أو عرض حي بعد التحقق</td></tr><tr><td>5:15–6:15</td><td>قابلية التطبيق والفائدة الاجتماعية والعسكرية والتكلفة المثبتة.</td><td>بيانات المشروع المتاحة</td></tr><tr><td>6:15–7:15</td><td>السلامة: دقة القياس والتلامس والخصوصية والتعامل مع الإنذارات.</td><td>حدود النموذج</td></tr><tr><td>7:15–8:00</td><td>التطوير: المعايرة، تصغير الغلاف، تحسين الطاقة، وAI بعد جمع بيانات مناسبة.</td><td>خاتمة واضحة</td></tr></tbody></table><p class="meta">المحتوى مقترح للعرض ويحتاج دعمًا بنتائج وتجارب ومراجع فعلية. الأسئلة والمناقشة: ٥ دقائق إضافية.</p></details></div><p class="meta anatomy-credit">الرسم يستخدم Anatomy kit — Ryan، MIT. أما الغرض والتسميات فمن المشروع. توجد ملفات التصميم الأصلية في مجلد 3D_Design بالمستودع.</p></section>`;
const styles=`${k.ISO_CSS}
.anatomy-head{display:flex;justify-content:space-between;align-items:center;gap:16px}.anatomy-layout{display:grid;grid-template-columns:minmax(0,1.7fr) minmax(250px,1fr);gap:18px}.anatomy-figure{--anatomy-paper:#101d29;border:1px solid var(--line);background:var(--anatomy-paper);border-radius:20px;overflow:hidden;color:#7fa3b7}.anatomy-figure[data-theme=light]{--anatomy-paper:#edf1ed;color:#273f45}.figure-heading{display:flex;justify-content:space-between;padding:20px 22px;font-size:11px;letter-spacing:1px}.anatomy-figure svg{width:100%;height:auto;display:block;max-height:510px}.anatomy-figure [data-assembly]{cursor:pointer;transition:filter .2s,opacity .2s;outline:none}.anatomy-figure [data-selected=true]{filter:drop-shadow(0 0 4px #6de0c8)}.anatomy-figure [data-assembly]:focus-visible{filter:drop-shadow(0 0 5px #e7bd71)}.explode-controls{padding:15px 20px;display:flex;gap:10px;align-items:center;flex-wrap:wrap;font-size:12px}.explode-controls input{accent-color:#70e1cb;flex:1;min-width:80px}.figure-caption{padding:0 22px 14px;font:12px/1.9 system-ui;color:var(--anatomy-muted,#8da4b8)}.anatomy-info{border:1px solid var(--line);background:var(--panel);border-radius:20px;padding:24px}.anatomy-info h3{font-size:22px;margin:12px 0}.anatomy-info p{font-size:14px;color:#b0c4d1;min-height:100px}.part-buttons{display:grid;grid-template-columns:1fr 1fr;gap:8px}.part-buttons button{font-size:12px;padding:11px 7px}.part-buttons [aria-pressed=true],.journey-buttons [aria-pressed=true]{border-color:#70e1cb;background:#21463f;color:#b0f3e3}.hsp-fact{font-size:12px;line-height:1.9;border-top:1px solid var(--line);padding-top:16px;margin-top:20px;color:#d8be8b}.hsp-journey,.hsp-pitch{border:1px solid var(--line);border-radius:18px;padding:23px;margin-top:18px;background:#101e2a}.hsp-journey h3,.hsp-pitch h3{font-size:18px;margin:8px 0}.journey-buttons{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.journey-buttons button{font-size:13px;display:flex;align-items:center;gap:10px}.journey-buttons span{font-size:11px;color:#72cdb9}.hsp-journey>p{min-height:48px;font-size:14px;color:#b9ccd5}.anatomy-credit{margin-top:18px}@media(max-width:850px){.anatomy-layout{grid-template-columns:1fr}.anatomy-figure svg{max-height:440px}.anatomy-info p{min-height:0}.journey-buttons{grid-template-columns:1fr 1fr}}@media(prefers-reduced-motion:reduce){.anatomy-figure [data-assembly]{transition:none}}`;
const live=`
// Geometry derived from Anatomy's iso-kit; MIT license included at end of page.
const hspGroups=${JSON.stringify(groups.map(({body,...g})=>({...g,vector:k.axisVector(P,g.move),depth:k.depthOf(g.center,P)})))};
const hspDetails={
shell:['الغلاف والسوار','الغلاف المطبوع ثلاثيًا يحمي الإلكترونيات، والسوار يثبّت النموذج قرب موضع القياس. فتحات الحساسات وتلامس الجلد يؤثران في جودة الإشارة.','الأبعاد والمواضع الداخلية هنا تقريبية؛ يلزم مطابقة ملف CAD والجهاز النهائي.'],
strap:['سوار التثبيت','يحافظ على وضع الجهاز أثناء الارتداء. جودة القياس الضوئي تتأثر بالحركة والضغط والتلامس.','لا يضمن تثبيت السوار وحده دقة طبية.'],
front:['واجهة الغلاف','تمثيل للغلاف المستطيل الظاهر في صور النموذج.','هذا عرض توضيحي للتركيب وليس مخطط تصنيع.'],
power:['وحدة الطاقة','تمثيل عام لتغذية الإلكترونيات أثناء الاستخدام دون كمبيوتر. نوع البطارية ودائرة الشحن لم يُؤكدا من ملفات المشروع.','لا تُستنتج سعة البطارية أو مدة التشغيل من هذا الرسم.'],
esp:['ESP32-C3 · المعالجة والاتصال','يقرأ الحساسات ويعالج الإشارات ويحسب درجة الخطر، ثم يرسل حزم BLE إلى تطبيق Flutter أو لوحة المتصفح.','الحساب الحالي قواعد ودرجات في الكود. تنفيذ Fuzzy Logic أو AI يحتاج تحققًا مستقلًا.'],
ppg:['MAX30102 · النبض وSpO₂','يستخدم الضوء الأحمر وتحت الأحمر لالتقاط إشارة PPG؛ الخوارزمية تستخرج النبض وتقدّر الأكسجين من الإشارتين.','معايرة الأكسجين وتوقيت العينات قيد التحقق؛ الرسم لا يصلح هذه القياسات.'],
temp:['MAX30205 · حرارة التلامس','يقيس حرارة الحساس عند التلامس. البرنامج يرشّح القياس ويشتق تقديرًا حراريًا بتعويض البيئة.','التقدير ليس قياسًا مباشرًا لحرارة الجسم الداخلية. MLX90614 ذُكر في وصف المشروع، لكن المسار الحالي بالكود يستخدم MAX30205.'],
env:['BME280 · ظروف البيئة','يقيس حرارة الهواء والرطوبة والضغط. حرارة البيئة والرطوبة تدخلان حساب مؤشر الحرارة؛ الضغط معروض للمتابعة.','لا يقيس الإشعاع الشمسي مباشرة. يلزم اختبار أثر حرارة الإلكترونيات ومكان الحساس.'],
lid:['الغطاء والفتحات','تمثيل للغطاء الذي يجمع الأجزاء ويترك مواضع مكشوفة للحساسات. يُرفع في العرض لتوضيح التركيب.','التفكيك حركة تعليمية وليست تعليمات صيانة أو ترتيب تجميع موثّق.']};
const hspNodes=new Map(hspGroups.map(g=>[g.id,document.querySelector('[data-assembly="'+g.id+'"]')]));
const hspFigure=document.getElementById('hsp-figure');
let hspTarget=0,hspAt=0,hspFrame=0,hspLast=0,hspVisible=true;
const hspStill=matchMedia('(prefers-reduced-motion: reduce)');
function hspDraw(){const stack=hspGroups.slice().sort((a,b)=>(a.depth+kDepth(a))-(b.depth+kDepth(b)));for(const g of stack){const t=hspAt;hspNodes.get(g.id).setAttribute('transform','translate('+(g.vector[0]*t).toFixed(2)+' '+(g.vector[1]*t).toFixed(2)+')');hspNodes.get(g.id).parentNode.appendChild(hspNodes.get(g.id));}document.getElementById('hsp-pose').textContent=hspAt<.01?'الجهاز مجمّع':hspAt>.99?'تفكيك توضيحي · الأجزاء منفصلة':'جارٍ الاستكشاف';}
function kDepth(g){const a=48*Math.PI/180,e=34*Math.PI/180;return ((g.move[0]*Math.cos(a)+g.move[1]*Math.sin(a))*Math.cos(e)+g.move[2]*Math.sin(e))*hspAt;}
function hspTick(now){const dt=hspLast?Math.min((now-hspLast)/1000,.033):.016;hspLast=now;hspAt=hspStill.matches?hspTarget:hspAt+(hspTarget-hspAt)*(1-Math.exp(-dt/.23));if(Math.abs(hspTarget-hspAt)<.0005)hspAt=hspTarget;hspDraw();hspFrame=hspVisible&&hspAt!==hspTarget?requestAnimationFrame(hspTick):0;}
function hspSet(value){hspTarget=Math.max(0,Math.min(1,value));document.getElementById('hsp-spread').value=String(Math.round(hspTarget*100));document.getElementById('hsp-explode').setAttribute('aria-pressed',String(hspTarget>0));document.getElementById('hsp-explode').textContent=hspTarget>0?'إعادة التجميع':'استكشف الداخل';if(!hspFrame){hspLast=0;hspFrame=requestAnimationFrame(hspTick)}}
function hspSelect(id){const d=hspDetails[id];if(!d)return;document.getElementById('hsp-part-title').textContent=d[0];document.getElementById('hsp-part-text').textContent=d[1];document.getElementById('hsp-part-fact').textContent=d[2];for(const [key,node]of hspNodes)node.setAttribute('data-selected',String(key===id));document.querySelectorAll('[data-hsp-select]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.hspSelect===id)));}
document.getElementById('hsp-spread').oninput=e=>hspSet(Number(e.target.value)/100);
document.getElementById('hsp-explode').onclick=()=>hspSet(hspTarget>.5?0:1);
document.getElementById('hsp-theme').onclick=()=>hspFigure.dataset.theme=hspFigure.dataset.theme==='dark'?'light':'dark';
document.getElementById('hsp-fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch(e){document.getElementById('hsp-pose').textContent='استخدم F11 لملء الشاشة'}};
document.querySelectorAll('[data-hsp-select]').forEach(b=>b.onclick=()=>{hspSelect(b.dataset.hspSelect);hspSet(1)});
for(const [id,node]of hspNodes){node.onclick=()=>hspSelect(id);node.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();hspSelect(id)}}}
const hspSteps=[['ppg','تلتقط الحساسات إشارات النبض والأكسجين وحرارة التلامس والبيئة. القيم لا تتولد من هذا الرسم.'],['ppg','يفحص البرنامج التلامس وتشبع الإشارة وعلامات الصلاحية. القيمة المتاحة ليست بالضرورة دقيقة قبل المعايرة.'],['esp','يجمع البرنامج درجات النبض والتقدير الحراري ومؤشر الحرارة. الأكسجين والضغط لا يدخلان مباشرة في مجموع الخطر الحالي.'],['esp','ينقل ESP32-C3 البيانات والتصنيف عبر BLE إلى Flutter أو المتصفح. خرج الصفارة والـLED موجود في البرنامج ويعتمد تشغيله على إعدادات GPIO والتوصيل الفعلي.']];
document.querySelectorAll('[data-hsp-step]').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.hspStep);document.querySelectorAll('[data-hsp-step]').forEach(n=>n.setAttribute('aria-pressed',String(n===b)));hspSelect(hspSteps[i][0]);hspSet(1);document.getElementById('hsp-step-text').textContent=hspSteps[i][1]});
new IntersectionObserver(entries=>{hspVisible=entries[entries.length-1].isIntersecting;if(hspVisible&&hspAt!==hspTarget&&!hspFrame){hspLast=0;hspFrame=requestAnimationFrame(hspTick)}}).observe(hspFigure);
hspDraw();
`;
const nav='<button role="tab" id="tab-anatomy" aria-controls="anatomy-panel" data-panel="anatomy-panel" aria-selected="false" tabindex="-1">استكشف الجهاز</button>';
let output=source.replace('</style>',styles+'</style>').replace('</nav>',nav+'</nav>').replace('<footer>',panel+'<footer>').replace('</script>',live+'</script>');
output+='\n<!-- Anatomy iso-kit: '+fs.readFileSync('./kit/LICENSE','utf8').replaceAll('--','—')+' -->';
fs.writeFileSync('index.html',output);fs.writeFileSync('geometry.json',JSON.stringify({projection:P,solids,groups:groups.map(({body,...g})=>g)},null,2));console.log('Built interactive Anatomy dashboard:',solids,'solids,',groups.length,'assemblies.');
