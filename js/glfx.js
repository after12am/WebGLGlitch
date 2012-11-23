/*
 * glfx.js
 * https://github.com/after12am/WebGLGlitch
 *
 * Copyright 2011 Evan Wallace
 * Copyright 2012 Satoshi Okami
 * Released under the MIT license
 */
var fx=function(){function m(a,d,b){return Math.max(a,Math.min(d,b))}function u(a){return{_:a,loadContentsOf:function(a){this._.loadContentsOf(a)},destroy:function(){this._.destroy()}}}function z(a){return u(r.fromElement(a))}function A(a){return new B(this,a)}function C(c,d){var b=a.getExtension("OES_texture_float")?a.FLOAT:a.UNSIGNED_BYTE;this._.texture&&this._.texture.destroy();this._.spareTexture&&this._.spareTexture.destroy();this.width=c;this.height=d;this._.texture=new r(c,d,a.RGBA,b);this._.spareTexture=
new r(c,d,a.RGBA,b);this._.extraTexture=this._.extraTexture||new r(0,0,a.RGBA,b);this._.flippedShader=this._.flippedShader||new h(null,"uniform sampler2D texture;varying vec2 texCoord;void main(){gl_FragColor=texture2D(texture,vec2(texCoord.x,1.0-texCoord.y));}");this._.isInitialized=!0}function D(a,d,b){if(!this._.isInitialized||a._.width!=this.width||a._.height!=this.height)C.call(this,d?d:a._.width,b?b:a._.height);a._.use();this._.texture.drawTo(function(){h.getDefaultShader().drawRect()});
return this}function E(){this._.texture.use();this._.flippedShader.drawRect();return this}function j(a,d,b,e){(b||this._.texture).use();this._.spareTexture.drawTo(function(){a.uniforms(d).drawRect()});this._.spareTexture.swapWith(e||this._.texture)}function F(a){a.parentNode.insertBefore(this,a);a.parentNode.removeChild(a);return this}function G(){var c=new r(this._.texture.width,this._.texture.height,a.RGBA,a.UNSIGNED_BYTE);this._.texture.use();c.drawTo(function(){h.getDefaultShader().drawRect()});
return u(c)}function v(){var c=this._.texture.width,d=this._.texture.height,b=new Uint8Array(4*c*d);this._.texture.drawTo(function(){a.readPixels(0,0,c,d,a.RGBA,a.UNSIGNED_BYTE,b)});return b}function H(a){var d=this._.texture.width,b=this._.texture.height,e=v.call(this),g=document.createElement("canvas"),i=g.getContext("2d");g.width=d;g.height=b;d=i.createImageData(d,b);for(b=0;b<e.length;b++)d.data[b]=e[b];i.putImageData(d,0,0);return g.toDataURL(a)}function f(c){return function(){a=this._.gl;return c.apply(this,
arguments)}}function w(a,d,b,e,g,i,l,n){var p=b-g,o=e-i,f=l-g,h=n-i,g=a-b+g-l,i=d-e+i-n,j=p*h-f*o,f=(g*h-f*i)/j,p=(p*i-g*o)/j;return[b-a+f*b,e-d+f*e,f,l-a+p*l,n-d+p*n,p,a,d,1]}function x(a){var d=a[0],b=a[1],e=a[2],g=a[3],i=a[4],l=a[5],n=a[6],f=a[7],a=a[8],o=d*i*a-d*l*f-b*g*a+b*l*n+e*g*f-e*i*n;return[(i*a-l*f)/o,(e*f-b*a)/o,(b*l-e*i)/o,(l*n-g*a)/o,(d*a-e*n)/o,(e*g-d*l)/o,(g*f-i*n)/o,(b*n-d*f)/o,(d*i-b*g)/o]}function y(a){var d=a.length;this.xa=[];this.ya=[];this.u=[];this.y2=[];a.sort(function(a,
c){return a[0]-c[0]});for(var b=0;b<d;b++)this.xa.push(a[b][0]),this.ya.push(a[b][1]);this.u[0]=0;this.y2[0]=0;for(b=1;b<d-1;++b){var a=this.xa[b+1]-this.xa[b-1],e=(this.xa[b]-this.xa[b-1])/a,g=e*this.y2[b-1]+2;this.y2[b]=(e-1)/g;this.u[b]=(6*((this.ya[b+1]-this.ya[b])/(this.xa[b+1]-this.xa[b])-(this.ya[b]-this.ya[b-1])/(this.xa[b]-this.xa[b-1]))/a-e*this.u[b-1])/g}this.y2[d-1]=0;for(b=d-2;0<=b;--b)this.y2[b]=this.y2[b]*this.y2[b+1]+this.u[b]}function t(a,d){return new h(null,a+"uniform sampler2D texture;uniform vec2 texSize;varying vec2 texCoord;void main(){vec2 coord=texCoord*texSize;"+
d+"gl_FragColor=texture2D(texture,coord/texSize);vec2 clampedCoord=clamp(coord,vec2(0.0),texSize);if(coord!=clampedCoord){gl_FragColor.a*=max(0.0,1.0-length(coord-clampedCoord));}}")}function I(c,d){a.brightnessContrast=a.brightnessContrast||new h(null,"uniform sampler2D texture;uniform float brightness;uniform float contrast;varying vec2 texCoord;void main(){vec4 color=texture2D(texture,texCoord);color.rgb+=brightness;if(contrast>0.0){color.rgb=(color.rgb-0.5)/(1.0-contrast)+0.5;}else{color.rgb=(color.rgb-0.5)*(1.0+contrast)+0.5;}gl_FragColor=color;}");
j.call(this,a.brightnessContrast,{brightness:m(-1,c,1),contrast:m(-1,d,1)});return this}function s(a){for(var a=new y(a),d=[],b=0;256>b;b++)d.push(m(0,Math.floor(256*a.interpolate(b/255)),255));return d}function J(c,d,b){c=s(c);1==arguments.length?d=b=c:(d=s(d),b=s(b));for(var e=[],g=0;256>g;g++)e.splice(e.length,0,c[g],d[g],b[g],255);this._.extraTexture.initFromBytes(256,1,e);this._.extraTexture.use(1);a.curves=a.curves||new h(null,"uniform sampler2D texture;uniform sampler2D map;varying vec2 texCoord;void main(){vec4 color=texture2D(texture,texCoord);color.r=texture2D(map,vec2(color.r)).r;color.g=texture2D(map,vec2(color.g)).g;color.b=texture2D(map,vec2(color.b)).b;gl_FragColor=color;}");
a.curves.textures({map:1});j.call(this,a.curves,{});return this}function K(c){a.denoise=a.denoise||new h(null,"uniform sampler2D texture;uniform float exponent;uniform float strength;uniform vec2 texSize;varying vec2 texCoord;void main(){vec4 center=texture2D(texture,texCoord);vec4 color=vec4(0.0);float total=0.0;for(float x=-4.0;x<=4.0;x+=1.0){for(float y=-4.0;y<=4.0;y+=1.0){vec4 sample=texture2D(texture,texCoord+vec2(x,y)/texSize);float weight=1.0-abs(dot(sample.rgb-center.rgb,vec3(0.25)));weight=pow(weight,exponent);color+=sample*weight;total+=weight;}}gl_FragColor=color/total;}");
for(var d=0;2>d;d++)j.call(this,a.denoise,{exponent:Math.max(0,c),texSize:[this.width,this.height]});return this}function L(c,d){a.hueSaturation=a.hueSaturation||new h(null,"uniform sampler2D texture;uniform float hue;uniform float saturation;varying vec2 texCoord;void main(){vec4 color=texture2D(texture,texCoord);float angle=hue*3.14159265;float s=sin(angle),c=cos(angle);vec3 weights=(vec3(2.0*c,-sqrt(3.0)*s-c,sqrt(3.0)*s-c)+1.0)/3.0;float len=length(color.rgb);color.rgb=vec3(dot(color.rgb,weights.xyz),dot(color.rgb,weights.zxy),dot(color.rgb,weights.yzx));float average=(color.r+color.g+color.b)/3.0;if(saturation>0.0){color.rgb+=(average-color.rgb)*(1.0-1.0/(1.001-saturation));}else{color.rgb+=(average-color.rgb)*(-saturation);}gl_FragColor=color;}");
j.call(this,a.hueSaturation,{hue:m(-1,c,1),saturation:m(-1,d,1)});return this}function M(c){a.noise=a.noise||new h(null,"uniform sampler2D texture;uniform float amount;varying vec2 texCoord;float rand(vec2 co){return fract(sin(dot(co.xy,vec2(12.9898,78.233)))*43758.5453);}void main(){vec4 color=texture2D(texture,texCoord);float diff=(rand(texCoord)-0.5)*amount;color.r+=diff;color.g+=diff;color.b+=diff;gl_FragColor=color;}");
j.call(this,a.noise,{amount:m(0,c,1)});return this}function N(c){a.sepia=a.sepia||new h(null,"uniform sampler2D texture;uniform float amount;varying vec2 texCoord;void main(){vec4 color=texture2D(texture,texCoord);float r=color.r;float g=color.g;float b=color.b;color.r=min(1.0,(r*(1.0-(0.607*amount)))+(g*(0.769*amount))+(b*(0.189*amount)));color.g=min(1.0,(r*0.349*amount)+(g*(1.0-(0.314*amount)))+(b*0.168*amount));color.b=min(1.0,(r*0.272*amount)+(g*0.534*amount)+(b*(1.0-(0.869*amount))));gl_FragColor=color;}");
j.call(this,a.sepia,{amount:m(0,c,1)});return this}function O(c,d){a.unsharpMask=a.unsharpMask||new h(null,"uniform sampler2D blurredTexture;uniform sampler2D originalTexture;uniform float strength;uniform float threshold;varying vec2 texCoord;void main(){vec4 blurred=texture2D(blurredTexture,texCoord);vec4 original=texture2D(originalTexture,texCoord);gl_FragColor=mix(blurred,original,1.0+strength);}");
this._.extraTexture.ensureFormat(this._.texture);this._.texture.use();this._.extraTexture.drawTo(function(){h.getDefaultShader().drawRect()});this._.extraTexture.use(1);this.triangleBlur(c);a.unsharpMask.textures({originalTexture:1});j.call(this,a.unsharpMask,{strength:d});this._.extraTexture.unuse(1);return this}function P(c){a.vibrance=a.vibrance||new h(null,"uniform sampler2D texture;uniform float amount;varying vec2 texCoord;void main(){vec4 color=texture2D(texture,texCoord);float average=(color.r+color.g+color.b)/3.0;float mx=max(color.r,max(color.g,color.b));float amt=(mx-average)*(-amount*3.0);color.rgb=mix(color.rgb,vec3(mx),amt);gl_FragColor=color;}");
j.call(this,a.vibrance,{amount:m(-1,c,1)});return this}function Q(c,d){a.vignette=a.vignette||new h(null,"uniform sampler2D texture;uniform float size;uniform float amount;varying vec2 texCoord;void main(){vec4 color=texture2D(texture,texCoord);float dist=distance(texCoord,vec2(0.5,0.5));color.rgb*=smoothstep(0.8,size*0.799,dist*(amount+size));gl_FragColor=color;}");
j.call(this,a.vignette,{size:m(0,c,1),amount:m(0,d,1)});return this}function R(c,d,b){a.lensBlurPrePass=a.lensBlurPrePass||new h(null,"uniform sampler2D texture;uniform float power;varying vec2 texCoord;void main(){vec4 color=texture2D(texture,texCoord);color=pow(color,vec4(power));gl_FragColor=vec4(color);}");var e="uniform sampler2D texture0;uniform sampler2D texture1;uniform vec2 delta0;uniform vec2 delta1;uniform float power;varying vec2 texCoord;"+
q+"vec4 sample(vec2 delta){float offset=random(vec3(delta,151.7182),0.0);vec4 color=vec4(0.0);float total=0.0;for(float t=0.0;t<=30.0;t++){float percent=(t+offset)/30.0;color+=texture2D(texture0,texCoord+delta*percent);total+=1.0;}return color/total;}";
a.lensBlur0=a.lensBlur0||new h(null,e+"void main(){gl_FragColor=sample(delta0);}");a.lensBlur1=a.lensBlur1||new h(null,e+"void main(){gl_FragColor=(sample(delta0)+sample(delta1))*0.5;}");a.lensBlur2=a.lensBlur2||(new h(null,e+"void main(){vec4 color=(sample(delta0)+2.0*texture2D(texture1,texCoord))/3.0;gl_FragColor=pow(color,vec4(power));}")).textures({texture1:1});for(var e=
[],g=0;3>g;g++){var i=b+2*g*Math.PI/3;e.push([c*Math.sin(i)/this.width,c*Math.cos(i)/this.height])}c=Math.pow(10,m(-1,d,1));j.call(this,a.lensBlurPrePass,{power:c});this._.extraTexture.ensureFormat(this._.texture);j.call(this,a.lensBlur0,{delta0:e[0]},this._.texture,this._.extraTexture);j.call(this,a.lensBlur1,{delta0:e[1],delta1:e[2]},this._.extraTexture,this._.extraTexture);j.call(this,a.lensBlur0,{delta0:e[1]});this._.extraTexture.use(1);j.call(this,a.lensBlur2,{power:1/c,delta0:e[2]});return this}
function S(c,d,b,e,g,i){a.tiltShift=a.tiltShift||new h(null,"uniform sampler2D texture;uniform float blurRadius;uniform float gradientRadius;uniform vec2 start;uniform vec2 end;uniform vec2 delta;uniform vec2 texSize;varying vec2 texCoord;"+q+"void main(){vec4 color=vec4(0.0);float total=0.0;float offset=random(vec3(12.9898,78.233,151.7182),0.0);vec2 normal=normalize(vec2(start.y-end.y,end.x-start.x));float radius=smoothstep(0.0,1.0,abs(dot(texCoord*texSize-start,normal))/gradientRadius)*blurRadius;for(float t=-30.0;t<=30.0;t++){float percent=(t+offset-0.5)/30.0;float weight=1.0-abs(percent);vec4 sample=texture2D(texture,texCoord+delta/texSize*percent*radius);sample.rgb*=sample.a;color+=sample*weight;total+=weight;}gl_FragColor=color/total;gl_FragColor.rgb/=gl_FragColor.a+0.00001;}");
var l=b-c,n=e-d,f=Math.sqrt(l*l+n*n);j.call(this,a.tiltShift,{blurRadius:g,gradientRadius:i,start:[c,d],end:[b,e],delta:[l/f,n/f],texSize:[this.width,this.height]});j.call(this,a.tiltShift,{blurRadius:g,gradientRadius:i,start:[c,d],end:[b,e],delta:[-n/f,l/f],texSize:[this.width,this.height]});return this}function T(c){a.triangleBlur=a.triangleBlur||new h(null,"uniform sampler2D texture;uniform vec2 delta;varying vec2 texCoord;"+q+"void main(){vec4 color=vec4(0.0);float total=0.0;float offset=random(vec3(12.9898,78.233,151.7182),0.0);for(float t=-30.0;t<=30.0;t++){float percent=(t+offset-0.5)/30.0;float weight=1.0-abs(percent);vec4 sample=texture2D(texture,texCoord+delta*percent);sample.rgb*=sample.a;color+=sample*weight;total+=weight;}gl_FragColor=color/total;gl_FragColor.rgb/=gl_FragColor.a+0.00001;}");
j.call(this,a.triangleBlur,{delta:[c/this.width,0]});j.call(this,a.triangleBlur,{delta:[0,c/this.height]});return this}function U(c,d,b){a.zoomBlur=a.zoomBlur||new h(null,"uniform sampler2D texture;uniform vec2 center;uniform float strength;uniform vec2 texSize;varying vec2 texCoord;"+q+"void main(){vec4 color=vec4(0.0);float total=0.0;vec2 toCenter=center-texCoord*texSize;float offset=random(vec3(12.9898,78.233,151.7182),0.0);for(float t=0.0;t<=40.0;t++){float percent=(t+offset)/40.0;float weight=4.0*(percent-percent*percent);vec4 sample=texture2D(texture,texCoord+toCenter*percent*strength/texSize);sample.rgb*=sample.a;color+=sample*weight;total+=weight;}gl_FragColor=color/total;gl_FragColor.rgb/=gl_FragColor.a+0.00001;}");
j.call(this,a.zoomBlur,{center:[c,d],strength:b,texSize:[this.width,this.height]});return this}function V(c,d,b,e){a.colorHalftone=a.colorHalftone||new h(null,"uniform sampler2D texture;uniform vec2 center;uniform float angle;uniform float scale;uniform vec2 texSize;varying vec2 texCoord;float pattern(float angle){float s=sin(angle),c=cos(angle);vec2 tex=texCoord*texSize-center;vec2 point=vec2(c*tex.x-s*tex.y,s*tex.x+c*tex.y)*scale;return(sin(point.x)*sin(point.y))*4.0;}void main(){vec4 color=texture2D(texture,texCoord);vec3 cmy=1.0-color.rgb;float k=min(cmy.x,min(cmy.y,cmy.z));cmy=(cmy-k)/(1.0-k);cmy=clamp(cmy*10.0-3.0+vec3(pattern(angle+0.26179),pattern(angle+1.30899),pattern(angle)),0.0,1.0);k=clamp(k*10.0-5.0+pattern(angle+0.78539),0.0,1.0);gl_FragColor=vec4(1.0-cmy-k,color.a);}");
j.call(this,a.colorHalftone,{center:[c,d],angle:b,scale:Math.PI/e,texSize:[this.width,this.height]});return this}function W(c,d,b,e){a.dotScreen=a.dotScreen||new h(null,"uniform sampler2D texture;uniform vec2 center;uniform float angle;uniform float scale;uniform vec2 texSize;varying vec2 texCoord;float pattern(){float s=sin(angle),c=cos(angle);vec2 tex=texCoord*texSize-center;vec2 point=vec2(c*tex.x-s*tex.y,s*tex.x+c*tex.y)*scale;return(sin(point.x)*sin(point.y))*4.0;}void main(){vec4 color=texture2D(texture,texCoord);float average=(color.r+color.g+color.b)/3.0;gl_FragColor=vec4(vec3(average*10.0-5.0+pattern()),color.a);}");
j.call(this,a.dotScreen,{center:[c,d],angle:b,scale:Math.PI/e,texSize:[this.width,this.height]});return this}function X(c){a.edgeWork1=a.edgeWork1||new h(null,"uniform sampler2D texture;uniform vec2 delta;varying vec2 texCoord;"+q+"void main(){vec2 color=vec2(0.0);vec2 total=vec2(0.0);float offset=random(vec3(12.9898,78.233,151.7182),0.0);for(float t=-30.0;t<=30.0;t++){float percent=(t+offset-0.5)/30.0;float weight=1.0-abs(percent);vec3 sample=texture2D(texture,texCoord+delta*percent).rgb;float average=(sample.r+sample.g+sample.b)/3.0;color.x+=average*weight;total.x+=weight;if(abs(t)<15.0){weight=weight*2.0-1.0;color.y+=average*weight;total.y+=weight;}}gl_FragColor=vec4(color/total,0.0,1.0);}");
a.edgeWork2=a.edgeWork2||new h(null,"uniform sampler2D texture;uniform vec2 delta;varying vec2 texCoord;"+q+"void main(){vec2 color=vec2(0.0);vec2 total=vec2(0.0);float offset=random(vec3(12.9898,78.233,151.7182),0.0);for(float t=-30.0;t<=30.0;t++){float percent=(t+offset-0.5)/30.0;float weight=1.0-abs(percent);vec2 sample=texture2D(texture,texCoord+delta*percent).xy;color.x+=sample.x*weight;total.x+=weight;if(abs(t)<15.0){weight=weight*2.0-1.0;color.y+=sample.y*weight;total.y+=weight;}}float c=clamp(10000.0*(color.y/total.y-color.x/total.x)+0.5,0.0,1.0);gl_FragColor=vec4(c,c,c,1.0);}");
j.call(this,a.edgeWork1,{delta:[c/this.width,0]});j.call(this,a.edgeWork2,{delta:[0,c/this.height]});return this}function Y(c,d,b){a.hexagonalPixelate=a.hexagonalPixelate||new h(null,"uniform sampler2D texture;uniform vec2 center;uniform float scale;uniform vec2 texSize;varying vec2 texCoord;void main(){vec2 tex=(texCoord*texSize-center)/scale;tex.y/=0.866025404;tex.x-=tex.y*0.5;vec2 a;if(tex.x+tex.y-floor(tex.x)-floor(tex.y)<1.0)a=vec2(floor(tex.x),floor(tex.y));else a=vec2(ceil(tex.x),ceil(tex.y));vec2 b=vec2(ceil(tex.x),floor(tex.y));vec2 c=vec2(floor(tex.x),ceil(tex.y));vec3 TEX=vec3(tex.x,tex.y,1.0-tex.x-tex.y);vec3 A=vec3(a.x,a.y,1.0-a.x-a.y);vec3 B=vec3(b.x,b.y,1.0-b.x-b.y);vec3 C=vec3(c.x,c.y,1.0-c.x-c.y);float alen=length(TEX-A);float blen=length(TEX-B);float clen=length(TEX-C);vec2 choice;if(alen<blen){if(alen<clen)choice=a;else choice=c;}else{if(blen<clen)choice=b;else choice=c;}choice.x+=choice.y*0.5;choice.y*=0.866025404;choice*=scale/texSize;gl_FragColor=texture2D(texture,choice+center/texSize);}");
j.call(this,a.hexagonalPixelate,{center:[c,d],scale:b,texSize:[this.width,this.height]});return this}function Z(c){a.ink=a.ink||new h(null,"uniform sampler2D texture;uniform float strength;uniform vec2 texSize;varying vec2 texCoord;void main(){vec2 dx=vec2(1.0/texSize.x,0.0);vec2 dy=vec2(0.0,1.0/texSize.y);vec4 color=texture2D(texture,texCoord);float bigTotal=0.0;float smallTotal=0.0;vec3 bigAverage=vec3(0.0);vec3 smallAverage=vec3(0.0);for(float x=-2.0;x<=2.0;x+=1.0){for(float y=-2.0;y<=2.0;y+=1.0){vec3 sample=texture2D(texture,texCoord+dx*x+dy*y).rgb;bigAverage+=sample;bigTotal+=1.0;if(abs(x)+abs(y)<2.0){smallAverage+=sample;smallTotal+=1.0;}}}vec3 edge=max(vec3(0.0),bigAverage/bigTotal-smallAverage/smallTotal);gl_FragColor=vec4(color.rgb-dot(edge,edge)*strength*100000.0,color.a);}");
j.call(this,a.ink,{strength:c*c*c*c*c,texSize:[this.width,this.height]});return this}function $(c,d,b,e){a.bulgePinch=a.bulgePinch||t("uniform float radius;uniform float strength;uniform vec2 center;","coord-=center;float distance=length(coord);if(distance<radius){float percent=distance/radius;if(strength>0.0){coord*=mix(1.0,smoothstep(0.0,radius/distance,percent),strength*0.75);}else{coord*=mix(1.0,pow(percent,1.0+strength*0.75)*radius/distance,1.0-percent);}}coord+=center;");
j.call(this,a.bulgePinch,{radius:b,strength:m(-1,e,1),center:[c,d],texSize:[this.width,this.height]});return this}function aa(c,d,b){a.matrixWarp=a.matrixWarp||t("uniform mat3 matrix;uniform bool useTextureSpace;","if(useTextureSpace)coord=coord/texSize*2.0-1.0;vec3 warp=matrix*vec3(coord,1.0);coord=warp.xy/warp.z;if(useTextureSpace)coord=(coord*0.5+0.5)*texSize;");c=Array.prototype.concat.apply([],c);if(4==c.length)c=
[c[0],c[1],0,c[2],c[3],0,0,0,1];else if(9!=c.length)throw"can only warp with 2x2 or 3x3 matrix";j.call(this,a.matrixWarp,{matrix:d?x(c):c,texSize:[this.width,this.height],useTextureSpace:b|0});return this}function ba(a,d){var b=w.apply(null,d),e=w.apply(null,a),b=x(b);return this.matrixWarp([b[0]*e[0]+b[1]*e[3]+b[2]*e[6],b[0]*e[1]+b[1]*e[4]+b[2]*e[7],b[0]*e[2]+b[1]*e[5]+b[2]*e[8],b[3]*e[0]+b[4]*e[3]+b[5]*e[6],b[3]*e[1]+b[4]*e[4]+b[5]*e[7],b[3]*e[2]+b[4]*e[5]+b[5]*e[8],b[6]*e[0]+b[7]*e[3]+b[8]*e[6],
b[6]*e[1]+b[7]*e[4]+b[8]*e[7],b[6]*e[2]+b[7]*e[5]+b[8]*e[8]])}function ca(c,d,b,e){a.swirl=a.swirl||t("uniform float radius;uniform float angle;uniform vec2 center;","coord-=center;float distance=length(coord);if(distance<radius){float percent=(radius-distance)/radius;float theta=percent*percent*angle;float s=sin(theta);float c=cos(theta);coord=vec2(coord.x*c-coord.y*s,coord.x*s+coord.y*c);}coord+=center;");
j.call(this,a.swirl,{radius:b,center:[c,d],angle:e,texSize:[this.width,this.height]});return this}var k={},a;k.canvas=function(){var c=document.createElement("canvas");try{a=c.getContext("experimental-webgl",{premultipliedAlpha:!1})}catch(d){a=null}if(!a)throw"This browser does not support WebGL";c._={gl:a,isInitialized:!1,texture:null,spareTexture:null,flippedShader:null};c.texture=f(z);c.draw=f(D);c.update=f(E);c.replace=f(F);c.contents=f(G);c.getPixelArray=f(v);c.toDataURL=f(H);c.brightnessContrast=
f(I);c.hexagonalPixelate=f(Y);c.hueSaturation=f(L);c.colorHalftone=f(V);c.triangleBlur=f(T);c.unsharpMask=f(O);c.perspective=f(ba);c.matrixWarp=f(aa);c.bulgePinch=f($);c.tiltShift=f(S);c.dotScreen=f(W);c.edgeWork=f(X);c.lensBlur=f(R);c.zoomBlur=f(U);c.noise=f(M);c.denoise=f(K);c.curves=f(J);c.swirl=f(ca);c.ink=f(Z);c.vignette=f(Q);c.vibrance=f(P);c.sepia=f(N);c.glitch=f(A);return c};k.splineInterpolate=s;k.ALPHA=6406;k.LUMINANCE=6409;k.LUMINANCE_ALPHA=6410;k.RGB=6407;k.RGBA=6408;k.UNSIGNED_BYTE=5121;
k.UNSIGNED_SHORT_4_4_4_4=32819;k.UNSIGNED_SHORT_5_5_5_1=32820;k.UNSIGNED_SHORT_5_6_5=33635;var B=function(a,d){var b=a._.gl;a.draw(d);var e=a.getPixelArray(),g,i,l,f,h;this.width=function(a){g=a=a||d._.width;return this};this.height=function(a){i=a=a||d._.height;return this};this.shortenX=function(a){g=d._.width-(a||0);return this};this.shortenY=function(a){i=d._.height-(a||0);return this};this.type=function(a){switch(a){case k.UNSIGNED_BYTE:case k.UNSIGNED_SHORT_5_6_5:case k.UNSIGNED_SHORT_4_4_4_4:case k.UNSIGNED_SHORT_5_5_5_1:f=
a;break;default:console.log("[GLITCH TYPE ERROR] type supports only fx.UNSIGNED_BYTE, fx.UNSIGNED_SHORT_5_6_5, fx.UNSIGNED_SHORT_4_4_4_4, fx.UNSIGNED_SHORT_5_5_5_1.")}return this};this.format=function(a){switch(a){case k.ALPHA:case k.LUMINANCE:case k.LUMINANCE_ALPHA:case k.RGB:case k.RGBA:l=a;break;default:console.log("[GLITCH FORMAT ERROR] format supports only fx.ALPHA, fx.LUMINANCE, fx.LUMINANCE_ALPHA, fx.RGB and fx.RGBA.")}return this};this.offset=function(a){for(var b=e.subarray(0,a),a=e.subarray(a,
e.length),c=new Uint8Array(e.length),d=0,g=0;g<a.length;g++)c[d]=a[g],d++;for(g=0;g<b.length;g++)c[d]=b[g],d++;e=c;return this};this.length=function(){return e.length()};this.process=function(a){h=a||function(){};return this};this.update=function(){g=g||d._.width;i=i||d._.height;l=l||k.RGBA;f=f||k.UNSIGNED_BYTE;h=h||function(){};h(e);b.bindTexture(b.TEXTURE_2D,d._.id);b.texImage2D(b.TEXTURE_2D,0,l,g,i,0,l,f,e);a.draw(d).update();return this}},h=function(){function c(b,c){var e=a.createShader(b);a.shaderSource(e,
c);a.compileShader(e);if(!a.getShaderParameter(e,a.COMPILE_STATUS))throw"compile error: "+a.getShaderInfoLog(e);return e}function d(d,i){this.texCoordAttribute=this.vertexAttribute=null;this.program=a.createProgram();d=d||b;i=i||e;i="precision highp float;"+i;a.attachShader(this.program,c(a.VERTEX_SHADER,d));a.attachShader(this.program,c(a.FRAGMENT_SHADER,i));a.linkProgram(this.program);if(!a.getProgramParameter(this.program,a.LINK_STATUS))throw"link error: "+a.getProgramInfoLog(this.program);}var b=
"attribute vec2 vertex;attribute vec2 _texCoord;varying vec2 texCoord;void main(){texCoord=_texCoord;gl_Position=vec4(vertex*2.0-1.0,0.0,1.0);}",e="uniform sampler2D texture;varying vec2 texCoord;void main(){gl_FragColor=texture2D(texture,texCoord);}";d.prototype.destroy=function(){a.deleteProgram(this.program);this.program=null};d.prototype.uniforms=function(b){a.useProgram(this.program);for(var c in b)if(b.hasOwnProperty(c)){var e=
a.getUniformLocation(this.program,c);if(null!==e){var d=b[c];if("[object Array]"==Object.prototype.toString.call(d))switch(d.length){case 1:a.uniform1fv(e,new Float32Array(d));break;case 2:a.uniform2fv(e,new Float32Array(d));break;case 3:a.uniform3fv(e,new Float32Array(d));break;case 4:a.uniform4fv(e,new Float32Array(d));break;case 9:a.uniformMatrix3fv(e,!1,new Float32Array(d));break;case 16:a.uniformMatrix4fv(e,!1,new Float32Array(d));break;default:throw"dont't know how to load uniform \""+c+'" of length '+
d.length;}else if("[object Number]"==Object.prototype.toString.call(d))a.uniform1f(e,d);else throw'attempted to set uniform "'+c+'" to invalid value '+(d||"undefined").toString();}}return this};d.prototype.textures=function(b){a.useProgram(this.program);for(var e in b)b.hasOwnProperty(e)&&a.uniform1i(a.getUniformLocation(this.program,e),b[e]);return this};d.prototype.drawRect=function(b,e,c,d){var f=a.getParameter(a.VIEWPORT),e=void 0!==e?(e-f[1])/f[3]:0,b=void 0!==b?(b-f[0])/f[2]:0,c=void 0!==c?
(c-f[0])/f[2]:1,d=void 0!==d?(d-f[1])/f[3]:1;null==a.vertexBuffer&&(a.vertexBuffer=a.createBuffer());a.bindBuffer(a.ARRAY_BUFFER,a.vertexBuffer);a.bufferData(a.ARRAY_BUFFER,new Float32Array([b,e,b,d,c,e,c,d]),a.STATIC_DRAW);null==a.texCoordBuffer&&(a.texCoordBuffer=a.createBuffer(),a.bindBuffer(a.ARRAY_BUFFER,a.texCoordBuffer),a.bufferData(a.ARRAY_BUFFER,new Float32Array([0,0,0,1,1,0,1,1]),a.STATIC_DRAW));null==this.vertexAttribute&&(this.vertexAttribute=a.getAttribLocation(this.program,"vertex"),
a.enableVertexAttribArray(this.vertexAttribute));null==this.texCoordAttribute&&(this.texCoordAttribute=a.getAttribLocation(this.program,"_texCoord"),a.enableVertexAttribArray(this.texCoordAttribute));a.useProgram(this.program);a.bindBuffer(a.ARRAY_BUFFER,a.vertexBuffer);a.vertexAttribPointer(this.vertexAttribute,2,a.FLOAT,!1,0,0);a.bindBuffer(a.ARRAY_BUFFER,a.texCoordBuffer);a.vertexAttribPointer(this.texCoordAttribute,2,a.FLOAT,!1,0,0);a.drawArrays(a.TRIANGLE_STRIP,0,4)};d.getDefaultShader=function(){a.defaultShader=
a.defaultShader||new d;return a.defaultShader};return d}();y.prototype.interpolate=function(a){for(var d=0,b=this.ya.length-1;1<b-d;){var e=b+d>>1;this.xa[e]>a?b=e:d=e}var e=this.xa[b]-this.xa[d],g=(this.xa[b]-a)/e,a=(a-this.xa[d])/e;return g*this.ya[d]+a*this.ya[b]+((g*g*g-g)*this.y2[d]+(a*a*a-a)*this.y2[b])*e*e/6};var r=function(){function c(b,c,d,f){this.id=a.createTexture();this.width=b;this.height=c;this.format=d;this.type=f;a.bindTexture(a.TEXTURE_2D,this.id);a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MAG_FILTER,
a.LINEAR);a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.LINEAR);a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_S,a.CLAMP_TO_EDGE);a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_T,a.CLAMP_TO_EDGE);b&&c&&a.texImage2D(a.TEXTURE_2D,0,this.format,b,c,0,this.format,this.type,null)}function d(a){null==b&&(b=document.createElement("canvas"));b.width=a.width;b.height=a.height;a=b.getContext("2d");a.clearRect(0,0,b.width,b.height);return a}c.fromElement=function(b){var d=new c(0,0,a.RGBA,a.UNSIGNED_BYTE);d.loadContentsOf(b);
return d};c.prototype.loadContentsOf=function(b){this.width=b.width||b.videoWidth;this.height=b.height||b.videoHeight;a.bindTexture(a.TEXTURE_2D,this.id);a.texImage2D(a.TEXTURE_2D,0,this.format,this.format,this.type,b)};c.prototype.initFromBytes=function(b,c,d){this.width=b;this.height=c;this.format=a.RGBA;this.type=a.UNSIGNED_BYTE;a.bindTexture(a.TEXTURE_2D,this.id);a.texImage2D(a.TEXTURE_2D,0,a.RGBA,b,c,0,a.RGBA,this.type,new Uint8Array(d))};c.prototype.destroy=function(){a.deleteTexture(this.id);
this.id=null};c.prototype.use=function(b){a.activeTexture(a.TEXTURE0+(b||0));a.bindTexture(a.TEXTURE_2D,this.id)};c.prototype.unuse=function(b){a.activeTexture(a.TEXTURE0+(b||0));a.bindTexture(a.TEXTURE_2D,null)};c.prototype.ensureFormat=function(b,c,d,f){if(1==arguments.length)var h=arguments[0],b=h.width,c=h.height,d=h.format,f=h.type;if(b!=this.width||c!=this.height||d!=this.format||f!=this.type)this.width=b,this.height=c,this.format=d,this.type=f,a.bindTexture(a.TEXTURE_2D,this.id),a.texImage2D(a.TEXTURE_2D,
0,this.format,b,c,0,this.format,this.type,null)};c.prototype.drawTo=function(b){a.framebuffer=a.framebuffer||a.createFramebuffer();a.bindFramebuffer(a.FRAMEBUFFER,a.framebuffer);a.framebufferTexture2D(a.FRAMEBUFFER,a.COLOR_ATTACHMENT0,a.TEXTURE_2D,this.id,0);a.viewport(0,0,this.width,this.height);b();a.bindFramebuffer(a.FRAMEBUFFER,null)};var b=null;c.prototype.fillUsingCanvas=function(c){c(d(this));this.format=a.RGBA;this.type=a.UNSIGNED_BYTE;a.bindTexture(a.TEXTURE_2D,this.id);a.texImage2D(a.TEXTURE_2D,
0,a.RGBA,a.RGBA,a.UNSIGNED_BYTE,b);return this};c.prototype.toImage=function(c){this.use();h.getDefaultShader().drawRect();var f=4*this.width*this.height,i=new Uint8Array(f),j=d(this),k=j.createImageData(this.width,this.height);a.readPixels(0,0,this.width,this.height,a.RGBA,a.UNSIGNED_BYTE,i);for(var m=0;m<f;m++)k.data[m]=i[m];j.putImageData(k,0,0);c.src=b.toDataURL()};c.prototype.swapWith=function(a){var b;b=a.id;a.id=this.id;this.id=b;b=a.width;a.width=this.width;this.width=b;b=a.height;a.height=
this.height;this.height=b;b=a.format;a.format=this.format;this.format=b};return c}(),q="float random(vec3 scale,float seed){return fract(sin(dot(gl_FragCoord.xyz+seed,scale))*43758.5453+seed);}";return k}();
