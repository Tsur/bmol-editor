
-----------------------
1) Logging Fundamentals
-----------------------

Resources: 

http://architects.dzone.com/articles/high-performance-and-smarter
http://blog.codinghorror.com/the-problem-with-logging/
http://www.javacodegeeks.com/2011/01/10-tips-proper-application-logging.html
https://segment.io/docs/tutorials/client-side-vs-server-side/

Logging is considered as a Non Functional Requirements (NFRs) and often relegated to a back-burner/background/not-so-important activity while architecting, designing, developing and debugging applications, or even when enhancing applications. 

After the application is ready, you deploy it to a production environment. Your application now is out of the development environment - and that means not having a nice IDE debugger at your service. It is now that you realize the importance of logs if you have not been using them before but rather just a nice IDE/tool debuger.

You start then logging your application but as you wade through a huge set of logs trying to debug any problem with your application, you realize that it is not a trivial task. It is boring, tedious and time-taking, and many times you feel as finding a needle in a haystack of logs! Or possibly you off-load this activity to your sub-ordinates workmates or an application maintenance team who equally curse you for their tedious and thankless job! Or possibly they would just throw up their hands, and you the specialized "architect/engineer" would get involved, muttering under your breath how your skills are being wasted away. Logging information can serve different purposes, as for example:

  * When a user encounters a critical error, I want to be warned immediatly with an email. I should also be able to trace the source of the error, and retrieve all the needed data to reproduce it.

  * When a new account is created, I want to be warned immediatly, so I can check that everything is alright.

  * When a new ticket is sold, keep me informed just to make sure all is right.

  * ...

Most of us know the basics about logging: 

  * there are various logging levels which can be turned on or off at will
  * there are log categories that allow you to organize your logs
  * there are logging frameworks that can direct logs to various destinations such as Files, Databases, ... etc.


But  What about planning our logs content and format? What about understanding how logging affects our system quality attributes as performance? What about setting up access rules to logs? What about stablishing a clear workflow when dealing with logs (logging discipline)? Some important points about logging are:

  * Logs content and format

    It's important to define the format your logs will be exposing so it can be then easily parsed by other tools. A very common format is that of using a JSON record per line in the log which can be understood by many logging parsers out there. Another important point is the content your going to include within your logs. Try avoid verbose logs, for instance log ID's objects instead of full object content. Avoid logging falsy values as null, undefined, false, ... when in most of cases they say nothing. Be concise and descriptive.

  * Performance

    Nearly 90% of the applications, excessive logging has been found to have a very detrimental effect on performance. Logging is an I/O intensive activity and can get in the way of the application's performance, particularly when logging is done in the traditional way, that is, synchronously. Use performance benchmarking exercise to determine logging levels you should use at production environment. At production environment never use debug level. Resist the temptation to log source location information at runtime as linenumber, method, class name, ...etc. Use error codes instead of error messages. Then set a static file to map what those error codes actually mean. Avoid recording errors with long stack traces repeatedly. Do not use logging as a replacement for other time monitoring strategies., use performance benchmarking instead.

  * Security

    Audit logs are a special class of logs that enable security auditing of the application, and are used to track actions of users. This is an example of how logging aids security practices. However, if logs carry sensitive information such as passwords of user accounts, they may expose a system vulnerability. Logging may aid developer's monitoring and debugging of an application but may also expose the internal architecture of the application which is certainly not desirable. In today's cloud application environments, where applications may be hosted on public clouds, such vulnerabilities can pose risks to the Intellectual Property of the application owner. Also remember to set rules to determine who can access your logs.

  * Scalability and high availability

    When an application is scaled out or is enabled for an active-passive configuration for availability, there are multiple instances of the application and the strategy of logging becomes important. Would the application support or development team like to gather logs from 10 different machines or directories or have a centralized location for collecting logs? This is where centralized distributed logging becomes essential. In a clustered environment, logs should reflect the components, modules, subsystems and even process instances from where they emerged. This would also have the extremely beneficial side effect of moving the I/O to a separate machine so that the performance of the application is not impeded by logging I/O.

  * Recoverability

    Major databases like Oracle already use redo logs to ensure recoverability of database failures. Applications may also borrow a leaf on redo logs and use them for system recoverability if required.

  * Error Handling and Fault tolerance

    In most applications, logging is one of the, or sometimes only measure taken for error handling. In cases of recurrent errors such as unavailability of Mail server or even database for long periods of time, there is no benefit gained and even much harm incurred by logging the error repeatedly and frequently, especially with huge exception stack traces, due to increased I/O activity. In the process, one may discover that important logs that were important for analyzing a week old frustrating issue have been rolled over. This approach only makes a bad situation worse. Other point to consider is, What is the logging frameworks or some logging message itself is not working? Avoid logging exceptions

  * Storage Capacity

    While doing capacity sizing of an application, architects would do well to consider the size of logs that would be generated by the application during production and estimate the disk space required, the provisioning of centralized file system and so on. For centralized logging in a distributed environment, it is also relevant to estimate the size of log objects distributed over the network to a remote machine.


  ------------------
  1.1) Tips
  ------------------

    1) Avoid "let's log everything we possibly can". Excessive is bad, same as for excessive comments, you should log good enough, but avoid excessive logging. 

    2) The more you log, the less you can find.

    3) "If it's worth saving to a logfile, it's worth showing in the user interface": Use some kind of GUI!

    4) Logging isn't free (performance hits)

    5) Logging means more code

    6) Categorize logs with the same care as you would do for modularizing your application

    7) Make everyone on your team to agree on the exact definitions of FATAL, ERROR, DEBUG, INFO, and whatever other logging levels you have defined.

    8) For production try to only log the most heinous serial-killer mass-murderer type issues.

