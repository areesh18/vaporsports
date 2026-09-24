precision highp float;

uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

// --------------------------------------------------------------------------
// Tweakables
// --------------------------------------------------------------------------

#define SPEED 1.
#define SEED 30.
#define LEVEL_BIAS 0.
#define LEVEL_GAIN 1.
#define BLOOM_PX 10.
#define CA_PX 14.
#define GRAIN .08

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
// Smooth 3D value noise
// --------------------------------------------------------------------------

float vnoise(vec3 p){
    vec3 i=floor(p);
    vec3 f=fract(p);
    
    f=f*f*(3.-2.*f);
    
    return mix(
        mix(
            mix(
                h31(i),
                h31(i+vec3(1.,0.,0.)),
                f.x
            ),
            mix(
                h31(i+vec3(0.,1.,0.)),
                h31(i+vec3(1.,1.,0.)),
                f.x
            ),
            f.y
        ),
        mix(
            mix(
                h31(i+vec3(0.,0.,1.)),
                h31(i+vec3(1.,0.,1.)),
                f.x
            ),
            mix(
                h31(i+vec3(0.,1.,1.)),
                h31(i+vec3(1.,1.,1.)),
                f.x
            ),
            f.y
        ),
        f.z
    );
}

// --------------------------------------------------------------------------
// Rotation
// --------------------------------------------------------------------------

const mat2 ROT=mat2(
    .8,.6,
    -.6,.8
);

// --------------------------------------------------------------------------
// fBm
// --------------------------------------------------------------------------

float fbm(vec2 p,float t){
    
    float v=.5*(
        vnoise(
            vec3(
                p.x*.5,
                p.y*.2+t*.1,
                t*.02
            )
        )*2.-1.
    );
    
    float a=.25;
    
    p=ROT*p*2.1;
    
    for(int i=1;i<5;i++){
        
        float n=vnoise(
            vec3(
                p*vec2(.9,1.),
                SEED
            )
        );
        
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
    
    return fbm(
        p+fbm(
            p+fbm(p,t),
            t
        ),
        t
    );
}

// --------------------------------------------------------------------------
// Gradient LUT
//
// black -> light gray -> dark blue -> black
// --------------------------------------------------------------------------

vec3 lut(float x){
    
    const vec3 K=vec3(0.);
    
    const vec3 S=vec3(
        .9450980392,
        .9450980392,
        .9450980392
    );
    
    const vec3 G=vec3(
        .0509803922,
        .1921568627,
        .3529411765
    );
    
    vec3 c=mix(
        K,
        S,
        clamp(x/.18,0.,1.)
    );
    
    c=mix(
        c,
        G,
        clamp((x-.18)/.18,0.,1.)
    );
    
    c=mix(
        c,
        K,
        clamp((x-.36)/.14,0.,1.)
    );
    
    return c;
}

// --------------------------------------------------------------------------
// Pixel level
// --------------------------------------------------------------------------

float level(
    vec2 fc,
    vec2 res,
    float t,
    float mask
){
    
    vec2 uv=fc/res.y;
    
    float base=field(uv,t);
    
    // Fine pre-palette grain
    base+=.08*(
        vnoise(
            vec3(
                fc*.9,
                uTime*2.
            )
        )*2.-1.
    );
    
    // Horizontal streak blur
    vec2 d=vec2(
        BLOOM_PX/res.y,
        0.
    );
    
    float blur=.5*(
        field(uv+d,t)+
        field(uv-d,t)
    );
    
    blur=mix(
        base,
        blur,
        mask
    );
    
    // Screen blend
    float s=1.-
    (1.-base)*
    (1.-blur);
    
    return mix(
        base,
        s,
        .8
    )*LEVEL_GAIN+LEVEL_BIAS;
}

// --------------------------------------------------------------------------
// Main
// --------------------------------------------------------------------------

void main(){
    
    vec2 res=uResolution;
    
    // Shadertoy:
    // float t = iTime * SPEED + SEED;
    
    float t=uTime*SPEED+SEED;
    
    // ----------------------------------------------------------------------
    // Streak mask
    // ----------------------------------------------------------------------
    
    float tick=floor(uTime*20.);
    
    float row=h21(
        vec2(
            floor(gl_FragCoord.y*.5),
            tick
        )
    );
    
    float px=h21(
        gl_FragCoord.xy+
        fract(uTime)*97.
    );
    
    float mask=step(
        row-px*.5,
        .5
    );
    
    // ----------------------------------------------------------------------
    // Chromatic split
    // ----------------------------------------------------------------------
    
    float k=(
        gl_FragCoord.x/res.x-
        .5
    )*2.;
    
    vec2 off=vec2(
        CA_PX*k,
        0.
    );
    
    // ----------------------------------------------------------------------
    // RGB channels
    // ----------------------------------------------------------------------
    
    vec3 col;
    
    col.r=lut(
        level(
            gl_FragCoord.xy-off,
            res,
            t,
            mask
        )
    ).r;
    
    col.g=lut(
        level(
            gl_FragCoord.xy,
            res,
            t,
            mask
        )
    ).g;
    
    col.b=lut(
        level(
            gl_FragCoord.xy+off,
            res,
            t,
            mask
        )
    ).b;
    
    // ----------------------------------------------------------------------
    // Final grain
    // ----------------------------------------------------------------------
    
    col+=GRAIN*h21(
        gl_FragCoord.xy+
        fract(uTime*7.)*131.
    );
    
    gl_FragColor=vec4(col,1.);
}