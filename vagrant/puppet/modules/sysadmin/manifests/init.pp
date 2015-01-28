class sysadmin {
    
    package { "htop":
        ensure => latest,
        require => Exec["aptGetUpdate"]
    }

    package { "screen":
        ensure => latest,
        require => Exec["aptGetUpdate"]
    }

    package { "tmux":
        ensure => latest,
        require => Exec["aptGetUpdate"]
    }

    package { "supervisor":
        ensure => latest,
        require => Exec["aptGetUpdate"]
    }

    # Do not use in production: very inefficient
    package { "strace":
        ensure => latest,
        require => Exec["aptGetUpdate"]
    }
    
}