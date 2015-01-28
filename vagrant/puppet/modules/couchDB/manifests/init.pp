class redis {
    
    package { "couchdb":
        ensure => latest,
        require => Exec["aptGetUpdate"]
    }
    
}