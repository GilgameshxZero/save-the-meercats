from flask import Flask, request, jsonify
from openai import OpenAI

app = Flask(__name__, static_url_path="", static_folder="../static")
oai = OpenAI()

sessions = {}

@app.route("/api/message", methods=['POST'])
def message():
	session_id = request.args.get("session_id")
	# history = sessions[session_id] if session_id in sessions else [{"role": "assistant", "content": "Hello! How can I help you today?"}]
	text = request.get_json()["text"]

	model_response = oai.chat.completions.create(
		model="gpt-3.5-turbo-16k",
		messages=[
			{"role": "system", "content": "You are simulating"},
			{"role": "user", "content": text}
		]
	)
	
	monitor_time = oai.chat.completions.create(
		model="gpt-3.5-turbo-16k",
		messages=[
			{"role": "system", "content": "You are an excellent calendar management assistant. You are in charge of scheduling activities for your client. Each activity takes at minimum 1 day and at most 365 days. When given an activity, it is your job to determine how many days the activity will take."},
			{"role": "user", "content": "Please determine how many days this will take: " + text}
		]
	)

	return jsonify({
		"days_elapsed": 5,
		"text": str(monitor_time.choices[0].message)
	})
