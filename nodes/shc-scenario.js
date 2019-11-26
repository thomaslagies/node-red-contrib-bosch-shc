"use strict";

module.exports = function(RED) {

    class SHCScenarioNode {
        constructor(config) {
            RED.nodes.createNode(this, config);
            
            this.scenario = config.scenario.split('|')[1];
            this.name = config.name;
            this.shcConfig = RED.nodes.getNode(config.shc);
            

            /**
             * Triggers on any input msg the configured scenario
             */
            this.on('input', function(msg, send, done) {
                if (this.scenario && this.shcConfig && this.shcConfig.state === 'PAIRED') {
                    this.shcConfig.shc.getBshcClient().triggerScenario(this.scenario).subscribe(result => {
                        done();
                    }, err => {
                        done(err);
                    });
                }
            });        
            
            /**
             * Check configuration state
             */
            if (this.shcConfig && this.scenario) {
                if (this.shcConfig.state !== 'PAIRED') {
                    this.status({fill: 'blue', shape:'ring', text:'Add Client'});
                } else {
                    this.status({fill: 'blue', shape:'dot', text:'configured'});                
                } 
            } else {
                this.status({fill: 'blue', shape:'ring', text:'Add Configuration'});
            }
        }

    }

    RED.nodes.registerType("shc-scenario", SHCScenarioNode);
}