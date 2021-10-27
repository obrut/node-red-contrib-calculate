/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

//Simple node to calculate stuff during a set time period or a number of messages
module.exports = function(RED) {
    "use strict";

    function CalculateNode(n){
        RED.nodes.createNode(this,n);

    	this.calculation = n.calculation;
    	this.name = n.name;
        this.buffer = [];
        this.timeoutUnits = n.timeoutUnits;
        this.intervalID = -1;
        this.pauseType = n.pauseType;
        this.rate = n.rate;
        this.round = n.round;

        if (n.timeoutUnits === "milliseconds") {
            this.timeout = n.timeout;
        } else if (n.timeoutUnits === "minutes") {
            this.timeout = n.timeout * (60 * 1000);
        } else if (n.timeoutUnits === "hours") {
            this.timeout = n.timeout * (60 * 60 * 1000);
        } else if (n.timeoutUnits === "days") {
            this.timeout = n.timeout * (24 * 60 * 60 * 1000);
        } else {   // Default to seconds
            this.timeout = n.timeout * 1000;
        }

        var node = this;

        if (node.pauseType == 'timed'){
            node.intervalID = setInterval(function() {
                calculateAndRelease(node.buffer.slice(0));
                node.buffer = [];
                node.status( { fill: 'grey', shape: 'dot', text: node.buffer.length } );
            },node.timeout);    
        }

        node.on("input", function(msg) {
            msg.topic = msg.topic || '_none_';
            msg.pushedAt = new Date().getTime();
            var topic = node.buffer.find(b => typeof(b[0]) == 'object' && b.find(b2 => b2.topic == msg.topic));
            var len = 0;
            if (!topic) {
                node.buffer.push([msg]);
                len = node.buffer.length;
            } else {
                topic.push(msg);
                len = topic.length;
                if (node.pauseType == 'rate' && topic.length >= node.rate){
                    calculateAndRelease(node.buffer.splice(node.buffer.findIndex(b => b === topic), 1));
                }
            }

            if (len == 0)
                node.status( {fill: 'grey', shape: 'dot', text: len } );
            else if (len < 10)
                node.status( {fill: 'green', shape: 'dot', text: len } );
            else if (len < 50)
                node.status( {fill: 'blue', shape: 'dot', text: len } );
            else if (len < 100)
                node.status( {fill: 'yellow', shape: 'dot', text: len } );
            else {
                node.status( {fill: 'red', shape: 'dot', text: len } );
                node.warn(node.name + " " + RED._("Calculation buffer is really big."));
            }
        });

        node.on("close", function() {
            clearInterval(node.intervalID);
            node.buffer = [];
            node.status({});
        });

        function calculateAndRelease(topics){
            while (topics.length > 0) {
                let topic = topics.shift();
                var err = topic.filter(m => isNaN(m.payload));
                if (err.length == 0){
                    let result = topic[topic.length-1];
                    var calculatedVal = getCalculation(topic, topic[0].pushedAt, result.pushedAt);
                    if (node.round)
                        calculatedVal = Math.round(calculatedVal);
                    result.payload = calculatedVal;
                    result.points = topic.length;
                    result.firstPushedAt = topic[0].pushedAt;
                    result.calculation = node.calculation;
                    node.send(result);
                } else {
                    node.error('Topic removed, non numerical value found.', err[0]);
                }
            }
        }

        function getCalculation(messages, firstAt, lastAt){
            var values = messages.map(p => (p.payload));
            switch (node.calculation) {
                case 'average':
                    return values.length == 0 ? parseFloat(values[0]) : (values.reduce((a,b) => parseFloat(a) + parseFloat(b)) / values.length);
                case 'median':
                    return getMedian(values);
                case 'max':
                    return values.length == 0 ? values[0] : values.sort((a,b) => (a-b)).pop();
                case 'min':
                    return values.length == 0 ? values[0] : values.sort((a,b) => (a-b))[0];
                default: 
                    node.error('Calculation not found: \'' + node.calculation + '\'.');
                break;
            }
        }

        function getMedian(data) {
            if (data.length == 0)
                return parseFloat(data[0]);
            
            let m = data.sort((a, b) => (a-b));

            let middle = Math.floor((m.length - 1) / 2); // NB: operator precedence
            if (m.length % 2) {
                return m[middle];
            } else {
                return (m[middle] + m[middle + 1]) / 2.0;
            }
        }
    }

    RED.nodes.registerType("calculate",CalculateNode);
}
