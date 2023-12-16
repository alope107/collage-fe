from http.server import BaseHTTPRequestHandler, HTTPServer
import json


class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):

    # Counter for GET requests
    get_requests_count = 0

    def _set_headers(self, status_code=200, content_type='application/json'):
        self.send_response(status_code)
        self.send_header('Content-type', content_type)
        # CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'X-Requested-With, Content-type')
        self.end_headers()

    def do_GET(self):
        SimpleHTTPRequestHandler.get_requests_count += 1
        if SimpleHTTPRequestHandler.get_requests_count % 3 == 0:
            self._set_headers()
            self.wfile.write("Dummy FASTA".encode('utf-8'))
        else:
            self._set_headers(status_code=404)
            self.wfile.write(b'404 Not Found')

    def do_POST(self):
        self._set_headers()
        response = {
            "isValid": True,
            "id": "dummy"
        }
        self.wfile.write(json.dumps(response).encode('utf-8'))

    def do_OPTIONS(self):
        self._set_headers()


def run(server_class=HTTPServer, handler_class=SimpleHTTPRequestHandler, port=8000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f"Starting httpd server on port {port}")
    httpd.serve_forever()


if __name__ == '__main__':
    run()
