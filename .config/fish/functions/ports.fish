function ports
	lsof -iTCP -sTCP:LISTEN -P
end
