const urlBase = 'http://group15.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

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
  	firstName = document.getElementById("firstname").value;
  	lastName = document.getElementById("lastname").value;

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
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
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