
precision highp float;

uniform float uTime;
uniform vec2 uResolution;

#define SPEED 1.
#define SEED 30.

float h31(vec3 p) {
    p = fract(p * .1031);
    p += dot(p, p.zyx + 31.32);
    return fract((p.x + p.y) * p.z);
}

float vnoise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3. - 2. * f);

    return mix(
        mix(
            mix(
                h31(i),
                h31(i + vec3(1., 0., 0.)),
                f.x
            ),
            mix(
                h31(i + vec3(0., 1., 0.)),
                h31(i + vec3(1., 1., 0.)),
                f.x
            ),
            f.y
        ),
        mix(
            mix(
                h31(i + vec3(0., 0., 1.)),
                h31(i + vec3(1., 0., 1.)),
                f.x
            ),
            mix(
                h31(i + vec3(0., 1., 1.)),
                h31(i + vec3(1., 1., 1.)),
                f.x
            ),
            f.y
        ),
        f.z
    );
}

const mat2 ROT = mat2(.8, .6, -.6, .8);

float fbm(vec2 p, float t) {
    float v = .5 * (
        vnoise(vec3(p.x * .5, p.y * .2 + t * .1, t * .02))
        * 2. - 1.
    );

    float a = .25;
    p = ROT * p * 2.1;

    for (int i = 1; i < 5; i++) {
        float n = vnoise(vec3(p * vec2(.9, 1.), SEED));
        v += a * n * n;

        p = ROT * p * 2.1;
        a *= .5;
    }

    return v;
}

float field(vec2 p, float t) {
    return fbm(p + fbm(p + fbm(p, t), t), t);
}

void main() {
    float t = uTime * SPEED + SEED;

    // Keep the original aspect-ratio behavior.
    vec2 uv = gl_FragCoord.xy / uResolution.y;

    float base = field(uv, t);

    // Store the field in the red channel.
    // The composite shader reconstructs the blur.
    gl_FragColor = vec4(base, 0., 0., 1.);
}
