module.exports = function(RED) {


    function ColumbusInstanceNode(config) {
		RED.nodes.createNode(this, config);
		this.hostname = config.hostname;
        this.port = config.port;
        this.baseurl = config.baseurl;
        this.https = config.https;

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

        if (node.columbusinstanceConfig) {

            var connectionConfig = {
                hostname: node.columbusinstanceConfig.hostname,
                port: node.columbusinstanceConfig.port,
                base_url: node.columbusinstanceConfig.baseurl,
                use_https: node.columbusinstanceConfig.https,
                user: node.columbusinstanceConfig.user,
                password: node.columbusinstanceConfig.password
            };

            var renewStatus=()=>{
                node.status({text:"latest:"+node.doctype });
            }

            node.on('input', function(msg, send, done) {
                
                const axios = require('axios')

                target_url='http';
                if (connectionConfig.use_https == true) {
                    target_url += 's'
                }
                target_url += '://' + connectionConfig.hostname + ':' + connectionConfig.port;
                target_url += connectionConfig.base_url;

                axios
                .post(target_url, {
                    data: 'Unbelievable data :-)'
                }, {
                    auth: {
                        username: 'xavier',
                        password: 'test'
                    }
                })
                .then(res => {
                    msg.payload = "TRE"; //msg.appsource;
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
        } else {
            this.error("Missing Columbus Instance configuration");
        }
    }
    RED.nodes.registerType("push2columbus",Push2ColumbusNode);
}