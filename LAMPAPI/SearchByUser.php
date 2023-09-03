<?php

	$inData = getRequestInfo();

	$queriedResult= "";
	$queryCount = 0;

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
?>