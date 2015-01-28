class essentials {

    package { "build-essential":
        ensure => installed,
        require => Exec["aptGetUpdate"]
    }

    package { "gcc":
        ensure => present,
        require => Exec["aptGetUpdate"]
    }

    package { "g++":
        ensure => present,
        require => Exec["aptGetUpdate"]
    }

    package { "cmake":
        ensure => present,
        require => Exec["aptGetUpdate"]
    }

    package { "git":
        ensure => latest,
        require => Exec["aptGetUpdate"]
    }

    package { "curl":
        ensure => present,
        require => Exec["aptGetUpdate"]
    }

    package { "wget":
        ensure => present,
        require => Exec["aptGetUpdate"]
    }

    $cairo = [ "libcairo2-dev", "libjpeg8-dev", "libpango1.0-dev", "libgif-dev" ]
    package { $cairo: ensure => "installed", require => Exec["aptGetUpdate"] }

    # Bash config
    file { "/etc/profile.d/bootstrap.sh":

	    owner   => "root",
	    group   => "root",
	    mode    => 644,
	    replace => true,
	    ensure  => present,
	    source  => "puppet:///modules/essentials/profile.sh",

  	}
    
}