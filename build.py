#!/usr/bin/env python3
"""
VITTORIS AI - Production Build Script for Hostinger Deployment
Packages all static assets, HTML entry points, .htaccess SPA rules,
robots.txt, and sitemap.xml into dist/ and hostinger-deploy.zip.
"""

import os
import shutil
import zipfile

PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
DIST_DIR = os.path.join(PROJECT_DIR, "dist")
ZIP_FILE = os.path.join(PROJECT_DIR, "hostinger-deploy.zip")

ROOT_FILES = [
    ".htaccess",
    "index.html",
    "404.html",
    "contact.html",
    "services.html",
    "admin.html",
    "robots.txt",
    "sitemap.xml",
    "favicon.ico",
    "favicon.png",
    "favicon.svg",
    "favicon-32x32.png",
    "apple-touch-icon.png",
    "icons.svg",
]

DIRS_TO_COPY = [
    "assets",
    "branding",
]

def build():
    print(f"[1/4] Preparing clean dist directory: {DIST_DIR}")
    if os.path.exists(DIST_DIR):
        shutil.rmtree(DIST_DIR)
    if os.path.exists(ZIP_FILE):
        os.remove(ZIP_FILE)

    os.makedirs(DIST_DIR, exist_ok=True)

    print("[2/4] Copying root production files...")
    for fname in ROOT_FILES:
        src = os.path.join(PROJECT_DIR, fname)
        dst = os.path.join(DIST_DIR, fname)
        if os.path.exists(src):
            shutil.copy2(src, dst)
            print(f"  ✓ {fname}")
        else:
            print(f"  ⚠ Missing: {fname}")

    print("[3/4] Copying asset directories...")
    for dname in DIRS_TO_COPY:
        src = os.path.join(PROJECT_DIR, dname)
        dst = os.path.join(DIST_DIR, dname)
        if os.path.exists(src):
            shutil.copytree(
                src,
                dst,
                ignore=shutil.ignore_patterns(
                    ".DS_Store", "__pycache__", "*.map"
                ),
            )
            count = sum(len(files) for _, _, files in os.walk(dst))
            print(f"  ✓ {dname}/ ({count} files)")

    print(f"[4/4] Creating deployment archive: {ZIP_FILE}...")
    with zipfile.ZipFile(ZIP_FILE, "w", zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(DIST_DIR):
            for file in files:
                abs_path = os.path.join(root, file)
                rel_path = os.path.relpath(abs_path, DIST_DIR)
                zipf.write(abs_path, rel_path)

    zip_size_mb = os.path.getsize(ZIP_FILE) / (1024 * 1024)
    print(f"\n==================================================")
    print(f" BUILD COMPLETE!")
    print(f" Archive: {ZIP_FILE} ({zip_size_mb:.2f} MB)")
    print(f" Ready to upload and extract in Hostinger public_html")
    print(f"==================================================")

if __name__ == "__main__":
    build()
