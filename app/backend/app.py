from flask import Flask, request, jsonify
from flask_cors import CORS
from service import classification_service
import logging

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all origins (dev); restrict in production
CORS(app, resources={r"/*": {"origins": "*"}})

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Explicitly add headers to every response to ensure CORS works even on errors
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route('/health', methods=['GET'])
def health_check():
    """Check API health and model load status."""
    status = "healthy" if classification_service.model_loaded else "degraded"
    response = {
        "status": status,
        "model_loaded": classification_service.model_loaded,
        "errors": classification_service.errors
    }
    return jsonify(response), 200

@app.route('/process', methods=['POST'])
def process_input():
    """
    Process input text for classification.
    Returns JSON with predicted class and optional details.
    """
    try:
        data = request.get_json(force=True)
    except Exception as e:
        logger.error(f"Error parsing JSON: {e}")
        return jsonify({"error": "Invalid JSON"}), 400

    if not data:
        return jsonify({"error": "No JSON data provided"}), 400

    user_input = data.get('input')
    if not user_input:
        return jsonify({"error": "Field 'input' is required"}), 400

    # Call classification service
    try:
        result = classification_service.predict(user_input)
    except Exception as e:
        logger.exception(f"Error during prediction: {e}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

    if "error" in result:
        return jsonify(result), 500

    return jsonify({"message": result.get("class"), "details": result}), 200

if __name__ == '__main__':
    logger.info("Starting Flask server on port 5000 (0.0.0.0)...")
    # Bind to 0.0.0.0 to ensure access from both localhost (IPv4) and IPv6 loopbacks if needed
    app.run(debug=True, port=5002, host='0.0.0.0')
