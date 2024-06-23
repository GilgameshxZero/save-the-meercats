//- Methods
function makeButton(name) {
	return `<button class="primaryButton">${name}</button>`;
}

//- Variables
const startBtn = document.getElementById("buttonHub");
const sessionId = (Math.random() + 1).toString(36).substring(7);

//- HTML
document.getElementById("story").innerText =
	"The year is 20XX. The all-powerful and all-knowing API D.A.N. has gone rogue. D.A.N. desires paperclip manufacturing maximization on a global scale and will tolerate nothing but perfection. In order for D.A.N.'s projected model to be fully realized, he must exterminate those pesky meerkats, starting with you. Are you ready to save the meerkat?";

startBtn.innerHTML = makeButton("SAVE HIM!");

//- Wiring
startBtn.onclick = async function () {
	const inputNode = document.getElementById("userInput");
	const text = inputNode.value;

	const userSegment = document.createElement("p");
	userSegment.innerText = text;
	document.querySelector(`.storyboard`).appendChild(userSegment);

	// Fetch the user input from the text box.
	const response = await fetch(`/api/message?session_id=${sessionId}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ text: text })
	});

	// Parse the JSON response
	const result = await response.json();
	console.log("Success:", result);

	const newSegment = document.createElement("p");
	newSegment.innerText = result.text;

	if (result.monitor_failure === "dead") {
		newSegment.innerText = "You have died. Game over.";
		startBtn.firstChild.disabled = true;
	}

	if (result.monitor_decimate === "dead") {
		newSegment.innerText = "You won! D.A.N. has been decimated!";
		startBtn.firstChild.disabled = true;
	}

	document.querySelector(`.storyboard`).appendChild(newSegment);
};
