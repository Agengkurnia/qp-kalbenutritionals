import os
import sys
import ssl
import base64
import urllib.request
import urllib.parse
from datetime import date
import xml.etree.ElementTree as ET

def get_base_dir():
    """Gets the directory where the script or compiled executable is located."""
    if getattr(sys, 'frozen', False):
        return os.path.dirname(sys.executable)
    return os.path.dirname(os.path.abspath(__file__))

# Configuration
BASE_DIR = get_base_dir()
LOGIN_FILE = os.path.join(BASE_DIR, "login.txt")
DEST_DIR = os.path.join(BASE_DIR, "file")

def parse_login(filepath):
    """Parses credentials from the login info file."""
    url, user, password = None, None, None
    if not os.path.exists(filepath):
        print(f"Error: Credentials file '{filepath}' not found.")
        sys.exit(1)
        
    with open(filepath, "r") as f:
        for line in f:
            line = line.strip()
            if line.lower().startswith("url"):
                url = line.split(":", 1)[1].strip()
            elif line.lower().startswith("user"):
                user = line.split(":", 1)[1].strip()
            elif line.lower().startswith("pass"):
                password = line.split(":", 1)[1].strip()
                
    if not url or not user or not password:
        print(f"Error: Invalid credentials format in '{filepath}'. URL, User, and Pass are required.")
        sys.exit(1)
        
    # Standardize URL to start with protocol
    if not url.startswith("http"):
        url = f"https://{url}"
        
    return url, user, password

def get_webdav_files(folder_url, user, password):
    """Retrieves a list of files from the Nextcloud WebDAV directory."""
    auth_str = f"{user}:{password}"
    auth_b64 = base64.b64encode(auth_str.encode('utf-8')).decode('utf-8')

    req = urllib.request.Request(folder_url, method="PROPFIND")
    req.add_header("Authorization", f"Basic {auth_b64}")
    req.add_header("Depth", "1")

    # Bypass SSL verification in case of self-signed certs in the internal environment
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    print(f"Connecting to WebDAV at {folder_url}...")
    try:
        with urllib.request.urlopen(req, context=ctx) as response:
            content = response.read()
    except urllib.error.HTTPError as e:
        print(f"HTTP Error {e.code}: {e.reason}")
        sys.exit(1)
    except Exception as e:
        print(f"Failed to connect to WebDAV: {e}")
        sys.exit(1)
        
    root = ET.fromstring(content)
    ns = {'d': 'DAV:'}
    
    files = []
    for resp in root.findall('d:response', ns):
        href = resp.find('d:href', ns).text
        decoded_href = urllib.parse.unquote(href)
        filename = decoded_href.split('/')[-1]
        if filename:
            files.append(filename)
    return files

def find_best_match(files, target_date):
    """Finds the best matching file for the target date."""
    # List of preferred patterns
    patterns = [
        f"LISTING_CLAIM_ {target_date}.csv",
        f"LISTING_CLAIM_{target_date}.csv",
        f"LISTING_CLAIM {target_date}.csv"
    ]
    
    for p in patterns:
        if p in files:
            return p
            
    # Fallback to any CSV containing the target date
    for f in files:
        if target_date in f and f.lower().endswith(".csv"):
            return f
            
    return None

def download_file(file_url, dest_path, user, password):
    """Downloads a file from Nextcloud WebDAV and saves it to local disk."""
    auth_str = f"{user}:{password}"
    auth_b64 = base64.b64encode(auth_str.encode('utf-8')).decode('utf-8')

    req = urllib.request.Request(file_url, method="GET")
    req.add_header("Authorization", f"Basic {auth_b64}")

    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    print(f"Downloading file from server...")
    try:
        with urllib.request.urlopen(req, context=ctx) as response:
            with open(dest_path, "wb") as f:
                # Stream in chunks to handle large files efficiently
                while True:
                    chunk = response.read(1024 * 64)
                    if not chunk:
                        break
                    f.write(chunk)
        print(f"File downloaded successfully!")
    except urllib.error.HTTPError as e:
        print(f"HTTP Error {e.code} during download: {e.reason}")
        sys.exit(1)
    except Exception as e:
        print(f"Download failed: {e}")
        sys.exit(1)

def main():
    # 1. Determine target date (default to today, or use CLI argument)
    if len(sys.argv) > 1:
        target_date = sys.argv[1].strip()
        print(f"Target date provided: {target_date}")
    else:
        target_date = date.today().strftime("%y%m%d")
        print(f"No date provided. Defaulting to today's date: {target_date}")
        
    # 2. Parse login info
    base_url, user, password = parse_login(LOGIN_FILE)
    print(f"Parsed credentials for user: {user} on {base_url}")
    
    # 3. Form WebDAV Folder URL
    folder_url = f"{base_url}/remote.php/dav/files/{user}/shp/"
    
    # 4. List remote files
    remote_files = get_webdav_files(folder_url, user, password)
    print(f"Found {len(remote_files)} files in WebDAV folder.")
    
    # 5. Search for the best matching file
    match_filename = find_best_match(remote_files, target_date)
    if not match_filename:
        print(f"Error: No claim file found for date '{target_date}' in the WebDAV directory.")
        print("Available files include:")
        for rf in sorted(remote_files)[-5:]:
            print(f"  - {rf}")
        sys.exit(1)
        
    print(f"Found matching remote file: {match_filename}")
    
    # 6. Ensure local directory exists
    os.makedirs(DEST_DIR, exist_ok=True)
    
    # 7. Form full URLs and filepaths
    encoded_filename = urllib.parse.quote(match_filename)
    file_url = f"{folder_url}{encoded_filename}"
    dest_path = os.path.join(DEST_DIR, match_filename)
    
    print(f"Destination path: {dest_path}")
    
    # 8. Download the file
    download_file(file_url, dest_path, user, password)

if __name__ == "__main__":
    main()
