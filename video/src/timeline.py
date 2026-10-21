import json, wave
segs = [  # orig start, hold, end, voice file, voice offset in segment, tail pad
 (0.0, 2.55, 2.6, 's1', 0.55, 0.3),
 (2.6, 4.0, 4.4, 's2', 0.25, 0.45),
 (4.4, 6.5, 7.0, 's3', 0.2, 0.45),
 (7.0, 10.0, 10.5, 's4', 0.35, 0.4),
 (10.5, 11.9, 12.3, 's5', 0.25, 0.45),
 (12.3, 15.0, 15.0, 's6', 0.7, 0.9),
]
out = []; S = 0.0
for a, h, b, v, off, pad in segs:
    w = wave.open(f'vo/{v}.wav'); vd = w.getnframes() / w.getframerate()
    need = off + vd + pad
    extra = max(0.0, need - (b - a))
    out.append({'a': a, 'h': h, 'b': b, 'S': S, 'extra': round(extra, 3), 'voice': v, 'vstart': round(S + off, 3)})
    S += (b - a) + extra
json.dump({'segments': out, 'total': round(S, 3)}, open('timeline.json', 'w'), indent=1)
print(round(S, 2), [(o['voice'], o['vstart'], o['extra']) for o in out])
