/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {

        var paramsObj = { request: false }; //false不跳出藍牙開啟視窗
        bluetoothle.initialize(initializeSuccess, initializeError, paramsObj);
    }
};
function initializeSuccess(obj) {
    var paramsObj = { serviceUuids: [] };
    bluetoothle.startScan(function (obj) {
        if (obj.status == "scanResult") {
            
            if (obj.address == 'D0:B5:C2:96:C3:B6') {
                // $('div.app').prepend('<h1>Welcome</h1>');
                $('div.app').prepend('<h5>'+obj.rssi+'</h5>'); 
                 
                // bluetoothle.stopScan(function(){
                //     $('div.app').prepend('<h1>STOP SCAN</h1>'); 
                // }, function(){
                //     $('div.app').prepend('<h1>fail to stop</h1>'); 
                // });            
            }

        }
        console.log(obj);
        
    }, function (obj) {
        console.log("初始化掃描錯誤 : " + JSON.stringify(obj));
    }, paramsObj);
    return false;
}

function initializeError(obj) {
    console.log("未開啟藍牙，準備開啟 : " + JSON.stringify(obj));
}


