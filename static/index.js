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
	const text = inputNode.textContent;

	// Fetch the user input from the text box.
	const response = await fetch("/api/message", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		params: {
			sessionId: sessionId
		},
		body: JSON.stringify({ text: text })
	});

	// Parse the JSON response
	const result = await response.json();
	console.log("Success:", result);

	const newSegment = document.createElement("p");
	newSegment.innerText = result.text;
	document.querySelector(`.storyboard`).appendChild(newSegment);
};
