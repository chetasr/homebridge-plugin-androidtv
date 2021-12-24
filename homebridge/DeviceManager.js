import bonjour from "bonjour";
import fs from "fs";
import {Device} from "./Device.js";
import EventEmitter from "events";

import {certificateGenerator} from "../remote/CertificateGenerator.js";

class DeviceManager extends EventEmitter {
    constructor() {
        super();
        this.device_list = {};

        this.delegate = {
            powered : function (host, power){
                let device = deviceManager.get(host);
                device.setPowered(power);
                deviceManager.emit('powered', device);
            },
            volume : function (host, volume_current, volume_max, volume_muted){
                let device = deviceManager.get(host);

                if(device.volume_current !== volume_current){
                    device.setVolumeCurrent(volume_current);
                    deviceManager.emit('volume', device);
                }
                else{
                    device.setVolumeCurrent(volume_current);
                }

                if(device.volume_muted !== volume_muted){
                    device.setVolumeMuted(volume_muted);
                    deviceManager.emit('muted', device);
                }
                else{
                    device.setVolumeMuted(volume_muted);
                }


                device.setVolumeMax(volume_max);

            },
            app : function (host, appPackage){
                let device = deviceManager.get(host);
                device.setAppPackageCurrent(appPackage);
            }
        }
    }

    load() {
        let buffer = fs.readFileSync("devices.json");
        let data = JSON.parse(buffer.toString());
        Object.keys(data).map((key, index) => {
            let device = new Device(data[key].host, data[key].name);
            device.setPaired(data[key].paired);
            device.getRemoteManager().delegate = this.delegate;
            this.add(data[key].host, device);
        });
    }

    save() {
        let devices_json = {};
        Object.keys(this.device_list).map((key, index) => {
            devices_json[key] = this.device_list[key].toJSONSaver();
        });
        fs.writeFileSync("devices.json", Buffer.from(JSON.stringify(devices_json)));
    }

    list() {
        return this.device_list;
    }

    get(host) {
        return this.device_list[host];
    }

    exist(host){
        return !!this.get(host);
    }

    add(host, device){
        this.device_list[host] = device;
    }

    remove(host){
        delete this.device_list[host];
    }

    listen(){
        bonjour().find({
            type : ["androidtvremote2"]
        }, function (service){
            console.log(service.name, service.addresses[0], service.port, service.host);
            if(!deviceManager.exist(service.host)){
                let device = new Device(service.host, service.name);
                device.setOnline(true);
                deviceManager.add(service.host, device);
                device.getRemoteManager().delegate = deviceManager.delegate;
            }
            else{
                let device = deviceManager.get(service.host);
                device.setOnline(true);
                if(device.getPaired()){
                    deviceManager.start(service.host);
                    /*let certs = certificateGenerator.retrieve(service.host);
                    let remoteManager = device.getRemoteManager();
                    remoteManager.start(certs);
                    device.setStarted(true);

                     */
                }
            }
        });
    }

    async pair(host){
        certificateGenerator.generate(host);
        let certs = certificateGenerator.retrieve(host);
        let device = this.get(host);
        let pairingManager = device.getPairingManager();
        let result = await pairingManager.start(certs);
        return result;
    }

    async sendCode(host, code){
        let device = this.get(host);
        let pairingManager = device.getPairingManager();
        let result = await pairingManager.sendCode(code);
        return result;
    }

    async start(host){
        let certs = certificateGenerator.retrieve(host);
        let device = this.get(host);
        let remoteManager = device.getRemoteManager();
        let result = await remoteManager.start(certs);
        device.setStarted(true);
        deviceManager.emit('discover', device);
        return result;
    }

    sendPower(host){
        let device = this.get(host);
        let remoteManager = device.getRemoteManager();
        remoteManager.sendPower();
    }


}

let deviceManager = new DeviceManager();
export { deviceManager };