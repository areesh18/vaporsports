precision highp float;

uniform float uTime;
uniform vec2 uResolution;// resolution of the LOW-RES offscreen target
uniform float uFullResY;// ACTUAL full-resolution canvas height in device
// pixels — used only to scale BLOOM_PX correctly,
// independent of the target's own resolution.

varying vec2 vUv;

// --------------------------------------------------------------------------
// Tweakables
// --------------------------------------------------------------------------

#define SPEED 1.
#define SEED 30.
#define BLOOM_PX 10.

// --------------------------------------------------------------------------
// Hashes
// --------------------------------------------------------------------------

float h31(vec3 p){
    p=fract(p*.1031);
    p+=dot(p,p.zyx+31.32);
    return fract((p.x+p.y)*p.z);
}

// --------------------------------------------------------------------------
// Smooth 3D value noise
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
// Rotation
// --------------------------------------------------------------------------

const mat2 ROT=mat2(.8,.6,-.6,.8);

// --------------------------------------------------------------------------
// fBm
// --------------------------------------------------------------------------

float fbm(vec2 p,float t){
    float v=.5*(vnoise(vec3(p.x*.5,p.y*.2+t*.1,t*.02))*2.-1.);
    float a=.25;
    p=ROT*p*2.1;
    
    for(int i=1;i<5;i++){
        float n=vnoise(vec3(p*vec2(.9,1.),SEED));
        v+=a*n*n;
        p=ROT*p*2.1;
        a*=.5;
    }
    return v;
}

// --------------------------------------------------------------------------
// Nested warped field
// --------------------------------------------------------------------------

float field(vec2 p,float t){
    return fbm(p+fbm(p+fbm(p,t),t),t);
}

// --------------------------------------------------------------------------
// Output: r = base field, g = blur (streak) field.
// No masking, no fine grain, no screen-blend — those stay in the
// full-resolution composite pass so they remain pixel-crisp.
// --------------------------------------------------------------------------

void main(){
    
    vec2 res=uResolution;
    float t=uTime*SPEED+SEED;
    
    vec2 uv=gl_FragCoord.xy/res.y;
    
    float base=field(uv,t);
    
    // BLOOM_PX is a full-resolution pixel constant — scale it against the
    // real full-res height, not this target's own (smaller) height, or the
    // streak blur ends up wider than intended.
    vec2 d=vec2(BLOOM_PX/uFullResY,0.);
    float blur=.5*(field(uv+d,t)+field(uv-d,t));
    
    gl_FragColor=vec4(base,blur,0.,1.);
}