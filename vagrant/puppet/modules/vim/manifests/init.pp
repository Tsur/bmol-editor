class vim {
	
	if ! defined(Package['curl']) {
		
		package { 'curl':
			ensure => present,
		}
	}

	package { "vim":

        ensure => latest,
        require => Exec["aptGetUpdate"]
    }

	package { "vim-common":

        ensure => latest,
        require => Exec["aptGetUpdate"]
    }

    # TODO check if already done
	exec { 'spf13' :
		
		user     	=> "vagrant",
		command     => "curl https://j.mp/spf13-vim3 -L > spf13-vim.sh && sh spf13-vim.sh",
		provider 	=> shell,
		environment => [ "HOME=/home/vagrant" ],
		path        => [ "/usr/local/bin", "/bin" , "/usr/bin" ],
		require     => Package[ 'curl', 'vim', 'vim-common' ],
		logoutput   => true,
		timeout     => 7200,
		creates 	=> "/home/vagrant/.spf13-vim-3",
		cwd			=> "/home/vagrant"
	}
}