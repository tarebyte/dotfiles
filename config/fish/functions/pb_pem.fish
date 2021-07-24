function pb_pem
	# pem = File.read("#{ARGV[0]}")
	# pem_string = pem.gsub(/\n/, '\n').strip # format as one line String for use as Env var
	# IO.popen("pbcopy", "w") { |pipe| pipe.puts pem_string }

	if test ! -e "$argv"
		echo "PEM file not provided"
		return 1
	end

	set pem_string

	while read -l line
		echo (string join \n $pem_string $line)
	end < $argv

	echo $pem_string
end