-----------------------
2) Logging Frameworks
-----------------------

log4js: https://github.com/nomiddlename/log4js-node
winston: https://github.com/flatiron/winston
bunyan: https://github.com/trentm/node-bunyan
logmagic: https://github.com/pquerna/node-logmagic
ln: https://github.com/wood1986/ln
...

Lets identify a few requirements which we can use to pit the frameworks against each other:

  * Timestamp each log line. This one is pretty self explanatory – you should be able to tell when each log entry occured.

  * Logging format should be easily digestible by humans as well as machines.

  * Allows for multiple configurable destination streams. For example, you might be writing trace logs to one file but when an error is encountered, write to the same file, and then send an email at the same time.

  * Transport add-ons available. You want to move from one stream to another in the future. For instance, you want to move from loggly to logstrash. If the framework support transport plugins you can do it totally transparent.

Winston cons:

  * Formatting
  * Performance (check benchmarks)
  * Dissasters when rotating files in cluster

Winston profits:

  * Transporters (even IRC transporter)
  * Profiling
  * Querying
  * Logs Categories

bunyan cons:

  * Transporters (not so many as with winston)
  * Dissasters when rotating files in cluster

bunyan profits:

  * Formatting
  * Serializers
  * DTrace
  * Logs Categories & Child logs
  * CLI

-----------------------------
3) Logging Strategies Adopted
-----------------------------

  A) One log per application scope (core, store, tickets, shell, ... etc)

  B) Only 2 levels: DEBUG, ERROR
     
     DEBUG – Developers stuff. I will discuss later what sort of information deserves to be logged.
     
     ERROR – something terribly wrong had happened, that must be investigated immediately. No system can tolerate items logged on this level. Example: NPE, database unavailable, mission critical use case cannot be continued.

     Other possible levels not used for now:

     WARN – the process might be continued, but take extra caution. Actually I always wanted to have two levels here: one for obvious problems where work-around exists (for example: “Current data unavailable, using cached values”) and second (name it: ATTENTION) for potential problems and suggestions. Example: “Application running in development mode” or “Administration console is not secured with a password”. The application can tolerate warning messages, but they should always be justified and examined.

     INFO – Important business process has finished. In ideal world, administrator or advanced user should be able to understand INFO messages and quickly find out what the application is doing. For example if an application is all about booking airplane tickets, there should be only one INFO statement per each ticket saying “[Who] booked ticket from [Where] to [Where]“. Other definition of INFO message: each action that changes the state of the application significantly (database update, external system request).

  C) Avoid verbose and much logs 

  D) Do not use log for comments and do not use excessive comments - rely on code to tell the story instead of relying on comments to tell the story.

  E) Bunyan framework (though it can change in the future)

  F) Other logs (nginx, crontab, mongodb, ...etc) centralised with application logs

  G) Who is going to access logs? Create an specific user just for reading logs?

  H) Maximun size for logs 10MB, then rotate

  -----------------------------
  3.1) Development
  -----------------------------

  * Every log uses DEBUG level
  * console + file as streams/transporters for all levels.
  * GUI: Logio.org for real time GUI

  -----------------------------
  3.2) Production
  -----------------------------

  * Every log uses ERROR level
  * loggly or file + email as streams/transporters for ERROR level.
  * GUI: loggly (free plan)

