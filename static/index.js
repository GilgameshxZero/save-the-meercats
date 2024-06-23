const sessionId = (Math.random() + 1).toString(36).substring(7);
const background = document.querySelector(`.background`);
const title = document.querySelector(`.title`);
const script = document.querySelector(`.script`);
const interactor = document.querySelector(`.interactor`);
const form = document.querySelector(`.interactor>form`);
const input = document.querySelector(`.interactor>form>input`);

const onFetchResponse = function (response) {
	console.log(response);

	const newSegment = document.createElement(`p`);
	newSegment.innerText = response.text;

	if (response.monitor_failure === `dead`) {
		newSegment.innerText += `<br><br>You have died. Game over.`;
		form.querySelector(`button`).disabled = true;
	}

	if (response.monitor_decimate === `dead`) {
		newSegment.innerText += `<br><br>You won! D.A.N. has been decimated!`;
		form.querySelector(`button`).disabled = true;
	}

	document.querySelector(`.script`).appendChild(newSegment);
};

const fetchResponse = function (text, callback) {
	fetch(`/api/message?session_id=${sessionId}`, {
		method: `POST`,
		headers: {
			"Content-Type": `application/json`
		},
		body: JSON.stringify({ text: text })
	})
		.then((response) => response.json())
		.then((responseJson) => {
			callback(responseJson);
		});
};

const onSubmit = function (e) {
	e.preventDefault();

	const nextScript = document.createElement(`p`);
	nextScript.innerText = input.value;
	document.querySelector(`.script`).appendChild(nextScript);
	input.value = ``;

	// Fetch the user input from the text box.
	fetchResponse(input.value, onFetchResponse);
};

const onWheel = function (e) {
	background.setAttribute(`position`, `script`);
	title.classList.add(`unloaded`);
	title.addEventListener(`transitionend`, (e) => {
		title.remove();
		script.style = ``;
		interactor.style = ``;
		setTimeout(() => {
			script.classList.remove(`unloaded`);
			interactor.classList.remove(`unloaded`);

			form.addEventListener(`submit`, onSubmit);
		}, 0);
	});
};

window.addEventListener(
	`load`,
	() => {
		document.fonts.ready.then(() => {
			document.body.style = ``;

			document.addEventListener(`wheel`, onWheel, { once: true });
			document.addEventListener(`scroll`, onWheel, { once: true });
		});
	},
	{ once: true }
);
