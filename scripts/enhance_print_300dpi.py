import os
import sys
import glob
import re
from PIL import Image, ImageFilter, ImageEnhance
import fitz  # PyMuPDF

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

input_dir = r"C:\Users\ppnh1\Downloads"
output_dir = os.path.join(input_dir, "DustGuard_Print_300DPI")
os.makedirs(output_dir, exist_ok=True)

files = glob.glob(os.path.join(input_dir, "ChatGPT Image 14_55_*.png"))

def extract_num(f):
    m = re.search(r'\((\d+)\)\.png$', f)
    return int(m.group(1)) if m else 0

sorted_files = sorted(files, key=extract_num)

print(f"Tim thay {len(sorted_files)} file anh can xu ly.")
processed_files = []
target_w = 3508

for idx, file_path in enumerate(sorted_files, start=1):
    with Image.open(file_path) as im:
        orig_w, orig_h = im.size
        target_h = int(orig_h * (target_w / orig_w))
        
        # 1. Upscale bang Lanczos 8x8 filter chat luong cao
        upscaled = im.resize((target_w, target_h), Image.Resampling.LANCZOS)
        
        # 2. Tinh chinh sac net vien chu & micro-contrast chuyen dung cho in an
        sharpened = upscaled.filter(ImageFilter.UnsharpMask(radius=1.5, percent=140, threshold=2))
        enhanced = ImageEnhance.Contrast(sharpened).enhance(1.04)
        
        # 3. Luu file PNG 300 DPI
        out_name = f"Trang_{idx:02d}_DustGuard_300DPI.png"
        out_path = os.path.join(output_dir, out_name)
        enhanced.save(out_path, dpi=(300, 300), optimize=True)
        
        processed_files.append(out_path)
        size_mb = os.path.getsize(out_path) / (1024 * 1024)
        print(f"[{idx:02d}/10] Xong: {out_name} | {target_w}x{target_h}px | 300 DPI | {size_mb:.2f} MB")

# 4. Xuat file PDF tong hop A4 Landscape 300 DPI
pdf_path = os.path.join(output_dir, "DustGuard_Full_10_Trang_A4_300DPI.pdf")
doc = fitz.open()

# Kho A4 Landscape tieu chuan trong PDF (841.89 x 595.28 points)
a4_w_pt = 841.89
a4_h_pt = 595.28

for img_file in processed_files:
    page = doc.new_page(width=a4_w_pt, height=a4_h_pt)
    img_aspect = target_w / target_h
    page_aspect = a4_w_pt / a4_h_pt
    
    if img_aspect > page_aspect:
        w = a4_w_pt
        h = w / img_aspect
        x0 = 0
        y0 = (a4_h_pt - h) / 2
    else:
        h = a4_h_pt
        w = h * img_aspect
        x0 = (a4_w_pt - w) / 2
        y0 = 0
        
    rect = fitz.Rect(x0, y0, x0 + w, y0 + h)
    page.insert_image(rect, filename=img_file)

doc.save(pdf_path, deflate=True)
doc.close()

pdf_size_mb = os.path.getsize(pdf_path) / (1024 * 1024)
print(f"Da xuat PDF thanh cong: {pdf_path} ({pdf_size_mb:.2f} MB)")
