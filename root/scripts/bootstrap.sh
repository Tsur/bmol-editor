#!/usr/bin/env bash

# $1: Vagrantfile path
ROOT=$1

# Set up dependeces
echo "------- UPDATING -------"
sudo apt-get update
echo "------- INSTALLING dpkg -------"
sudo apt-get install dpkg-dev
echo "------- INSTALLING virtualbox -------"
sudo apt-get install virtualbox-dkms
echo "------- CONFIGURING virtualbox -------"
sudo apt-get install linux-headers-$(uname -r)
sudo dpkg-reconfigure virtualbox-dkms
echo "------- INSTALLING vagrant -------"
echo "check vagrant versions at http://downloads.vagrantup.com/"
wget http://files.vagrantup.com/packages/a40522f5fabccb9ddabad03d836e120ff5d14093/vagrant_1.3.5_x86_64.deb
dpkg -i vagrant_1.3.5_x86_64.deb
rm -f vagrant_1.3.5_x86_64.deb
echo "------- INSTALLING puppet -------"
sudo apt-get install puppet
echo "------- SETTING UP environment -------"
cd $1
vagrant up --provision

# create alias for vagrant ssh
echo "function kpos_day_on () { cd $ROOT && vagrant up && vagrant ssh; }" >> ~/.bashrc
echo "function kpos_lets_work () { cd $ROOT && vagrant ssh; }" >> ~/.bashrc
echo "function kpos_day_off () { cd $ROOT && vagrant halt; }" >> ~/.bashrc