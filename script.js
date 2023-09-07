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
	console.log(url); // FOR DEBUGGING

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
					console.log("CHECK 1"); // FOR DEBUGGING
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				console.log("CHECK 2"); // FOR DEBUGGING

				saveCookie();

				console.log("CHECK 3"); // FOR DEBUGGING
	
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("login-result").innerHTML = err.message;
		console.log("CHECK 4"); // FOR DEBUGGING
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
		// changed later
		// document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
    // idk if the following line needs to be modified
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
                    // document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
          			console.log("Registration failed");
                    return;
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
    	console.log("Registration failed");
        // document.getElementById("login-result").innerHTML = err.message;
    }
}

// let loginButton = document.getElementById("login-button");
// let SignupButton = document.getElementById("signup-button");

// if (loginButton)
// {
// 	loginButton.addEventListener('click', doLogin);
// }

// if (SignupButton)
// {
// 	SignupButton.addEventListener('click', doRegister);
// }