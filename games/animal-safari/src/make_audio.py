#!/usr/bin/env python3
"""Pre-record every English line with Kokoro-82M (Apache-2.0, runs offline; no API key).
Setup (once):  pip install kokoro-onnx soundfile
  model files: https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0
               (kokoro-v1.0.onnx -> kokoro.onnx, voices-v1.0.bin -> voices.bin)
Run:  python3 make_audio.py <dir with kokoro.onnx + voices.bin> [only-these-keys...]
Writes ../audio/en/<key>.mp3 (needs ffmpeg). Chinese is read by the device's zh-TW voice instead."""
import json, pathlib, subprocess, sys, tempfile
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro

HERE = pathlib.Path(__file__).resolve().parent
OUT = HERE.parent / "audio" / "en"; OUT.mkdir(parents=True, exist_ok=True)
VOICE = {  # line voice -> (Kokoro voice, speed)
    "coco": ("af_heart", 0.9), "tiger": ("am_michael", 0.95), "monkey": ("am_puck", 1.0),
    "elephant": ("am_onyx", 0.86), "zebra": ("af_sky", 0.95), "parrot": ("af_nova", 1.0),
    "giraffe": ("bf_emma", 0.9), "deer": ("af_bella", 0.95),
}
# Phonics: say the letter SOUND, not the letter name (espeak would spell "Sss" as "ess-ess-ess").
IPA_FIX = [
    ("ˌɛlˌɛlˈɛl", "lːːː"), ("ˌɛmˌɛmˈɛm", "mːːː"), ("zˌiːzˌiːzˈiː", "zːːː"), ("ˌɛsˌɛsˈɛs", "sːːː"),
    ("ˌɛfˌɛfˈɛf", "fːːː"), ("ˌɑːɹɹˌɑːɹɹˈɑːɹ", "ɹːːː"), ("ˌeɪtʃˌeɪtʃˈeɪtʃ", "hˈʌ"), ("ˌɛnˌɛnˈɛn", "nːːː"),
]
def fix_eh(text, ipa):  # "Eh" should be the short e in "elephant"
    if "Eh" not in text and "eh" not in text: return ipa
    return ipa.replace("ˈeɪ,", "ˈɛ,").replace("ˈeɪ.", "ˈɛ.").replace("ˈeɪ!", "ˈɛ!").replace("ˈeɪ sˈaʊnd", "ˈɛ sˈaʊnd")

def main():
    mdir = pathlib.Path(sys.argv[1]); only = set(sys.argv[2:])
    k = Kokoro(str(mdir / "kokoro.onnx"), str(mdir / "voices.bin"))
    L = json.loads((HERE / "lines.json").read_text(encoding="utf-8"))
    for key, d in L.items():
        if only and key not in only: continue
        if key.startswith("ui_"): continue
        text = d.get("sp") or d["en"]
        if len(text) < 2 or not any(c.isalpha() for c in text): continue
        voice, speed = VOICE.get(d.get("v", "coco"), VOICE["coco"])
        ipa = k.tokenizer.phonemize(text, "en-us")
        for a, b in IPA_FIX: ipa = ipa.replace(a, b)
        ipa = fix_eh(text, ipa)
        s, sr = k.create(ipa, voice=voice, speed=speed, is_phonemes=True)
        s = np.asarray(s, dtype=np.float32)
        nz = np.where(np.abs(s) > 0.01)[0]
        if len(nz): s = s[max(0, nz[0] - int(.03 * sr)): nz[-1] + int(.12 * sr)]
        rms = np.sqrt(np.mean(s ** 2)) or 1; s = s * (0.1 / rms); s = np.clip(s, -0.97, 0.97)
        with tempfile.NamedTemporaryFile(suffix=".wav") as t:
            sf.write(t.name, s, sr)
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", t.name, "-ac", "1", "-ar", "24000", "-b:a", "48k",
                            str(OUT / (key + ".mp3"))], check=True)
        print(key, round(len(s) / sr, 2), ipa[:60], flush=True)

if __name__ == "__main__":
    main()
