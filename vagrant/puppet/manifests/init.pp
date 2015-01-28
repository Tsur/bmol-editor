# Puppet manifest for dev environment
Exec { path => [ "/bin/", "/sbin/" , "/usr/bin/", "/usr/sbin/" ] }
exec { "aptGetUpdate": command => "sudo apt-get update", path => ["/bin", "/usr/bin"] }

# System tools 
include essentials
include sysadmin

# Database
include redis
include mongodb
#include elasticsearch

# Engines
#include python
include nodejs
include npm

# Web Server
#include nginx

# Editors
include vim