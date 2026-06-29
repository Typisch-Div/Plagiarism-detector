from flask import Flask, request, jsonify
from flask_cors import CORS
import re

app = Flask(__name__)
CORS(app)

class CodeAnalyzer:
    def __init__(self):
        self.pattern = r'[a-zA-Z_][a-zA-Z0-9_]*|[0-9]+|[+\-*/%=<>!&|^~]+|[(){}\[\];:,.]'
    
    def tokenize(self, code):
        code = re.sub(r'//.*$', '', code, flags=re.MULTILINE)
        code = re.sub(r'/\*.*?\*/', '', code, flags=re.DOTALL)
        tokens = re.findall(self.pattern, code.lower())
        return tokens
    
    def calculate_similarity(self, code1, code2):
        tokens1 = self.tokenize(code1)
        tokens2 = self.tokenize(code2)
        
        if not tokens1 or not tokens2:
            return 0.0 if (tokens1 or tokens2) else 100.0
        
        set1 = set(tokens1)
        set2 = set(tokens2)
        intersection = len(set1 & set2)
        union = len(set1 | set2)
        
        return round((intersection / union * 100) if union > 0 else 0, 1)
    
    def analyze(self, code1, code2, language="python"):
        similarity = self.calculate_similarity(code1, code2)
        
        if similarity >= 80:
            risk = "HIGH"
            message = "⚠️ HIGH SIMILARITY: Code is nearly identical"
        elif similarity >= 50:
            risk = "MEDIUM"
            message = "⚠️ MEDIUM SIMILARITY: Some patterns match"
        else:
            risk = "LOW"
            message = "✅ LOW SIMILARITY: Code is substantially different"
        
        return {
            'similarity': similarity,
            'risk_level': risk,
            'message': message,
            'language': language,
            'status': 'success'
        }

analyzer = CodeAnalyzer()

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'running',
        'message': 'Backend working ✅'
    }), 200

@app.route('/api/compare', methods=['POST'])
def compare():
    try:
        data = request.json
        code1 = data.get('code1', '').strip()
        code2 = data.get('code2', '').strip()
        language = data.get('language', 'python')
        
        if not code1 or not code2:
            return jsonify({'error': 'Both codes required'}), 400
        
        if len(code1) > 10000 or len(code2) > 10000:
            return jsonify({'error': 'Code too large'}), 400
        
        result = analyzer.analyze(code1, code2, language)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/languages', methods=['GET'])
def languages():
    return jsonify({
        'languages': [
            {'name': 'Python', 'emoji': '🐍'},
            {'name': 'Java', 'emoji': '☕'},
            {'name': 'C++', 'emoji': '🚀'},
            {'name': 'JavaScript', 'emoji': '🌐'}
        ]
    }), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)