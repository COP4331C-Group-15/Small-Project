<?php

	$inData = getRequestInfo();

	$queriedResult= "";
	$queryCount = 0;

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
    else
	{
		$stmt = $conn->prepare("SELECT * FROM Users WHERE Login= ?");
		$stmt->bind_param("s", $inData["login"]);
		$stmt->execute();

		$queriedResult = $stmt->get_result();

		while($row = $queriedResult->fetch_assoc())
		{
			$queryCount++;
		}

		if( $queryCount == 0 )
		{
			returnWithInfo( "" );
		}
		else
		{
			returnWithError( "Username has been taken" );
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
		$retValue = '{"Error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $info )
	{
		$retValue = '{"Error": "' . $info . '"}';
		sendResultInfoAsJson( $retValue );
	}
?>
