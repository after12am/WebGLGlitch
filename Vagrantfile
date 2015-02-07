# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

$provision = <<SCRIPT
echo "Updating package..."
apt-get update > /dev/null 2>&1

echo "Installing Mecab..."
apt-get install -y mecab libmecab-dev mecab-ipadic
aptitude install -y mecab-ipadic-utf8
apt-get install -y python-mecab

echo "Installing node.js and npm..."
apt-get install -y python-software-properties
add-apt-repository -y ppa:chris-lea/node.js
apt-get update > /dev/null 2>&1
apt-get install -y nodejs

echo "Installing bower and grunt..."
npm install -g bower
npm install -g grunt-cli

echo "Copying sources to temp dir..."
cp -R /vagrant /home/vagrant/tmp_FBwZaXSa

echo "Installing node_modules..."
cd /home/vagrant/tmp_FBwZaXSa
npm install

echo "Copying node_modules..."
cp -R /home/vagrant/tmp_FBwZaXSa/node_modules /vagrant

echo "Cleaning..."
rm -rf /home/vagrant/tmp_FBwZaXSa
SCRIPT


Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = "precise64"
  config.vm.box_url = "http://files.vagrantup.com/precise64.box"
  
  config.vm.network "forwarded_port", guest: 9000,  host: 9000
  config.vm.network "forwarded_port", guest: 35729, host: 35729
  config.vm.network :private_network, ip:"192.168.33.10"
  
  config.vm.provision "shell", inline: $provision
end