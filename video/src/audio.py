import json, wave, numpy as np
SR = 48000
TL = json.load(open('timeline.json')); T = TL['total'] + 0.6
N = int(SR * T); mus = np.zeros(N); sfx = np.zeros(N); vox = np.zeros(N)
def o2n(t):
    for s in TL['segments']:
        if s['a'] <= t <= s['b'] + 1e-9:
            loc = t - s['a']
            return s['S'] + loc + (s['extra'] if t > s['h'] else 0)
    return t
def put(buf, sig, t):
    i = int(t * SR)
    if i >= N: return
    j = min(N, i + len(sig)); buf[i:j] += sig[:j - i]
tt = lambda d: np.arange(int(SR * d)) / SR
def env(n, a, r):
    e = np.ones(n); A = int(a * SR); R = int(r * SR)
    if A: e[:A] = np.linspace(0, 1, A)
    if R: e[-R:] *= np.linspace(1, 0, R)
    return e
f = lambda m: 440 * 2 ** ((m - 69) / 12)
# ---- music: warm pad + soft plucks, C major, 96 bpm
chords = [[48, 55, 64, 71], [45, 52, 60, 67], [41, 48, 57, 64], [43, 50, 59, 62]]
bar = 2.5
k = 0; t0 = 0.0
while t0 < T:
    ch = chords[k % 4]; d = bar + 0.6; x = tt(d)
    sig = sum(np.sin(2 * np.pi * f(m) * x) * 0.5 + np.sin(2 * np.pi * f(m) * 1.003 * x) * 0.5 for m in ch) / len(ch)
    sig += 0.25 * np.sin(2 * np.pi * f(ch[0] - 12) * x)
    put(mus, sig * env(len(x), 0.6, 0.9) * 0.22, t0)
    for j in range(4):  # gentle pluck arpeggio
        m = ch[[1, 2, 3, 2][j]] + 12; px = tt(0.9)
        pl = np.sin(2 * np.pi * f(m) * px) * np.exp(-px * 5.5) + 0.3 * np.sin(4 * np.pi * f(m) * px) * np.exp(-px * 9)
        put(mus, pl * 0.07, t0 + j * bar / 4)
    t0 += bar; k += 1
mus *= env(N, 0.8, 1.6)
# ---- sfx
def tick(m, vol):  # soft marimba-like blip
    x = tt(0.35); s = np.sin(2 * np.pi * f(m) * x) * np.exp(-x * 18) + 0.4 * np.sin(2 * np.pi * f(m) * 3.9 * x) * np.exp(-x * 40)
    return s * vol
penta = [72, 74, 76, 79, 81, 84, 86, 88, 91, 93]
for i in range(30):
    put(sfx, tick(penta[i % 10] - (0 if i < 10 else 0) + (12 if i >= 20 else 0) - (12 if i < 10 else 0), 0.10), o2n(0.3 + i * 0.055))
def whoosh(d, vol):
    x = tt(d); n = np.random.default_rng(1).standard_normal(len(x))
    k = int(SR * 0.004); n = np.convolve(n, np.ones(k) / k, 'same')
    return n * np.sin(np.pi * np.linspace(0, 1, len(x))) ** 2 * vol
put(sfx, whoosh(0.9, 0.5), o2n(2.55))
for kk in range(7):  # keyboard clicks while typing
    x = tt(0.04); n = np.random.default_rng(10 + kk).standard_normal(len(x)) * np.exp(-x * 160)
    put(sfx, n * 0.22, o2n(7.6 + kk * 0.09))
put(sfx, tick(79, 0.16), o2n(8.4)); put(sfx, tick(84, 0.14), o2n(8.6))
for j, m in enumerate([76, 72]):  # emergency: calm two-tone
    x = tt(0.5); s = (np.sin(2 * np.pi * f(m) * x) + 0.3 * np.sin(4 * np.pi * f(m) * x)) * env(len(x), 0.01, 0.4)
    put(sfx, s * 0.14, o2n(10.6) + j * 0.22)
put(sfx, whoosh(0.7, 0.4), o2n(12.25))
for j, m in enumerate([72, 76, 79, 84]):  # end chime
    x = tt(2.2); s = (np.sin(2 * np.pi * f(m) * x) + 0.2 * np.sin(2 * np.pi * f(m) * 2.76 * x) * np.exp(-x * 3)) * np.exp(-x * 1.6)
    put(sfx, s * 0.12, o2n(12.9) + j * 0.07)
# ---- voice
for s in TL['segments']:
    w = wave.open(f"vo/{s['voice']}.wav"); v = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(float) / 32768
    put(vox, v * 0.95, s['vstart'])
# duck music under voice
act = np.convolve((np.abs(vox) > 0.01).astype(float), np.ones(int(SR * 0.25)) / (SR * 0.25), 'same')
duck = 1 - 0.55 * np.clip(act * 3, 0, 1)
mix = mus * duck + sfx + vox
mix /= max(1.0, np.max(np.abs(mix)) / 0.89)
st = np.stack([mix, mix], 1)
w = wave.open('mix.wav', 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((st * 32767).astype(np.int16).tobytes()); w.close()
print('audio', round(T, 2), 's peak', round(float(np.max(np.abs(mix))), 3))