-----------------------------
4) Futher Logging Strategies
-----------------------------

In production we could change the production logging configuration to support Logstash + Elasticsearch + Redis + Kibana (http://tips4admin.com/blog/2013/10/how-to-centralize-your-log-with-logstash-elasticsearch-redis-kibana-in-ubuntu-server/). We just need to change the stream to bunyan-logstrash in our node application and remove email stream since logstash will handle email for us.

Check also node-logstash (https://github.com/bpaquet/node-logstash) and bunyan-logstash(https://github.com/sheknows/bunyan-logstash)

Logstash is a log indexer built on top of elasticsearch. It aggregates logs from multiple sources and allows you to query them using the Apache Lucene query parser syntax.

In a different machine where our node application lives, we set up logstash server mode:

* set up redis-server
* set up elasticsearch
* set up logstash
* configure logstash

vim /etc/logstash/indexer.conf

# This is the logstash server index configuration.
# This file will be put in the same folder with logtash.jar file in the
# /etc/logtash/
# This takes information straight from redis and loads it into elasticsearch. 

input {
  redis {
    host => "127.0.0.1"
    type => "redis-input"
    threads => 4
    # these settings should match the output of the agent
    data_type => "list"
    key => "logstash"

    # We use json_event here since the sender is a logstash agent
    format => "json_event"
  }
}

output {
  elasticsearch {
    host => "127.0.0.1"
  }
}


In the machine where our node application lives, we set up logstash client mode:

* set up logstash
* configure logstash

vim /etc/logtash/shipper.conf

input {
  stdin {
    type => "test"
  }
}

output {
  stdout { codec => rubydebug }
  redis { host => "logging.tips4admin.com" data_type => "list" key => "logstash" }
}

The Logstash configuration file above is really simple. It just get the log from console(stdin) and send to redis server(logging.tips4admin.com)

-----------------------------
5) Audit (Event Tracking)
-----------------------------

  * Note: Only in production environment

  -----------------------------
  5.1) Client Side
  -----------------------------

    * ga.js (Google Analytics)
    * HummingBird (http://hummingbirdstats.com/, https://github.com/mnutt/hummingbird)

  -----------------------------
  5.1) Server Side
  -----------------------------

    Note: Remember, tracking server side is suitable when dealing with: payment events, getting data from database, sensitive information, ... etc.

    A) Create a new log level called audit or reuse log level info as audit
    B) Use mongodb as stream to filter it later easily(here is when winston comes handly):

      https://gist.github.com/oroce/4052571
      https://github.com/Raynos/mongo-stream

      Example:

      var mongoCol = require( "mongo-col" ),
          mongoStream = require( "mongo-stream" ),
          restify = require( "restify" ),
          mongoInsertStream = mongoStream( mongoCol( "piped-collection", null, {
              dbOptions:{
                   safe: true
              }
          })),
          Logger = require( "bunyan" ),
          server = restify.createServer();
       
      var logger = new Logger({
          name: "pipe-into-mongodb",
          streams: [{
              type: "raw",
              stream: mongoInsertStream.insert({
                  safe: true
              })
          }]
      });
       
      server.on( "after", restify.auditLogger({
          log: logger
      }));

-----------------------------
6) Profiling
-----------------------------

In software engineering, profiling ("program profiling", "software profiling") is a form of dynamic program analysis that measures, for example, the space (memory) or time complexity of a program, the usage of particular instructions, or the frequency and duration of function calls. Most commonly, profiling information serves to aid program optimization.

-----------------------------
7) Others resources
-----------------------------

  * Sentry
  ...