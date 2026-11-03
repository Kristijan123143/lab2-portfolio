const form = document.getElementById('feedback-form');
const fullName = document.getElementById('full-name');
const email = document.getElementById('email');
const topic = document.getElementById('topic');
const comments = document.getElementById('comments');
const website = document.getElementById('website');

const nameError = document.getElementById('name-error');
const emailError = document.getElementById('email-error');
const tpoicError = document.getElementById('topic-error');
const commentsError = document.getElementById('comments-error');
const websiteError = document.getElementById('website-error');
const couunter = document.getElementById('comments-counter');
const statusMessage = document.getElementById('feedback-status');

const minimumComents = 15;
let successTimer = null;

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

function commentLenght(value)
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
