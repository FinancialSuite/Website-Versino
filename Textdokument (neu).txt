import http.server
import socketserver
import os

# --- Konfiguration ---
# Hier kannst du den Port ändern, falls 8000 bereits belegt ist.
PORT = 8000

# Finde den Pfad zum aktuellen Skript, damit der Server immer im richtigen Ordner startet.
web_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(web_dir)

# --- Server-Logik ---
# Dies ist der Handler, der die Anfragen bearbeitet und die Dateien ausliefert.
# SimpleHTTPRequestHandler ist perfekt für das Ausliefern von statischen Dateien.
Handler = http.server.SimpleHTTPRequestHandler

# TCPServer kümmert sich um die Netzwerkverbindung.
# Wir binden den Server an alle verfügbaren Netzwerkschnittstellen ('') und den definierten Port.
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"✅ Server gestartet!")
    print(f"Öffne deine Webseite hier: http://localhost:{PORT}")
    
    try:
        # Starte den Server und lasse ihn laufen, bis er manuell gestoppt wird.
        httpd.serve_forever()
    except KeyboardInterrupt:
        # Ermöglicht das saubere Herunterfahren des Servers mit Strg+C.
        print("\n shutting down server...")
        httpd.shutdown()