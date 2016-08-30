
Next is briefly depicted the approach and steps to take related to managing config project settings:

A) node-config (https://github.com/lorenwest/node-config)

    1) Use "node-config" npm package (npm install config), regardless its drawbacks.

    2) Fork "node-config" project and improve it in those scopes why you would not use it:

        Note: Crete a new branch for every point(*) below. 
        
        * rigid file loader (add fileLoader and configDir option):

            ```javascript```

            var options = {};

            options.configDir = {

                cli: [],
                env: ['NODE_CONFIG_DIR'],
                fallback: './config/settings'

            };

            options.fileLoader = {

                data : {

                    deployment: {

                        cli: ['settings', 's'],
                        env: ['NODE_ENV'],
                        fallback: 'development'
                    },

                    hostname: {

                        cli: ['host', 'h'],
                        env: ['HOST', 'HOSTNAME'],
                        fallback: require('os').hostname()
                    },

                    user: {

                        env: ['USER'],
                        fallback: 'user'
                    },

                    brand: {

                        cli: ['brand', 'b'],
                        env: ['BRAND'],
                        fallback: 'coca-cola'
                    }
                },

                // {deployment} is options.fileLoader.data.deployment value
                sequence: ['default', '{hostname}', '{deployment}', '{hostname}-{deployment}', 'local', 'local-{deployment}']

                //sequence: ['default', '{deployment}', '{deployment}.{user}']

                //sequence: ['{brand}.?default', '{brand}.?{deployment}', '{brand}.?{deployment}.{user}']
            };

            var config = require('config')(options);

            ```

        * get method more flexible (it does not accept fallback): 

            ```javascript```

            // fallback if value is undefined
            config.get('value',  'fallback');

            // fallback for value.value2: either value or value.value2 is undefined
            config.get('value.value2', 'fallback');

            // Same as 'value.value2.value3'
            config.get('value', 'value2', 'value3');
            config.get('value', 'value2', 'value3', 'fallback');

            ```

        * rigid Command Line/ Env Overrides (NODE_CONFIG & custom_env_variables file)

            Hi guys, 

            I think this is a great and quite important feature to add environment variables overrides by the custom-environment-variables.EXT file. I think though we could made this a bit more flexible. Sometimes, it may be convenient to pass variables from the command line. The current solution NODE_CONFIG is not so flexible...

            node server.js --which-ever bar --what-ever foo

            As actually it works, there's no way to pollute my configs with command line options as "bar" or "foo" above. So, a fast workarround could be to change from **"custom-environment-variables.EXT"** to something like **"custom-overrides-variables.EXT"** and its content will be like this:

            ```javascript```
            {
              "Customer": {
                "dbConfig": {
                  "host": { cli: ['host', 'h'], env: ['PROD_SERVER', 'HOST', 'HOSTNAME'] }
                }
              }
            }
            ```

            it will work just like now, but it would first look for command line options in the order given (cli) and then for environment variables in the order given (env). For the example above it will work this way:

            ```bash```
            export HOSTNAME="HOSTNAME" && node server.js 
            // Customer.dbConfig.host => "HOSTNAME"

            // HOSTNAME env variable here is already defined

            export PROD_SERVER="PROD_SERVER" && node server.js 
            // Customer.dbConfig.host => "PROD_SERVER"

            node server.js -h host
            // Customer.dbConfig.host => "host"
            ```

            if NODE_CONFIG is given, then use it as last resort as currently:

            ```bash```
            node server.js -h host --NODE_CONFIG='{"Customer":{"dbConfig":{"host":"customerdb.prod"}}}'
            // Customer.dbConfig.host => "customerdb.prod"
            ```

        * Configuring from an External Source not yet(this can be develop as a core-feature or a package called node-config-live):

            Use a live_settings file (Check config/settings/conftence file for an example of a desirable setting file) and use it by adding a live method to the config object:

            config.live('some_config') -> if not in storage then fallback defined in file
            config.live('some_config') -> if not in storage and not in local then Error(You can also use has to avoid exception)
            config.live('some_config', 'fallback') -> if not in storage and not in local then fallback

            It uses redis as storage by default.

        * Command line utility:

            ```bash```
            node-config --list --map(show sources) --live --dump --smartdump(dump with sources)
            ```

    3) Use the project forked in the package.json whilst it's merged into official node-config repository:

        "config": "git+https://github.com/Tsur/node-config.git#commit-ish"

        The commit-ish can be any tag, sha, or branch which can be supplied as an argument to git checkout. The default is master.

        As of version 1.1.65, you can simply refer to GitHub urls as:

        "config": "Tsur/node-config"

    4) If it's not merged into official repo:

        node-config ==> conftence
        node-config-live ==> conftence-redis

        ```javascript```

        var constanceRedis = require('conftence-redis');

        var options = {

          storage: new constanceRedis({

            port: 6379,
            host: 'localhost',
            db:0, 
            ttl: 60,
            remove: false, //Replace current values in backend database for those in the settings file
            prefix: 'settings:kalzate'

          }),

          configDir: {...},

          fileLoader: {...}

        };

        exports = module.exports = require('conftence') (options);

        ```




