const urlBase = 'http://group15.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
const ids = [];

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("login-username").value;
	let password = document.getElementById("login-password").value;
//	var hash = md5( password );
	
	document.getElementById("login-result").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("login-result").innerHTML = "User/Password combination incorrect";
					document.getElementById("login-result-container").classList.add("login-result-container-present");
					document.getElementById("login-result").classList.add("login-result-container-present-text");
					return;
				}

				else
				{
					document.getElementById("login-result-container").classList.remove("login-result-container-present");
					document.getElementById("login-result").classList.remove("login-result-container-present-text");
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("login-result").innerHTML = err.message;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}   

function doRegister()
{   
    let login = document.getElementById("signup-username").value;
    let password = document.getElementById("signup-password").value;
    let passwordCheck = document.getElementById("reenter-password").value;
  	firstName = document.getElementById("firstname").value;
  	lastName = document.getElementById("lastname").value;

    if (password != passwordCheck)
    {
        document.getElementById("signup-result").innerHTML = "Passwords do not match";
		document.getElementById("signup-result-container").classList.add("signup-result-container-error");
        document.getElementById("signup-result").classList.add("signup-result-container-present-text");
        return;
    }

    let tmp = {login:login,password:password,firstName,lastName};
	//  var tmp = {login:login,password:hash};
    let jsonPayload = JSON.stringify( tmp );
    
    let url = urlBase + '/Register.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function() 
        {
            if (this.readyState == 4 && this.status == 200)
            {
                let jsonObject = JSON.parse( xhr.responseText );
                userId = jsonObject.id;
        
                if( userId < 1 )
                {       
          			console.log("Registration failed");
                    return;
                }
        
                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

                saveCookie();
    
                document.getElementById("signup-result").innerHTML = "Successfully Added User!";
				document.getElementById("signup-result-container").classList.add("signup-result-container-present");
                document.getElementById("signup-result-container").classList.remove("signup-result-container-error");
				document.getElementById("signup-result").classList.add("signup-result-container-present-text");
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
    	console.log("Registration failed");
    }
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + "; expires=" + date.toGMTString();
    document.cookie = "lastName=" + lastName + "; expires=" + date.toGMTString();
    document.cookie = "userId=" + userId + "; expires=" + date.toGMTString();
}

function readCookie()
{
    userId = -1;
    let firstNameCookie = getCookie("firstName");
    let lastNameCookie = getCookie("lastName");
    let userIdCookie = getCookie("userId");

    if (firstNameCookie !== "") 
    {
        firstName = firstNameCookie;
    }

    if (lastNameCookie !== "") 
    {
        lastName = lastNameCookie;
    }

    if (userIdCookie !== "") 
    {
        userId = parseInt(userIdCookie);
    }
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}

	else
	{
		document.getElementById("firstname-contact-page-message").innerHTML = firstName;
		document.getElementById("lastname-contact-page-message").innerHTML = lastName;
	}
}

function getCookie(cookieName) {
    const name = cookieName + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(";");

    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i].trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return "";
}

function loadContacts(searchCriteria)
{
	let tmp = 
	{
        search: searchCriteria,
        userId: userId
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchContact.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	document.getElementById("contacts-container").innerHTML = "";

    try 
	{
        xhr.onreadystatechange = function () 
		{
            if (this.readyState == 4 && this.status == 200) 
			{
                let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error) 
				{
                    console.log(jsonObject.error);
					toggleBlankTableMessage("blank");
                    return;
                }
                let text = "<table border='8'>";
				text += "<tr id='table-header-row'><td><p>First Name</p></td><td><p>Last Name</p></td><td><p>Email</p></td><td><p>Phone</p></td><td><p></p></td></tr>";
				
                for (let i = 0; i < jsonObject.results.length; i++) 
				{
                    ids[i] = jsonObject.results[i].ID
                    text += "<tr id='row" + i + "' class='contact-row'>"
                    text += "<td id='firstNameRow" + i + "' class='firstname-cell'><span class='table-span'>" + jsonObject.results[i].FirstName + "</span></td>";
                    text += "<td id='lastNameRow" + i + "' class='lastname-cell'><span class='table-span'>" + jsonObject.results[i].LastName + "</span></td>";
                    text += "<td id='emailRow" + i + "' class='email-cell'><span class='table-span'>" + jsonObject.results[i].Email + "</span></td>";
                    text += "<td id='phoneRow" + i + "'class='phone-cell'><span class='table-span'>" + jsonObject.results[i].Phone + "</span></td>";
                    text += "<td class='button-cell'>" +
                        "<button id='editButton" + i + "' class='edit-button' onclick='editRow(" + i + ")'>" + "<img src='images/editing.png'></button>" +
						"<button id='saveButton" + i + "' class='save-button' onclick='saveRow(" + i + ")' style='display: none'>" + "<img src='images/check.png'></button>" +
                        "<button id='deleteButton" + i + "' class='delete-button' onclick='deleteRow(" + i + ")' '>" + " <img src='images/trashcan.png'></button>" + "</td>";
                    text += "<tr/>"
                }
                text += "</table>"
                document.getElementById("contacts-container").innerHTML = text;
            }
        };
        xhr.send(jsonPayload);
    } 
	catch (err) 
	{
        console.log(err.message);
    }

	toggleBlankTableMessage("notBlank");
}

function searchContacts() 
{
    let searchCriteria = document.getElementById("searchbar").value;
	loadContacts(searchCriteria);
}

