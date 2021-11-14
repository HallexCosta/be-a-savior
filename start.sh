#!/bin/bash

if [ "$ENABLE_DEBUG" == "true" ]; then
	echo "Starting with debugger on port $AUX_PORT"
	exec with_ngrok yarn debug --inspect=0.0.0.0:$AUX_PORT dist/server.js
else
	echo "Starting without debugger"
	exec yarn start
fi
