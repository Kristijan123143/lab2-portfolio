const form = document.getElementById('feedback-form');
const fullName = document.getElementById('full-name');
const email = document.getElementById('email');
const topic = document.getElementById('topic');
const comments = document.getElementById('comments');
const website = document.getElementById('website');

const nameError = document.getElementById('name-error');
const emailError = document.getElementById('email-error');
const topicError = document.getElementById('topic-error');
const commentsError = document.getElementById('comments-error');
const websiteError = document.getElementById('website-error');
const counter = document.getElementById('comments-counter');
const statusMessage = document.getElementById('feedback-status');

const minimumComments = 15;
let successTimer = null;

const fields = [
    { input: fullName, error: nameError, validate: validateFullName },
    { input: email, error: emailError, validate: validateEmail },
    { input: topic, error: topicError, validate: validateTopic },
    { input: comments, error: commentsError, validate: validateComments },
    { input: website, error: websiteError, validate: validateWebsite }
];

function validateFullName(value)
{
    const name = value.trim().normalize("NFC");

    if([...name].length < 2)
    {
        return "Enter your name using at least 2 characters.";
    }

    // Unicode letters and combining marks allow international names.
    if (!/^[\p{L}\p{M} '\u2019-]+$/u.test(name) || !/\p{L}/u.test(name)) 
    {
        return "Use letters, spaces, apostrophes or hyphens.";
    }

    return "";
}

function validateEmail(value)
{
    if (value.trim() === "") 
    {
        return "Enter your email address.";
    }

    if (!email.validity.valid || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) 
    {
        return "Enter a valid email, for example name@example.com.";
    }

  return "";
}

function validateTopic(value) 
{
  return value === "" ? "Choose a topic of interest." : "";
}

function commentLength(value)
{
    return [...value.trim()].length;
}

function validateComments(value) 
{
  return commentLength(value) < minimumComments ? "Enter a comment using at least 15 characters." : "";
}

function validateWebsite(value)
{
    if (value.trim() !== "" && !website.validity.valid) 
    {
        return "Enter a complete URL, for example https://example.com.";
    }

    return "";
}

function showFieldError(field, message)
{
    field.error.textContent = message;
    field.input.classList.remove("is-valid");
    field.input.classList.add("is-invalid");
    field.input.setAttribute("aria-invalid", "true");
}

function clearFieldError(field)
{
    field.error.textContent = "";
    field.input.classList.remove("is-invalid", "is-valid");
    field.input.removeAttribute("aria-invalid");
}

function validateField(field)
{
    const message = field.validate(field.input.value);
    if(message !== "")
    {
        showFieldError(field, message);
        return false;
    }

    clearFieldError(field);

    if(field.input.value.trim() !== "")
    {
        field.input.classList.add("is-valid");
    }

    return true;
}


function updateCounter()
{
    const count = commentLength(comments.value);
    const enough = count >= minimumComments;

    counter.textContent = enough
    ? `${count} characters – the minimum of ${minimumComments} is met.`
    : `${count} characters – at least ${minimumComments} required.`;

    counter.classList.toggle("too-short", !enough);
    counter.classList.toggle("long-enough", enough);
}

function clearSuccessMessage()
{
    clearTimeout(successTimer);
    successTimer = null;
    statusMessage.textContent = "";
}

function resetForm()
{
    fields.forEach((field) => {
        field.input.value = "";
        clearFieldError(field);
    });

    updateCounter();
    clearSuccessMessage();
}

fields.forEach((field) => {
    field.input.addEventListener("input", () => validateField(field));
});

comments.addEventListener("input", updateCounter);

form.addEventListener("reset", (event) => {
    event.preventDefault();
    resetForm();
    fullName.focus();
});

form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearSuccessMessage();

    const results = fields.map(validateField);
    const firstInvalid = results.indexOf(false);

    if(firstInvalid !== -1)
    {
        fields[firstInvalid].input.focus();
        return;
    }

    const submittedName = fullName.value.trim();
    resetForm();
    statusMessage.textContent = `Thank you for your feedback, ${submittedName}!`;
    successTimer = setTimeout(clearSuccessMessage, 4000);
});

updateCounter(); // Initialize counter on page load