function addContact()
{
	let firstName = document.getElementById("create-contact-firstname").value;
	let lastName = document.getElementById("create-contact-lastname").value;
	let email = document.getElementById("create-contact-email").value;
	let phone = document.getElementById("create-contact-phone").value;

	if (!validAddContact(firstName, lastName, email, phone))
	{
		console.log("CONTACT INFO NOT VALID!");
		return;
	}

	let tmp = {
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phone,
        emailAddress: email,
        userId: userId 
    };

	let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/AddContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try 
	{
        xhr.onreadystatechange = function () 
		{
            if (this.readyState == 4 && this.status == 200) 
			{
                console.log("Contact has been added");

                document.getElementById("create-contact-firstname").value = "";
                document.getElementById("create-contact-lastname").value = "";
                document.getElementById("create-contact-email").value = "";
                document.getElementById("create-contact-phone").value = "";

				// contact added successfully message
				showElementForFewSeconds();
            }
        };
        xhr.send(jsonPayload);
    } 
	catch (err) 
	{
        console.log(err.message);
    }
}

function showElementForFewSeconds() 
{
	let myElement = document.getElementById("added-contact-message");
	
    myElement.style.display = 'block';
    setTimeout(function () {
      myElement.style.display = 'none'; // Hide the element after 3 few seconds 
    }, 3000); 
}

function validAddContact(firstName, lastName, email, phone)
{
	let contactError = false;

	if (firstName == "" || lastName == "" || email == "" || phone == "")
	{
		contactError = true;
	}

	let validEmailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

	if (validEmailRegex.test(email) == false)
	{contactError = true;
	}

	let validPhoneRegex = /^[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;

	if (validPhoneRegex.test(phone) == false)
	{
		contactError = true;
	}

	return !contactError;
}

function deleteRow(rowNumber) 
{
    var namef_val = document.getElementById("firstNameRow" + rowNumber).innerText;
    var namel_val = document.getElementById("lastNameRow" + rowNumber).innerText;
    nameOne = namef_val.substring(0, namef_val.length);
    nameTwo = namel_val.substring(0, namel_val.length);

    let check = confirm('Are you sure you want to delete: ' + nameOne + ' ' + nameTwo + '?');

    if (check === true) 
	{
        document.getElementById("row" + rowNumber + "").outerHTML = "";
        let tmp = 
		{
            firstName: nameOne,
            lastName: nameTwo,
            userId: userId
        };

        let jsonPayload = JSON.stringify(tmp);

        let url = urlBase + '/DeleteContact.' + extension;

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try 
		{
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) 
				{

                    console.log("Contact has been deleted");
                    loadContacts();
                }
            };
            xhr.send(jsonPayload);
        } 
		catch (err) 
		{
            console.log(err.message);
        }
    };
}

function editRow(id) 
{
    document.getElementById("editButton" + id).style.display = "none";
    document.getElementById("saveButton" + id).style.display = "inline-block";

    var firstNameI = document.getElementById("firstNameRow" + id);
    var lastNameI = document.getElementById("lastNameRow" + id);
    var email = document.getElementById("emailRow" + id);
    var phone = document.getElementById("phoneRow" + id);

    var namef_data = firstNameI.innerText;
    var namel_data = lastNameI.innerText;
    var email_data = email.innerText;
    var phone_data = phone.innerText;

    firstNameI.innerHTML = "<input type='text' class='editing-input-box' id='namef_text" + id + "' value='" + namef_data + "'>";
    lastNameI.innerHTML = "<input type='text' class='editing-input-box' id='namel_text" + id + "' value='" + namel_data + "'>";
    email.innerHTML = "<input type='text' class='editing-input-box' id='email_text" + id + "' value='" + email_data + "'>";
    phone.innerHTML = "<input type='text' class='editing-input-box' id='phone_text" + id + "' value='" + phone_data + "'>"
}

function saveRow(no) 
{
    var namef_val = document.getElementById("namef_text" + no).value;
    var namel_val = document.getElementById("namel_text" + no).value;
    var email_val = document.getElementById("email_text" + no).value;
    var phone_val = document.getElementById("phone_text" + no).value;
    var id_val = ids[no]

    document.getElementById("firstNameRow" + no).innerHTML = namef_val;
    document.getElementById("lastNameRow" + no).innerHTML = namel_val;
    document.getElementById("emailRow" + no).innerHTML = email_val;
    document.getElementById("phoneRow" + no).innerHTML = phone_val;

    document.getElementById("editButton" + no).style.display = "inline-block";
    document.getElementById("saveButton" + no).style.display = "none";

    let tmp = {
        phoneNumber: phone_val,
        emailAddress: email_val,
        newFirstName: namef_val,
        newLastName: namel_val,
        id: id_val
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Update.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try 
	{
        xhr.onreadystatechange = function () 
		{
            if (this.readyState == 4 && this.status == 200) 
			{
                console.log("Contact has been updated");
                loadContacts();
            }
        };
        xhr.send(jsonPayload);
    } 
	catch (err) 
	{
        console.log(err.message);
    }
}

function toggleBlankTableMessage(state)
{
	let blankTableMessage = document.getElementById("blank-table-message");

	if (state == "blank")
	{
		blankTableMessage.classList.remove("make-hidden-style");
	}

	else
	{
		blankTableMessage.classList.add("make-hidden-style");
	}
}