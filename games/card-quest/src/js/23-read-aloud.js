/* ---------- tap any word to hear it (reading help) ---------- */
const SKIPW='button,svg,script,style,.zh,.w,input,textarea,.toast,.stamp,.dmg,.coin,.bill,.logo';
function wordify(root){if(!root||root.nodeType!==1)return;if(root.closest&&root.closest(SKIPW))return;const tw=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>/[A-Za-z]/.test(n.nodeValue)&&!(n.parentElement&&n.parentElement.closest(SKIPW))?1:2});
 const ns=[];while(tw.nextNode())ns.push(tw.currentNode);
 ns.forEach(n=>{const f=document.createDocumentFragment();n.nodeValue.split(/([A-Za-z][A-Za-z’'-]*)/).forEach((part,i)=>{if(!part)return;if(i%2){const sp=document.createElement('span');sp.className='w';sp.textContent=part;f.appendChild(sp);}else f.appendChild(document.createTextNode(part));});n.parentNode.replaceChild(f,n);});}
let wq=null;new MutationObserver(ms=>{ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1)(wq=wq||new Set()).add(n);else if(n.nodeType===3&&n.parentElement)(wq=wq||new Set()).add(n.parentElement);}));
 if(wq&&!wq.raf){wq.raf=requestAnimationFrame(()=>{const q=wq;wq=null;q.forEach(el=>{if(el.isConnected)wordify(el);});});}}).observe(document.body,{childList:true,subtree:true});
document.addEventListener('click',e=>{const w=e.target.closest&&e.target.closest('.w');if(!w)return;e.stopPropagation();e.preventDefault();
 const word=w.textContent.replace(/[’']s$/,'');w.classList.add('lit');setTimeout(()=>w.classList.remove('lit'),700);
 if('speechSynthesis' in window){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(word);u.lang='en-US';u.rate=.75;speechSynthesis.speak(u);}catch(err){}}},true);
wordify(document.body);

