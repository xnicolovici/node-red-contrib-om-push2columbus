module.exports = function(RED) {


    function ColumbusInstanceNode(config) {
		RED.nodes.createNode(this, config);
		this.hostname = config.hostname;

		var credentials = this.credentials;
		if (credentials) {
			this.user = credentials.user;
			this.password = credentials.password;
		}
	}
	
	RED.nodes.registerType("columbusinstance", ColumbusInstanceNode, {
		credentials: {
			user: {type: "text"},
			password: {type: "password"}
		}
	});




    function Push2ColumbusNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        node.columbusinstance = config.columbusinstance;
        node.columbusinstanceConfig = RED.nodes.getNode(this.columbusinstance);
        node.appsource = config.appsource;
        node.epuid = config.epuid;
        node.doctype = config.doctype;
        node.action = config.action;


        var renewStatus=()=>{
            node.status({text:"latest:"+node.doctype });
        }

        node.on('input', function(msg, send, done) {
            
            const axios = require('axios')

            axios
            .post('http://127.0.0.1:1880/test', {
                todo: 'Buy the milk'
            })
            .then(res => {
                msg.payload = res;
                msg.httpStatusCode = res.status;
                send(msg);
                renewStatus();
                done();
            })
            .catch(error => {
                msg.payload = error;
                // msg.httpStatusCode = res.status;
                send(msg);
                // renewStatus();
                // done();
                done(error)
            })
            
        });

        node.on('close', function(remove, done) {
            done();
        });
    }
    RED.nodes.registerType("push2columbus",Push2ColumbusNode);
}