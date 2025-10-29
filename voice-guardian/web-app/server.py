#!/usr/bin/env python3
"""
Simple HTTP server to serve the Voice Guardian web app
"""

import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

# Configuration
PORT = 3000
HOST = 'localhost'

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        super().end_headers()
    
    def do_OPTIONS(self):
        # Handle preflight requests
        self.send_response(200)
        self.end_headers()

def main():
    # Change to the web-app directory
    web_app_dir = Path(__file__).parent
    os.chdir(web_app_dir)
    
    print(f"🌐 Starting Voice Guardian Web App Server...")
    print(f"📁 Serving from: {web_app_dir}")
    print(f"🔗 URL: http://{HOST}:{PORT}")
    print(f"🎤 Voice Guardian Web App will open in your browser...")
    
    # Start the server
    with socketserver.TCPServer((HOST, PORT), CustomHTTPRequestHandler) as httpd:
        print(f"✅ Server running on http://{HOST}:{PORT}")
        print("Press Ctrl+C to stop the server")
        
        # Open browser
        webbrowser.open(f'http://{HOST}:{PORT}')
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Server stopped")

if __name__ == "__main__":
    main()


