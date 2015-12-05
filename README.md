# Dish

Dish is a command line tool for interaction with the DHIS 2 Web API. It is suitable for handling batch metadata operations, system maintenance operations and more.

### Installation

Dish is a NPM package and requires NPM to be installed on your local system. You can install Dish with:

<pre>npm install dish2 -g</pre>

The "-g" global option will ensure that you can invoke the available Dish commands anywhere on your command line.

### Configuration

Dish is configured through a "conf.json" configuration file which must be valid JSON. Example configuration:

<pre>
{
  "api": {
    "baseUrl": "http://localhost:8080/api",
    "username": "admin",
    "password": "district"
  }
}
</pre>

### General

The commands heavily utilizes CSV files as input for manipulation of batches of metadata. The CSV files follows a common format where the following header column names are valid: "name", "uid" and "code". The commands will attempt to match on any specified column/property. Column names are case-sensitive. You must specify at least one column.

Example CSV file:

<pre>
"name","code"
"Johns clinic", "Fac021"
"Bobs dispensary", "Fac015"
"St Martas hospital","Fac042"
</pre>


### Available commands

The following commands are available.

#### Remove organisation units

The *dish_remove_org_units* command will remove a batch of organisation units, including associated complete data set registrations, data approvals and data values. It reads organisation units from a CSV file. It requires that the authenticated user has the "ALL" authority in order to delete data values and at least the "delete organisation units" authority in order to delete organisation units.

<pre>dish_remove_org_units --file &lt;name-of-org-unit-csv-file&gt;</pre>

#### Generate analytics tables

The *dish_gen_analytics_tables* command will initiate the analytics table generation process.

<pre>dish_gen_analytics_tables</pre>

#### Generate resource tables

The *dish_gen_resource_tables* command will initiate the resource table generation process.

<pre>dish_gen_resource_tables</pre>
