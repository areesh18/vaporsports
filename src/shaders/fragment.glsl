// fragment.glsl
// warped fBm -> streak bloom -> gradient LUT -> chromatic split -> grain
//
// Required uniforms:
//   uniform float uTime;        // seconds
//   uniform vec2  uResolution;  // drawing-buffer size in PIXELS (width * pixelRatio, height * pixelRatio)

uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

// ---- tweakables ----------------------------------------------------------
#define SPEED      -0.142   // overall drift speed
#define SEED       30.0     // change for a different layout
#define LEVEL_BIAS 0.0      // shift gray levels before the palette (try -0.1..0.15)
#define LEVEL_GAIN 1.0      // stretch gray levels (try 0.8..1.4)
#define BLOOM_PX   10.0     // horizontal streak length in pixels
#define CA_PX      14.0     // max chromatic split at screen edges, in pixels
#define GRAIN      0.08     // final film grain amount
// --------------------------------------------------------------------------

// hashes (no textures, no sin)
float h31(vec3 p) {
    p = fract(p * .1031);
    p += dot(p, p.zyx + 31.32);
    return fract((p.x + p.y) * p.z);
}

float h21(vec2 p) {
    vec3 q = fract(vec3(p.xyx) * .1031);
    q += dot(q, q.yzx + 33.33);
    return fract((q.x + q.y) * q.z);
}

// smooth 3D value noise, range 0..1
float vnoise(vec3 p) {
    vec3 i = floor(p), f = fract(p);
    f = f * f * (3. - 2. * f);
    return mix(
        mix(mix(h31(i),                 h31(i + vec3(1,0,0)), f.x),
            mix(h31(i + vec3(0,1,0)),   h31(i + vec3(1,1,0)), f.x), f.y),
        mix(mix(h31(i + vec3(0,0,1)),   h31(i + vec3(1,0,1)), f.x),
            mix(h31(i + vec3(0,1,1)),   h31(i + vec3(1,1,1)), f.x), f.y), f.z);
}

const mat2 ROT = mat2(.8, .6, -.6, .8);

// only octave 0 moves; the nested warp turns that into evolving blobs
float fbm(vec2 p, float t) {
    float v = .5 * (vnoise(vec3(p.x * .5, p.y * .2 + t * .1, t * .02)) * 2. - 1.);
    float a = .25;
    p = ROT * p * 2.1;
    for (int i = 1; i < 5; i++) {
        float n = vnoise(vec3(p * vec2(.9, 1.), SEED));
        v += a * n * n;              // squared = darker valleys, sharper ridges
        p = ROT * p * 2.1;
        a *= .5;
    }
    return v;
}

float field(vec2 p, float t) {
    return fbm(p + fbm(p + fbm(p, t), t), t);
}

// gray level -> palette: black -> S -> G -> black
vec3 lut(float x) {
    const vec3 K = vec3(0.);
    const vec3 S = vec3(1., 0., 0.);
    const vec3 G = vec3(1., 1., 1.);
    vec3 c = mix(K, S, clamp(x / .18, 0., 1.));
    c = mix(c, G, clamp((x - .18) / .18, 0., 1.));
    c = mix(c, K, clamp((x - .36) / .14, 0., 1.));
    return c;
}

// gray level for a pixel, including the masked horizontal streak + screen blend
float level(vec2 fc, vec2 res, float t, float mask) {
    vec2 uv = fc / res.y;
    float base = field(uv, t);

    // fine pre-palette grain: this is what makes the mesh texture inside blobs
    base += .08 * (vnoise(vec3(fc * .9, uTime * 2.)) * 2. - 1.);

    // cheap 2-tap horizontal blur, only where the mask is on
    vec2 d = vec2(BLOOM_PX / res.y, 0.);
    float blur = .5 * (field(uv + d, t) + field(uv - d, t));
    blur = mix(base, blur, mask);

    // screen blend (80%) of the blurred copy over the original
    float s = 1. - (1. - base) * (1. - blur);
    return mix(base, s, .8) * LEVEL_GAIN + LEVEL_BIAS;
}

void main() {
    vec2 fc  = gl_FragCoord.xy;
    vec2 res = uResolution;
    float t  = uTime * SPEED + SEED;

    // streak mask: a random value per row (re-rolled ~20x/s) vs per-pixel noise
    float tick = floor(uTime * 20.);
    float row  = h21(vec2(floor(fc.y * .5), tick));
    float px   = h21(fc + fract(uTime) * 97.);
    float mask = step(row - px * .5, .5);

    // chromatic split grows toward the left/right edges, zero at center
    float k = (fc.x / res.x - .5) * 2.;
    vec2 off = vec2(CA_PX * k, 0.);

    vec3 col;
    col.r = lut(level(fc - off, res, t, mask)).r;
    col.g = lut(level(fc,       res, t, mask)).g;
    col.b = lut(level(fc + off, res, t, mask)).b;

    col += GRAIN * h21(fc + fract(uTime * 7.) * 131.);
    gl_FragColor = vec4(col, 1.);
}
