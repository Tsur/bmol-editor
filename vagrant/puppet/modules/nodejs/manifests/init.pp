# $version can be the string "latest", "stable" or a number (e.g. 0.10.30)
class nodejs ( $version = 'stable', $logoutput = 'on_failure' ) {
	
	if ! defined(Package['curl']) {
		
		package { 'curl':
			ensure => present,
		}
	}

	exec { 'node' :
		
		command     => "bash -c \"\$(curl -s 'https://raw.githubusercontent.com/isaacs/nave/master/nave.sh') usemain $version \"",
		path        => [ "/usr/local/bin", "/bin" , "/usr/bin" ],
		require     => Package[ 'curl' ],
		environment => [ 'HOME=""', 'PREFIX=/usr/local/lib/node', 'NAVE_JOBS=1' ],
		logoutput   => $logoutput,
		timeout     => 0,
		unless      => "test \"v$version\" = \"\$(node -v)\""
		
	}
}