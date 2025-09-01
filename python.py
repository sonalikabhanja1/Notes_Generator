from flask import Flask, render_template, request, jsonify
import openai  # Optional: Use GPT for note generation

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    data = request.get_json()
    raw_text = data['text']

    # Simple logic or GPT-based generation
    notes = generate_notes(raw_text)
    return jsonify({'notes': notes})

def generate_notes(text):
    # Replace with GPT or custom logic
    return f"🔹 Topic: {text}\n🔸 Key Points:\n- Point 1\n- Point 2\n- Point 3"

if __name__ == '__main__':
    app.run(debug=True)