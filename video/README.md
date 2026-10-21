# Launch video

| File | Length | Notes |
| --- | --- | --- |
| `betterpasig-launch-voice.mp4` | 22.5s, 1080×1080 | Filipino voice-over, music and sound effects. Use this one for Dec 15. |
| `betterpasig-launch.mp4` | 15s, 1080×1080 | Silent cut for autoplay feeds |

Scenes: the 30 barangays fill into the Pasig mark → "Iisang Pasig. Ito ang BetterPasig." → 173 services → search demo ("amilyar") → emergency number → betterpasig.org end card.

## Rebuild

Everything runs from `video/src/`:

```bash
cd video/src
pip install playwright edge-tts numpy imageio-ffmpeg
python3 tts.py          # lines.json -> vo/s1..s6.wav (voice fil-PH-AngeloNeural)
python3 timeline.py     # times each scene to its narration -> timeline.json
# inject map + mark into scene.html -> scene_built.html (see prototype/tools/build7.py for the same pattern)
python3 render2.py      # Playwright renders frames2/ at 30fps
python3 audio.py        # synthesizes music + SFX, ducks under voice -> mix.wav
# encode: ffmpeg -r 30 -i frames2/f%04d.png -i mix.wav -c:v libx264 -pix_fmt yuv420p -c:a aac -shortest out.mp4
```

Music and sound effects are synthesized in `audio.py` (no third-party audio), so there is nothing to license.
