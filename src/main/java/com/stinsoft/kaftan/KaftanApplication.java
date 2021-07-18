/*************************************************************
 * Application stating page
 * initialize UI
 * All secure pages should start with prefix "session/"
 *
 * muvi/src/main/resources
 * ***** application.properties - all config properties goes here
 * ***** all logging configuration goes here, write to file or console
 *
 * muvi/src/main/java/
 * ***** com.ondemand.muvi -- package name
 * ************* MuviApplication -- application start page
 * ************* config
 * ******************** SecurityConfig.java 	-- all secure page and non secure page configuration -- DO NOT UPDATE WITHOUT APPROVAL --
 *  											-- All secure pages should start with prefix
 *  											--	Super user security	"/superuser/session/"
 *  											--	Admin security "/admin/session/"
 *  											--	All secure pages for user "/session/"
 * ******************** CorsFilter.java 		-- cross platform configuration -- DO NOT UPDATE WITHOUT APPROVAL --
 * ************* controller  					-- all REST API controllers - one controller per screen (or) table
 * ************* dto 							-- all Data Transfer Objects goes here -- this is the objects use to transfer data from UI to Server
 * ************* exception 						-- Global exception handler -- DO NOT UPDATE WITHOUT APPROVAL --
 * ************* helper 						-- All application level helpers goes here
 * ******************** ConfigHelper.java 		-- all application config should be added to application.properties and defined here and used from here
 * ************* messages 						--  all messages should he added here (NO HARD CODED MESSAGE IN JAVA or APPLICATION
 * ************* model 							-- All MongoDB database model definition here (one model per DB table)
 * ************* repository						-- MongoDb Database interface (one model per DB table)
 * ************* security						-- Application Security Services -- DO NOT UPDATE WITHOUT APPROVAL --
 * ************* services						-- Database service implementation (One interface and implementation for database is must)
 *
 *
 *
 *************************************************************/


package com.stinsoft.kaftan;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.hateoas.config.EnableHypermediaSupport;

@SpringBootApplication(scanBasePackages = {"com.stinsoft.kaftan", "ss.core"})
@EnableMongoRepositories(basePackages = {"ss.core.repository", "com.stinsoft.kaftan.repository"})
@EnableHypermediaSupport(type = { EnableHypermediaSupport.HypermediaType.HAL })
public class KaftanApplication {

	public static void main(String[] args) {

		//Initializing logger
		Logger logger = LoggerFactory.getLogger(KaftanApplication.class);

		logger.info("Starting application...");

		SpringApplication.run(KaftanApplication.class, args);

		logger.info("Application started successfully");
	}
}
