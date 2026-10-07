"""Build a leak-free ECG train/val split.
Run from the project root:  python make_clean_ecg_split.py
Reads  data/ECG/train  (class sub-folders), removes exact duplicate images,
then makes an 80/20 stratified split into data/ECG_clean/train and data/ECG_clean/val."""
import os, random, shutil, hashlib, sys
SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.join("data", "ECG", "train")
DST = sys.argv[2] if len(sys.argv) > 2 else os.path.join("data", "ECG_clean")
random.seed(42)

def md5(p):
    h = hashlib.md5()
    with open(p, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()

if os.path.exists(DST):
    sys.exit(f"{DST} already exists - delete it first so the split is clean.")
seen, total, kept = set(), 0, 0
for cls in sorted(os.listdir(SRC)):
    cdir = os.path.join(SRC, cls)
    if not os.path.isdir(cdir): continue
    files = []
    for fn in sorted(os.listdir(cdir)):
        p = os.path.join(cdir, fn); total += 1
        h = md5(p)
        if h in seen: continue          # drop exact duplicates (also across classes)
        seen.add(h); files.append(p)
    random.shuffle(files)
    n_val = max(1, round(0.2 * len(files)))
    for i, p in enumerate(files):
        split = "val" if i < n_val else "train"
        out = os.path.join(DST, split, cls); os.makedirs(out, exist_ok=True)
        shutil.copy2(p, os.path.join(out, os.path.basename(p)))
    kept += len(files)
    print(f"{cls}: {len(files)} unique images -> {len(files)-n_val} train / {n_val} val")
print(f"Total scanned: {total}, unique kept: {kept}")
print(f"Done. Now train with:\n  yolo classify train data={DST} model=yolov8n-cls.pt epochs=20 imgsz=224 batch=16 name=train_clean")