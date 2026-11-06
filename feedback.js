// Store DOM references once so event handlers can reuse them.
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

const minimumComments = 20;
const maximumComments = 40;
let successTimer = null;

// Connect each input to its error element and validation function.
// This lets all fields share the same validation and feedback flow.
const fields = [
    { input: fullName, error: nameError, validate: validateFullName },
    { input: email, error: emailError, validate: validateEmail },
    { input: topic, error: topicError, validate: validateTopic },
    { input: comments, error: commentsError, validate: validateComments },
    { input: website, error: websiteError, validate: validateWebsite }
];

// Each validation function returns an error message for invalid input.
// An empty string means that the input passed validation.
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

// Use the same length calculation for validation and the live counter.
// Leading and trailing whitespace does not count towards the minimum.
function commentLength(value)
{
    return [...value.trim()].length;
}

function validateComments(value) 
{
  return commentLength(value) < minimumComments || commentLength(value) > maximumComments ? "Enter a comment using between 20 and 40 characters." : "";
}

function validateWebsite(value)
{
    if (value.trim() !== "" && !website.validity.valid) 
    {
        return "Enter a complete URL, for example https://example.com.";
    }

    return "";
}

// Combine visible error text and styling with an accessible invalid state.
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
    // Run the validator assigned to this field and use its returned message.
    const message = field.validate(field.input.value);
    if(message !== "")
    {
        showFieldError(field, message);
        return false;
    }

    clearFieldError(field);

    // An empty optional field passes validation but keeps a neutral border.
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

// Prevent an older timer from removing a newer success message.
function clearSuccessMessage()
{
    clearTimeout(successTimer);
    successTimer = null;
    statusMessage.textContent = "";
}

// Restore field values, validation states, the counter and the status message.
// Reuse this function after successful submission and when Clear is pressed.
function resetForm()
{
    fields.forEach((field) => {
        field.input.value = "";
        clearFieldError(field);
    });

    updateCounter();
    clearSuccessMessage();
}

// Give immediate feedback whenever the user changes a field.
fields.forEach((field) => {
    field.input.addEventListener("input", () => validateField(field));
});

// Update the character count whenever the comment changes.
comments.addEventListener("input", updateCounter);

form.addEventListener("reset", (event) => {
    // The browser's default reset does not clear our custom feedback or timer.
    event.preventDefault();
    resetForm();
    fullName.focus();
});

form.addEventListener("submit", (event) => {
    // Handle submission in JavaScript instead of submitting the page.
    event.preventDefault();

    // Remove any previous success message and cancel its timer.
    clearSuccessMessage();

    // Validate every field so all errors can be displayed in one attempt.
    const results = fields.map(validateField);
    
    // Find the first failed validation. -1 means that every field passed.
    const firstInvalid = results.indexOf(false);

    if(firstInvalid !== -1)
    {
        // Help the user locate the first field that needs correction.
        fields[firstInvalid].input.focus();
        return;
    }

    // Keep the name before resetForm clears the input values.
    const submittedName = fullName.value.trim();
    resetForm();

    // Display the confirmation as plain text.
    statusMessage.textContent = `Thank you for your feedback, ${submittedName}!`;
    
    // Remove the confirmation after four seconds.
    successTimer = setTimeout(clearSuccessMessage, 4000);
});

updateCounter(); // Initialize counter on page load

