/* ================= wiring ================= */
$('#backHome').onclick=()=>{Sfx.tap();renderHome();show('home')};
$('#flee').onclick=()=>{Music.stop();try{speechSynthesis.cancel()}catch(e){}renderWorld();show('world')};
$('#sndBtn').onclick=()=>{soundOn=!soundOn;$('#sndBtn').textContent='SOUND: '+(soundOn?'ON':'OFF');try{localStorage.setItem('qb-sound',soundOn?'1':'0')}catch(e){}if(!soundOn)Music.stop();else{ac();Sfx.tap()}};
$('#musicBtn').onclick=()=>{musicOn=!musicOn;$('#musicBtn').textContent='♪ '+(musicOn?'ON':'OFF');if(musicOn&&B&&!$('#battle').hidden)Music.start(B.track||'adventure');else Music.stop()};
try{if(localStorage.getItem('qb-sound')==='0'){soundOn=false;$('#sndBtn').textContent='SOUND: OFF'}}catch(e){}
Speech.init();Save.load();renderHome();Save.connect();
/* silence music while the game is hidden, so it never piles up notes in the background */
document.addEventListener('visibilitychange',()=>{try{if(!AC)return;if(document.hidden)AC.suspend();else AC.resume()}catch(e){}});
$('#introBtn').onclick=()=>{ac();Intro.play(true)};
Intro.play(false);
window.QB={Shop,Equip,ITEMS,ANCH,starsOf,fitStage,Intro,Story,STORIES,FX_POOL,Mini,NEW_BANKS,CHAPTERS,chapterTopics,Fx,get B(){return B},Save,POOLS,nextQuestion,STARTERS,SPR,MapV,topicsFor,NORA_BANKS};
