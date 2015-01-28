class redis {
    
    package { "redis-server":
        ensure => latest,
        require => Exec["aptGetUpdate"]
    }
    
}