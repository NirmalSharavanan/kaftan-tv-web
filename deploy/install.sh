#!/usr/bin/env bash
echo "creating node directory"
mkdir nodejs
cd nodejs

echo "downloading and installing nvm (node version manager)..."
sudo curl https://raw.githubusercontent.com/creationix/nvm/v0.25.0/install.sh | bash
source ~/.bashrc

echo "downloading and installing node version..."
nvm install v6.9.4
n=$(which node);n=${n%/bin/node}; chmod -R 755 $n/bin/*; sudo cp -r $n/{bin,lib,share} /usr/local
cd ..

echo "installing java 1.8.0"
sudo apt-get install openjdk-8-jdk
export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64

echo "installing maven"
wget http://ftp.fau.de/apache/maven/maven-3/3.5.2/binaries/apache-maven-3.5.2-bin.tar.gz
tar xvf apache-maven-3.5.2-bin.tar.gz
sudo mv apache-maven-3.5.2  /usr/local/apache-maven
export M2_HOME=/usr/local/apache-maven
export M2=$M2_HOME/bin
export PATH=$M2:$PATH
source ~/.bashrc


echo "setting up IP forwading for port 80 to 8088..."
sudo iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 8088
sudo iptables -A INPUT -p tcp -m tcp --sport 80 -j ACCEPT
sudo iptables -A OUTPUT -p tcp -m tcp --dport 80 -j ACCEPT

