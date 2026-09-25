precision highp float;

uniform sampler2D uField;// .r = base field, .g = blur field (low-res)
uniform vec2 uResolution;// FULL-RES resolution
uniform float uTime;

varying vec2 vUv;

#define LEVEL_BIAS 0.
#define LEVEL_GAIN 1.
#define CA_PX 14.
#define GRAIN.08

// --------------------------------------------------------------------------
// Hashes
// --------------------------------------------------------------------------

float h31(vec3 p){
    p=fract(p*.1031);
    p+=dot(p,p.zyx+31.32);
    return fract((p.x+p.y)*p.z);
}

float h21(vec2 p){
    vec3 q=fract(vec3(p.xyx)*.1031);
    q+=dot(q,q.yzx+33.33);
    return fract((q.x+q.y)*q.z);
}

// --------------------------------------------------------------------------
// Fine pre-palette grain — a single cheap value-noise call, done here at
// full resolution so it stays crisp instead of being smeared by the
// low-res field texture's bilinear upscale.
// --------------------------------------------------------------------------

float vnoise(vec3 p){
    vec3 i=floor(p);
    vec3 f=fract(p);
    f=f*f*(3.-2.*f);
    
    return mix(
        mix(
            mix(h31(i),h31(i+vec3(1.,0.,0.)),f.x),
            mix(h31(i+vec3(0.,1.,0.)),h31(i+vec3(1.,1.,0.)),f.x),
            f.y
        ),
        mix(
            mix(h31(i+vec3(0.,0.,1.)),h31(i+vec3(1.,0.,1.)),f.x),
            mix(h31(i+vec3(0.,1.,1.)),h31(i+vec3(1.,1.,1.)),f.x),
            f.y
        ),
        f.z
    );
}

// --------------------------------------------------------------------------
// Gradient LUT
// black -> light gray -> dark blue -> black
// --------------------------------------------------------------------------

vec3 lut(float x){
    const vec3 K=vec3(0.);
    const vec3 S=vec3(.9450980392,.9450980392,.9450980392);
    const vec3 G=vec3(.0509803922,.1921568627,.3529411765);
    
    vec3 c=mix(K,S,clamp(x/.18,0.,1.));
    c=mix(c,G,clamp((x-.18)/.18,0.,1.));
    c=mix(c,K,clamp((x-.36)/.14,0.,1.));
    return c;
}

// --------------------------------------------------------------------------
// Reconstructs level() from the original shader, per channel, using the
// low-res base/blur samples in place of live field()/fbm() calls, but
// doing mask + grain + screen-blend at full resolution — identical math
// to the original level(), just fed pre-baked base/blur inputs.
// --------------------------------------------------------------------------

float level(vec2 fc,float mask){
    vec2 res=uResolution;
    vec2 uv=fc/res.xy;
    
    float base=texture2D(uField,uv).r;
    float blurField=texture2D(uField,uv).g;
    
    // Fine pre-palette grain, computed at this channel's own shifted
    // pixel position — matches the original, which computed grain inside
    // level(fc ± off, ...) using that channel's own fc.
    base+=.08*(vnoise(vec3(fc*.9,uTime*2.))*2.-1.);
    
    float blur=mix(base,blurField,mask);
    
    float s=1.-(1.-base)*(1.-blur);
    
    return mix(base,s,.8)*LEVEL_GAIN+LEVEL_BIAS;
}

void main(){
    
    vec2 res=uResolution;
    
    // Streak mask — computed ONCE per pixel from the unshifted
    // gl_FragCoord, shared across all three channels, exactly as in the
    // original (not recomputed per CA-shifted channel).
    float tick=floor(uTime*20.);
    float row=h21(vec2(floor(gl_FragCoord.y*.5),tick));
    float px=h21(gl_FragCoord.xy+fract(uTime)*97.);
    float mask=step(row-px*.5,.5);
    
    // Chromatic split
    float k=(gl_FragCoord.x/res.x-.5)*2.;
    vec2 off=vec2(CA_PX*k,0.);
    
    vec3 col;
    col.r=lut(level(gl_FragCoord.xy-off,mask)).r;
    col.g=lut(level(gl_FragCoord.xy,mask)).g;
    col.b=lut(level(gl_FragCoord.xy+off,mask)).b;
    
    // Final grain
    col+=GRAIN*h21(gl_FragCoord.xy+fract(uTime*7.)*131.);
    
    gl_FragColor=vec4(col,1.);
}