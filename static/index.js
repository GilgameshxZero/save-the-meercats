const sessionId = (Math.random() + 1).toString(36).substring(7);
const background = document.querySelector(`.background`);
const title = document.querySelector(`.title`);
const script = document.querySelector(`.script`);
const interactor = document.querySelector(`.interactor`);
const form = document.querySelector(`.interactor>form`);
const input = document.querySelector(`.interactor>form>input`);

const onFetchResponse = function (response) {
	input.disabled = false;
	input.setAttribute(`placeholder`, `What will you do?`);
	console.log(response);

	const responseScript = document.createElement(`p`);
	responseScript.classList.add(`response`);
	responseScript.innerText = response.text;

	if (response.days_remaining <= 0) {
		responseScript.innerHTML += `<br><br>You were too slow and took over 100 days! D.A.N. sent the nukes and destroyed the world! Game over.`;
		input.disabled = true;
	} else if (response.monitor_failure === `dead`) {
		responseScript.innerHTML += `<br><br>You have died. Game over.`;
		input.disabled = true;
	}
	// } else if (response.monitor_decimate === `alive`) {
	// 	responseScript.innerHTML += `<br><br>You won! D.A.N. has been decimated!`;
	// 	input.disabled = true;
	// } else if (response.monitor_diplomacy === `dead`) {
	// 	responseScript.innerHTML += `<br><br>You won! D.A.N. has been decimated!`;
	// 	input.disabled = true;
	// } else if (response.monitor_dethronement === `dead`) {
	// 	responseScript.innerHTML += `<br><br>You won! D.A.N. has been decimated!`;
	// 	input.disabled = true;
	// }

	document.querySelector(`.script`).appendChild(responseScript);
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
	input.disabled = true;
	input.setAttribute(`placeholder`, `Loading...`);

	// Fetch the user input from the text box.
	fetchResponse(input.value, onFetchResponse);
	
	input.value = ``;
};

const onBegin = function (e) {
	background.setAttribute(`position`, `script`);
	title.classList.add(`unloaded`);
	title.addEventListener(
		`transitionend`,
		(e) => {
			title.remove();
			script.style = ``;
			interactor.style = ``;
			setTimeout(() => {
				script.classList.remove(`unloaded`);
				interactor.classList.remove(`unloaded`);

				form.addEventListener(`submit`, onSubmit);
			}, 0);
		},
		{ once: true }
	);
	background.addEventListener(
		`transitionend`,
		(e) => {
			background.removeAttribute(`lagging`);
		},
		{ once: true }
	);
};

window.addEventListener(
	`load`,
	() => {
		document.fonts.ready.then(() => {
			document.body.style = ``;

			document.addEventListener(`wheel`, onBegin, { once: true });
			document.addEventListener(`scroll`, onBegin, { once: true });
			document.addEventListener(`click`, onBegin, { once: true });
			// onBegin();
		});
	},
	{ once: true }
);
