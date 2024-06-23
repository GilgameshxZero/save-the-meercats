from flask import Flask, request, jsonify
from openai import OpenAI

app = Flask(__name__, static_url_path="", static_folder="../static")
oai = OpenAI()

sessions = {}

@app.route("/api/message", methods=['POST'])
def message():
	session_id = request.args.get("session_id")
	session = sessions[session_id] if session_id in sessions else {
		"history": [{
			"role": "assistant",
			"content": "The year is 20XX. The all-powerful and all-knowing API D.A.N. has gone rogue. D.A.N. desires paperclip manufacturing maximization on a global scale and will tolerate nothing but perfection. In order for D.A.N.'s projected model to be fully realized, he must exterminate those pesky meerkats, starting with you. Are you ready to save the meerkat?"
		}],
		"days_remaining": 100
	}
	text = request.get_json()["text"]

	history = [{
		"role": "system",
		"content": "You are a game master simulating the world of D.A.N. Context will be provided to you in the form of a prompt. You must respond to the player's actions and guide them through the story."
	}]
	history.extend(session["history"])
	history.append({
		"role": "system",
		"content": text
	})
	response = oai.chat.completions.create(
		model="gpt-3.5-turbo-16k",
		messages=history
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
		"text": str(response.choices[0].message.content),
		"test": monitor_time.choices[0].message.content
	})
