/* Kids Arcade · save pictures to the device
   iPad / iPhone: opens the share sheet → "Save Image" puts them in the Photos app.
   Computers without a share sheet: downloads the files.
   KASave.share(files, title) MUST be called straight from a tap (no await before it).
     files: [{blob, name}] or [{dataURL, name}]   → Promise<'shared'|'downloaded'|'cancelled'|'failed'>
   KASave.fromCanvas(canvas, name) builds a file instantly (no waiting), so it can be used inside the tap. */
(function(){
  function dataURLtoBlob(u){const [h,b]=u.split(',');const mime=(h.match(/:(.*?);/)||[])[1]||'image/png';const bin=atob(b);const a=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)a[i]=bin.charCodeAt(i);return new Blob([a],{type:mime})}
  function toFile(f){const blob=f.blob||dataURLtoBlob(f.dataURL);return new File([blob],f.name,{type:blob.type||'image/png'})}
  function download(files){files.forEach((f,i)=>setTimeout(()=>{const a=document.createElement('a');a.href=URL.createObjectURL(f);a.download=f.name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000)},i*350))}
  function share(list,title){let files;try{files=list.map(toFile)}catch(e){return Promise.resolve('failed')}
    try{if(navigator.share&&navigator.canShare&&navigator.canShare({files}))
      return navigator.share({files,title:title||''}).then(()=>'shared',e=>e&&e.name==='AbortError'?'cancelled':(download(files),'downloaded'))}catch(e){}
    download(files);return Promise.resolve('downloaded')}
  function fromCanvas(cv,name,type){const t=type||'image/jpeg';return{dataURL:cv.toDataURL(t,.92),name}}
  window.KASave={share,fromCanvas,dataURLtoBlob};
})();
