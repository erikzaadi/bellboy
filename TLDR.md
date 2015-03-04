#How to CONNECT ALL THE THINGZ needed for our amazing Bellboy

## 1. Get the hardware

* Raspberry Pi
* A door with an electronic lock mechanism, usually they can be controlled by 12/24V [Example](http://www.seco-larm.com/E-941SA-600.htm).
* 2 x Buttons - Inside door opener and outside doorbell (We used [these](https://www.sparkfun.com/products/9340) )
* RFID Reader [Sparkfun link](https://www.sparkfun.com/products/11827)
* Speakers
* N-Channel MOSFET 60V 30A [Sparkfun link](https://www.sparkfun.com/products/10213)
* 12/24V Transistor power adapter (12/24 depending on what your door needs) [Sparkfun link](https://www.sparkfun.com/products/10811)
* Small breadboard [Sparkfun link](https://www.sparkfun.com/products/9567)
* 3 X 10K Resistors [Sparkfun link](https://www.sparkfun.com/products/8374)
* LOTZ of Jumper wires [Male to male](https://www.sparkfun.com/products/11026) and [Male to Female](https://www.sparkfun.com/products/9385)
* Soldering equipment
* Optional:
  * Wifi Adapter

## 2. Connecting EVERYTHINGZ

* GPIO 22 - Inside open Button
* GPIO 17 - Outside doorbell
* GPIO 25 - Door controller (MOSFET, on is closed) - See [this tutorial](http://bildr.org/2012/03/rfp30n06le-arduino/)
* Speakers to headphone jack
* UART TX - RFID Reader
* Grounds (buttons, RFID)
* USB - WebCam


## 3. Setting up your Raspberry PI

* Download the [latest Raspbian image](http://downloads.raspberrypi.org/raspbian_latest)
* Flash your card, insert into your Raspberry Pi and set the following things in the raspi-config utility
  * Expand File System (needs restart)
  * Set hostname (Yes, take your time and choose a cool name...)
  * Change locale and keyboard layout to en-us.utf-8
  * Enable SSH
  * Enable Serial
  * Set Memory Split (16 or 32 for graphics is enough)
  * Set default audio out to headphone jack instead of HDMI
* Install ALL THE THINGZ!!1

  ```bash
  sudo apt-get remove --purge x11-common && sudo apt-get autoremove -y #remove all GUI
  sudo apt-get update && sudo apt-get upgrade -y && sudo apt-get dist-upgrade -y && sudo apt-get autoremove -y #get up to date
  sudo apt-get install tmux git vim curl wget libasound2-dev libexpat1-dev libicu-dev fswebcam -y #dependencies and convenience
  wget http://node-arm.herokuapp.com/node_0.10.36_armhf.deb #not working well with 0.12 yet
  sudo dpkg -i ./node*.deb
  sudo apt-get install -f
  ```
* Optional, configure your WIFI adapter if needed, also setting a static IP is recommended.
* Then ssh into your Raspberry Pi:

  ```bash
  git clone https://github.com/bigpandaio/bellboy
  cd bellboy
  ```
* copy ```bellboy-hubot/hubot.conf.template``` to ```hubot.conf``` and fill in the needed details
* add your own sounds in the ```bellboy-soundservice/sounds``` directory and add your own ```sounds.config.json``` file according to the ```bellboy-soundservice/README.md``` instructions.
* run ```bellboy-services/bootstrap.sh```:
* have a coffee, this will take a while

