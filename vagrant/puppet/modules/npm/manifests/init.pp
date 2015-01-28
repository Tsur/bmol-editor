class npm {
  
    # Global dependences
    exec { "npm-install-nave":

        command => "npm install -g nave",
        path => [ "/usr/local/bin", "/bin" , "/usr/bin" ],
        require => Class['nodejs'],
        unless 	=> "command -v nave",
        provider 	=> shell

    }

    exec { "npm-install-grunt":

        command => "npm install -g grunt-cli",
        path => [ "/usr/local/bin", "/bin" , "/usr/bin" ],
        require => Class['nodejs'],
        provider 	=> shell,
        unless 	=> "command -v grunt"

    }

    exec { "npm-install-mocha":

        command => "npm install -g mocha",
        path => [ "/usr/local/bin", "/bin" , "/usr/bin" ],
        require => Class['nodejs'],
        provider 	=> shell,
        unless 	=> "command -v mocha"

    }

    exec { "npm-install-forever":

        command => "npm install -g forever",
        path => [ "/usr/local/bin", "/bin" , "/usr/bin" ],
        require => Class['nodejs'],
        provider 	=> shell,
        unless 	=> "command -v forever"

    }

    exec { "npm-install-http-server":

        command => "npm install -g http-server",
        path => [ "/usr/local/bin", "/bin" , "/usr/bin" ],
        require => Class['nodejs'],
        provider 	=> shell,
        unless 	=> "command -v http-server"

    }

    exec { "npm-install-jsdoc":

        command => "npm install -g jsdoc",
        path => [ "/usr/local/bin", "/bin" , "/usr/bin" ],
        require => Class['nodejs'],
        provider    => shell,
        unless  => "command -v jsdoc"

    }

    exec { "npm-install-smartcomments":

        command => "npm install -g smartcomments",
        path => [ "/usr/local/bin", "/bin" , "/usr/bin" ],
        require => Class['nodejs'],
        provider    => shell,
        unless  => "command -v smartcomments"

    }

    exec { "npm-install-bunyan":

        command => "npm install -g bunyan",
        path => [ "/usr/local/bin", "/bin" , "/usr/bin" ],
        require => Class['nodejs'],
        provider    => shell,
        unless  => "command -v bunyan"

    }

    exec { "npm-install-less":

        command => "npm install -g less",
        path => [ "/usr/local/bin", "/bin" , "/usr/bin" ],
        require => Class['nodejs'],
        provider    => shell,
        unless  => "command -v less"

    }

    # Local dependences
    exec { 'npm-install-local': 

		command => 'npm install',
		path => [ "/usr/local/bin", "/bin" , "/usr/bin" ],
		cwd => '/var/www/kalzate' 
    } 

}