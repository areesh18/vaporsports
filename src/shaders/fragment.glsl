precision highp float;

uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

// ---- tweakables ----------------------------------------------------------

#define SPEED      -0.142
#define SEED       30.0
#define LEVEL_BIAS 0.0
#define LEVEL_GAIN 1.0
#define BLOOM_PX   10.0
#define CA_PX      14.0
#define GRAIN      0.08

// --------------------------------------------------------------------------
// Hashes

float h31(vec3 p) {
    p = fract(p * 0.1031);
    p += dot(p, p.zyx + 31.32);
    return fract((p.x + p.y) * p.z);
}

float h21(vec2 p) {
    vec3 q = fract(vec3(p.xyx) * 0.1031);
    q += dot(q, q.yzx + 33.33);
    return fract((q.x + q.y) * q.z);
}

// --------------------------------------------------------------------------
// Smooth 3D value noise

float vnoise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);

    f = f * f * (3.0 - 2.0 * f);

    return mix(
        mix(
            mix(
                h31(i),
                h31(i + vec3(1.0, 0.0, 0.0)),
                f.x
            ),
            mix(
                h31(i + vec3(0.0, 1.0, 0.0)),
                h31(i + vec3(1.0, 1.0, 0.0)),
                f.x
            ),
            f.y
        ),
        mix(
            mix(
                h31(i + vec3(0.0, 0.0, 1.0)),
                h31(i + vec3(1.0, 0.0, 1.0)),
                f.x
            ),
            mix(
                h31(i + vec3(0.0, 1.0, 1.0)),
                h31(i + vec3(1.0, 1.0, 1.0)),
                f.x
            ),
            f.y
        ),
        f.z
    );
}

const mat2 ROT = mat2(
     0.8,  0.6,
    -0.6,  0.8
);

// --------------------------------------------------------------------------
// fBm

float fbm(vec2 p, float t) {

    float v =
        0.5 *
        (
            vnoise(
                vec3(
                    p.x * 0.5,
                    p.y * 0.2 + t * 0.1,
                    t * 0.02
                )
            ) * 2.0 - 1.0
        );

    float a = 0.25;

    p = ROT * p * 2.1;

    for (int i = 1; i < 5; i++) {

        float n = vnoise(
            vec3(
                p * vec2(0.9, 1.0),
                SEED
            )
        );

        // squared = darker valleys / sharper ridges
        v += a * n * n;

        p = ROT * p * 2.1;

        a *= 0.5;
    }

    return v;
}

// --------------------------------------------------------------------------
// Nested warped field

float field(vec2 p, float t) {
    return fbm(
        p + fbm(
            p + fbm(p, t),
            t
        ),
        t
    );
}

// --------------------------------------------------------------------------
// Gradient LUT
// black -> sage -> bright green -> black

vec3 lut(float x) {

    const vec3 K = vec3(0.0);

    const vec3 S = vec3(
        0.0,
        0.3803921568627451,
        0.20392156862745098
    );

    const vec3 G = vec3(
        0.7843137254901961,
        1.0,
        0.0
    );

    vec3 c = mix(
        K,
        S,
        clamp(x / 0.18, 0.0, 1.0)
    );

    c = mix(
        c,
        G,
        clamp((x - 0.18) / 0.18, 0.0, 1.0)
    );

    c = mix(
        c,
        K,
        clamp((x - 0.36) / 0.14, 0.0, 1.0)
    );

    return c;
}

// --------------------------------------------------------------------------
// Pixel level

float level(
    vec2 fc,
    vec2 res,
    float t,
    float mask
) {

    // Shadertoy:
    // vec2 uv = fc / res.y;

    // Keep the exact same aspect behavior.
    vec2 uv = fc / res.y;

    float base = field(uv, t);

    // Fine pre-palette grain
    base += 0.08 *
        (
            vnoise(
                vec3(
                    fc * 0.9,
                    uTime * 2.0
                )
            ) * 2.0 - 1.0
        );

    // Horizontal blur
    vec2 d = vec2(
        BLOOM_PX / res.y,
        0.0
    );

    float blur = 0.5 * (
        field(uv + d, t) +
        field(uv - d, t)
    );

    blur = mix(
        base,
        blur,
        mask
    );

    // Screen blend
    float s =
        1.0 -
        (1.0 - base) *
        (1.0 - blur);

    return mix(
        base,
        s,
        0.8
    ) * LEVEL_GAIN + LEVEL_BIAS;
}

// --------------------------------------------------------------------------
// Main

void main() {

    vec2 res = uResolution;

    // Equivalent to:
    // float t = iTime * SPEED + SEED;

    float t = uTime * SPEED + SEED;

    // ----------------------------------------------------------------------
    // Streak mask

    float tick = floor(uTime * 20.0);

    float row = h21(
        vec2(
            floor(gl_FragCoord.y * 0.5),
            tick
        )
    );

    float px = h21(
        gl_FragCoord.xy +
        fract(uTime) * 97.0
    );

    float mask = step(
        row - px * 0.5,
        0.5
    );

    // ----------------------------------------------------------------------
    // Chromatic aberration

    float k =
        (gl_FragCoord.x / res.x - 0.5) * 2.0;

    vec2 off = vec2(
        CA_PX * k,
        0.0
    );

    // ----------------------------------------------------------------------
    // RGB split

    vec3 col;

    col.r = lut(
        level(
            gl_FragCoord.xy - off,
            res,
            t,
            mask
        )
    ).r;

    col.g = lut(
        level(
            gl_FragCoord.xy,
            res,
            t,
            mask
        )
    ).g;

    col.b = lut(
        level(
            gl_FragCoord.xy + off,
            res,
            t,
            mask
        )
    ).b;

    // ----------------------------------------------------------------------
    // Final grain

    col += GRAIN *
        h21(
            gl_FragCoord.xy +
            fract(uTime * 7.0) * 131.0
        );

    gl_FragColor = vec4(col, 1.0);
}