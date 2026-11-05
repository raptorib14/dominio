import{$ as e,A as t,B as n,C as r,D as i,E as a,F as o,G as s,H as c,I as l,J as u,K as d,L as f,M as p,N as m,O as h,P as g,Q as _,R as v,S as y,T as b,U as x,V as S,W as C,X as w,Y as T,Z as E,_ as D,a as ee,at as O,b as te,c as ne,ct as re,d as ie,et as k,f as A,g as ae,h as oe,i as se,it as j,j as M,k as N,l as ce,lt as le,m as ue,n as de,nt as fe,o as pe,ot as me,p as he,r as P,rt as ge,s as _e,st as ve,t as ye,tt as F,u as be,v as xe,w as Se,x as Ce,y as we,z as Te}from"./index-Dvr3AUJC.js";function Ee(e,t=!1){let n=e[0].index!==null,r=new Set(Object.keys(e[0].attributes)),i=new Set(Object.keys(e[0].morphAttributes)),a={},o={},s=e[0].morphTargetsRelative,c=new ee;c.morphTargetsRelative=s;let l=0;for(let u=0;u<e.length;++u){let d=e[u],f=0,p=0;if(n!==(d.index!==null))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.`),null;for(let e in d.attributes){if(!r.has(e))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure "`+e+`" attribute exists among all geometries, or in none of them.`),null;a[e]===void 0&&(a[e]=[]),a[e].push(d.attributes[e]),f++}if(f!==r.size)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. Make sure all geometries have the same number of attributes.`),null;if(s!==d.morphTargetsRelative)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. .morphTargetsRelative must be consistent throughout all geometries.`),null;for(let t in d.morphAttributes){if(!i.has(t))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`.  .morphAttributes must be consistent throughout all geometries.`),null;if(d.morphAttributes[t].length!==e[0].morphAttributes[t].length)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have the same number of morph targets for the "`+t+`" morph attribute.`),null;o[t]===void 0&&(o[t]=[]),o[t].push(d.morphAttributes[t]),p++}if(p!==i.size)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. Make sure all geometries have the same number of morph attributes.`),null;if(t){let e;if(n)e=d.index.count;else if(d.attributes.position!==void 0)e=d.attributes.position.count;else return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. The geometry must have either an index or a position attribute`),null;c.addGroup(l,e,u),l+=e}}if(n){let t=0,n=[];for(let r=0;r<e.length;++r){let i=e[r].index;for(let e=0;e<i.count;++e)n.push(i.getX(e)+t);t+=e[r].attributes.position.count}c.setIndex(n)}for(let e in a){let t=I(a[e]);if(!t)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` attribute.`),null;c.setAttribute(e,t)}for(let e in o){let t=o[e][0].length;if(t!==0){c.morphAttributes=c.morphAttributes||{},c.morphAttributes[e]=[];for(let n=0;n<t;++n){let t=[];for(let r=0;r<o[e].length;++r)t.push(o[e][r][n]);let r=I(t);if(!r)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` morphAttribute.`),null;c.morphAttributes[e].push(r)}}}return c}function I(e){let t,n,r,i=-1,a=0;for(let o=0;o<e.length;++o){let s=e[o];if(t===void 0&&(t=s.array.constructor),t!==s.array.constructor)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.`),null;if(n===void 0&&(n=s.itemSize),n!==s.itemSize)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.`),null;if(r===void 0&&(r=s.normalized),r!==s.normalized)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.`),null;if(i===-1&&(i=s.gpuType),i!==s.gpuType)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes.`),null;a+=s.count*n}let o=new t(a),s=new se(o,n,r),c=0;for(let t=0;t<e.length;++t){let r=e[t];if(r.isInterleavedBufferAttribute){let e=c/n;for(let t=0,i=r.count;t<i;t++)for(let i=0;i<n;i++){let n=r.getComponent(t,i);s.setComponent(t+e,i,n)}}else o.set(r.array,c);c+=r.count*n}return i!==void 0&&(s.gpuType=i),s}var De=class extends u{constructor(){super(),this.name=`RoomEnvironment`,this.position.y=-3.5;let e=new P;e.deleteAttribute(`uv`);let t=new p({side:1}),n=new p,r=new Te(16777215,900,28,2);r.position.set(.418,16.199,.3),this.add(r);let i=new h(e,t);i.position.set(-.757,13.219,.717),i.scale.set(31.713,28.305,28.591),this.add(i);let a=new Se(e,n,6),o=new g;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);let s=new h(e,L(50));s.position.set(-16.116,14.37,8.208),s.scale.set(.1,2.428,2.739),this.add(s);let c=new h(e,L(50));c.position.set(-16.109,18.021,-8.207),c.scale.set(.1,2.425,2.751),this.add(c);let l=new h(e,L(17));l.position.set(14.904,12.198,-1.832),l.scale.set(.15,4.265,6.331),this.add(l);let u=new h(e,L(43));u.position.set(-.462,8.89,14.52),u.scale.set(4.38,5.441,.088),this.add(u);let d=new h(e,L(20));d.position.set(3.235,11.486,-12.541),d.scale.set(2.5,2,.1),this.add(d);let f=new h(e,L(100));f.position.set(0,20,0),f.scale.set(1,.1,1),this.add(f)}dispose(){let e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(let t of e)t.dispose()}};function L(e){return new t({color:0,emissive:16777215,emissiveIntensity:e})}var Oe=class extends he{constructor(e){super(e),this.type=y}parse(e){let t=function(e,t){switch(e){case 1:throw Error(`THREE.HDRLoader: Read Error: `+(t||``));case 2:throw Error(`THREE.HDRLoader: Write Error: `+(t||``));case 3:throw Error(`THREE.HDRLoader: Bad File Format: `+(t||``));default:case 4:throw Error(`THREE.HDRLoader: Memory Error: `+(t||``))}},n=function(e,t,n){t||=1024;let r=e.pos,i=-1,a=0,o=``,s=String.fromCharCode.apply(null,new Uint16Array(e.subarray(r,r+128)));for(;0>(i=s.indexOf(`
`))&&a<t&&r<e.byteLength;)o+=s,a+=s.length,r+=128,s=String.fromCharCode.apply(null,new Uint16Array(e.subarray(r,r+128)));return-1<i&&(!1!==n&&(e.pos+=a+i+1),o+s.slice(0,i))},r=function(e){let r=/^#\?(\S+)/,i=/^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,a=/^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,o=/^\s*FORMAT=(\S+)\s*$/,s=/^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,c={valid:0,string:``,comments:``,programtype:`RGBE`,format:``,gamma:1,exposure:1,width:0,height:0},l,u;for((e.pos>=e.byteLength||!(l=n(e)))&&t(1,`no header found`),(u=l.match(r))||t(3,`bad initial token`),c.valid|=1,c.programtype=u[1],c.string+=l+`
`;l=n(e),!1!==l;)if(c.string+=l+`
`,l.charAt(0)===`#`)c.comments+=l+`
`;else if((u=l.match(i))&&(c.gamma=parseFloat(u[1])),(u=l.match(a))&&(c.exposure=parseFloat(u[1])),(u=l.match(o))&&(c.valid|=2,c.format=u[1]),(u=l.match(s))&&(c.valid|=4,c.height=parseInt(u[1],10),c.width=parseInt(u[2],10)),c.valid&2&&c.valid&4)break;return c.valid&2||t(3,`missing format specifier`),c.valid&4||t(3,`missing image size specifier`),c},i=function(e,n,r){let i=n;if(i<8||i>32767||e[0]!==2||e[1]!==2||e[2]&128)return new Uint8Array(e);i!==(e[2]<<8|e[3])&&t(3,`wrong scanline width`);let a=new Uint8Array(4*n*r);a.length||t(4,`unable to allocate buffer space`);let o=0,s=0,c=4*i,l=new Uint8Array(4),u=new Uint8Array(c),d=r;for(;d>0&&s<e.byteLength;){s+4>e.byteLength&&t(1),l[0]=e[s++],l[1]=e[s++],l[2]=e[s++],l[3]=e[s++],(l[0]!=2||l[1]!=2||(l[2]<<8|l[3])!=i)&&t(3,`bad rgbe scanline format`);let n=0,r;for(;n<c&&s<e.byteLength;){r=e[s++];let i=r>128;if(i&&(r-=128),(r===0||n+r>c)&&t(3,`bad scanline data`),i){let t=e[s++];for(let e=0;e<r;e++)u[n++]=t}else u.set(e.subarray(s,s+r),n),n+=r,s+=r}let f=i;for(let e=0;e<f;e++){let t=0;a[o]=u[e+t],t+=i,a[o+1]=u[e+t],t+=i,a[o+2]=u[e+t],t+=i,a[o+3]=u[e+t],o+=4}d--}return a},o=function(e,t,n,r){let i=2**(e[t+3]-128)/255;n[r+0]=e[t+0]*i,n[r+1]=e[t+1]*i,n[r+2]=e[t+2]*i,n[r+3]=1},s=function(e,t,n,r){let i=2**(e[t+3]-128)/255;n[r+0]=ue.toHalfFloat(Math.min(e[t+0]*i,65504)),n[r+1]=ue.toHalfFloat(Math.min(e[t+1]*i,65504)),n[r+2]=ue.toHalfFloat(Math.min(e[t+2]*i,65504)),n[r+3]=ue.toHalfFloat(1)},c=new Uint8Array(e);c.pos=0;let l=r(c),u=l.width,d=l.height,f=i(c.subarray(c.pos),u,d),p,m,h;switch(this.type){case we:h=f.length/4;let e=new Float32Array(h*4);for(let t=0;t<h;t++)o(f,t*4,e,t*4);p=e,m=we;break;case y:h=f.length/4;let t=new Uint16Array(h*4);for(let e=0;e<h;e++)s(f,e*4,t,e*4);p=t,m=y;break;default:throw Error(`THREE.HDRLoader: Unsupported type: `+this.type)}return{width:u,height:d,data:p,header:l.string,gamma:l.gamma,exposure:l.exposure,type:m,colorSpace:a,minFilter:b,magFilter:b,generateMipmaps:!1,flipY:!0}}setDataType(e){return this.type=e,this}};function ke(){let e=null,t=null,n=null,r=null,i=!1,a=.85,o=!1;function s(){if(e)return e;e=new(window.AudioContext||window.webkitAudioContext)({latencyHint:`interactive`}),t=e.createGain(),t.gain.value=i?0:a,n=e.createGain(),n.gain.value=1,n.connect(t),t.connect(e.destination);let o=e.sampleRate;r=e.createBuffer(1,o,e.sampleRate);let s=r.getChannelData(0);for(let e=0;e<o;e++)s[e]=Math.random()*2-1;return e}function c(){let t=s();if(t.state===`suspended`&&t.resume(),!o&&r&&n&&e){o=!0;let t=e.createBufferSource();t.buffer=r,t.loop=!0;let i=e.createBiquadFilter();i.type=`lowpass`,i.frequency.value=320;let a=e.createGain();a.gain.value=.018,t.connect(i),i.connect(a),a.connect(n),t.start()}}function l(n){i=n,t&&e&&t.gain.setTargetAtTime(n?0:a,e.currentTime,.03)}function u(n){a=Math.max(0,Math.min(1,n)),t&&e&&!i&&t.gain.setTargetAtTime(a,e.currentTime,.03)}function d(t,r,a,o,s,c=0){if(!e||!n||i)return;let l=e.currentTime,u=e.createOscillator(),d=e.createGain();u.type=a,u.frequency.setValueAtTime(t,l),s&&u.frequency.exponentialRampToValueAtTime(Math.max(40,s),l+r),d.gain.setValueAtTime(o,l),d.gain.exponentialRampToValueAtTime(1e-4,l+r);let f=e.createStereoPanner();f.pan.value=Math.max(-1,Math.min(1,c)),u.connect(d),d.connect(f),f.connect(n),u.start(l),u.stop(l+r+.02),u.onended=()=>{u.disconnect(),d.disconnect(),f.disconnect()}}function f(t,a,o,s,c=0){if(!e||!n||!r||i)return;let l=e.currentTime,u=e.createBufferSource();u.buffer=r;let d=e.createBiquadFilter();d.type=`bandpass`,d.frequency.value=t,d.Q.value=a;let f=e.createGain();f.gain.setValueAtTime(s,l),f.gain.exponentialRampToValueAtTime(1e-4,l+o);let p=e.createStereoPanner();p.pan.value=Math.max(-1,Math.min(1,c)),u.connect(d),d.connect(f),f.connect(p),p.connect(n),u.start(l),u.stop(l+o+.02),u.onended=()=>{u.disconnect(),d.disconnect(),f.disconnect(),p.disconnect()}}return{unlock:c,setMuted:l,setVolume:u,shot(e=1,t=0,n=`rifle`){c();let r=e*(.9+Math.random()*.15);n===`shot`?(f(180,.45,.2,.62*r,t),f(640,.7,.07,.28*r,t),d(80,.18,`triangle`,.32*r,36,t)):n===`smg`?(f(1900+Math.random()*300,.85,.04,.3*r,t),d(240,.045,`triangle`,.1*r,90,t)):n===`pistol`?(f(1500,1.15,.055,.38*r,t),d(260,.07,`triangle`,.16*r,70,t),d(1900,.02,`square`,.035*r,700,t)):n===`dmr`?(f(820,.55,.13,.48*r,t),d(100,.16,`triangle`,.3*r,42,t),d(2300,.035,`square`,.05*r,420,t)):(f(1400+Math.random()*400,.7,.09,.55*r,t),d(160+Math.random()*30,.12,`triangle`,.28*r,55,t),d(2200,.03,`square`,.05*r,800,t))},hit(e){c(),f(e?2800:1800,2.4,.05,e?.28:.16),d(e?880:520,.06,`square`,e?.08:.04,200)},hurt(){c(),f(240,.6,.18,.35),d(90,.2,`sawtooth`,.12,40)},reload(){c(),d(420,.05,`square`,.05,180),window.setTimeout(()=>d(640,.04,`square`,.04,300),160),window.setTimeout(()=>f(900,1.2,.04,.08),280)},empty(){c(),d(180,.03,`square`,.06,80)},secure(){c(),d(523,.08,`triangle`,.08),window.setTimeout(()=>d(784,.12,`triangle`,.08),90)},blip(){c(),d(660,.05,`sine`,.04)},down(){c(),d(220,.1,`triangle`,.07,110)}}}var Ae={name:`CopyShader`,uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`},je=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error(`THREE.Pass: .render() must be implemented in derived pass.`)}dispose(){}},R=new l(-1,1,1,-1,0,1),Me=new class extends ee{constructor(){super(),this.setAttribute(`position`,new xe([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute(`uv`,new xe([0,2,0,0,2,0],2))}},z=class{constructor(e){this._mesh=new h(Me,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,R)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}},Ne=class extends je{constructor(e,t=`tDiffuse`){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof T?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=F.clone(e.uniforms),this.material=new T({name:e.name===void 0?`unspecified`:e.name,defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new z(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},Pe=class extends je{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let r=e.getContext(),i=e.state;i.buffers.color.setMask(!1),i.buffers.depth.setMask(!1),i.buffers.color.setLocked(!0),i.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),i.buffers.stencil.setTest(!0),i.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),i.buffers.stencil.setFunc(r.ALWAYS,a,4294967295),i.buffers.stencil.setClear(o),i.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),i.buffers.color.setLocked(!1),i.buffers.depth.setLocked(!1),i.buffers.color.setMask(!0),i.buffers.depth.setMask(!0),i.buffers.stencil.setLocked(!1),i.buffers.stencil.setFunc(r.EQUAL,1,4294967295),i.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),i.buffers.stencil.setLocked(!0)}},B=class extends je{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}},V=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new j);this._width=n.width,this._height=n.height,t=new me(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:y}),t.texture.name=`EffectComposer.rt1`}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name=`EffectComposer.rt2`,this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Ne(Ae),this.copyPass.material.blending=0,this.timer=new k}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let t=0,r=this.passes.length;t<r;t++){let r=this.passes[t];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(t),r.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),r.needsSwap){if(n){let t=this.renderer.getContext(),n=this.renderer.state.buffers.stencil;n.setFunc(t.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),n.setFunc(t.EQUAL,1,4294967295)}this.swapBuffers()}Pe!==void 0&&(r instanceof Pe?n=!0:r instanceof B&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new j);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(n,r),this.renderTarget2.setSize(n,r);for(let e=0;e<this.passes.length;e++)this.passes[e].setSize(n,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}},Fe=class extends je{constructor(e,t,n=null,r=null,i=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=r,this.clearAlpha=i,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new ne}render(e,t,n){let r=e.autoClear;e.autoClear=!1;let i,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(i=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==1&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(i),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=r}},Ie={name:`LuminosityHighPassShader`,uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new ne(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`},Le=class e extends je{constructor(e,t=1,n,r){super(),this.strength=t,this.radius=n,this.threshold=r,this.resolution=e===void 0?new j(256,256):new j(e.x,e.y),this.clearColor=new ne(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new me(i,a,{type:y,depthBuffer:!1}),this.renderTargetBright.texture.name=`UnrealBloomPass.bright`,this.renderTargetBright.texture.generateMipmaps=!1;for(let e=0;e<this.nMips;e++){let t=new me(i,a,{type:y,depthBuffer:!1});t.texture.name=`UnrealBloomPass.h`+e,t.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(t);let n=new me(i,a,{type:y,depthBuffer:!1});n.texture.name=`UnrealBloomPass.v`+e,n.texture.generateMipmaps=!1,this.renderTargetsVertical.push(n),i=Math.round(i/2),a=Math.round(a/2)}let o=Ie;this.highPassUniforms=F.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=r,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new T({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];let s=[6,10,14,18,22];i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let e=0;e<this.nMips;e++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(s[e])),this.separableBlurMaterials[e].uniforms.invSize.value=new j(1/i,1/a),i=Math.round(i/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new O(1,1,1),new O(1,1,1),new O(1,1,1),new O(1,1,1),new O(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=F.clone(Ae.uniforms),this.blendMaterial=new T({uniforms:this.copyUniforms,vertexShader:Ae.vertexShader,fragmentShader:Ae.fragmentShader,premultipliedAlpha:!0,blending:2,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new ne,this._oldClearAlpha=1,this._basic=new N,this._fsQuad=new z(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),r=Math.round(t/2);this.renderTargetBright.setSize(n,r);for(let e=0;e<this.nMips;e++)this.renderTargetsHorizontal[e].setSize(n,r),this.renderTargetsVertical[e].setSize(n,r),this.separableBlurMaterials[e].uniforms.invSize.value=new j(1/n,1/r),n=Math.round(n/2),r=Math.round(r/2)}render(t,n,r,i,a){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();let o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),a&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=r.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=r.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let s=this.renderTargetBright;for(let n=0;n<this.nMips;n++)this._fsQuad.material=this.separableBlurMaterials[n],this.separableBlurMaterials[n].uniforms.colorTexture.value=s.texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[n]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[n].uniforms.colorTexture.value=this.renderTargetsHorizontal[n].texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[n]),t.clear(),this._fsQuad.render(t),s=this.renderTargetsVertical[n];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(r),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=o}_getSeparableBlurMaterial(e){let t=[],n=e/3;for(let r=0;r<e;r++)t.push(.39894*Math.exp(-.5*r*r/(n*n))/n);let r=[],i=[];for(let n=1;n<e;n+=2){let a=t[n],o=n+1<e?t[n+1]:0,s=a+o;r.push((n*a+(n+1)*o)/s),i.push(s)}return new T({defines:{KERNEL_PAIRS:r.length},uniforms:{colorTexture:{value:null},invSize:{value:new j(.5,.5)},direction:{value:new j(.5,.5)},centerWeight:{value:t[0]},gaussianOffsets:{value:r},gaussianWeights:{value:i}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float centerWeight;
				uniform float gaussianOffsets[KERNEL_PAIRS];
				uniform float gaussianWeights[KERNEL_PAIRS];

				void main() {

					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * centerWeight;

					for ( int i = 0; i < KERNEL_PAIRS; i ++ ) {

						vec2 uvOffset = direction * invSize * gaussianOffsets[ i ];
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * gaussianWeights[ i ];

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new T({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}};Le.BlurDirectionX=new j(1,0),Le.BlurDirectionY=new j(0,1);var Re={name:`OutputShader`,uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`},ze=class extends je{constructor(){super(),this.isOutputPass=!0,this.uniforms=F.clone(Re.uniforms),this.material=new x({name:Re.name,uniforms:this.uniforms,vertexShader:Re.vertexShader,fragmentShader:Re.fragmentShader}),this._fsQuad=new z(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},ce.getTransfer(this._outputColorSpace)===`srgb`&&(this.material.defines.SRGB_TRANSFER=``),this._toneMapping===1?this.material.defines.LINEAR_TONE_MAPPING=``:this._toneMapping===2?this.material.defines.REINHARD_TONE_MAPPING=``:this._toneMapping===3?this.material.defines.CINEON_TONE_MAPPING=``:this._toneMapping===4?this.material.defines.ACES_FILMIC_TONE_MAPPING=``:this._toneMapping===6?this.material.defines.AGX_TONE_MAPPING=``:this._toneMapping===7?this.material.defines.NEUTRAL_TONE_MAPPING=``:this._toneMapping===5&&(this.material.defines.CUSTOM_TONE_MAPPING=``),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},Be={name:`GTAOShader`,defines:{PERSPECTIVE_CAMERA:1,SAMPLES:16,NORMAL_VECTOR_TYPE:1,SCREEN_SPACE_RADIUS:0,SCREEN_SPACE_RADIUS_SCALE:100,SCENE_CLIP_BOX:0},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new j},cameraNear:{value:null},cameraFar:{value:null},cameraProjectionMatrix:{value:new i},cameraProjectionMatrixInverse:{value:new i},cameraWorldMatrix:{value:new i},radius:{value:.25},distanceExponent:{value:1},thickness:{value:1},distanceFallOff:{value:1},scale:{value:1},sceneBoxMin:{value:new O(-1,-1,-1)},sceneBoxMax:{value:new O(1,1,1)}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		varying vec2 vUv;
		uniform highp sampler2D tNormal;
		uniform highp sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform float cameraNear;
		uniform float cameraFar;
		uniform mat4 cameraProjectionMatrix;
		uniform mat4 cameraProjectionMatrixInverse;
		uniform mat4 cameraWorldMatrix;
		uniform float radius;
		uniform float distanceExponent;
		uniform float thickness;
		uniform float distanceFallOff;
		uniform float scale;
		#if SCENE_CLIP_BOX == 1
			uniform vec3 sceneBoxMin;
			uniform vec3 sceneBoxMax;
		#endif

		#include <common>
		#include <packing>

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(vec3(ao), 1.)
		#endif

		vec3 getViewPosition( const in vec2 screenPosition, const in float depth ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				vec4 clipSpacePosition = vec4( vec2( screenPosition ) * 2.0 - 1.0, depth, 1.0 );
			#else
				vec4 clipSpacePosition = vec4( vec3( screenPosition, depth ) * 2.0 - 1.0, 1.0 );
			#endif
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}

		float getDepth(const vec2 uv) {
			return textureLod(tDepth, uv.xy, 0.0).r;
		}

		float fetchDepth(const ivec2 uv) {
			return texelFetch(tDepth, uv.xy, 0).r;
		}

		float getViewZ(const in float depth) {
			#if PERSPECTIVE_CAMERA == 1
				return perspectiveDepthToViewZ(depth, cameraNear, cameraFar);
			#else
				return orthographicDepthToViewZ(depth, cameraNear, cameraFar);
			#endif
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
			vec2 size = vec2(textureSize(tDepth, 0));
			ivec2 p = ivec2(uv * size);
			float c0 = fetchDepth(p);
			float l2 = fetchDepth(p - ivec2(2, 0));
			float l1 = fetchDepth(p - ivec2(1, 0));
			float r1 = fetchDepth(p + ivec2(1, 0));
			float r2 = fetchDepth(p + ivec2(2, 0));
			float b2 = fetchDepth(p - ivec2(0, 2));
			float b1 = fetchDepth(p - ivec2(0, 1));
			float t1 = fetchDepth(p + ivec2(0, 1));
			float t2 = fetchDepth(p + ivec2(0, 2));
			float dl = abs((2.0 * l1 - l2) - c0);
			float dr = abs((2.0 * r1 - r2) - c0);
			float db = abs((2.0 * b1 - b2) - c0);
			float dt = abs((2.0 * t1 - t2) - c0);
			vec3 ce = getViewPosition(uv, c0).xyz;
			vec3 dpdx = (dl < dr) ? ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz : -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
			vec3 dpdy = (db < dt) ? ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz : -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
			return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
			#if NORMAL_VECTOR_TYPE == 2
				return normalize(textureLod(tNormal, uv, 0.).rgb);
			#elif NORMAL_VECTOR_TYPE == 1
				return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
			#else
				return computeNormalFromDepth(uv);
			#endif
		}

		vec3 getSceneUvAndDepth(vec3 sampleViewPos) {
			vec4 sampleClipPos = cameraProjectionMatrix * vec4(sampleViewPos, 1.);
			vec2 sampleUv = sampleClipPos.xy / sampleClipPos.w * 0.5 + 0.5;
			float sampleSceneDepth = getDepth(sampleUv);
			return vec3(sampleUv, sampleSceneDepth);
		}

		void main() {
			float depth = getDepth(vUv.xy);

			#ifdef USE_REVERSED_DEPTH_BUFFER
				if (depth <= 0.0) {
					discard;
					return;
				}
			#else
				if (depth >= 1.0) {
					discard;
					return;
				}
			#endif
			
			vec3 viewPos = getViewPosition(vUv, depth);
			vec3 viewNormal = getViewNormal(vUv);

			float radiusToUse = radius;
			float distanceFalloffToUse = thickness;
			#if SCREEN_SPACE_RADIUS == 1
				float radiusScale = getViewPosition(vec2(0.5 + float(SCREEN_SPACE_RADIUS_SCALE) / resolution.x, 0.0), depth).x;
				radiusToUse *= radiusScale;
				distanceFalloffToUse *= radiusScale;
			#endif

			#if SCENE_CLIP_BOX == 1
				vec3 worldPos = (cameraWorldMatrix * vec4(viewPos, 1.0)).xyz;
				float boxDistance = length(max(vec3(0.0), max(sceneBoxMin - worldPos, worldPos - sceneBoxMax)));
				if (boxDistance > radiusToUse) {
					discard;
					return;
				}
			#endif

			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
			vec3 randomVec = noiseTexel.xyz * 2.0 - 1.0;
			vec3 tangent = normalize(vec3(randomVec.xy, 0.));
			vec3 bitangent = vec3(-tangent.y, tangent.x, 0.);
			mat3 kernelMatrix = mat3(tangent, bitangent, vec3(0., 0., 1.));

			const int DIRECTIONS = SAMPLES < 30 ? 3 : 5;
			const int STEPS = (SAMPLES + DIRECTIONS - 1) / DIRECTIONS;
			float ao = 0.0;
			for (int i = 0; i < DIRECTIONS; ++i) {

				float angle = float(i) / float(DIRECTIONS) * PI;
				vec4 sampleDir = vec4(cos(angle), sin(angle), 0., 0.5 + 0.5 * noiseTexel.w);
				sampleDir.xyz = normalize(kernelMatrix * sampleDir.xyz);

				#if PERSPECTIVE_CAMERA == 1
					vec3 viewDir = normalize(-viewPos.xyz);
				#else
					vec3 viewDir = vec3(0., 0., 1.);
				#endif
				vec3 sliceBitangent = normalize(cross(sampleDir.xyz, viewDir));
				vec3 sliceTangent = cross(sliceBitangent, viewDir);
				vec3 normalInSlice = normalize(viewNormal - sliceBitangent * dot(viewNormal, sliceBitangent));

				vec3 tangentToNormalInSlice = cross(normalInSlice, sliceBitangent);
				vec2 cosHorizons = vec2(dot(viewDir, tangentToNormalInSlice), dot(viewDir, -tangentToNormalInSlice));

				for (int j = 0; j < STEPS; ++j) {
					vec3 sampleViewOffset = sampleDir.xyz * radiusToUse * sampleDir.w * pow(float(j + 1) / float(STEPS), distanceExponent);

					vec3 sampleSceneUvDepth = getSceneUvAndDepth(viewPos + sampleViewOffset);
					vec3 sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
					vec3 viewDelta = sampleSceneViewPos - viewPos;
					if (abs(viewDelta.z) < thickness) {
						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
						cosHorizons.x += max(0., (sampleCosHorizon - cosHorizons.x) * mix(1., 2. / float(j + 2), distanceFallOff));
					}

					sampleSceneUvDepth = getSceneUvAndDepth(viewPos - sampleViewOffset);
					sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
					viewDelta = sampleSceneViewPos - viewPos;
					if (abs(viewDelta.z) < thickness) {
						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
						cosHorizons.y += max(0., (sampleCosHorizon - cosHorizons.y) * mix(1., 2. / float(j + 2), distanceFallOff));
					}
				}

				vec2 sinHorizons = sqrt(1. - cosHorizons * cosHorizons);
				float nx = dot(normalInSlice, sliceTangent);
				float ny = dot(normalInSlice, viewDir);
				float nxb = 1. / 2. * (acos(cosHorizons.y) - acos(cosHorizons.x) + sinHorizons.x * cosHorizons.x - sinHorizons.y * cosHorizons.y);
				float nyb = 1. / 2. * (2. - cosHorizons.x * cosHorizons.x - cosHorizons.y * cosHorizons.y);
				float occlusion = nx * nxb + ny * nyb;
				ao += occlusion;
			}

			ao = clamp(ao / float(DIRECTIONS), 0., 1.);
		#if SCENE_CLIP_BOX == 1
			ao = mix(ao, 1., smoothstep(0., radiusToUse, boxDistance));
		#endif
			ao = pow(ao, scale);

			gl_FragColor = FRAGMENT_OUTPUT;
		}`},H={name:`GTAODepthShader`,defines:{PERSPECTIVE_CAMERA:1},uniforms:{tDepth:{value:null},cameraNear:{value:null},cameraFar:{value:null}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		uniform sampler2D tDepth;
		uniform float cameraNear;
		uniform float cameraFar;
		varying vec2 vUv;

		#include <packing>

		float getLinearDepth( const in vec2 screenPosition ) {
			#if PERSPECTIVE_CAMERA == 1
				float fragCoordZ = texture2D( tDepth, screenPosition ).x;
				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
			#else
				return texture2D( tDepth, screenPosition ).x;
			#endif
		}

		void main() {
			float depth = getLinearDepth( vUv );
			gl_FragColor = vec4( vec3( 1.0 - depth ), 1.0 );

		}`},Ve={name:`GTAOBlendShader`,uniforms:{tDiffuse:{value:null},intensity:{value:1}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		uniform float intensity;
		uniform sampler2D tDiffuse;
		varying vec2 vUv;

		void main() {
			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = vec4(mix(vec3(1.), texel.rgb, intensity), texel.a);
		}`};function He(e=5){let t=Math.floor(e)%2==0?Math.floor(e)+1:Math.floor(e),n=Ue(t),r=n.length,i=new Uint8Array(r*4);for(let e=0;e<r;++e){let t=n[e],a=2*Math.PI*t/r,o=new O(Math.cos(a),Math.sin(a),0).normalize();i[e*4]=(o.x*.5+.5)*255,i[e*4+1]=(o.y*.5+.5)*255,i[e*4+2]=127,i[e*4+3]=255}let a=new A(i,t,t);return a.wrapS=C,a.wrapT=C,a.needsUpdate=!0,a}function Ue(e){let t=Math.floor(e)%2==0?Math.floor(e)+1:Math.floor(e),n=t*t,r=Array(n).fill(0),i=Math.floor(t/2),a=t-1;for(let e=1;e<=n;)i===-1&&a===t?(a=t-2,i=0):(a===t&&(a=0),i<0&&(i=t-1)),r[i*t+a]===0?(r[i*t+a]=e++,a++,i--):(a-=2,i++);return r}var We={name:`PoissonDenoiseShader`,defines:{SAMPLES:16,SAMPLE_VECTORS:Ge(16,2,1),NORMAL_VECTOR_TYPE:1},uniforms:{tDiffuse:{value:null},tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new j},cameraProjectionMatrixInverse:{value:new i},lumaPhi:{value:5},depthPhi:{value:5},normalPhi:{value:5},radius:{value:4},index:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`

		varying vec2 vUv;

		uniform sampler2D tDiffuse;
		uniform sampler2D tNormal;
		uniform sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform mat4 cameraProjectionMatrixInverse;
		uniform float lumaPhi;
		uniform float depthPhi;
		uniform float normalPhi;
		uniform float radius;
		uniform int index;

		#include <common>
		#include <packing>

		#ifndef SAMPLE_LUMINANCE
		#define SAMPLE_LUMINANCE dot(vec3(0.2125, 0.7154, 0.0721), a)
		#endif

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(denoised, 1.)
		#endif

		float getLuminance(const in vec3 a) {
			return SAMPLE_LUMINANCE;
		}

		const vec3 poissonDisk[SAMPLES] = SAMPLE_VECTORS;

		vec3 getViewPosition( const in vec2 screenPosition, const in float depth ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				vec4 clipSpacePosition = vec4( vec2( screenPosition ) * 2.0 - 1.0, depth, 1.0 );
			#else
				vec4 clipSpacePosition = vec4( vec3( screenPosition, depth ) * 2.0 - 1.0, 1.0 );
			#endif
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}

		float getDepth(const vec2 uv) {
			return textureLod(tDepth, uv.xy, 0.0).r;
		}

		float fetchDepth(const ivec2 uv) {
			return texelFetch(tDepth, uv.xy, 0).r;
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
			vec2 size = vec2(textureSize(tDepth, 0));
			ivec2 p = ivec2(uv * size);
			float c0 = fetchDepth(p);
			float l2 = fetchDepth(p - ivec2(2, 0));
			float l1 = fetchDepth(p - ivec2(1, 0));
			float r1 = fetchDepth(p + ivec2(1, 0));
			float r2 = fetchDepth(p + ivec2(2, 0));
			float b2 = fetchDepth(p - ivec2(0, 2));
			float b1 = fetchDepth(p - ivec2(0, 1));
			float t1 = fetchDepth(p + ivec2(0, 1));
			float t2 = fetchDepth(p + ivec2(0, 2));
			float dl = abs((2.0 * l1 - l2) - c0);
			float dr = abs((2.0 * r1 - r2) - c0);
			float db = abs((2.0 * b1 - b2) - c0);
			float dt = abs((2.0 * t1 - t2) - c0);
			vec3 ce = getViewPosition(uv, c0).xyz;
			vec3 dpdx = (dl < dr) ?  ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz
									: -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
			vec3 dpdy = (db < dt) ?  ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz
									: -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
			return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
		#if NORMAL_VECTOR_TYPE == 2
			return normalize(textureLod(tNormal, uv, 0.).rgb);
		#elif NORMAL_VECTOR_TYPE == 1
			return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
		#else
			return computeNormalFromDepth(uv);
		#endif
		}

		void denoiseSample(in vec3 center, in vec3 viewNormal, in vec3 viewPos, in vec2 sampleUv, inout vec3 denoised, inout float totalWeight) {
			vec4 sampleTexel = textureLod(tDiffuse, sampleUv, 0.0);
			float sampleDepth = getDepth(sampleUv);
			vec3 sampleNormal = getViewNormal(sampleUv);
			vec3 neighborColor = sampleTexel.rgb;
			vec3 viewPosSample = getViewPosition(sampleUv, sampleDepth);

			float normalDiff = dot(viewNormal, sampleNormal);
			float normalSimilarity = pow(max(normalDiff, 0.), normalPhi);
			float lumaDiff = abs(getLuminance(neighborColor) - getLuminance(center));
			float lumaSimilarity = max(1.0 - lumaDiff / lumaPhi, 0.0);
			float depthDiff = abs(dot(viewPos - viewPosSample, viewNormal));
			float depthSimilarity = max(1. - depthDiff / depthPhi, 0.);
			float w = lumaSimilarity * depthSimilarity * normalSimilarity;

			denoised += w * neighborColor;
			totalWeight += w;
		}

		void main() {
			float depth = getDepth(vUv.xy);
			vec3 viewNormal = getViewNormal(vUv);
			if (depth == 1. || dot(viewNormal, viewNormal) == 0.) {
				discard;
				return;
			}
			vec4 texel = textureLod(tDiffuse, vUv, 0.0);
			vec3 center = texel.rgb;
			vec3 viewPos = getViewPosition(vUv, depth);

			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
      		vec2 noiseVec = vec2(sin(noiseTexel[index % 4] * 2. * PI), cos(noiseTexel[index % 4] * 2. * PI));
    		mat2 rotationMatrix = mat2(noiseVec.x, -noiseVec.y, noiseVec.x, noiseVec.y);

			float totalWeight = 1.0;
			vec3 denoised = texel.rgb;
			for (int i = 0; i < SAMPLES; i++) {
				vec3 sampleDir = poissonDisk[i];
				vec2 offset = rotationMatrix * (sampleDir.xy * (1. + sampleDir.z * (radius - 1.)) / resolution);
				vec2 sampleUv = vUv + offset;
				denoiseSample(center, viewNormal, viewPos, sampleUv, denoised, totalWeight);
			}

			if (totalWeight > 0.) {
				denoised /= totalWeight;
			}
			gl_FragColor = FRAGMENT_OUTPUT;
		}`};function Ge(e,t,n){let r=Ke(e,t,n),i=`vec3[SAMPLES](`;for(let t=0;t<e;t++){let n=r[t];i+=`vec3(${n.x}, ${n.y}, ${n.z})${t<e-1?`,`:`)`}`}return i}function Ke(e,t,n){let r=[];for(let i=0;i<e;i++){let a=2*Math.PI*t*i/e,o=(i/(e-1))**n;r.push(new O(Math.cos(a),Math.sin(a),o))}return r}var qe=class{constructor(e=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let t=0;t<256;t++)this.p[t]=Math.floor(e.random()*256);this.perm=[];for(let e=0;e<512;e++)this.perm[e]=this.p[e&255];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}noise(e,t){let n,r,i,a=.5*(Math.sqrt(3)-1),o=(e+t)*a,s=Math.floor(e+o),c=Math.floor(t+o),l=(3-Math.sqrt(3))/6,u=(s+c)*l,d=s-u,f=c-u,p=e-d,m=t-f,h,g;p>m?(h=1,g=0):(h=0,g=1);let _=p-h+l,v=m-g+l,y=p-1+2*l,b=m-1+2*l,x=s&255,S=c&255,C=this.perm[x+this.perm[S]]%12,w=this.perm[x+h+this.perm[S+g]]%12,T=this.perm[x+1+this.perm[S+1]]%12,E=.5-p*p-m*m;E<0?n=0:(E*=E,n=E*E*this._dot(this.grad3[C],p,m));let D=.5-_*_-v*v;D<0?r=0:(D*=D,r=D*D*this._dot(this.grad3[w],_,v));let ee=.5-y*y-b*b;return ee<0?i=0:(ee*=ee,i=ee*ee*this._dot(this.grad3[T],y,b)),70*(n+r+i)}noise3d(e,t,n){let r,i,a,o,s=(e+t+n)*(1/3),c=Math.floor(e+s),l=Math.floor(t+s),u=Math.floor(n+s),d=1/6,f=(c+l+u)*d,p=c-f,m=l-f,h=u-f,g=e-p,_=t-m,v=n-h,y,b,x,S,C,w;g>=_?_>=v?(y=1,b=0,x=0,S=1,C=1,w=0):g>=v?(y=1,b=0,x=0,S=1,C=0,w=1):(y=0,b=0,x=1,S=1,C=0,w=1):_<v?(y=0,b=0,x=1,S=0,C=1,w=1):g<v?(y=0,b=1,x=0,S=0,C=1,w=1):(y=0,b=1,x=0,S=1,C=1,w=0);let T=g-y+d,E=_-b+d,D=v-x+d,ee=g-S+2*d,O=_-C+2*d,te=v-w+2*d,ne=g-1+3*d,re=_-1+3*d,ie=v-1+3*d,k=c&255,A=l&255,ae=u&255,oe=this.perm[k+this.perm[A+this.perm[ae]]]%12,se=this.perm[k+y+this.perm[A+b+this.perm[ae+x]]]%12,j=this.perm[k+S+this.perm[A+C+this.perm[ae+w]]]%12,M=this.perm[k+1+this.perm[A+1+this.perm[ae+1]]]%12,N=.6-g*g-_*_-v*v;N<0?r=0:(N*=N,r=N*N*this._dot3(this.grad3[oe],g,_,v));let ce=.6-T*T-E*E-D*D;ce<0?i=0:(ce*=ce,i=ce*ce*this._dot3(this.grad3[se],T,E,D));let le=.6-ee*ee-O*O-te*te;le<0?a=0:(le*=le,a=le*le*this._dot3(this.grad3[j],ee,O,te));let ue=.6-ne*ne-re*re-ie*ie;return ue<0?o=0:(ue*=ue,o=ue*ue*this._dot3(this.grad3[M],ne,re,ie)),32*(r+i+a+o)}noise4d(e,t,n,r){let i=this.grad4,a=this.simplex,o=this.perm,s=(Math.sqrt(5)-1)/4,c=(5-Math.sqrt(5))/20,l,u,d,f,p,m=(e+t+n+r)*s,h=Math.floor(e+m),g=Math.floor(t+m),_=Math.floor(n+m),v=Math.floor(r+m),y=(h+g+_+v)*c,b=h-y,x=g-y,S=_-y,C=v-y,w=e-b,T=t-x,E=n-S,D=r-C,ee=w>T?32:0,O=w>E?16:0,te=T>E?8:0,ne=w>D?4:0,re=T>D?2:0,ie=+(E>D),k=ee+O+te+ne+re+ie,A=+(a[k][0]>=3),ae=+(a[k][1]>=3),oe=+(a[k][2]>=3),se=+(a[k][3]>=3),j=+(a[k][0]>=2),M=+(a[k][1]>=2),N=+(a[k][2]>=2),ce=+(a[k][3]>=2),le=+(a[k][0]>=1),ue=+(a[k][1]>=1),de=+(a[k][2]>=1),fe=+(a[k][3]>=1),pe=w-A+c,me=T-ae+c,he=E-oe+c,P=D-se+c,ge=w-j+2*c,_e=T-M+2*c,ve=E-N+2*c,ye=D-ce+2*c,F=w-le+3*c,be=T-ue+3*c,xe=E-de+3*c,Se=D-fe+3*c,Ce=w-1+4*c,we=T-1+4*c,Te=E-1+4*c,Ee=D-1+4*c,I=h&255,De=g&255,L=_&255,Oe=v&255,ke=o[I+o[De+o[L+o[Oe]]]]%32,Ae=o[I+A+o[De+ae+o[L+oe+o[Oe+se]]]]%32,je=o[I+j+o[De+M+o[L+N+o[Oe+ce]]]]%32,R=o[I+le+o[De+ue+o[L+de+o[Oe+fe]]]]%32,Me=o[I+1+o[De+1+o[L+1+o[Oe+1]]]]%32,z=.6-w*w-T*T-E*E-D*D;z<0?l=0:(z*=z,l=z*z*this._dot4(i[ke],w,T,E,D));let Ne=.6-pe*pe-me*me-he*he-P*P;Ne<0?u=0:(Ne*=Ne,u=Ne*Ne*this._dot4(i[Ae],pe,me,he,P));let Pe=.6-ge*ge-_e*_e-ve*ve-ye*ye;Pe<0?d=0:(Pe*=Pe,d=Pe*Pe*this._dot4(i[je],ge,_e,ve,ye));let B=.6-F*F-be*be-xe*xe-Se*Se;B<0?f=0:(B*=B,f=B*B*this._dot4(i[R],F,be,xe,Se));let V=.6-Ce*Ce-we*we-Te*Te-Ee*Ee;return V<0?p=0:(V*=V,p=V*V*this._dot4(i[Me],Ce,we,Te,Ee)),27*(l+u+d+f+p)}_dot(e,t,n){return e[0]*t+e[1]*n}_dot3(e,t,n,r){return e[0]*t+e[1]*n+e[2]*r}_dot4(e,t,n,r,i){return e[0]*t+e[1]*n+e[2]*r+e[3]*i}},Je=class e extends je{constructor(e,t,n=512,r=512,i,a,o){super(),this.width=n,this.height=r,this.clear=!0,this.camera=t,this.scene=e,this.output=0,this._renderGBuffer=!0,this._visibilityCache=[],this.blendIntensity=1,this.pdRings=2,this.pdRadiusExponent=2,this.pdSamples=16,this.gtaoNoiseTexture=He(),this.pdNoiseTexture=this._generateNoise(),this.gtaoRenderTarget=new me(this.width,this.height,{type:y,depthBuffer:!1}),this.pdRenderTarget=this.gtaoRenderTarget.clone(),this.gtaoMaterial=new T({defines:Object.assign({},Be.defines),uniforms:F.clone(Be.uniforms),vertexShader:Be.vertexShader,fragmentShader:Be.fragmentShader,blending:0,depthTest:!1,depthWrite:!1}),this.gtaoMaterial.defines.PERSPECTIVE_CAMERA=+!!this.camera.isPerspectiveCamera,this.gtaoMaterial.uniforms.tNoise.value=this.gtaoNoiseTexture,this.gtaoMaterial.uniforms.resolution.value.set(this.width,this.height),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.normalMaterial=new M,this.normalMaterial.blending=0,this.pdMaterial=new T({defines:Object.assign({},We.defines),uniforms:F.clone(We.uniforms),vertexShader:We.vertexShader,fragmentShader:We.fragmentShader,depthTest:!1,depthWrite:!1}),this.pdMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.pdMaterial.uniforms.tNoise.value=this.pdNoiseTexture,this.pdMaterial.uniforms.resolution.value.set(this.width,this.height),this.pdMaterial.uniforms.lumaPhi.value=10,this.pdMaterial.uniforms.depthPhi.value=2,this.pdMaterial.uniforms.normalPhi.value=3,this.pdMaterial.uniforms.radius.value=8,this.depthRenderMaterial=new T({defines:Object.assign({},H.defines),uniforms:F.clone(H.uniforms),vertexShader:H.vertexShader,fragmentShader:H.fragmentShader,blending:0}),this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.copyMaterial=new T({uniforms:F.clone(Ae.uniforms),vertexShader:Ae.vertexShader,fragmentShader:Ae.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blendSrc:208,blendDst:200,blendEquation:100,blendSrcAlpha:206,blendDstAlpha:200,blendEquationAlpha:100}),this.blendMaterial=new T({uniforms:F.clone(Ve.uniforms),vertexShader:Ve.vertexShader,fragmentShader:Ve.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blending:5,blendSrc:208,blendDst:200,blendEquation:100,blendSrcAlpha:206,blendDstAlpha:200,blendEquationAlpha:100}),this._fsQuad=new z(null),this._originalClearColor=new ne,this.setGBuffer(i?i.depthTexture:void 0,i?i.normalTexture:void 0),a!==void 0&&this.updateGtaoMaterial(a),o!==void 0&&this.updatePdMaterial(o)}setSize(e,t){this.width=e,this.height=t,this.gtaoRenderTarget.setSize(e,t),this.normalRenderTarget&&this.normalRenderTarget.setSize(e,t),this.pdRenderTarget.setSize(e,t),this.gtaoMaterial.uniforms.resolution.value.set(e,t),this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.pdMaterial.uniforms.resolution.value.set(e,t),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse)}dispose(){this.gtaoNoiseTexture.dispose(),this.pdNoiseTexture.dispose(),this.normalRenderTarget&&this.normalRenderTarget.dispose(),this.gtaoRenderTarget.dispose(),this.pdRenderTarget.dispose(),this.normalMaterial.dispose(),this.pdMaterial.dispose(),this.copyMaterial.dispose(),this.depthRenderMaterial.dispose(),this._fsQuad.dispose()}get gtaoMap(){return this.pdRenderTarget.texture}setGBuffer(e,t){if(e!==void 0)this.depthTexture=e,this.normalTexture=t,this._renderGBuffer=!1;else{if(this.normalRenderTarget===void 0){let e=new ae;e.format=oe,e.type=ge,this.normalRenderTarget=new me(this.width,this.height,{minFilter:m,magFilter:m,type:y,depthTexture:e})}this.depthTexture=this.normalRenderTarget.depthTexture,this.normalTexture=this.normalRenderTarget.texture,this._renderGBuffer=!0}let n=+!!this.normalTexture;this.gtaoMaterial.defines.NORMAL_VECTOR_TYPE=n,this.gtaoMaterial.needsUpdate=!0,this.gtaoMaterial.uniforms.tNormal.value=this.normalTexture,this.gtaoMaterial.uniforms.tDepth.value=this.depthTexture,this.pdMaterial.defines.NORMAL_VECTOR_TYPE=n,this.pdMaterial.needsUpdate=!0,this.pdMaterial.uniforms.tNormal.value=this.normalTexture,this.pdMaterial.uniforms.tDepth.value=this.depthTexture,this.depthRenderMaterial.uniforms.tDepth.value=this.depthTexture}setSceneClipBox(e){e?(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX!==1,this.gtaoMaterial.defines.SCENE_CLIP_BOX=1,this.gtaoMaterial.uniforms.sceneBoxMin.value.copy(e.min),this.gtaoMaterial.uniforms.sceneBoxMax.value.copy(e.max)):(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX===0,this.gtaoMaterial.defines.SCENE_CLIP_BOX=0)}updateGtaoMaterial(e){e.radius!==void 0&&(this.gtaoMaterial.uniforms.radius.value=e.radius),e.distanceExponent!==void 0&&(this.gtaoMaterial.uniforms.distanceExponent.value=e.distanceExponent),e.thickness!==void 0&&(this.gtaoMaterial.uniforms.thickness.value=e.thickness),e.distanceFallOff!==void 0&&(this.gtaoMaterial.uniforms.distanceFallOff.value=e.distanceFallOff,this.gtaoMaterial.needsUpdate=!0),e.scale!==void 0&&(this.gtaoMaterial.uniforms.scale.value=e.scale),e.samples!==void 0&&e.samples!==this.gtaoMaterial.defines.SAMPLES&&(this.gtaoMaterial.defines.SAMPLES=e.samples,this.gtaoMaterial.needsUpdate=!0),e.screenSpaceRadius!==void 0&&+!!e.screenSpaceRadius!==this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS&&(this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS=+!!e.screenSpaceRadius,this.gtaoMaterial.needsUpdate=!0)}updatePdMaterial(e){let t=!1;e.lumaPhi!==void 0&&(this.pdMaterial.uniforms.lumaPhi.value=e.lumaPhi),e.depthPhi!==void 0&&(this.pdMaterial.uniforms.depthPhi.value=e.depthPhi),e.normalPhi!==void 0&&(this.pdMaterial.uniforms.normalPhi.value=e.normalPhi),e.radius!==void 0&&e.radius!==this.radius&&(this.pdMaterial.uniforms.radius.value=e.radius),e.radiusExponent!==void 0&&e.radiusExponent!==this.pdRadiusExponent&&(this.pdRadiusExponent=e.radiusExponent,t=!0),e.rings!==void 0&&e.rings!==this.pdRings&&(this.pdRings=e.rings,t=!0),e.samples!==void 0&&e.samples!==this.pdSamples&&(this.pdSamples=e.samples,t=!0),t&&(this.pdMaterial.defines.SAMPLES=this.pdSamples,this.pdMaterial.defines.SAMPLE_VECTORS=Ge(this.pdSamples,this.pdRings,this.pdRadiusExponent),this.pdMaterial.needsUpdate=!0)}render(t,n,r){switch(this._renderGBuffer&&(this._overrideVisibility(),this._renderOverride(t,this.normalMaterial,this.normalRenderTarget,7829503,1),this._restoreVisibility()),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.gtaoMaterial.uniforms.cameraWorldMatrix.value.copy(this.camera.matrixWorld),this._renderPass(t,this.gtaoMaterial,this.gtaoRenderTarget,16777215,1),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this._renderPass(t,this.pdMaterial,this.pdRenderTarget,16777215,1),this.output){case e.OUTPUT.Off:break;case e.OUTPUT.Diffuse:this.copyMaterial.uniforms.tDiffuse.value=r.texture,this.copyMaterial.blending=0,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case e.OUTPUT.AO:this.copyMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.copyMaterial.blending=0,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case e.OUTPUT.Denoise:this.copyMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this.copyMaterial.blending=0,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case e.OUTPUT.Depth:this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this._renderPass(t,this.depthRenderMaterial,this.renderToScreen?null:n);break;case e.OUTPUT.Normal:this.copyMaterial.uniforms.tDiffuse.value=this.normalTexture||null,this.copyMaterial.blending=0,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case e.OUTPUT.Default:this.copyMaterial.uniforms.tDiffuse.value=r.texture,this.copyMaterial.blending=0,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n),this.blendMaterial.uniforms.intensity.value=this.blendIntensity,this.blendMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this._renderPass(t,this.blendMaterial,this.renderToScreen?null:n);break;default:console.warn(`THREE.GTAOPass: Unknown output type.`)}}_renderPass(e,t,n,r,i){e.getClearColor(this._originalClearColor);let a=e.getClearAlpha(),o=e.autoClear;e.setRenderTarget(n),e.autoClear=!1,r!=null&&(e.setClearColor(r),e.setClearAlpha(i||0),e.clear()),this._fsQuad.material=t,this._fsQuad.render(e),e.autoClear=o,e.setClearColor(this._originalClearColor),e.setClearAlpha(a)}_renderOverride(e,t,n,r,i){e.getClearColor(this._originalClearColor);let a=e.getClearAlpha(),o=e.autoClear;e.setRenderTarget(n),e.autoClear=!1,r=t.clearColor||r,i=t.clearAlpha||i,r!=null&&(e.setClearColor(r),e.setClearAlpha(i||0),e.clear()),this.scene.overrideMaterial=t,e.render(this.scene,this.camera),this.scene.overrideMaterial=null,e.autoClear=o,e.setClearColor(this._originalClearColor),e.setClearAlpha(a)}_overrideVisibility(){let e=this.scene,t=this._visibilityCache;e.traverse(function(e){(e.isPoints||e.isLine||e.isLine2)&&e.visible&&(e.visible=!1,t.push(e))})}_restoreVisibility(){let e=this._visibilityCache;for(let t=0;t<e.length;t++)e[t].visible=!0;e.length=0}_generateNoise(e=64){let t=new qe,n=e*e*4,r=new Uint8Array(n);for(let n=0;n<e;n++)for(let i=0;i<e;i++){let a=n,o=i;r[(n*e+i)*4]=(t.noise(a,o)*.5+.5)*255,r[(n*e+i)*4+1]=(t.noise(a+e,o)*.5+.5)*255,r[(n*e+i)*4+2]=(t.noise(a,o+e)*.5+.5)*255,r[(n*e+i)*4+3]=(t.noise(a+e,o+e)*.5+.5)*255}let i=new A(r,e,e,c,fe);return i.wrapS=C,i.wrapT=C,i.needsUpdate=!0,i}};Je.OUTPUT={Off:-1,Default:0,Diffuse:1,Depth:2,Normal:3,AO:4,Denoise:5};function Ye(e){let t=document.createElement(`canvas`);t.width=t.height=64;let n=t.getContext(`2d`),r=n.createRadialGradient(32,32,0,32,32,32);for(let[t,n]of e)r.addColorStop(t,n);n.fillStyle=r,n.fillRect(0,0,64,64);let i=new pe(t);return i.colorSpace=d,i}var Xe={uniforms:{tDiffuse:{value:null},uVig:{value:.32},uSat:{value:1.12},uHurt:{value:0}},vertexShader:`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,fragmentShader:`uniform sampler2D tDiffuse; uniform float uVig; uniform float uSat; uniform float uHurt; varying vec2 vUv;
  void main(){ vec4 c=texture2D(tDiffuse,vUv); float l=dot(c.rgb,vec3(0.299,0.587,0.114));
  c.rgb=mix(vec3(l),c.rgb,uSat); c.rgb*=vec3(1.02,1.0,0.97);
  float d=distance(vUv,vec2(0.5)); c.rgb*=1.0-uVig*smoothstep(0.35,0.85,d);
  c.rgb=mix(c.rgb,vec3(0.6,0.02,0.02),uHurt*smoothstep(0.3,0.8,d)*0.6); gl_FragColor=c; }`};function Ze(e,t,n){let r=Ye([[0,`rgba(255,255,255,1)`],[.25,`rgba(255,220,150,0.9)`],[1,`rgba(255,140,40,0)`]]),i=Ye([[0,`rgba(200,195,185,0.55)`],[.6,`rgba(160,155,145,0.22)`],[1,`rgba(140,135,125,0)`]]),a=Ye([[0,`rgba(255,250,235,1)`],[.12,`rgba(255,236,190,0.75)`],[.4,`rgba(255,210,140,0.18)`],[1,`rgba(255,200,120,0)`]]),o=(e,n)=>{let r=[];for(let i=0;i<e;i++){let e=new E(n.clone());e.visible=!1,e.renderOrder=5,t.add(e),r.push({s:e,vx:0,vy:0,vz:0,life:0,max:1,grow:0,drag:0,g:0,a0:1})}return r},s=o(48,new _({map:r,blending:2,depthWrite:!1,transparent:!0,color:16765066})),c=o(28,new _({map:i,depthWrite:!1,transparent:!0})),l=0,u=0,d=new E(new _({map:a,blending:2,depthWrite:!1,depthTest:!0,fog:!1,transparent:!0}));d.scale.setScalar(70),t.add(d);let f=new Te(16757850,0,9,2);t.add(f);let p=0;function m(e,t,n,r,i,a,o){let s=e[t%e.length];return s.s.position.set(n,r,i),s.s.scale.setScalar(o),s.s.visible=!0,s.life=s.max=a,s}let h=new O(.5,.8,.3).normalize(),g=!1,v={setLow(e){g=e},impact(e,t,n,r=0,i=1,a=0,o=!1){let d=g?3:6;for(let c=0;c<d;c++){let c=m(s,l++,e,t,n,.18+Math.random()*.2,.09+Math.random()*.07);c.vx=r*2+(Math.random()-.5)*4,c.vy=i*2+Math.random()*3,c.vz=a*2+(Math.random()-.5)*4,c.g=9,c.drag=1.5,c.grow=-.2,c.a0=1,c.s.material.color.setHex(o?16732224:16765066)}let f=m(s,l++,e+r*.05,t+i*.05,n+a*.05,.08,.5);if(f.vx=f.vy=f.vz=0,f.g=0,f.grow=2,f.a0=.9,f.s.material.color.setHex(o?16736336:16769184),!o){let o=m(c,u++,e+r*.1,t+i*.1,n+a*.1,.9+Math.random()*.5,.25);o.vx=r*.6+(Math.random()-.5)*.3,o.vy=.35+i*.4,o.vz=a*.6+(Math.random()-.5)*.3,o.g=0,o.drag=1.2,o.grow=.9,o.a0=.8}},burst(e,t,n){for(let r=0;r<(g?6:14);r++){let i=m(s,l++,e,t+Math.random()*1.2,n,.35+Math.random()*.3,.12+Math.random()*.1),a=Math.random()*Math.PI*2,o=1.5+Math.random()*3;i.vx=Math.cos(a)*o,i.vz=Math.sin(a)*o,i.vy=1+Math.random()*3,i.g=7,i.drag=1,i.grow=-.2,i.a0=1,i.s.material.color.setHex(r%3?16742976:16767120)}for(let r=0;r<(g?2:5);r++){let r=m(c,u++,e+(Math.random()-.5),t+.4+Math.random(),n+(Math.random()-.5),1.4+Math.random(),.6);r.vx=(Math.random()-.5)*.6,r.vy=.5,r.vz=(Math.random()-.5)*.6,r.g=0,r.drag=.8,r.grow=1.2,r.a0=.75}},muzzle(e,t,n,r=!1){f.position.set(e,t,n),f.intensity=r?9:6,p=.06},setSun(e){h.copy(e).normalize()},update(e){for(let t of[s,c])for(let n of t){if(n.life<=0)continue;if(n.life-=e,n.life<=0){n.s.visible=!1;continue}let t=Math.exp(-n.drag*e);n.vx*=t,n.vz*=t,n.vy=n.vy*t-n.g*e,n.s.position.x+=n.vx*e,n.s.position.y+=n.vy*e,n.s.position.z+=n.vz*e,n.s.position.y<.02&&n.g>0&&(n.s.position.y=.02,n.vy*=-.3),n.s.scale.multiplyScalar(Math.max(.2,1+n.grow*e)),n.s.material.opacity=n.a0*(n.life/n.max)}d.position.copy(n.position).addScaledVector(h,220),p>0&&(p-=e,p<=0&&(f.intensity=0))}},y=null,b=null,x=null,S=null,C=!1;function w(){if(y)return y;y=new V(e),y.addPass(new Fe(t,n));let r=e.getSize(new j);return S=new Je(t,n,r.x,r.y),S.updateGtaoMaterial({radius:.6,distanceExponent:1.4,thickness:1.2,scale:1.1,samples:12}),S.blendIntensity=.85,y.addPass(S),x=new Le(new j(r.x/2,r.y/2),.42,.5,.86),y.addPass(x),b=new Ne(Xe),y.addPass(b),y.addPass(new ze),y}return{...v,setPost(e){C=e,e&&w()},resize(t,n){y&&(y.setPixelRatio(e.getPixelRatio()),y.setSize(t,n),x?.setSize(t/2,n/2),S?.setSize(t,n))},setAo(e){S&&(S.enabled=e)},setHurt(e){b&&(b.uniforms.uHurt.value=e)},render(){C&&y?y.render():e.render(t,n)},postOn:()=>C,dispose(){y?.dispose(),r.dispose(),i.dispose(),a.dispose()}}}function Qe(){let e=document.createElement(`canvas`);e.width=e.height=128;let t=e.getContext(`2d`);t.translate(64,64),t.globalCompositeOperation=`lighter`;for(let e=0;e<7;e++){t.save(),t.rotate(e/7*Math.PI*2+e%2*.2);let n=e%2?40:62,r=t.createLinearGradient(0,0,n,0);r.addColorStop(0,`rgba(255,240,200,0.9)`),r.addColorStop(1,`rgba(255,150,40,0)`),t.fillStyle=r,t.beginPath(),t.moveTo(0,-7),t.lineTo(n,0),t.lineTo(0,7),t.fill(),t.restore()}let n=t.createRadialGradient(0,0,0,0,0,34);n.addColorStop(0,`rgba(255,255,240,1)`),n.addColorStop(.4,`rgba(255,210,120,0.8)`),n.addColorStop(1,`rgba(255,140,30,0)`),t.fillStyle=n,t.fillRect(-64,-64,128,128);let r=new pe(e);return r.colorSpace=d,r}var $e=210,et=1/60,tt=Math.PI/2-.04,nt=[{id:`rifle`,name:`R-47`,blurb:`FUSIL`,magSize:30,reserve:120,interval:.098,reloadTime:1.85,damage:26,head:100,pellets:1,spread:.0045,sprayGrow:.042,sprayAdd:.14,moveSpread:.0032,air:.026,adsTight:.62,recoil:.015,yawKick:.008,auto:!0,kick:1,fallStart:28,fallDist:40,fallMin:.72,adsFov:50,draw:.28},{id:`smg`,name:`VX-9`,blurb:`SUBFUSIL`,magSize:36,reserve:144,interval:.058,reloadTime:1.55,damage:15,head:36,pellets:1,spread:.014,sprayGrow:.055,sprayAdd:.1,moveSpread:.0045,air:.034,adsTight:.4,recoil:.008,yawKick:.012,auto:!0,kick:.62,fallStart:14,fallDist:22,fallMin:.45,adsFov:58,draw:.22},{id:`shot`,name:`SC-12`,blurb:`ESCOPETA`,magSize:6,reserve:30,interval:.72,reloadTime:2.35,damage:13,head:18,pellets:8,spread:.082,sprayGrow:.01,sprayAdd:.22,moveSpread:.004,air:.04,adsTight:.35,recoil:.042,yawKick:.02,auto:!1,kick:1.35,fallStart:7,fallDist:14,fallMin:.22,adsFov:64,draw:.34},{id:`pistol`,name:`P-19`,blurb:`PISTOLA`,magSize:15,reserve:60,interval:.18,reloadTime:1.2,damage:32,head:78,pellets:1,spread:.0028,sprayGrow:.018,sprayAdd:.16,moveSpread:.0022,air:.018,adsTight:.55,recoil:.017,yawKick:.006,auto:!1,kick:.78,fallStart:20,fallDist:34,fallMin:.58,adsFov:54,draw:.18},{id:`dmr`,name:`M-90`,blurb:`TIRADOR`,magSize:10,reserve:40,interval:.46,reloadTime:2.05,damage:70,head:140,pellets:1,spread:.0014,sprayGrow:.01,sprayAdd:.32,moveSpread:.0055,air:.048,adsTight:.88,recoil:.03,yawKick:.004,auto:!1,kick:1.12,fallStart:42,fallDist:55,fallMin:.86,adsFov:26,draw:.36},{id:`lmg`,name:`AM-60`,blurb:`AMETRALLADORA`,magSize:60,reserve:180,interval:.085,reloadTime:3.1,damage:23,head:70,pellets:1,spread:.007,sprayGrow:.05,sprayAdd:.09,moveSpread:.006,air:.04,adsTight:.55,recoil:.013,yawKick:.011,auto:!0,kick:1.05,fallStart:24,fallDist:36,fallMin:.66,adsFov:52,draw:.5,model:0,snd:`rifle`},{id:`revolver`,name:`RV-44`,blurb:`REVÓLVER`,magSize:6,reserve:36,interval:.42,reloadTime:1.9,damage:55,head:120,pellets:1,spread:.0022,sprayGrow:.02,sprayAdd:.3,moveSpread:.0026,air:.02,adsTight:.6,recoil:.034,yawKick:.01,auto:!1,kick:1.2,fallStart:22,fallDist:30,fallMin:.6,adsFov:52,draw:.24,model:3,snd:`dmr`},{id:`carbine`,name:`K-4`,blurb:`CARABINA`,magSize:25,reserve:100,interval:.075,reloadTime:1.6,damage:21,head:64,pellets:1,spread:.006,sprayGrow:.045,sprayAdd:.12,moveSpread:.0035,air:.03,adsTight:.58,recoil:.011,yawKick:.009,auto:!0,kick:.8,fallStart:22,fallDist:30,fallMin:.6,adsFov:54,draw:.25,model:1,snd:`smg`},{id:`glaciar`,name:`GL-0 GLACIAR`,blurb:`CRIOFUSIL`,magSize:24,reserve:96,interval:.11,reloadTime:1.9,damage:27,head:78,pellets:1,spread:.0045,sprayGrow:.04,sprayAdd:.1,moveSpread:.0032,air:.03,adsTight:.55,recoil:.012,yawKick:.008,auto:!0,kick:.9,fallStart:26,fallDist:34,fallMin:.62,adsFov:50,draw:.34,model:5,snd:`rifle`}],rt=new Set([`KeyW`,`KeyA`,`KeyS`,`KeyD`,`ArrowUp`,`ArrowLeft`,`ArrowDown`,`ArrowRight`,`Space`,`ShiftLeft`,`ShiftRight`,`ControlLeft`,`ControlRight`,`KeyC`,`KeyR`]);function U(e,t,n){return Math.max(t,Math.min(n,e))}function W(e,t,n){return e+(t-e)*n}function it(e,t,n,r){let i=t-e;for(;i>Math.PI;)i-=Math.PI*2;for(;i<-Math.PI;)i+=Math.PI*2;return e+i*Math.min(1,r*n)}function at(e,t){e.textContent!==t&&(e.textContent=t)}function ot(e){let t=Math.max(0,Math.ceil(e));return`${Math.floor(t/60)}:${String(t%60).padStart(2,`0`)}`}function st(e,t,n,r){let i=document.createElement(`canvas`);i.width=i.height=e;let a=i.getContext(`2d`);if(!a)throw Error(`canvas`);t(a,e);let o=new pe(i);return o.colorSpace=d,o.wrapS=o.wrapT=C,o.anisotropy=8,{map:o,normal:lt(i),rough:ct(i,n,r)}}function ct(e,t,n){let r=e.width,i=e.getContext(`2d`);if(!i)throw Error(`canvas`);let a=i.getImageData(0,0,r,r).data,o=document.createElement(`canvas`);o.width=o.height=128;let s=o.getContext(`2d`);if(!s)throw Error(`canvas`);let c=s.createImageData(128,128),l=c.data,u=r/128;for(let e=0;e<128;e++)for(let i=0;i<128;i++){let o=Math.min(r-1,Math.floor(i*u)),s=(Math.min(r-1,Math.floor(e*u))*r+o)*4,c=(a[s]*.3+a[s+1]*.59+a[s+2]*.11)/255,d=U(Math.round((t+(.5-c)*n)*255),12,250),f=(e*128+i)*4;l[f]=d,l[f+1]=d,l[f+2]=d,l[f+3]=255}s.putImageData(c,0,0);let d=new pe(o);return d.wrapS=d.wrapT=C,d}function lt(e){let t=e.width,n=Math.min(128,t),r=e.getContext(`2d`);if(!r)throw Error(`canvas`);let i=r.getImageData(0,0,t,t).data,a=(e,n)=>{let r=(e%t+t)%t,a=((n%t+t)%t*t+r)*4;return i[a]*.299+i[a+1]*.587+i[a+2]*.114},o=document.createElement(`canvas`);o.width=o.height=n;let s=o.getContext(`2d`);if(!s)throw Error(`canvas`);let c=s.createImageData(n,n),l=c.data,u=t/n;for(let e=0;e<n;e++)for(let t=0;t<n;t++){let r=Math.floor(t*u),i=Math.floor(e*u),o=(a(r-2,i)-a(r+2,i))/255,s=(a(r,i-2)-a(r,i+2))/255,c=1/2.2,d=Math.hypot(o,s,c)||1,f=(e*n+t)*4;l[f]=o/d*127+128,l[f+1]=s/d*127+128,l[f+2]=c/d*127+128,l[f+3]=255}s.putImageData(c,0,0);let d=new pe(o);return d.wrapS=d.wrapT=C,d.anisotropy=8,d}function ut(e,t){e.fillStyle=`#a89b88`,e.fillRect(0,0,t,t);let n=e.getImageData(0,0,t,t),r=n.data;for(let e=0;e<r.length;e+=4){let t=(Math.random()-.5)*34;r[e]=U(r[e]+t,0,255),r[e+1]=U(r[e+1]+t*.92,0,255),r[e+2]=U(r[e+2]+t*.7,0,255)}e.putImageData(n,0,0),e.fillStyle=`rgba(70,62,52,0.55)`;for(let n=0;n<t;n+=64)e.fillRect(0,n,t,2);for(let n=0;n<t;n+=64)e.fillRect(n,0,2,t);for(let n=0;n<50;n++)e.fillStyle=`rgba(${40+Math.random()*40},${32+Math.random()*24},${22+Math.random()*16},${.08+Math.random()*.16})`,e.beginPath(),e.ellipse(Math.random()*t,Math.random()*t,6+Math.random()*40,4+Math.random()*18,Math.random()*3,0,Math.PI*2),e.fill();e.strokeStyle=`rgba(48,40,32,0.45)`,e.lineWidth=1;for(let n=0;n<18;n++){e.beginPath();let n=Math.random()*t,r=Math.random()*t;e.moveTo(n,r);for(let t=0;t<6;t++)n+=(Math.random()-.5)*36,r+=(Math.random()-.5)*36,e.lineTo(n,r);e.stroke()}e.fillStyle=`rgba(28,24,20,0.22)`,e.fillRect(0,t-28,t,28)}function dt(e,t){e.fillStyle=`#6a4630`,e.fillRect(0,0,t,t);for(let n=0;n<t;n+=36){let r=92+Math.random()*48;e.fillStyle=`rgb(${r+40},${r*.62},${r*.32})`,e.fillRect(0,n+1,t,33);for(let i=0;i<t;i+=2){let t=r+Math.sin(i*.08+n)*10;e.fillStyle=`rgba(${t+30},${t*.5},${t*.25},0.35)`,e.fillRect(i,n+2,1,30)}e.fillStyle=`rgba(28,16,8,0.8)`,e.fillRect(0,n,t,2),e.fillStyle=`rgba(90,50,28,0.9)`,e.beginPath(),e.ellipse(40+Math.random()*(t-80),n+18,7,5,0,0,Math.PI*2),e.fill()}}function ft(e,t){e.fillStyle=`#6d767c`,e.fillRect(0,0,t,t);for(let n=0;n<t;n++){let r=78+Math.sin(n/10*Math.PI)*22+Math.random()*5;e.fillStyle=`rgb(${r-4},${r},${r+6})`,e.fillRect(n,0,1,t)}e.fillStyle=`rgba(120,48,28,0.55)`;for(let n=0;n<7;n++)e.beginPath(),e.ellipse(Math.random()*t,Math.random()*t,10+Math.random()*28,6+Math.random()*14,Math.random(),0,Math.PI*2),e.fill();e.strokeStyle=`rgba(210,214,216,0.35)`,e.lineWidth=1;for(let n=0;n<12;n++){e.beginPath();let n=Math.random()*t;e.moveTo(0,n),e.lineTo(t,n+(Math.random()-.5)*8),e.stroke()}e.fillStyle=`rgba(16,18,20,0.7)`;for(let n=22;n<t;n+=48)for(let r=18;r<t;r+=48)e.beginPath(),e.arc(r,n,2.4,0,Math.PI*2),e.fill(),e.strokeStyle=`rgba(180,186,190,0.45)`,e.stroke()}function pt(e,t){e.fillStyle=`#c2ae86`,e.fillRect(0,0,t,t);let n=e.getImageData(0,0,t,t),r=n.data;for(let e=0;e<r.length;e+=4){let t=(Math.random()-.5)*28;r[e]=U(r[e]+t,0,255),r[e+1]=U(r[e+1]+t*.85,0,255),r[e+2]=U(r[e+2]+t*.55,0,255)}e.putImageData(n,0,0);for(let n=0;n<80;n++)e.fillStyle=`rgba(70,58,40,${.15+Math.random()*.35})`,e.fillRect(Math.random()*t,Math.random()*t,1+Math.random()*2,1+Math.random()*2)}function mt(e,t){e.fillStyle=`#e0a41c`,e.fillRect(0,0,t,t),e.fillStyle=`#16180f`;let n=t/7;for(let r=-8;r<14;r++)e.beginPath(),e.moveTo(r*n,0),e.lineTo(r*n+n*.48,0),e.lineTo(r*n+n*.48-t,t),e.lineTo(r*n-t,t),e.fill();e.fillStyle=`rgba(0,0,0,0.12)`;for(let n=0;n<20;n++)e.fillRect(Math.random()*t,Math.random()*t,8,2)}function ht(e,t){e.fillStyle=`#8d7b5e`,e.fillRect(0,0,t,t);let n=e.getImageData(0,0,t,t),r=n.data;for(let e=0;e<r.length;e+=4){let t=(Math.random()-.5)*30;r[e]=U(r[e]+t,0,255),r[e+1]=U(r[e+1]+t*.9,0,255),r[e+2]=U(r[e+2]+t*.65,0,255)}e.putImageData(n,0,0);let i=t/4;e.strokeStyle=`rgba(50,44,36,0.55)`,e.lineWidth=3;for(let n=1;n<4;n++)e.beginPath(),e.moveTo(n*i,0),e.lineTo(n*i,t),e.stroke(),e.beginPath(),e.moveTo(0,n*i),e.lineTo(t,n*i),e.stroke();e.fillStyle=`rgba(24,22,18,0.28)`,e.fillRect(t*.42,0,t*.06,t),e.fillRect(0,t*.62,t,t*.045),e.fillStyle=`rgba(20,18,16,0.35)`,e.beginPath(),e.ellipse(t*.3,t*.4,28,16,.4,0,Math.PI*2),e.fill(),e.beginPath(),e.ellipse(t*.72,t*.7,22,12,-.3,0,Math.PI*2),e.fill()}function gt(e,t){e.fillStyle=`#3e4540`,e.fillRect(0,0,t,t);for(let n=0;n<t;n++){let r=62+Math.sin(n*.55)*8+(Math.random()-.5)*8;e.fillStyle=`rgba(${r},${r+3},${r-1},0.55)`,e.fillRect(0,n,t,1)}e.strokeStyle=`rgba(190,184,170,0.28)`;for(let n=0;n<16;n++)e.beginPath(),e.moveTo(Math.random()*t,Math.random()*t),e.lineTo(Math.random()*t,Math.random()*t),e.stroke();e.fillStyle=`rgba(20,18,16,0.45)`;for(let n=0;n<8;n++)e.beginPath(),e.ellipse(Math.random()*t,Math.random()*t,8,4,Math.random(),0,Math.PI*2),e.fill()}function _t(e,t){e.fillStyle=`#2c3832`,e.fillRect(0,0,t,t);for(let[n,r]of[[`#1b2420`,28],[`#3d4a34`,22],[`#6a5a3c`,16],[`#141816`,12]]){e.fillStyle=n;for(let n=0;n<10;n++)e.beginPath(),e.ellipse(Math.random()*t,Math.random()*t,r*(.6+Math.random()),r*(.4+Math.random()*.5),Math.random()*3,0,Math.PI*2),e.fill()}}function vt(e){let t=e.attributes.position,n=e.attributes.normal,r=e.attributes.uv;if(t&&n&&r)for(let e=0;e<t.count;e++){let i=t.getX(e),a=t.getY(e),o=t.getZ(e),s=Math.abs(n.getX(e)),c=Math.abs(n.getY(e)),l=Math.abs(n.getZ(e)),u,d;c>=s&&c>=l?(u=i,d=o):s>=l?(u=o,d=a):(u=i,d=a),r.setXY(e,u*.42,d*.42)}}function yt(e,t,n,r,i,a,o){let s=0,c=1/0,l=0,u=0,d=0,f=[e,t,n],p=[r,i,a],m=[o.minX,o.minY,o.minZ],h=[o.maxX,o.maxY,o.maxZ];for(let e=0;e<3;e++){if(Math.abs(p[e])<1e-8){if(f[e]<m[e]||f[e]>h[e])return null;continue}let t=(m[e]-f[e])/p[e],n=(h[e]-f[e])/p[e],r=-1,i=1;if(t>n){let e=t;t=n,n=e;let a=r;r=i,i=a}if(t>s&&(s=t,l=0,u=0,d=0,e===0?l=r:e===1?u=r:d=r),n<c&&(c=n),s>c)return null}if(c<0)return null;let g=s>=0?s:c;return g<0?null:{t:g,nx:l,ny:u,nz:d}}function bt(e,t,n,r,i,a,o,s,c,l){let u=o-e,d=s-t,f=c-n,p=u*r+d*i+f*a;if(p<0)return null;let m=u*u+d*d+f*f-p*p,h=l*l;if(m>h)return null;let g=p-Math.sqrt(h-m);return g>.02?g:null}function xt(e,t,n,r){let i=-n,a=0,o=e,s=Math.hypot(i,a,o);s<1e-4&&(i=1,a=0,o=0,s=1),i/=s,a/=s,o/=s;let c=a*n-o*t,l=o*e-i*n,u=i*t-a*e,d=Math.random()*Math.PI*2,f=r*Math.sqrt(Math.random()),p=Math.cos(d)*f,m=Math.sin(d)*f,h=e+i*p+c*m,g=t+a*p+l*m,_=n+o*p+u*m,v=Math.hypot(h,g,_)||1;return{x:h/v,y:g/v,z:_/v}}function St(e){let t=document.createElement(`canvas`);t.width=256,t.height=96;let n=t.getContext(`2d`);if(!n)throw Error(`canvas`);n.clearRect(0,0,256,96),n.fillStyle=`rgba(20,24,16,0.72)`,n.fillRect(28,16,200,64),n.fillStyle=`#f3ecdc`,n.font=`700 48px sans-serif`,n.textAlign=`center`,n.textBaseline=`middle`,n.fillText(e,128,50);let r=new pe(t);return r.colorSpace=d,r}function Ct(t,i,a,c){let l=ke(),m=ve(),g=m.sens,_=le[m.map]??le.complejo,y=_.ways,b=m.bots,x=m.diff,E=m.quality,k=m.fov,A=null,ae=0,oe=null,M={x:0,y:0,z:8,tx:0,ty:0,tz:8,yaw:0,tyaw:0,pitch:0,hp:100,alive:!1,seen:!1,name:``},ce=new Set,ue=null,fe=!1,pe=!1,me=!1,he=!1,ge=!1,F=!1,xe=!1,Se=0,we=0,I=0,L=0,Ae=!1,je=!1,R=`menu`,Me=``,z=[],Ne=``,Pe=0,B=0,V=$e,Fe=0,Ie=performance.now(),Le=60,Re=0,ze=0,Be=performance.now(),H=window.matchMedia(`(pointer: coarse)`).matches||window.innerWidth<820?1:2,Ve=0,He=[],Ue=0,We=0,Ge=0,Ke=0,qe=0,Je=0,Ye=0,Xe=0,ct=0,lt=0,Ct=0,wt=!1,Tt=!1,Et=!1,Dt=.4,Ot=0,kt=0,At=0,jt=0,Mt=0,G=new de({canvas:t,antialias:!0,alpha:!1,powerPreference:`high-performance`,stencil:!1});G.outputColorSpace=d,G.toneMapping=4,G.toneMappingExposure=.96,G.shadowMap.enabled=!0,G.shadowMap.type=2,G.setClearColor(13220772,1);let Nt=new ye(G),Pt=Nt.fromScene(new De,.045).texture;Nt.dispose();let K=new u;K.environment=Pt,K.environmentIntensity=.4,K.fog=new te(13352358,24,92);let q=new f(78,1,.08,280);q.rotation.order=`YXZ`;let Ft=new u;Ft.environment=Pt,Ft.environmentIntensity=.85;let It=new f(78,1,.05,10);Ft.add(new r(14017268,9271902,.85));let Lt=new D(16773590,2.1);Lt.position.set(2,4,1.2),Ft.add(Lt);let Rt=new Ce;Ft.add(Rt);let zt=new r(10401492,9270092,.42);K.add(zt);let J=new D(16773328,2.65);J.position.set(26,42,18),J.target.position.set(0,0,0),J.castShadow=!0,J.shadow.mapSize.set(1024,1024),J.shadow.camera.left=-42,J.shadow.camera.right=42,J.shadow.camera.top=42,J.shadow.camera.bottom=-42,J.shadow.camera.near=2,J.shadow.camera.far=120,J.shadow.bias=-35e-5,J.shadow.normalBias=.04,J.shadow.radius=2,K.add(J),K.add(J.target);let Bt=new D(10402004,.42);Bt.position.set(-24,16,-18),K.add(Bt);let Vt=Ze(G,K,q),Ht=new h(new w(200,28,16),new T({side:1,depthWrite:!1,uniforms:{top:{value:new ne(`#2f6ea8`)},hor:{value:new ne(`#f0d2a4`)},bot:{value:new ne(`#b7a07e`)},hdr:{value:null},uHdr:{value:0}},vertexShader:`
        varying vec3 vP;
        void main() {
          vP = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,fragmentShader:`
        varying vec3 vP;
        uniform vec3 top;
        uniform vec3 hor;
        uniform vec3 bot;
        uniform sampler2D hdr;
        uniform float uHdr;
        void main() {
          vec3 n = normalize(vP);
          float h = n.y;
          vec3 col = mix(hor, top, smoothstep(0.0, 0.55, h));
          col = mix(bot, col, smoothstep(-0.18, 0.05, h));
          float bands = sin(n.x * 7.0 + n.z * 5.0) * sin(n.z * 11.0 + n.x * 3.0);
          float cloud = smoothstep(0.15, 0.8, bands * 0.5 + 0.5) * smoothstep(0.12, 0.48, h);
          col = mix(col, vec3(0.93, 0.94, 0.96), cloud * 0.55 * (1.0 - uHdr));
          if (uHdr > 0.0) {
            vec2 euv = vec2(atan(n.z, n.x) * 0.1591549 + 0.5, asin(clamp(n.y, -1.0, 1.0)) * 0.3183099 + 0.5);
            vec3 hc = texture2D(hdr, euv).rgb * 0.9;
            hc = hc / (1.0 + hc * 0.6);
            hc = pow(hc, vec3(1.0 / 2.2));
            hc *= mix(vec3(1.0), hor * 1.15, 0.3);
            col = mix(col, hc, uHdr * smoothstep(0.0, 0.2, h));
          }
          vec3 sunDir = normalize(vec3(0.48, 0.72, 0.34));
          float sun = pow(max(dot(n, sunDir), 0.0), 520.0);
          float glow = pow(max(dot(n, sunDir), 0.0), 5.0);
          col += vec3(1.0, 0.95, 0.8) * sun * 1.4;
          col += vec3(1.0, 0.72, 0.4) * glow * 0.22;
          gl_FragColor = vec4(col, 1.0);
        }
      `}));K.add(Ht);let Ut={concrete:[],wood:[],metal:[],sand:[],hazard:[]},Wt=[],Gt=[];function Kt(e){let t=new ne(e??16777215);return t.multiplyScalar(.93+Math.random()*.07),t}function qt(e,t,n,r){r&&vt(t);let i=Kt(n),a=new Float32Array(t.attributes.position.count*3);for(let e=0;e<t.attributes.position.count;e++)a[e*3]=i.r,a[e*3+1]=i.g,a[e*3+2]=i.b;t.setAttribute(`color`,new se(a,3)),Ut[e].push(t)}function Jt(e,t,n,r,i,a,o,s=0,c=!0){let l=new P(r,i,a);l.translate(t,s+i/2,n),qt(e,l,o,e===`concrete`||e===`sand`||e===`metal`),c&&Wt.push({minX:t-r/2,maxX:t+r/2,minY:s,maxY:s+i,minZ:n-a/2,maxZ:n+a/2})}function Yt(e,t,n,r,i,a){let o=new ie(r,r,i,10);o.translate(t,i/2,n),qt(e,o,a,!1),Wt.push({minX:t-r,maxX:t+r,minY:0,maxY:i,minZ:n-r,maxZ:n+r})}let Xt={concrete:st(512,ut,.88,.28),wood:st(256,dt,.78,.22),metal:st(256,ft,.38,.55),sand:st(256,pt,.96,.12),hazard:st(256,mt,.62,.2)},Zt={concrete:.85,wood:.7,metal:1.05,sand:.45,hazard:.3},Qt=[],$t={},en=new Map,tn=`/dominio/tex/`;function nn(e,t,n){e.map=t.map,e.normalMap=t.normal,e.roughnessMap=t.rough,e.normalScale.set(n,n),e.needsUpdate=!0}function rn(){let t=new e,n=Math.min(8,G.capabilities.getMaxAnisotropy());for(let e of[`concrete`,`wood`,`metal`,`ground`]){let r=(r,i)=>{let a=t.load(`${tn}${e}_${r}.jpg`);return a.wrapS=a.wrapT=C,a.anisotropy=n,i&&(a.colorSpace=d),e===`ground`&&a.repeat.set(26,26),a},i={map:r(`c`,!0),normal:r(`n`,!1),rough:r(`r`,!1)};Promise.all([i.map,i.normal,i.rough].map(e=>new Promise(t=>{let n=()=>e.image&&e.image.complete!==!1&&e.image.width?t():setTimeout(n,120);n()}))).then(()=>{if($t[e]=i,e===`ground`)nn(un,i,1);else for(let[t,n]of en)n===e&&nn(t,i,1)})}}let an=[];function on(){for(let e of an)K.remove(e),e.geometry.dispose();an.length=0,Gt.length=0,Object.keys(Ut).forEach(e=>{let t=Ut[e];if(Ut[e]=[],!t.length)return;let n=Ee(t,!1);if(t.forEach(e=>e.dispose()),!n)return;let r=new p({map:Xt[e].map,normalMap:Xt[e].normal,normalScale:new j(Zt[e],Zt[e]),roughnessMap:Xt[e].rough,roughness:1,metalness:e===`metal`?.82:e===`hazard`?.08:.04,vertexColors:!0,envMapIntensity:e===`metal`?1.15:.28});Qt.push(r),en.set(r,e);let i=$t[e];i&&nn(r,i,1);let a=new h(n,r);a.castShadow=!0,a.receiveShadow=!0,K.add(a),an.push(a),Gt.push(a)})}let sn=null;function cn(){new Oe().load(`${tn}sky.hdr`,e=>{e.mapping=303;let t=new ye(G);sn=t.fromEquirectangular(e).texture,t.dispose(),K.environment=sn;let n=Ht.material;n.uniforms.hdr.value=e,xn(_)},void 0,()=>{})}let ln=st(512,ht,.92,.2);ln.map.repeat.set(7,7),ln.normal.repeat.set(7,7),ln.rough.repeat.set(7,7);let un=new p({map:ln.map,normalMap:ln.normal,normalScale:new j(.8,.8),roughnessMap:ln.rough,roughness:1,metalness:.02,color:_.ground,envMapIntensity:.22}),dn=new h(new v(130,130),un);dn.rotation.x=-Math.PI/2,dn.receiveShadow=!0,K.add(dn);let fn=new ee,pn=new Float32Array(240);for(let e=0;e<80;e++)pn[e*3]=(Math.random()-.5)*70,pn[e*3+1]=.4+Math.random()*3.2,pn[e*3+2]=(Math.random()-.5)*56;fn.setAttribute(`position`,new se(pn,3));let mn=new S({color:15128508,size:.06,transparent:!0,opacity:_.dust,depthWrite:!1}),hn=new n(fn,mn);K.add(hn);let gn=new p({color:9278616,roughness:.32,metalness:.72}),_n=new p({color:2764072,roughness:.5,metalness:.4}),vn=new Ce;K.add(vn);function yn(){for(let e of[...vn.children]){vn.remove(e);let t=e;t.geometry&&t.geometry.dispose()}}function bn(e,t,n){let r=new h(new ie(.06,.09,3.4,8),gn);r.position.set(e,1.7,t),r.castShadow=!0;let i=new h(new P(.55,.12,.28),_n);i.position.set(e,3.4,t),i.castShadow=!0;let a=new h(new P(.36,.04,.16),new N({color:n?13229567:16763274}));a.position.set(e,3.32,t);let o=new Te(n?12178687:16761466,n?2.1:1.35,n?16:12,2);o.position.set(e,3.15,t),vn.add(r,i,a,o)}function xn(e){let t=Ht.material;t.uniforms.top.value.set(e.sky.top),t.uniforms.hor.value.set(e.sky.hor),t.uniforms.bot.value.set(e.sky.bot);let n=K.fog;n.color.set(e.fog.color),n.near=e.fog.near,n.far=e.fog.far,G.setClearColor(e.clear,1),un.color.set(e.ground),J.color.set(e.sun.color),J.intensity=e.sun.intensity,J.position.set(e.sun.x,e.sun.y,e.sun.z),Vt.setSun(new O(e.sun.x,e.sun.y,e.sun.z)),zt.color.set(e.hemi.sky),zt.groundColor.set(e.hemi.ground),zt.intensity=e.hemi.intensity,mn.opacity=e.dust;let r=e.id===`deposito`;t.uniforms.uHdr.value=t.uniforms.hdr.value&&!r?.92:0;let i=E===`realista`?.62:E===`rendimiento`?.22:.4;K.environmentIntensity=sn?i*(r?.35:1.25):i}function Sn(e){Wt.length=0;for(let e of Object.keys(Ut))Ut[e]=[];for(let t of e.boxes)Jt(t.k,t.x,t.z,t.w,t.h,t.d,t.tint,t.y??0,t.hit!==!1);for(let t of e.cyls)Yt(t.k,t.x,t.z,t.r,t.h,t.tint)}function Cn(e){y=e.ways,Y[0].x=e.bases[0].x,Y[0].z=e.bases[0].z,Y[1].x=e.bases[1].x,Y[1].z=e.bases[1].z;for(let e of Y)e.ring.position.set(e.x,.04,e.z),e.disc.position.set(e.x,.035,e.z),e.beam.position.set(e.x,3.8,e.z),e.sign.position.set(e.x,3.35,e.z),e.light.position.set(e.x,2.2,e.z);for(let t=0;t<X.length;t++){let n=e.bots[t],r=X[t];r.home=n.home,r.spawnX=n.x,r.spawnZ=n.z,r.x=n.x,r.z=n.z,r.enabled=t<b,r.group.visible=r.enabled,r.group.position.set(n.x,0,n.z),r.wp=t%y[r.home].length}}function wn(e){_=e;for(let e of Qt)e.dispose();Qt.length=0,Sn(e),on(),yn();let t=e.id===`deposito`;for(let[n,r]of e.lamps)bn(n,r,t);xn(e),Y.length&&Cn(e)}function Tn(e,t,n,r){let i=new h(new s(4.7,5.35,48),new N({color:r,transparent:!0,opacity:.9,side:2,depthWrite:!1}));i.rotation.x=-Math.PI/2,i.position.set(t,.04,n);let a=new h(new _e(4.7,40),new N({color:r,transparent:!0,opacity:.16,side:2,depthWrite:!1}));a.rotation.x=-Math.PI/2,a.position.set(t,.035,n);let o=new h(new ie(.18,.55,7.5,12,1,!0),new N({color:r,transparent:!0,opacity:.16,side:2,depthWrite:!1}));o.position.set(t,3.8,n);let c=new h(new v(2.4,.9),new N({map:St(e),transparent:!0,depthWrite:!1,side:2}));c.position.set(t,3.35,n);let l=new Te(r,.7,12,2);return l.position.set(t,2.2,n),K.add(i,a,o,c,l),{x:t,z:n,r:5.35,p:0,ring:i,disc:a,beam:o,sign:c,light:l,half:!1,held:!1}}let Y=[Tn(`ALFA`,_.bases[0].x,_.bases[0].z,3979442),Tn(`BRAVO`,_.bases[1].x,_.bases[1].z,3979442)],En=st(128,_t,.9,.15);function Dn(e,t,n,r){let i=new p({map:En.map,normalMap:En.normal,normalScale:new j(.35,.35),roughnessMap:En.rough,roughness:1,metalness:.02}),a=new p({color:4871516,roughness:.42,metalness:.62,envMapIntensity:.8}),o=new p({color:6968134,roughness:.82}),s=new p({color:1711386,roughness:.45,metalness:.45}),c=new p({color:401952,emissive:1474426,emissiveIntensity:.9,roughness:.25,metalness:.4}),l=new Ce,u=new h(new P(.48,.5,.28),a);u.position.set(0,1.22,0),u.castShadow=!0;let d=new h(new P(.4,.28,.22),i);d.position.set(0,.86,0),d.castShadow=!0;let f=new h(new P(.26,.24,.26),i);f.position.set(0,1.62,0),f.castShadow=!0;let m=new h(new P(.32,.12,.32),a);m.position.set(0,1.78,0);let g=new h(new P(.2,.07,.04),c);g.position.set(0,1.63,-.14);let _=new h(new P(.28,.32,.12),i);_.position.set(0,1.22,.18);let v=(e,t,n,r,i,a,o)=>{let s=new Ce;s.position.set(e,t,n);let c=new h(new P(r,i,a),o);return c.position.set(0,-i/2,0),c.castShadow=!0,s.add(c),s},b=v(-.12,.72,0,.15,.7,.16,i),x=v(.12,.72,0,.15,.7,.16,i),S=v(-.34,1.42,0,.12,.5,.14,i),C=v(.34,1.42,0,.12,.46,.14,o),w=new h(new P(.06,.08,.46),s);w.position.set(.02,-.28,-.22),C.add(w),l.add(u,d,f,m,g,_,b,x,S,C),l.position.set(n,0,r),K.add(l);let T=Y[t];return{id:e,name:`Guardia ${e+1}`,home:t,x:n,y:0,z:r,vx:0,vz:0,yaw:Math.atan2(-(T.x-n),-(T.z-r)),hp:100,alive:!0,respawn:0,cooldown:.4+e*.07,alert:0,react:0,lx:n,lz:r,wp:e%y[t].length,stuck:0,nudge:0,side:e%2==0?1:-1,walk:e,flash:0,spawnX:n,spawnZ:r,enabled:!0,group:l,legL:b,legR:x,armL:S,armR:C,bodyMats:[i,a,o,s]}}let X=_.bots.map((e,t)=>Dn(t,e.home,e.x,e.z));wn(_);let On=new p({color:1849920,roughness:.72,metalness:.08}),kn=new p({color:401952,emissive:3979442,emissiveIntensity:1.2,roughness:.18}),An=new Ce,jn=new h(new P(.46,.78,.28),On);jn.position.y=1.08,jn.castShadow=!0;let Mn=new h(new P(.26,.24,.26),On);Mn.position.y=1.64,Mn.castShadow=!0;let Nn=new h(new P(.2,.07,.04),kn);Nn.position.set(0,1.64,-.14),An.add(jn,Mn,Nn),An.visible=!1,K.add(An);let Pn=new N({map:Qe(),color:16769442,transparent:!0,opacity:.95,blending:2,depthWrite:!1,depthTest:!1}),Fn=st(256,gt,.46,.4),In=new p({map:Fn.map,normalMap:Fn.normal,normalScale:new j(.45,.45),roughnessMap:Fn.rough,roughness:1,metalness:.62,color:10134424,envMapIntensity:1}),Ln=new p({map:Fn.map,normalMap:Fn.normal,normalScale:new j(.25,.25),roughnessMap:Fn.rough,roughness:.55,metalness:.92,color:14014682,envMapIntensity:1.2}),Rn=new p({color:1842972,roughness:.58,metalness:.18,envMapIntensity:.55}),zn=new p({color:13206554,roughness:.42,metalness:.28,envMapIntensity:.6}),Bn=new p({color:3814446,roughness:.8}),Vn=new p({color:7029548,roughness:.66,metalness:.06}),Hn=new p({color:1193018,emissive:813668,emissiveIntensity:.45,roughness:.08,metalness:.25}),Un=[],Z=(e,t,n,r,i,a,o=0,s=0,c=0)=>{let l=new h(t,n);return l.position.set(r,i,a),l.rotation.set(o,s,c),e.add(l),l},Wn=(e,t,n)=>{let r=new ie(e,t,n,12);return r.rotateX(Math.PI/2),r},Gn=(e,t,n,r)=>{let i=new h(new v(r*1.8,r*1.8),Pn);return i.position.set(0,t,n),i.visible=!1,e.add(i),i},Kn=e=>{let t=new Ce;t.visible=Un.length===0,Rt.add(t),Un.push({root:t,...e(t)})};Kn(e=>{Z(e,new P(.05,.08,.24),Rn,0,.01,.18),Z(e,new P(.07,.1,.34),In,0,.02,-.06),Z(e,new P(.018,.02,.2),Ln,0,.09,-.05),Z(e,new P(.042,.12,.048),Rn,0,-.08,.03,.22);let t=Z(e,new P(.046,.16,.048),In,0,-.14,-.06);return Z(e,new P(.06,.072,.26),In,0,.018,-.36),Z(e,Wn(.014,.016,.34),Ln,0,.034,-.64),Z(e,Wn(.02,.02,.05),In,0,.034,-.84),Z(e,new P(.048,.04,.07),zn,0,.02,-.2),Z(e,new P(.07,.075,.09),Bn,0,-.02,-.32,.45),Z(e,new P(.055,.085,.07),Bn,.012,-.06,.02,.35),{mag:t,rest:-.14,pump:!1,flash:Gn(e,.034,-.9,.2)}}),Kn(e=>{Z(e,new P(.055,.09,.16),Rn,0,0,.08),Z(e,new P(.064,.085,.28),In,0,.015,-.12);let t=Z(e,new P(.04,.2,.05),In,0,-.16,-.04);return Z(e,Wn(.013,.015,.16),Ln,0,.03,-.34),Z(e,new P(.03,.09,.03),Rn,.02,-.08,-.28),Z(e,new P(.05,.03,.08),zn,0,.06,-.02),Z(e,new P(.06,.07,.08),Bn,.03,-.03,-.16,.4),Z(e,new P(.05,.07,.06),Bn,0,-.05,.04,.3),{mag:t,rest:-.16,pump:!1,flash:Gn(e,.03,-.44,.16)}}),Kn(e=>{Z(e,new P(.05,.07,.28),Vn,0,0,.2),Z(e,new P(.07,.09,.22),In,0,.02,-.04),Z(e,Wn(.02,.022,.62),Ln,0,.04,-.46);let t=Z(e,new P(.055,.055,.16),Vn,0,0,-.32);return Z(e,new P(.04,.11,.045),Rn,0,-.08,.02,.18),Z(e,new P(.06,.07,.1),Bn,.02,-.02,-.18,.4),Z(e,new P(.05,.08,.07),Bn,0,-.05,.08,.25),{mag:t,rest:-.32,pump:!0,flash:Gn(e,.04,-.8,.28)}}),Kn(e=>{e.scale.setScalar(.86),e.position.set(.05,-.02,.05),Z(e,new P(.045,.14,.05),Rn,0,-.08,.02,.28),Z(e,new P(.048,.07,.18),In,0,.03,-.04),Z(e,Wn(.012,.013,.14),Ln,0,.045,-.18);let t=Z(e,new P(.03,.07,.04),In,0,-.02,0);return Z(e,new P(.05,.06,.07),Bn,.02,-.04,0,.35),{mag:t,rest:-.02,pump:!1,flash:Gn(e,.045,-.28,.14)}}),Kn(e=>{Z(e,new P(.048,.075,.3),Rn,0,.01,.22),Z(e,new P(.055,.08,.36),In,0,.025,-.08),Z(e,Wn(.011,.013,.52),Ln,0,.04,-.5),Z(e,Wn(.018,.02,.16),In,0,.105,-.02),Z(e,Wn(.012,.012,.04),Ln,0,.105,.08),Z(e,new _e(.016,12),Hn,0,.105,-.1);let t=Z(e,new P(.04,.1,.04),In,0,-.08,-.02);return Z(e,new P(.04,.11,.042),Rn,0,-.07,.06,.2),Z(e,new P(.05,.03,.1),zn,0,.07,-.22),Z(e,new P(.06,.07,.09),Bn,.01,-.02,-.16,.4),Z(e,new P(.05,.08,.06),Bn,0,-.05,.08,.3),{mag:t,rest:-.08,pump:!1,flash:Gn(e,.04,-.78,.18)}});let qn=new p({color:12576511,emissive:2788607,emissiveIntensity:.32,roughness:.14,metalness:.35,envMapIntensity:1.4}),Jn=new p({color:14083312,roughness:.85,metalness:.05}),Yn=new p({color:10480127,emissive:4707583,emissiveIntensity:1.1,roughness:.05,metalness:.1,transparent:!0,opacity:.85}),Xn=null;Kn(e=>{e.scale.setScalar(.74),e.position.set(.02,-.01,.05),Z(e,new P(.05,.08,.26),Jn,0,.01,.2),Z(e,new P(.07,.1,.36),qn,0,.02,-.07),Z(e,Wn(.014,.018,.46),qn,0,.04,-.46);for(let t=0;t<4;t++)Z(e,new o(.022-t*.003),Yn,0,.04,-.3-t*.09,0,t,.6);Z(e,new be(.02,.08,6),Yn,.03,.1,-.1,.3,0,-.5),Z(e,new be(.016,.06,6),Yn,-.03,.09,-.02,.2,0,.5),Z(e,new P(.02,.03,.22),Jn,0,.09,-.06);let t=Z(e,new P(.04,.16,.06),Yn,0,-.12,-.05,.15);Z(e,new P(.04,.11,.042),Jn,0,-.07,.07,.2),Z(e,new P(.06,.07,.09),Bn,.01,-.02,-.18,.4),Z(e,new P(.05,.08,.06),Bn,0,-.05,.08,.3);let r=new Float32Array(66);for(let e=0;e<22;e++)r[e*3]=(Math.random()-.5)*.14,r[e*3+1]=Math.random()*.16-.02,r[e*3+2]=-Math.random()*.7+.1;let i=new ee;return i.setAttribute(`position`,new se(r,3)),Xn=new n(i,new S({color:14677759,size:.005,transparent:!0,opacity:.5,blending:2,depthWrite:!1})),e.add(Xn),{mag:t,rest:-.12,pump:!1,flash:Gn(e,.04,-.72,.2)}});let Zn=new Map,Qn=new h(new w(.09,8,8),new N({color:16769696,transparent:!0,opacity:.9,blending:2,depthWrite:!1}));Qn.visible=!1,K.add(Qn);function $n(e,t,n,r){let i=[];for(let a=0;a<e;a++){let e=new h(t,n);e.visible=!1,r.add(e),i.push({mesh:e,vx:0,vy:0,vz:0,life:0})}return i}let er=$n(12,new P(.025,.05,.025),new p({color:13017434,metalness:.7,roughness:.35}),K),tr=$n(16,new P(.05,.05,.05),new N({color:16762218}),K),nr=new N({color:16761162,transparent:!0,opacity:.9,blending:2,depthWrite:!1}),rr=$n(14,new P(.018,.018,1),nr,K),ir=$n(24,new v(.16,.16),new N({color:2366998,transparent:!0,opacity:.8,depthWrite:!1,side:2,polygonOffset:!0,polygonOffsetFactor:-2}),K),Q={x:0,y:0,z:21,vx:0,vy:0,vz:0,yaw:0,pitch:0,hp:100,armor:50,mag:nt[0].magSize,reserve:nt[0].reserve,reload:0,nextShot:0,spray:0,recoilP:0,recoilY:0,bob:0,grounded:!0,alive:!0,down:0,invuln:0,crouch:0,ads:0,draw:0,kills:0,deaths:0},ar=0,or=[0,1,3],sr=0,cr=e=>nt[e].model??e,lr={dash:6,escudo:18,cura:20,radar:15},ur=[{id:`dash`,cd:0}],dr=0,fr=0,pr=0;function mr(e){let t=ur[e];return!t||t.cd>0||R!==`play`||!Q.alive||Q.down>0?!1:(t.cd=lr[t.id],t.id===`dash`?(pr=.2,kr(`DASH`,.6)):t.id===`escudo`?(dr=4,kr(`ESCUDO ACTIVO`,1.2)):t.id===`cura`?(Q.hp=Math.min(100,Q.hp+50),kr(`+50 VIDA`,1)):t.id===`radar`&&(fr=7,kr(`RADAR: ENEMIGOS EN EL MAPA`,1.4)),l.blip(),!0)}let hr=nt.map(e=>({mag:e.magSize,reserve:e.reserve})),gr=!1,_r=0;function vr(){return nt[ar]}function yr(){hr[ar].mag=Q.mag,hr[ar].reserve=Q.reserve}function br(){Q.mag=hr[ar].mag,Q.reserve=hr[ar].reserve}function xr(){let e=cr(ar);for(let t=0;t<Un.length;t++)Un[t].root.visible=t===e}function Sr(e){let t=or.length,n=(e%t+t)%t,r=or[n];r===ar||Q.down>0||(sr=n,yr(),ar=r,br(),Q.reload=0,Q.spray=0,Q.draw=vr().draw,gr=!0,xr(),l.blip())}function Cr(){let e=vr(),t=e.spread+Q.spray*e.sprayGrow;return t+=Math.hypot(Q.vx,Q.vz)*e.moveSpread,Q.grounded||(t+=e.air),Q.crouch>.75&&(t*=.72),t*=1-Q.ads*e.adsTight,t}function wr(e,t,n){if(e<-34.15||e>34.15||t<-23.7||t>27.7)return!0;for(let r=0;r<Wt.length;r++){let i=Wt[r];if(i.maxY<.45)continue;let a=U(e,i.minX,i.maxX),o=U(t,i.minZ,i.maxZ),s=e-a,c=t-o;if(s*s+c*c<n*n)return!0}return!1}function Tr(e,t,n,r,i){let a=e,o=t;return wr(e+n,t,i)||(a=e+n),wr(a,t+r,i)||(o=t+r),{x:a,z:o}}function Er(e,t,n,r,i,a){let o=null;for(let s=0;s<Wt.length;s++){let c=yt(e,t,n,r,i,a,Wt[s]);!c||c.t<0||(!o||c.t<o.t)&&(o=c)}return o}function Dr(){return Q.y+W(1.62,1,Q.crouch)}function Or(e,t){let n=Math.cos(t);return{x:-Math.sin(e)*n,y:Math.sin(t),z:-Math.cos(e)*n}}function kr(e,t=2.2){Ne=e,Pe=t}function Ar(e){z.unshift(e),z.length>4&&z.pop()}function jr(){return{phase:R,kills:Q.kills,deaths:Q.deaths,elapsed:$e-V,best:m.best,wins:m.wins,reason:Me,map:_.id,basesTaken:Y.filter(e=>e.p>=100).length}}function Mr(e){R!==e&&(R=e,a(jr()))}function Nr(){try{let e=t.requestPointerLock({unadjustedMovement:!0});e&&typeof e.catch==`function`&&e.catch(()=>{try{t.requestPointerLock()}catch{}})}catch{try{t.requestPointerLock()}catch{}}}function Pr(){return x===`recluta`?{spread:1.55,cool:1.4,dmg:.62,react:.42}:x===`veterano`?{spread:.58,cool:.7,dmg:1.35,react:.06}:{spread:1,cool:1,dmg:1,react:.2}}function Fr(e){let t=Q.alive&&Q.down<=0&&Math.hypot(Q.x-e.x,Q.z-e.z)<e.r,n=M.alive&&M.seen&&Math.hypot(M.x-e.x,M.z-e.z)<e.r;return t||n}function Ir(){Q.x=_.spawn.x,Q.y=0,Q.z=_.spawn.z,Q.vx=0,Q.vy=0,Q.vz=0,Q.yaw=_.spawn.yaw,Q.pitch=0,Q.hp=100,Q.armor=50,sr=0,ar=or[0],dr=0,fr=0;for(let e of ur)e.cd=0;for(let e=0;e<nt.length;e++)hr[e].mag=nt[e].magSize,hr[e].reserve=nt[e].reserve;br(),Q.reload=0,Q.nextShot=0,Q.spray=0,Q.recoilP=0,Q.recoilY=0,Q.bob=0,Q.grounded=!0,Q.alive=!0,Q.down=0,Q.invuln=1.4,Q.crouch=0,Q.ads=0,Q.draw=0,Q.kills=0,Q.deaths=0,F=!1,gr=!1,xr(),V=$e,B=0,z.length=0,Je=0;for(let e of Y)e.p=0,e.half=!1,e.held=!1;for(let e of X)e.x=e.spawnX,e.z=e.spawnZ,e.y=0,e.vx=0,e.vz=0,e.hp=100,e.alive=!0,e.respawn=0,e.alert=0,e.react=0,e.cooldown=.3,e.enabled=e.id<b,e.group.visible=e.enabled,e.group.position.set(e.x,0,e.z);kr(`${_.name} — CAPTURA ALFA Y BRAVO`,3.4)}function Lr(e,t,n=!1){if(R===`play`){if(Me=t,e===`win`){let e=$e-V;m.wins+=1,(m.best===null||e<m.best)&&(m.best=e),re(m)}!n&&A?.role===`host`&&A.send({t:`end`,result:e,why:t}),Mr(e);try{document.exitPointerLock()}catch{}}}function Rr(e){if(!Q.alive||Q.invuln>0)return!1;let t=e.x,n=1.5,r=e.z,i=Q.x,a=Dr()-.15,o=Q.z,s=i-t,c=a-n,l=o-r,u=Math.hypot(s,c,l);if(u>34)return!1;s/=u,c/=u,l/=u;let d=Er(t,n,r,s,c,l);return!(d&&d.t<u-.45)}function zr(e,t,n,r){if(!Q.alive||Q.invuln>0||R!==`play`)return;let i=dr>0?e*.25:e;if(!t&&Q.armor>0){let e=Math.min(Q.armor,i*.5);Q.armor-=e,i-=e}Q.hp=Math.max(0,Q.hp-i),Je=1,qe=Math.min(1.2,qe+.7);let a=n-Q.x,o=r-Q.z,s=-Math.sin(Q.yaw),c=-Math.cos(Q.yaw),u=Math.cos(Q.yaw),d=-Math.sin(Q.yaw),f=a*s+o*c,p=a*u+o*d,m=Math.atan2(p,f);Ye=Math.max(0,Math.cos(m)),Xe=Math.max(0,Math.sin(m)),ct=Math.max(0,-Math.cos(m)),lt=Math.max(0,-Math.sin(m)),l.hurt(),Q.hp<=0&&(Q.alive=!1,Q.down=2.5,Q.deaths+=1,kr(`HAS CAÍDO — REINSERTANDO`,2.4))}function Br(){Q.x=_.spawn.x+(Math.random()-.5)*1.5,Q.z=_.spawn.z,Q.y=0,Q.vx=0,Q.vy=0,Q.vz=0,Q.pitch=0,Q.hp=100,Q.armor=40,Q.alive=!0,Q.down=0,Q.invuln=1.6,Q.mag=Math.max(Q.mag,Math.ceil(vr().magSize*.45)),yr()}function Vr(e,t,n,r=`local`){if(e.alive&&e.enabled&&(e.hp-=t,e.flash=.12,r===`local`&&nt[ar].id===`glaciar`&&Zn.set(e,1.4),e.alert=3.2,e.lx=r===`ally`?M.x:Q.x,e.lz=r===`ally`?M.z:Q.z,r===`local`&&(Ct=1,wt=n,l.hit(n)),e.hp<=0)){e.alive=!1,e.group.visible=!1,Vt.burst(e.x,e.y,e.z),e.respawn=5.5;let t=r===`local`?`Eliminaste`:`${M.name||`Aliado`} eliminó`;r===`local`&&(Q.kills+=1),Ar(`${t} a ${e.name}`),l.down()}}function Hr(){let e=vr();--Q.mag,yr(),Q.spray=Math.min(1.6,Q.spray+e.sprayAdd);let t=e.recoil+Q.spray*e.recoil*.35;Q.pitch=U(Q.pitch+t*.28,-tt,tt),Q.recoilP+=t*.72,Q.recoilY+=(Math.random()-.5)*e.yawKick,Ge=e.kick,Ke=e.id===`shot`?.07:.045,qe=Math.min(1.2,qe+(e.id===`shot`?.72:e.id===`dmr`?.48:.32)),l.shot(.55+e.kick*.28,0,e.snd??e.id);let n=Un[cr(ar)];n.flash.scale.setScalar((e.id===`shot`?1.65:e.id===`pistol`?.7:e.id===`smg`?.85:1.1)*(.85+Math.random()*.3)),n.flash.rotation.z=Math.random()*Math.PI*2,nr.color.set(e.id===`dmr`?16751164:e.id===`smg`?16769162:e.id===`pistol`?16765562:16761162);let r=Or(Q.yaw+Q.recoilY,Q.pitch+Q.recoilP),i=Cr(),a=Q.x,o=Dr(),s=Q.z;{let t=Or(Q.yaw,Q.pitch);Vt.muzzle(a+t.x*.9,o+t.y*.9-.1,s+t.z*.9,e.id===`shot`)}let c=new Map;for(let t=0;t<e.pellets;t++){let n=xt(r.x,r.y,r.z,i),l=80,u=null,d=!1;for(let e of X){if(!e.alive||!e.enabled)continue;let t=bt(a,o,s,n.x,n.y,n.z,e.x,e.y+1.64,e.z,.2);t!==null&&t<l&&(l=t,u=e,d=!0);let r=yt(a,o,s,n.x,n.y,n.z,{minX:e.x-.38,maxX:e.x+.38,minY:e.y+.68,maxY:e.y+1.45,minZ:e.z-.38,maxZ:e.z+.38});r&&r.t<l&&(l=r.t,u=e,d=!1)}let f=Er(a,o,s,n.x,n.y,n.z),p=[0,1,0];if(f&&f.t<l&&(p=[f.nx,f.ny,f.nz],l=f.t,u=null,t<3)){let e=ir[jt++%ir.length];e.life=30,e.mesh.visible=!0;let t=a+n.x*f.t,r=o+n.y*f.t,i=s+n.z*f.t;e.mesh.position.set(t+f.nx*.03,r+f.ny*.03,i+f.nz*.03),e.mesh.lookAt(t+f.nx,r+f.ny,i+f.nz)}if(t===0&&e.pellets===1){let e=rr[At++%rr.length];e.life=.07,e.mesh.visible=!0;let t=Math.min(1.4,l*.5),r=Math.max(.01,l-t);e.mesh.scale.set(1,1,r);let i=t+r*.5;e.mesh.position.set(a+n.x*i,o+n.y*i-.06,s+n.z*i),e.mesh.lookAt(a+n.x*l,o+n.y*l,s+n.z*l)}if(t<2){let e=a+n.x*l,t=o+n.y*l,r=s+n.z*l;l<79.9&&Vt.impact(e,t,r,p[0],p[1],p[2],!!u);for(let n=0;n<3;n++){let n=tr[kt++%tr.length];n.life=.16+Math.random()*.1,n.mesh.visible=!0,n.mesh.position.set(e,t,r),n.vx=(Math.random()-.5)*3,n.vy=Math.random()*2.5,n.vz=(Math.random()-.5)*3}}if(u){let t=l>e.fallStart?U(1-(l-e.fallStart)/e.fallDist,e.fallMin,1):1,n=(d?e.head:e.damage)*t,r=c.get(u);c.set(u,{dmg:(r?.dmg??0)+n,head:d||!!r?.head})}}if(A?.role===`guest`){let e=[...c.entries()].map(([e,t])=>({id:e.id,dmg:t.dmg,head:t.head}));e.length&&A.send({t:`hit`,hits:e})}else for(let[e,t]of c)Vr(e,t.dmg,t.head);for(let e of X)e.alive&&Math.hypot(e.x-Q.x,e.z-Q.z)<26&&(e.alert=Math.max(e.alert,1.8),e.lx=Q.x,e.lz=Q.z);let u=Math.cos(Q.yaw),d=-Math.sin(Q.yaw),f=er[Ot++%er.length];f.life=.8,f.mesh.visible=!0,f.mesh.position.set(Q.x+u*.28,Dr()-.2,Q.z+d*.28),f.vx=u*2.4,f.vy=1.8,f.vz=d*2.4,f.mesh.scale.setScalar(e.id===`shot`?1.6:e.id===`pistol`?.7:1),Q.mag<=0&&Q.reserve>0&&Ur()}function Ur(){let e=vr();Q.reload>0||Q.mag>=e.magSize||Q.reserve<=0||Q.down>0||Q.draw>0||(Q.reload=e.reloadTime,l.reload())}function Wr(e,t){let n=e.x,r=1.45,i=e.z,a=Q.x,o=Q.y+W(1.15,.75,Q.crouch),s=Q.z,c=a-n,u=o-r,d=s-i,f=Math.hypot(c,u,d)||1;c/=f,u/=f,d/=f;let p=Pr(),m=(.04+t*.0022)*p.spread,h=xt(c,u,d,m),g=Er(n,r,i,h.x,h.y,h.z),_=null,v=!1,y=bt(n,r,i,h.x,h.y,h.z,Q.x,Dr(),Q.z,.18);y!==null&&(_=y,v=!0);let b=yt(n,r,i,h.x,h.y,h.z,{minX:Q.x-.36,maxX:Q.x+.36,minY:Q.y+.35,maxY:Dr()-.05,minZ:Q.z-.36,maxZ:Q.z+.36});b&&(_===null||b.t<_)&&(_=b.t,v=!1),_!==null&&(!g||_<g.t)&&zr((v?16:8)*p.dmg,v,e.x,e.z);let x=-Math.sin(e.yaw),S=-Math.cos(e.yaw);Qn.position.set(e.x+x*.6,1.32,e.z+S*.6),Qn.visible=!0,Mt=.05;let C=e.x-Q.x,w=e.z-Q.z,T=Math.hypot(C,w),E=Math.cos(Q.yaw),D=-Math.sin(Q.yaw),ee=U((C*E+w*D)/(T+.001),-1,1);l.shot(Math.min(1,9/(T+3))*.55,ee)}function Gr(e){if(Q.invuln=Math.max(0,Q.invuln-e),Q.recoilP=W(Q.recoilP,0,1-Math.exp(-7*e)),Q.recoilY=W(Q.recoilY,0,1-Math.exp(-7*e)),Q.spray=Math.max(0,Q.spray-e*2.1),Ge=Math.max(0,Ge-e*8),Q.down>0){Q.down-=e,Q.vx*=Math.max(0,1-e*6),Q.vz*=Math.max(0,1-e*6),Q.pitch=W(Q.pitch,-.9,1-Math.exp(-3*e)),Q.down<=0&&Br();return}let t=+!!he;Q.ads=W(Q.ads,t,1-Math.exp(-12*e));let n=ui()||F?1:0;Q.crouch=W(Q.crouch,n,1-Math.exp(-10*e));let r=0,i=0;($(`KeyW`)||$(`ArrowUp`))&&(r+=1),($(`KeyS`)||$(`ArrowDown`))&&--r,($(`KeyD`)||$(`ArrowRight`))&&(i+=1),($(`KeyA`)||$(`ArrowLeft`))&&--i,r+=we,i+=Se;let a=Math.hypot(r,i);a>1&&(r/=a,i/=a);let o=di(),s=(ge||$(`ShiftLeft`)||$(`ShiftRight`))&&r>.5&&Q.crouch<.35&&Q.ads<.25&&Q.grounded&&!o,c=Q.crouch>.5?2.65:s?7.25:Q.ads>.45?3.25:5.2,u=Q.yaw,d=-Math.sin(u),f=-Math.cos(u),p=Math.cos(u),m=-Math.sin(u),h=d*r+p*i,g=f*r+m*i,_=Math.hypot(h,g);if(_>0&&(h/=_,g/=_),Q.grounded){let t=Math.hypot(Q.vx,Q.vz);if(t>0){let n=Math.max(t,1.5)*9.5*e,r=Math.max(0,t-n);Q.vx=Q.vx/t*r,Q.vz=Q.vz/t*r}if(_>0){let t=c-(Q.vx*h+Q.vz*g);if(t>0){let n=46*e*c;n>t&&(n=t),Q.vx+=h*n,Q.vz+=g*n}}}else if(Q.vy-=19.5*e,_>0){Q.vx+=h*10*e,Q.vz+=g*10*e;let t=Math.hypot(Q.vx,Q.vz),n=7.4;t>n&&(Q.vx=Q.vx/t*n,Q.vz=Q.vz/t*n)}let v=Tr(Q.x,Q.z,Q.vx*e,Q.vz*e,.34);Q.x=v.x,Q.z=v.z,Q.grounded||(Q.y+=Q.vy*e,Q.y<=0&&(Q.y=0,Q.vy=0,Q.grounded=!0)),xe&&Q.grounded&&(Q.vy=6.45,Q.grounded=!1,Q.y=.02),xe=!1;let y=Math.hypot(Q.vx,Q.vz);Q.grounded&&y>.6&&(Q.bob+=e*y*2.15),Q.draw>0&&(Q.draw=Math.max(0,Q.draw-e));let b=$(`KeyR`)||!1;if(b&&!Et&&Ur(),Et=b,Q.reload>0&&(Q.reload-=e,Q.reload<=0)){let e=vr().magSize-Q.mag,t=Math.min(e,Q.reserve);Q.mag+=t,Q.reserve-=t,Q.reload=0,yr()}let x=vr(),S=x.auto?o:o&&!gr;o||(gr=!1),S&&Q.reload<=0&&Q.draw<=0?(x.auto||(gr=!0),Q.mag<=0?Tt||(Tt=!0,Q.reserve>0?Ur():l.empty()):B>=Q.nextShot&&(Tt=!1,Hr(),Q.nextShot=B+x.interval)):o||(Tt=!1)}function Kr(e){for(let t of Y){let n=Fr(t),r=!1;for(let e of X)e.enabled&&e.alive&&Math.hypot(e.x-t.x,e.z-t.z)<t.r&&(r=!0);let i=t.p;n&&!r?t.p=Math.min(100,t.p+20*e):r&&!n&&(t.p=Math.max(0,t.p-14*e)),!t.half&&i<50&&t.p>=50&&(t.half=!0,l.blip()),t.p<40&&(t.half=!1),!t.held&&t.p>=100&&(t.held=!0,kr(`BASE ${t===Y[0]?`ALFA`:`BRAVO`} ASEGURADA`,2.2),l.secure()),t.p<98&&(t.held=!1)}Y[0].p>=100&&Y[1].p>=100&&Lr(`win`,`Las dos bases son del equipo.`)}function qr(e,t){if(A?.role!==`host`||!M.alive)return;let n=Pr(),r=e.x,i=1.45,a=e.z,o=M.x-r,s=-.19999999999999996,c=M.z-a,l=Math.hypot(o,s,c)||1;o/=l,s/=l,c/=l;let u=xt(o,s,c,(.045+t*.0022)*n.spread),d=Er(r,i,a,u.x,u.y,u.z),f=null,p=!1,m=bt(r,i,a,u.x,u.y,u.z,M.x,1.55,M.z,.18);m!==null&&(f=m,p=!0);let h=yt(r,i,a,u.x,u.y,u.z,{minX:M.x-.36,maxX:M.x+.36,minY:.35,maxY:1.45,minZ:M.z-.36,maxZ:M.z+.36});h&&(f===null||h.t<f)&&(f=h.t,p=!1),f!==null&&(!d||f<d.t)&&A.send({t:`pain`,dmg:(p?16:8)*n.dmg,head:p,x:e.x,z:e.z});let g=-Math.sin(e.yaw),_=-Math.cos(e.yaw);Qn.position.set(e.x+g*.6,1.32,e.z+_*.6),Qn.visible=!0,Mt=.05}function Jr(e,t){if(!e.enabled){e.group.visible=!1;return}if(!e.alive){e.respawn-=t,e.respawn<=0&&(e.alive=!0,e.hp=100,e.x=e.spawnX,e.z=e.spawnZ,e.alert=0,e.group.visible=!0);return}let n=Rr(e),r=Math.hypot(Q.x-e.x,Q.z-e.z),i=M.alive&&M.seen?Math.hypot(M.x-e.x,M.z-e.z):999,a=!1;if(M.alive&&M.seen&&i<32&&(!n||i<r)){let t=M.x-e.x,n=1.4-1.5,r=M.z-e.z,o=Math.hypot(t,n,r)||1;t/=o,n/=o,r/=o;let s=Er(e.x,1.5,e.z,t,n,r);(!s||s.t>i-.45)&&(a=!0)}let o=n||a;o?(e.alert<=0&&(e.react=Pr().react),e.alert=2.6,e.lx=a?M.x:Q.x,e.lz=a?M.z:Q.z):e.alert=Math.max(0,e.alert-t),e.react=Math.max(0,e.react-t),e.cooldown=Math.max(0,e.cooldown-t);let s=Y[e.home],c,l;if(e.alert>0)c=e.lx,l=e.lz;else if(s.p>10&&s.p<100)c=s.x,l=s.z;else{let t=y[e.home],n=t[e.wp];c=n[0],l=n[1],Math.hypot(e.x-c,e.z-l)<1.15&&(e.wp=(e.wp+1)%t.length)}let u=c-e.x,d=l-e.z,f=Math.hypot(u,d)||1;u/=f,d/=f;for(let t of X){if(t===e||!t.alive)continue;let n=e.x-t.x,r=e.z-t.z,i=Math.hypot(n,r);i>.001&&i<1.3&&(u+=n/i*1.1,d+=r/i*1.1)}e.nudge>0&&(e.nudge-=t,u+=-d*e.side,d+=u*e.side*.2);let p=Math.hypot(u,d)||1;if(u/=p,d/=p,o&&r<8){let t=Math.sin(B*1.8+e.id*2),n=-d,r=u;u=u*.25+n*t,d=d*.25+r*t;let i=Math.hypot(u,d)||1;u/=i,d/=i}let m=(o?4.5:3.15)*((Zn.get(e)??0)>0?.5:1),h=e.x,g=e.z,_=Tr(e.x,e.z,u*m*t,d*m*t,.36);e.x=_.x,e.z=_.z,e.vx=(e.x-h)/t,e.vz=(e.z-g)/t;let v=Math.hypot(e.x-h,e.z-g);v<.004&&f>1.2?e.stuck+=t:e.stuck=0,e.stuck>.55&&(e.stuck=0,e.side*=-1,e.nudge=.45,e.wp=(e.wp+1)%y[e.home].length);let b=o?(a?M.x:Q.x)-e.x:u,x=o?(a?M.z:Q.z)-e.z:d,S=Math.atan2(-b,-x);e.yaw=it(e.yaw,S,t,o?8:5),e.walk+=v*9,o&&e.react<=0&&e.cooldown<=0&&(a?i:r)<34&&(e.cooldown=(.42+Math.random()*.22)*Pr().cool,a?qr(e,i):Wr(e,r))}function Yr(e){for(let t of er)t.life<=0||(t.life-=e,t.vy-=12*e,t.mesh.position.x+=t.vx*e,t.mesh.position.y+=t.vy*e,t.mesh.position.z+=t.vz*e,t.mesh.rotation.x+=e*9,t.mesh.rotation.z+=e*6,t.mesh.position.y<.03&&(t.mesh.position.y=.03,t.vy*=-.28,t.vx*=.55,t.vz*=.55),t.life<=0&&(t.mesh.visible=!1));for(let t of tr)t.life<=0||(t.life-=e,t.vy-=10*e,t.mesh.position.x+=t.vx*e,t.mesh.position.y+=t.vy*e,t.mesh.position.z+=t.vz*e,t.life<=0&&(t.mesh.visible=!1));for(let t of rr)t.life<=0||(t.life-=e,t.life<=0&&(t.mesh.visible=!1));Mt-=e,Mt<=0&&(Qn.visible=!1),Pe=Math.max(0,Pe-e),Je=Math.max(0,Je-e*1.5),Ye=Math.max(0,Ye-e*1.8),Xe=Math.max(0,Xe-e*1.8),ct=Math.max(0,ct-e*1.8),lt=Math.max(0,lt-e*1.8),Ct=Math.max(0,Ct-e*4.5),qe=Math.max(0,qe-e*4.5)}function Xr(e){if(B+=e,A?.role!==`guest`&&(V-=e),Gr(e),R===`play`){if(A?.role===`guest`)Yr(e);else if(Kr(e),R===`play`){for(let t of X)Jr(t,e);Yr(e),R===`play`&&V<=0&&Lr(`lose`,`Se agotó el tiempo. Faltó una base.`)}}}function Zr(e,t){if(!e.enabled||!e.alive){e.group.visible=!1;return}e.group.visible=!0,e.group.position.set(e.x,0,e.z),e.group.rotation.y=e.yaw;let n=t?Math.sin(B*1.6+e.id)*.06:Math.sin(e.walk)*.7;e.legL.rotation.x=n,e.legR.rotation.x=-n,e.armL.rotation.x=t?.15:-n*.45,e.armR.rotation.x=e.alert>0?1.25:.55;let r=e.flash>0?e.flash/.12:0;for(let t of e.bodyMats)t.emissive.setRGB(r,r*.25,r*.12);e.flash>0&&(e.flash=Math.max(0,e.flash-.016))}function Qr(e,t){let n=new ne;if(t){let e=.5+Math.sin(B*10)*.5;return n.setRGB(W(.85,.95,e),W(.45,.85,e),W(.2,.3,e)),n}let r=e/100;return n.setRGB(W(.24,.89,r),W(.72,.64,r),W(.7,.13,r)),n}function $r(){for(let e of Y){let t=!1;for(let n of X)n.enabled&&n.alive&&Math.hypot(n.x-e.x,n.z-e.z)<e.r&&(t=!0);let n=Fr(e)&&t&&R===`play`,r=Qr(e.p,n);e.ring.material.color.copy(r),e.disc.material.color.copy(r),e.beam.material.color.copy(r),e.light.color.copy(r),e.light.intensity=.55+Math.sin(B*(n?14:2)+e.x)*(n?.45:.08),e.sign.lookAt(q.position.x,e.sign.position.y,q.position.z)}}function ei(e){for(let[t,n]of Zn)n-e<=0?Zn.delete(t):Zn.set(t,n-e);if(Xn&&Xn.parent?.visible){let t=Xn.geometry.attributes.position;for(let n=0;n<t.count;n++){let r=t.getY(n)+e*(.03+n%5*.012);r>.16&&(r=-.02),t.setY(n,r),t.setX(n,t.getX(n)+Math.sin(performance.now()*.002+n)*e*.01)}t.needsUpdate=!0}if(dr=Math.max(0,dr-e),fr=Math.max(0,fr-e),pr>0&&R===`play`){let t=Math.min(e,pr);pr-=t;let n=Or(Q.yaw,0),r=Tr(Q.x,Q.z,n.x*22*t,n.z*22*t,.38);Q.x=r.x,Q.z=r.z}if(R===`play`)for(let t of ur)t.cd=Math.max(0,t.cd-e);let t=R===`play`||R===`pause`;i.root.classList.toggle(`hidden`,!t),at(i.hp,String(Math.max(0,Math.ceil(Q.hp)))),i.hp.classList.toggle(`is-low`,Q.hp<35),at(i.armor,String(Math.max(0,Math.ceil(Q.armor)))),at(i.weaponName,`${vr().name} · ${vr().blurb}`);let n=i.slots.children;for(let e=0;e<n.length;e++)n[e].classList.toggle(`is-on`,e===sr);at(i.mag,Q.reload>0?`—`:String(Q.mag)),at(i.reserve,String(Q.reserve)),at(i.timer,ot(V)),at(i.kills,`${Q.kills} / ${Q.deaths}`),i.alfaFill.style.transform=`scaleX(${Y[0].p/100})`,i.bravoFill.style.transform=`scaleX(${Y[1].p/100})`;let r=(e,t)=>t?`CONTESTADA`:e>=100?`TUYA`:e<=1?`HOSTIL`:`CAPTURANDO`,a=e=>{if(R!==`play`||!Q.alive)return!1;let t=Fr(e),n=!1;for(let t of X)t.alive&&Math.hypot(t.x-e.x,t.z-e.z)<e.r&&(n=!0);return t&&n};at(i.alfaState,r(Y[0].p,a(Y[0]))),at(i.bravoState,r(Y[1].p,a(Y[1]))),at(i.banner,Pe>0?Ne:``),i.banner.style.opacity=Pe>0?`1`:`0`,at(i.feed,z.join(`
`));let o=H===2?`ALTO`:H===1?`MEDIO`:`BAJO`;at(i.fps,`${Math.round(Le)} FPS · ${o}`),at(i.quality,o);let s=Cr();i.cross.style.setProperty(`--gap`,`${5+s*220}px`);let c=vr().id===`dmr`&&Q.ads>.62&&R===`play`;i.cross.style.opacity=c||Q.ads>.72?`0`:`0.92`,i.scope.style.opacity=c?String(Math.min(1,(Q.ads-.62)/.25)):`0`,i.cross.classList.toggle(`is-hit`,Ct>0&&!wt),i.cross.classList.toggle(`is-head`,Ct>0&&wt),i.hit.style.opacity=String(Ct),i.hit.classList.toggle(`is-head`,wt),i.hurt.style.opacity=String(Je*.8),i.dmgN.style.opacity=String(Je*Ye),i.dmgE.style.opacity=String(Je*Xe),i.dmgS.style.opacity=String(Je*ct),i.dmgW.style.opacity=String(Je*lt);let l=Q.reload>0?1-Q.reload/vr().reloadTime:0;if(i.reloadBar.style.transform=`scaleX(${l})`,i.reloadBar.style.opacity=Q.reload>0?`1`:`0`,ze+=e,Re+=1,ze>=.35&&(Le=Re/ze,Re=0,ze=0,performance.now()-Be>2800)){He.push(Le),He.length>8&&He.shift();let e=He.reduce((e,t)=>e+t,0)/He.length;E===`auto`&&!ii&&e<52&&H>0&&performance.now()-Ve>2200&&(--H,Ve=performance.now(),He.length=0,ai())}ti()}function ti(){let e=i.minimap,t=e.getContext(`2d`);if(!t)return;e.width!==180&&(e.width=180,e.height=180);let n=e.width,r=e.height;t.clearRect(0,0,n,r),t.fillStyle=`rgba(20,24,16,0.72)`,t.fillRect(0,0,n,r);let a=(e,t)=>({px:(e+_.mini.ox)/_.mini.w*n,py:(t+_.mini.oz)/_.mini.h*r});t.fillStyle=`rgba(243,236,220,0.18)`;for(let e of Wt){if(e.maxY<.8)continue;let n=a(e.minX,e.minZ),r=a(e.maxX,e.maxZ);t.fillRect(n.px,n.py,r.px-n.px,r.py-n.py)}for(let e of Y){let n=a(e.x,e.z);t.beginPath(),t.arc(n.px,n.py,10,0,Math.PI*2),t.fillStyle=e.p>=100?`rgba(226,163,34,0.9)`:`rgba(60,184,178,0.85)`,t.fill()}for(let e of X){if(!e.enabled||!e.alive||fr<=0&&Math.hypot(e.x-Q.x,e.z-Q.z)>24&&R===`play`)continue;let n=a(e.x,e.z);t.fillStyle=`#9ff4ef`,t.fillRect(n.px-2,n.py-2,4,4)}if(M.seen&&M.alive){let e=a(M.x,M.z);t.fillStyle=`#7dffb2`,t.fillRect(e.px-2,e.py-2,5,5)}let o=a(Q.x,Q.z);t.save(),t.translate(o.px,o.py);let s=Math.atan2(-Math.cos(Q.yaw),-Math.sin(Q.yaw));t.rotate(s),t.fillStyle=`#e2a322`,t.beginPath(),t.moveTo(8,0),t.lineTo(-5,4.5),t.lineTo(-5,-4.5),t.closePath(),t.fill(),t.restore(),t.strokeStyle=`rgba(243,236,220,0.35)`,t.strokeRect(.5,.5,n-1,r-1)}function ni(e){if(M.seen){let t=1-Math.exp(-14*Math.max(e,.001));M.x=W(M.x,M.tx,t),M.y=W(M.y,M.ty,t),M.z=W(M.z,M.tz,t),M.yaw=it(M.yaw,M.tyaw,Math.max(e,.016),12),An.visible=M.alive&&R!==`menu`,An.position.set(M.x,0,M.z),An.rotation.y=M.yaw}else An.visible=!1;if(R===`menu`){Dt+=e*.13,q.position.set(Math.sin(Dt)*30,13.5,Math.cos(Dt)*24),q.lookAt(0,1.2,-2);for(let e of X)Zr(e,!0)}else{let t=Math.sin(Q.bob)*(Q.crouch>.5?.012:.045),n=Math.cos(Q.bob*.5)*.02*(1-Q.crouch),r=Math.cos(Q.yaw),i=-Math.sin(Q.yaw),a=qe*.03;q.position.set(Q.x+r*n+(Math.random()-.5)*a,Dr()+t+(Math.random()-.5)*a,Q.z+i*n+(Math.random()-.5)*a),q.rotation.y=Q.yaw+Q.recoilY,q.rotation.x=Q.pitch+Q.recoilP,q.rotation.z=Math.sin(Q.bob*.5)*.012*(1-Q.crouch);let o=vr(),s=W(k,o.adsFov,Q.ads);Math.abs(q.fov-s)>.05&&(q.fov=s,q.updateProjectionMatrix(),It.fov=s,It.updateProjectionMatrix());for(let e of X)Zr(e,Math.hypot(e.vx,e.vz)<.4);let c=Q.ads,l=Q.draw>0?Q.draw/o.draw:0;Rt.position.set(W(.24,0,c)+Ue,W(-.26,-.2,c)+t*.8+We-l*.2,W(-.5,-.38,c)-Ge*.08-l*.16),Rt.rotation.set(Q.recoilP*.4+We,Ue*.8,-Ue*.5);let u=Un[cr(ar)];if(u.mag){let e=o.reloadTime,t=Q.reload>0?Math.sin(Q.reload/e*Math.PI):0;u.pump?u.mag.position.z=u.rest+t*.14:u.mag.position.y=u.rest-t*.16}u.flash.visible=Ke>0,Ke=Math.max(0,Ke-e),Ue*=Math.exp(-8*e),We*=Math.exp(-8*e)}$r();let t=hn.geometry.attributes.position;for(let n=0;n<80;n++){let r=t.getY(n)+e*.15;r>3.6&&(r=.3),t.setY(n,r)}t.needsUpdate=!0,Vt.update(e),Vt.setHurt(R===`menu`?0:Math.min(1,Je)),G.autoClear=!0,Vt.setAo(R===`play`),Vt.render(),R!==`menu`&&(G.autoClear=!1,G.clearDepth(),G.render(Ft,It),G.autoClear=!0),ei(e)}function ri(){if(R!==`play`||Q.down>0){I=0,L=0;return}let e=g*(1-Q.ads*.45);Q.yaw-=I*e,Q.pitch=U(Q.pitch-L*e,-tt,tt),Ue=U(Ue-I*.0016,-.09,.09),We=U(We+L*8e-4,-.05,.05),I=0,L=0}let ii=!1;function ai(){let e=H===2?E===`realista`?1.75:1.5:H===1?1.15:1;if(G.setPixelRatio(Math.min(window.devicePixelRatio||1,e)),J.castShadow=H>0,G.shadowMap.enabled=H>0,H>0){let e=H===2?2048:1024;J.shadow.mapSize.set(e,e),J.shadow.map&&(J.shadow.map.dispose(),J.shadow.map=null)}for(let e of Gt)e.castShadow=H>0;Vt.setPost(H===2),Vt.setLow(H===0),oi()}function oi(){let e=t.clientWidth||window.innerWidth,n=t.clientHeight||window.innerHeight;e<2||n<2||(G.setSize(e,n,!1),Vt.resize(e,n),q.aspect=e/n,q.updateProjectionMatrix(),It.aspect=e/n,It.updateProjectionMatrix())}function si(e){if(!A||R!==`play`||(ae+=e,ae<.07))return;ae=0;let t={t:`st`,x:Q.x,y:Q.y,z:Q.z,yaw:Q.yaw,pitch:Q.pitch,hp:Q.hp,alive:Q.alive&&Q.down<=0};A.role===`host`&&(t.timer=V,t.bases=[Y[0].p,Y[1].p],t.bots=X.map(e=>({x:e.x,z:e.z,yaw:e.yaw,hp:e.hp,a:e.alive&&e.enabled?1:0}))),A.broadcast(t)}function ci(e,t){if(!e||typeof e!=`object`)return;let n=e;if(t&&!oe&&(oe=t,M.name=typeof n.name==`string`?n.name:M.name),!(t&&oe&&t!==oe&&n.t!==`go`)){if(n.t===`st`){if(M.tx=Number(n.x)||0,M.ty=Number(n.y)||0,M.tz=Number(n.z)||0,M.tyaw=Number(n.yaw)||0,M.alive=!!n.alive,M.seen=!0,A?.role===`guest`){if(typeof n.timer==`number`&&(V=n.timer),Array.isArray(n.bases)&&n.bases.length===2){let e=Y[0].p,t=Y[1].p;Y[0].p=Number(n.bases[0])||0,Y[1].p=Number(n.bases[1])||0,e<100&&Y[0].p>=100&&(kr(`BASE ALFA ASEGURADA`,2),l.secure()),t<100&&Y[1].p>=100&&(kr(`BASE BRAVO ASEGURADA`,2),l.secure())}Array.isArray(n.bots)&&n.bots.forEach((e,t)=>{let n=X[t],r=e;n&&r&&(n.x=r.x,n.z=r.z,n.yaw=r.yaw,n.hp=r.hp,n.alive=r.a===1,n.enabled=t<b)})}}else if(n.t===`go`&&A?.role===`guest`){let e=n.map;(e===`complejo`||e===`deposito`||e===`muelle`)&&(b=n.bots===4||n.bots===8?Number(n.bots):6,x=n.diff===`recluta`||n.diff===`veterano`?n.diff:`regular`,m.map=e,re(m),wn(le[e])),Ir(),Ae=!1,Mr(`play`),Nr()}else if(n.t===`hit`&&A&&A.role===`host`&&Array.isArray(n.hits)){let e=!1,t=!1;for(let r of n.hits){let n=r,i=X[n.id];if(!i)continue;let a=i.hp;Vr(i,Number(n.dmg)||0,!!n.head,`ally`),i.hp<a&&(e=!0),t||=!!n.head}e&&A.send({t:`mark`,head:t})}else n.t===`mark`?(Ct=1,wt=!!n.head,l.hit(!!n.head)):n.t===`pain`?zr(Number(n.dmg)||8,!!n.head,Number(n.x)||0,Number(n.z)||0):n.t===`end`&&A?.role===`guest`&&Lr(n.result===`win`?`win`:`lose`,String(n.why||``),!0)}}function li(e){if(je)return;let t=Math.min(.05,(e-Ie)/1e3)||0;if(Ie=e,R===`menu`)ni(t);else if(R===`play`){ri(),Fe+=t;let e=0;for(;Fe>=et&&e<3;)Xr(et),Fe-=et,e+=1;Fe>et&&(Fe=0),ni(t),si(t)}else I=0,L=0,ni(0);Ei=requestAnimationFrame(li)}function $(e){return ue?ue.has(e):ce.has(e)}function ui(){return $(`ControlLeft`)||$(`ControlRight`)||$(`KeyC`)}function di(){return pe||me||$(`Mouse0`)}function fi(e){R===`play`&&(e.preventDefault(),!(performance.now()<_r)&&(_r=performance.now()+180,Sr(sr+(e.deltaY>0?1:-1))))}function pi(e){let t=e.target;(!t||t.tagName!==`INPUT`&&t.tagName!==`TEXTAREA`)&&(rt.has(e.code)&&e.preventDefault(),ce.add(e.code),e.code===`Space`&&(xe=!0),R===`play`&&Q.down<=0&&(e.code===`Digit1`?Sr(0):e.code===`Digit2`?Sr(1):e.code===`Digit3`?Sr(2):e.code===`KeyQ`?Sr(sr+1):e.code===`KeyE`?mr(0):e.code===`KeyF`&&mr(1)),(e.code===`Escape`||e.code===`KeyP`)&&R===`play`&&xi())}function mi(e){ce.delete(e.code)}function hi(e){document.pointerLockElement===t&&(I+=e.movementX,L+=e.movementY)}function gi(e){document.pointerLockElement===t&&R===`play`&&(e.button===0&&(pe=!0),e.button===2&&(he=!0))}function _i(e){e.button===0&&(pe=!1),e.button===2&&(he=!1)}function vi(){let e=document.pointerLockElement===t;c(e),!fe&&(e?(Ae=!0,R===`pause`&&Mr(`play`)):(pe=!1,he=!1,Ae&&R===`play`&&Mr(`pause`)))}function yi(){document.visibilityState===`visible`?l.unlock():ce.clear()}function bi(){l.unlock(),l.setMuted(m.muted),A?.role!==`guest`&&(A?.role===`host`&&A.send({t:`go`,map:_.id,diff:x,bots:b}),Ir(),Ae=!1,Mr(`play`),Nr())}function xi(){if(R===`play`){try{document.exitPointerLock()}catch{}Mr(`pause`)}}function Si(){R===`pause`&&(l.unlock(),Mr(`play`),Nr())}function Ci(){try{document.exitPointerLock()}catch{}Ae=!1,Mr(`menu`)}let wi=[[window,`keydown`,pi],[window,`keyup`,mi],[window,`mousemove`,hi],[window,`mousedown`,gi],[window,`mouseup`,_i],[window,`blur`,()=>ce.clear()],[document,`pointerlockchange`,vi],[document,`visibilitychange`,yi],[window,`resize`,oi],[window,`wheel`,fi],[t,`contextmenu`,(e=>e.preventDefault())]];for(let[e,t,n]of wi)t===`wheel`?e.addEventListener(t,n,{passive:!1}):e.addEventListener(t,n);ai(),E===`rendimiento`?H=0:E===`realista`&&(H=2),ai(),oi();let Ti=()=>{if(document.querySelector(`[data-testid=intro]`))return void setTimeout(Ti,300);rn(),cn()};Ti(),l.setMuted(m.muted),l.setVolume(m.volume);let Ei=requestAnimationFrame(li),Di={dispose(){je=!0,Vt.dispose(),cancelAnimationFrame(Ei);for(let[e,t,n]of wi)e.removeEventListener(t,n);try{document.exitPointerLock()}catch{}G.dispose(),K.traverse(e=>{let t=e;t.geometry&&t.geometry.dispose();let n=t.material;Array.isArray(n)?n.forEach(e=>e.dispose()):n&&n.dispose()}),Ft.traverse(e=>{let t=e;t.geometry&&t.geometry.dispose()}),Object.values(Xt).forEach(e=>{e.map.dispose(),e.normal.dispose(),e.rough.dispose()}),ln.map.dispose(),ln.normal.dispose(),ln.rough.dispose(),Fn.map.dispose(),Fn.normal.dispose(),Fn.rough.dispose(),En.map.dispose(),En.normal.dispose(),En.rough.dispose(),Pt.dispose(),G.forceContextLoss(),delete window.__controlsTest},start:bi,resume:Si,pause:xi,toMenu:Ci,setTouchMove(e,t){Se=e,we=t},addLook(e,t){I+=e,L+=t},setFireHeld(e){pe=e},setAdsHeld(e){he=e},setSprintHeld(e){ge=e},toggleCrouch(){F=!F},reload(){Ur()},jump(){xe=!0},setMuted(e){m.muted=e,re(m),l.setMuted(e)},setSens(e){g=e,m.sens=e,re(m)},setMap(e){R!==`play`&&le[e]&&(m.map=e,re(m),wn(le[e]),a(jr()))},setQualityPref(e){E=e,m.quality=e,re(m),H=e===`rendimiento`?0:e===`realista`?2:window.matchMedia(`(pointer: coarse)`).matches||window.innerWidth<820?1:2,ai(),xn(_)},setFov(e){k=U(e,60,100),m.fov=k,re(m),q.fov=k,q.updateProjectionMatrix()},setBotCount(e){b=e===4||e===8?e:6,m.bots=b,re(m);for(let e of X)e.enabled=e.id<b,e.enabled||(e.group.visible=!1)},setDiff(e){x=e,m.diff=e,re(m)},setVolume(e){m.volume=U(e,0,1),re(m),l.setVolume(m.volume)},attachNet(e){A=e,oe=null,M.seen=!1,M.alive=!1,M.name=`Aliado`,An.visible=!1},setAllyName(e){M.name=e.slice(0,16)||`Aliado`},ingest:ci,announce(){A?.role===`host`&&R===`play`&&A.send({t:`go`,map:_.id,diff:x,bots:b})},isMuted:()=>m.muted,getSens:()=>g,selectWeapon:Sr,cycleWeapon(){Sr(sr+1)},setLoadout(e){let t=e.map(e=>nt.findIndex(t=>t.id===e)).filter(e=>e>=0).slice(0,3);for(let e of[0,1,3])t.length<3&&!t.includes(e)&&t.push(e);or=t,R!==`play`&&(sr=0,ar=or[0],br(),xr())},setAbilities(e){ur=e.filter(e=>e in lr).slice(0,2).map(e=>({id:e,cd:0}))},useAbility:mr,getAbilities:()=>ur.map(e=>({id:e.id,cd:e.cd,max:lr[e.id]})),getLoadoutNames:()=>or.map(e=>nt[e].name),setSkin(e){Rn.color.setHex(e??1842972),zn.emissive.setHex(e??0),zn.emissiveIntensity=e===null?0:.35}};return window.__controlsTest={setQuality(e){E=e===2?`realista`:e===0?`rendimiento`:`auto`,H=e,ii=!0,ai()},qaWin(e=3){for(let t=0;t<e&&t<X.length;t++)X[t].alive&&Vr(X[t],999,!1);Y[0].p=100,Y[1].p=100,Lr(`win`,`QA`)},getLoadout:()=>or.map(e=>nt[e].id),getWeapon:()=>nt[ar].id,getYaw:()=>Q.yaw,getSpeed:()=>Math.hypot(Q.vx,Q.vz),getPos:()=>({x:Q.x,y:Q.y,z:Q.z}),getFps:()=>Le,getPhase:()=>R,getPlayer:()=>({hp:Q.hp,armor:Q.armor,mag:Q.mag,alive:Q.alive,down:Q.down,pitch:Q.pitch,yaw:Q.yaw}),getBots:()=>X.map(e=>({name:e.name,hp:Math.round(e.hp),alive:e.alive,x:e.x,z:e.z})),setKeys(e){fe=!0,ue=new Set(e),R===`pause`?Mr(`play`):R!==`play`&&(Ir(),Mr(`play`))},setFire(e){fe=!0,me=e,R!==`play`&&(Ir(),Mr(`play`))},teleport(e,t){Q.x=e,Q.z=t,Q.y=0,Q.vx=0,Q.vz=0},lookAt(e,t){Q.yaw=Math.atan2(-(e-Q.x),-(t-Q.z)),Q.pitch=0,Q.recoilP=0,Q.recoilY=0},nearestBot(){let e=X[0],t=1/0;for(let n of X){let r=Math.hypot(n.x-Q.x,n.z-Q.z);r<t&&(e=n,t=r)}return{x:e.x,z:e.z,hp:e.hp,alive:e.alive,name:e.name}},deploy:()=>bi(),getRemote:()=>M.seen?{x:M.tx,z:M.tz,name:M.name}:null,getMap:()=>_.id,toMenu:()=>Ci()},Di}export{Ct as createGame};