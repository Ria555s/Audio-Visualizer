(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))d(e);new MutationObserver(e=>{for(const i of e)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&d(a)}).observe(document,{childList:!0,subtree:!0});function m(e){const i={};return e.integrity&&(i.integrity=e.integrity),e.referrerPolicy&&(i.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?i.credentials="include":e.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function d(e){if(e.ep)return;e.ep=!0;const i=m(e);fetch(e.href,i)}})();document.querySelector("#app").innerHTML=`
  <div class="main-layout">
    <header>
      <h1>Audio Visualizer</h1>
      <p>Click start and speak or play music</p>
    </header>

    <div class="visualizer-container">
      <canvas id="canvas"></canvas>
    </div>

    <div class="controls">
      <button id="toggle">Start Visualizer</button>
    </div>
  </div>
`;const s=document.getElementById("canvas"),t=s.getContext("2d"),y=document.getElementById("toggle");let p,l,f,v,S,h=!1,b=0;function x(){const n=Math.min(window.innerWidth*.8,500);s.width=n,s.height=n}window.addEventListener("resize",x);x();y.addEventListener("click",async()=>{if(h){cancelAnimationFrame(S),h=!1,y.innerText="Start Visualizer";return}try{const n=await navigator.mediaDevices.getUserMedia({audio:!0});p=new(window.AudioContext||window.webkitAudioContext),l=p.createAnalyser(),l.fftSize=512,l.smoothingTimeConstant=.8,p.createMediaStreamSource(n).connect(l),v=l.frequencyBinCount,f=new Uint8Array(v),h=!0,y.innerText="Stop Visualizer",M()}catch(n){console.error("Audio error:",n),alert("Please allow microphone access to see the visualizer.")}});function M(){if(!h)return;S=requestAnimationFrame(M),l.getByteFrequencyData(f);const n=s.width/2,o=s.height/2,m=s.width*.25;t.fillStyle="#1a1a1a",t.fillRect(0,0,s.width,s.height);let d=0;for(let r=0;r<10;r++)d+=f[r];let i=d/10/255*30,a=m+i;const c=120,A=Math.PI*2/c;for(let r=0;r<c;r++){let C=r>c/2?c-r:r;const z=Math.floor(C/(c/2)*(v*.6)),w=(f[z]||0)/255*(s.width*.25)+5,u=r*A+b,L=n+Math.cos(u)*a,P=o+Math.sin(u)*a,I=n+Math.cos(u)*(a+w),O=o+Math.sin(u)*(a+w);t.strokeStyle=`hsl(${r/c*360}, 80%, 60%)`,t.lineWidth=4,t.lineCap="round",t.beginPath(),t.moveTo(L,P),t.lineTo(I,O),t.stroke()}const g=t.createRadialGradient(n,o,0,n,o,a);g.addColorStop(0,"rgba(0, 210, 255, 0.3)"),g.addColorStop(1,"transparent"),t.fillStyle=g,t.beginPath(),t.arc(n,o,a,0,Math.PI*2),t.fill(),b+=.005}
