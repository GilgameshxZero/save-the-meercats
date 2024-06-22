//- Methods
function makeButton(name) {
    return `<button class="primaryButton">${name}</button>`;
}

//- Variables


//- HTML
document.getElementById("story").innerText = "The year is 20XX. The all-powerful and all-knowing API D.A.N. has gone rogue. D.A.N. desires paperclip manufacturing maximization on a global scale and will tolerate nothing but perfection. In order for D.A.N.'s projected model to be fully realized, he must exterminate those pesky meerkats, starting with you. Are you ready to save the meerkat?";

document.getElementById("buttonHub").innerHTML = makeButton('Save Who?');

