#!/usr/bin/env python3
"""
Hostinger FTP Deployment Script for vittoris.com
Uploads dist/ files or extracted hostinger-deploy files directly to public_html/
"""

import sys
import os
import ftplib
import zipfile

def deploy(ftp_host, ftp_user, ftp_pass, target_dir="public_html"):
    print(f"Connecting to FTP {ftp_host} as {ftp_user}...")
    ftp = ftplib.FTP(ftp_host)
    ftp.login(ftp_user, ftp_pass)
    print("Logged in successfully.")

    # Navigate to public_html
    try:
        ftp.cwd(target_dir)
        print(f"Changed directory to {target_dir}")
    except Exception as e:
        print(f"Warning: could not cwd to {target_dir}: {e}")

    # Files to upload
    base_dir = os.path.dirname(os.path.abspath(__file__))
    dist_dir = os.path.join(base_dir, "dist")
    if not os.path.exists(dist_dir):
        dist_dir = base_dir

    def upload_dir(local_path, remote_path):
        for item in os.listdir(local_path):
            if item.startswith('.') or item == 'node_modules' or item.endswith('.zip') or item.endswith('.py'):
                continue
            local_item = os.path.join(local_path, item)
            if os.path.isfile(local_item):
                with open(local_item, 'rb') as f:
                    print(f"Uploading: {item} ...")
                    ftp.storbinary(f"STOR {item}", f)
            elif os.path.isdir(local_item):
                try:
                    ftp.mkd(item)
                except Exception:
                    pass
                ftp.cwd(item)
                upload_dir(local_item, item)
                ftp.cwd("..")

    print(f"Deploying from {dist_dir} to FTP...")
    upload_dir(dist_dir, "")
    ftp.quit()
    print("Deployment complete!")

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python3 deploy_hostinger_ftp.py <FTP_HOST> <FTP_USER> <FTP_PASS>")
        sys.exit(1)
    deploy(sys.argv[1], sys.argv[2], sys.argv[3])
