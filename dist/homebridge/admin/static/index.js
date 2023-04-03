"use strict";

var Devices = {
  mounted() {
    axios.get('api/devices').then(response => this.devices = response.data);
  },
  computed: {
    devices_length: function devices_length() {
      return Object.keys(this.devices).length;
    }
  },
  data() {
    return {
      devices: {},
      columns: ["host", "name", "online", "paired", "started", "powered", "app_package_current", "type"],
      code: "",
      types: [{
        text: 'TELEVISION',
        value: '31'
      }, {
        text: 'SET TOP BOX',
        value: '35'
      }]
    };
  },
  methods: {
    pair: function pair(device) {
      console.log('Pair ' + device.host);
      device.pairing = true;
      axios.put('api/devices/' + device.host + '/pair').then(response => {
        console.log('Paired', response);
        this.devices[device.host] = response.data;
      });
    },
    unpair: function unpair(device) {
      console.log('Unpair ' + device.host);
      axios.put('api/devices/' + device.host + '/unpair').then(response => {
        console.log('Unpaired', response);
        this.devices[device.host] = response.data;
      });
    },
    send_code: function send_code(device) {
      console.log('sendCode ' + device.host + ' ' + this.code);
      axios.put('api/devices/' + device.host + '/secret', {
        code: this.code
      }).then(response => {
        this.devices[device.host] = response.data;
        this.code = "";
        console.log('Code received', response);
      });
    },
    power: function power(device) {
      console.log('Send Power ' + device.host);
      axios.get('api/devices/' + device.host + '/power').then(response => {});
    },
    set_type: function set_type(device) {
      console.log('Send Type ' + device.type);
      axios.put('api/devices/' + device.host + '/type', {
        type: device.type
      }).then(response => {
        this.devices[device.host] = response.data;
        console.log('Type changed', response);
      });
    }
  }
};
Vue.createApp(Devices).mount('#devices_list');