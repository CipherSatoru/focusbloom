#!/usr/bin/env python3
"""
Zip the FocusBloom project for Colab building.
Excludes node_modules, .git, and other unnecessary files.
"""
import zipfile
import os
import sys

def zip_project(source_dir, output_path):
    """Create a zip file of the project, excluding unnecessary files."""
    exclude_dirs = {
        'node_modules', '.git', '.expo', '.web', '.expo-shared',
        '.kilo/node_modules', 'android/app/build', 'android/local.properties',
        'ios/Pods', 'ios/build', 'dist', 'build'
    }
    exclude_files = {
        '.DS_Store', 'Thumbs.db', '*.log'
    }

    file_count = 0
    skipped_count = 0

    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(source_dir):
            # Filter out excluded directories
            dirs[:] = [d for d in dirs if d not in exclude_dirs
                       and os.path.join(root, d) not in exclude_dirs
                       and not any(part in exclude_dirs for part in os.path.join(root, d).split('/'))]

            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, source_dir)

                # Skip excluded files
                if file in exclude_files or file.endswith('.log'):
                    skipped_count += 1
                    continue

                # Skip files in excluded directories
                if any(part in exclude_dirs for part in arcname.split('/')):
                    skipped_count += 1
                    continue

                try:
                    zf.write(file_path, arcname)
                    file_count += 1
                except Exception as e:
                    print(f"Warning: Could not add {file_path}: {e}")
                    skipped_count += 1

    return file_count, skipped_count

if __name__ == '__main__':
    source = '/home/cipher'
    output = '/home/cipher/Desktop/focusbloom.zip'

    print(f"Zipping project from {source}...")
    print(f"Output: {output}")

    # Ensure desktop directory exists
    os.makedirs(os.path.dirname(output), exist_ok=True)

    count, skipped = zip_project(source, output)

    # Get file size
    size_mb = os.path.getsize(output) / (1024 * 1024)

    print(f"\nDone!")
    print(f"Files added: {count}")
    print(f"Files skipped: {skipped}")
    print(f"Archive size: {size_mb:.1f} MB")
    print(f"Archive path: {output}")
