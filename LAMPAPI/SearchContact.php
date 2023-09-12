<?php

	$inData = getRequestInfo();
	
	$contactSearchResults = "";
	$searchCount = 0;

	// connection to the database
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		// this is the search contact part
		$stmt = $conn->prepare("SELECT * FROM Contacts WHERE FirstName = ? AND LastName = ? AND UserID = ?");
		$userName = "%" . $inData["search"] . "%";
		$stmt->bind_param("ss", $userName, $inData["userId"]);
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$contactSearchResults .= ",";
			}
			$searchCount++;
			$contactSearchResults .= '{"FirstName" : "' . $row["FirstName"]. '", "LastName" : "' . $row["LastName"]. 
				'", "PhoneNumber" : "' . $row["PhoneNumber"].  '", "EmailAddress" : "' . $row["EmailAddress"]. 
				'", "UserID" : "' . $row["UserID"]. '", "ID" : "' . $row["ID"]. '"}';
		}
		
		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfo( $contactSearchResults );
		}
		
		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $contactSearchResults )
	{
		$retValue = '{"results":[' . $contactSearchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>