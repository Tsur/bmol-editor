class mongodb {

  exec { "mongodbKeys":
    command => "sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10",
    path => ["/bin", "/usr/bin"],
    notify => Exec["aptGetUpdate"],
    unless => "apt-key list | grep mongodb"
  }

  file { "mongodb.list":
    path => "/etc/apt/sources.list.d/mongodb.list",
    ensure => file,
    content => "deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen",
    notify => Exec["mongodbKeys"]
  }

  package { "mongodb-org":
    ensure => present,
    require => [Exec["aptGetUpdate"],File["mongodb.list"]]
  }
  
}