node-red-contrib-calculate
==========================

Node-Red (http://nodered.org) nodes for some simple calculations over time or message count.

#Install

Run the following command in the root directory of your Node-RED install

    npm install node-red-contrib-calculate

#Usage

Add the calculate node, select either a time period or a number of messages for release. Select calculation. Done.

#Example
    ```json
    [{"id":"4c3a1551.6c254c","type":"random","z":"aff2cc18.0b484","name":"RandomNumber","low":"1","high":"100","inte":"true","property":"payload","x":340,"y":300,"wires":[["6f127280.30cf3c","6867669e.2a13a8","ac90cf81.6e61b","6dd3b70c.dfd938","596e1e94.3205b"]]},{"id":"6f127280.30cf3c","type":"calculate","z":"aff2cc18.0b484","name":"AvgEveryMinute","pauseType":"timed","calculation":"average","timeout":"1","timeoutUnits":"minutes","rate":"10","x":600,"y":180,"wires":[["4fb1838b.89fb2c"]]},{"id":"b32574cf.036708","type":"inject","z":"aff2cc18.0b484","name":"10SecBump","topic":"","payload":"","payloadType":"date","repeat":"10","crontab":"","once":true,"onceDelay":0.1,"x":140,"y":300,"wires":[["4c3a1551.6c254c"]]},{"id":"6867669e.2a13a8","type":"calculate","z":"aff2cc18.0b484","name":"AvgEvery10Msg","pauseType":"rate","calculation":"average","timeout":"10","timeoutUnits":"seconds","rate":"10","x":600,"y":240,"wires":[["4fb1838b.89fb2c"]]},{"id":"ac90cf81.6e61b","type":"calculate","z":"aff2cc18.0b484","name":"MedEveryMinute","pauseType":"timed","calculation":"median","timeout":"1","timeoutUnits":"minutes","rate":"10","x":610,"y":320,"wires":[["4fb1838b.89fb2c"]]},{"id":"6dd3b70c.dfd938","type":"calculate","z":"aff2cc18.0b484","name":"MinEveryMinute","pauseType":"timed","calculation":"min","timeout":"1","timeoutUnits":"minutes","rate":"10","x":600,"y":380,"wires":[["4fb1838b.89fb2c"]]},{"id":"596e1e94.3205b","type":"calculate","z":"aff2cc18.0b484","name":"MaxEveryMinute","pauseType":"timed","calculation":"max","timeout":"1","timeoutUnits":"minutes","rate":"10","x":610,"y":440,"wires":[["4fb1838b.89fb2c"]]},{"id":"4fb1838b.89fb2c","type":"debug","z":"aff2cc18.0b484","name":"Debug","active":false,"tosidebar":true,"console":false,"tostatus":false,"complete":"payload","targetType":"msg","x":870,"y":300,"wires":[]}]
    ```
Copy the json above, use Import Clipboard in the menu to add to your instance.

#Disclaimer

Use at your own risk, of course, everything will be fine.

#Author

Gustaf Ridderstolpe, https://github.com/obrut

#Feedback and support

https://groups.google.com/forum/#!forum/node-red or specifically the subject https://groups.google.com/forum/#!topic/node-red/l8lVxeW6AGQ
