# Dish

Dish is a command line tool for interaction with the DHIS 2 Web API. It aims at simplifying common tasks and is suitable for handling batch metadata operations, system maintenance operations and more.

### Installation

Dish is a NPM [package](https://www.npmjs.com/package/dish2) and requires *nodejs* and *NPM* to be installed on your local system. You can install Dish with:

<pre>npm install dish2 -g</pre>

The "-g" global option will ensure that you can invoke the available Dish commands anywhere on your command line.

### Configuration

Dish is configured through a *dish.json* configuration file which must be a valid JSON object. Note that the protocol (e.g. http://) is mandatory for the base URL. Example configuration:

<pre>
{
  "dhis": {
    "baseurl": "http://localhost:8080/dhis",
    "username": "admin",
    "password": "district"
  }
}
</pre>

Note that the *baseurl* should contain the hostname and the context path but not the *api* part. Examples of base urls are "https://play.dhis2.org/demo" and "http://localhost:8080".

This configuration file will be searched for at a location defined by a *DHIS2_HOME* environment variable (borrowed from the DHIS 2 setup). If not found, your home directory will be searched. Place the *dish.json* file in the desired directory.

<pre>
export DHIS2_HOME='/home/dhis/config'
touch /home/dhis/config/dish.json
</pre>

### Command overview

The available commands are listed in the table below. Details about each command follow below.

Command | Description
--- | ---
dish_remove_objects | Removes metadata objects
dish_remove_org_units | Removes organisation units including data values
dish_post_tracked_entity_instances | Imports tracked entity instances including attributes
dish_enroll_tracked_entity_instances | Enrolls tracked entity instances into programs for org units
dish_post_events | Imports single events including data values
dish_post_custom_form | Uploads a custom data entry form for a data set
dish_post_js | Uploads a javascript file
dish_post_css | Uploads a CSS file
dish_post_metadata | Imports a JSON metadata document
dish_gen_analytics_tables | Initiates an update of analytics tables
dish_gen_resource_tables | Initiates an update of resource tables
dish_run_integrity_checks | Runs SQL view-based integrity checks
dish_get_resources | Fetches web resources from a list of requests

### Available commands

The following commands are available.

#### Remove metadata objects

The *dish_remove_objects* command will remove metadata objects (identifiable objects). It reads identifiers (UIDs) from a CSV file. It requires that the authenticated DHIS 2 user has the authority to delete objects.

Parameter | Description
--- | ---
file | CSV file with organisation units
object-type | Type of object to delete, matching the Web API plural URL path, e.g. dataElements, categoryOptions

<pre>dish_remove_objects --file &lt;path-to-csv-file&gt; --object-type &lt;object-type-name&gt;</pre>

The CSV file must have a column header name with the value "id", and contain one identifier (UID) per row.

Example CSV file:

<pre>
"id"
"Fzj5GhvP91x"
"CpdYVRMm6gI"
"r3s85EzShLE"
</pre>

#### Remove organisation units

The *dish_remove_org_units* command will remove a batch of organisation units, including associated complete data set registrations, data approvals and data values. It reads organisation units from a CSV file. It requires that the authenticated DHIS 2 user has the "ALL" authority in order to delete data values and at least the "delete organisation units" authority in order to delete organisation units.

Parameter | Description
--- | ---
file | CSV file with organisation units

<pre>dish_remove_org_units --file &lt;path-to-org-unit-csv-file&gt;</pre>

The CSV file format allows the following column names: "name", "id" and "code". The command will attempt to match on any specified column/property. Column names are case-sensitive. You must specify at least one column.

Example CSV file:

<pre>
"name","code"
"Johns clinic", "Fac021"
"Bobs dispensary", "Fac015"
"St Martas hospital","Fac042"
</pre>

#### Import tracked entity instances

The *dish_post_tracked_entity_instances* command will import a batch of tracked entity instances, including tracked entity, organisation unit and attributes. It reads input from a CSV file.

Parameter | Description
--- | ---
file | CSV file with tracked entity instances
output-file | (Optional) Write summary of import operation to a file with the given name
payload-file | (Optional) Write payload to import to a file with the given name

<pre>dish_post_tracked_entity_instances --file &lt;path-to-tei-csv-file&gt; --output-file &lt;path-to-output-file&gt;</pre>

The CSV file format allows for the following column names: "trackedEntity", "orgUnit", and UIDs for tracked entity attributes. The "trackedEntity" column refers to the UID of the tracked entity, the "orgUnit" column refers to the UID of the organisation unit and the attribute columns may contain corresponding attribute values.

Example CSV file:

<pre>
"trackedEntity","orgUnit","QZO9afZwgtb","CkPE4ap6k6y","YpkMB1YsgyS"
"ahvFNubg3F5","v29iD7vYdpE","10196410140911","11","agfield"
"ahvFNubg3F6","v29iD7vYdpE","10196410140073","54","agfield"
"ahvFNubg3F7","v29iD7vYdpE","10196410140072","68","agfield"
</pre>

#### Enroll tracked entity instances

The *dish_enroll_tracked_entity_instances* command will enroll a batch of tracked entity instances into programs for organisatio units. It reads input from a CSV file.

Parameter | Description
--- | ---
file | CSV file with tracked entity instance enrollments
output-file | (Optional) Write summary of import operation to a file with the given name
payload-file | (Optional) Write payload to import to a file with the given name

<pre>dish_enroll_tracked_entity_instances --file &lt;path-to-csv-file&gt; --output-file &lt;path-to-output-file&gt;</pre>

The CSV file format allows for the following column names: "trackedEntityInstance", "orgUnit", "program", "enrollmentDate", "incidentDate", which refers to UIDs and dates respectively.

Example CSV file:

<pre>
"trackedEntityInstance","orgUnit","program","enrollmentDate","incidentDate"
"bIoemewGh6f","v29iD7vYdpE","aCNTXoZ0Tmj","2015-01-01","2015-01-06"
"SILtFfe34kj","v29iD7vYdpE"",aCNTXoZ0Tmj,"2015-01-04","2015-01-07"
"cDnzs9C3Msg","v29iD7vYdpE","aCNTXoZ0Tmj,"2015-01-02","2015-01-09"
</pre>

#### Import events

The *dish_post_events* command will import a batch of single events including data values.

Parameter | Description
--- | ---
file | CSV file with events
output-file | (Optional) Write summary of import operation to a file with the given name
payload-file | (Optional) Write payload to import to a file with the given name
org-unit-id-scheme | (Optional) uid or code
data-element-id-scheme | (Optional) uid or code
id-scheme | (Optional) uid or code


<pre>dish_post_events --file &lt;path-to-event-csv-file&gt; --output-file &lt;path-to-output-file&gt;</pre>

The CSV file format allows for the following column names: "program", "orgUnit", "eventDate", "status", "storedBy", "longitude", "latitude"; following these, UIDs for any number of data elements may be specified.

Example CSV file:

<pre>
"program","orgUnit","eventDate","storedBy","longitude","latitude","qrur9Dvnyt5","oZg33kd9taw"
"eBAyeGv0exc","DiszpKrYNg8","2013-05-17","admin","10.9","59.8","22","Male"
"eBAyeGv0exc","DiszpKrYNg8","2013-05-17","admin","11.3","55.1","22","Female"
"eBAyeGv0exc","DiszpKrYNg8","2013-05-17","admin","10.3","54.3","22","Male"
</pre>

#### Upload custom data entry form

The *dish_post_custom_form* command will upload a custom HTML data entry form from a file for a given data set.

Parameter | Description
--- | ---
dataset | Identifier of data set for which to create form
file | Custom form HTML file

<pre>dish_post_custom_form --dataset &lt;dataset-id&gt; --file &lt;path-to-custom-form-file&gt;</pre>

#### Upload custom Javascript

The *dish_post_js* command will upload a custom Javascript file using the *files/script* Web API resource.

Parameter | Description
--- | ---
file | Javascript file

<pre>dish_post_js --file &lt;path-to-javascript-file&gt;</pre>

#### Upload custom CSS

The *dish_post_css* command will upload a custom CSS file using the *files/style* Web API resource.

Parameter | Description
--- | ---
file | CSS file

<pre>dish_post_css --file &lt;path-to-css-file&gt;</pre>

#### Import metadata

The *dish_post_metadata* command will upload a JSON metadata file using the *metadata* Web API resource.

Parameter | Description
--- | ---
file | JSON file

<pre>dish_post_metadata --file &lt;path-to-json-file&gt;</pre>

#### Generate analytics tables

The *dish_gen_analytics_tables* command will initiate the analytics table generation process.

Parameter | Options | Description
--- | --- | ---
skip-resource-tables | false or true | Skip generating resource tables
skip-aggregate | false or true | Skip generating aggregate analytics tables
skip-events | false or true | Skip generating event analytics tables

<pre>dish_gen_analytics_tables</pre>

<pre>dish_gen_analytics_tables --skip-aggregate true</pre>

#### Generate resource tables

The *dish_gen_resource_tables* command will initiate the resource table generation process.

<pre>dish_gen_resource_tables</pre>

#### Run integrity checks

The *dish_run_integrity_checks* command will run integrity checks through the remote API. Integrity checks are SQL views with names prefixed with "INTEGRITY_". The integrity SQL views should return rows which illustrate integrity violations. The SQL views checks should return zero rows if the integrity is valid. It is recommended to provide a description for the SQL views explaining the nature of the integrity violation.

<pre>dish_run_integrity_checks</pre>

#### Get resources

The *dish_get_resources* command will fetch arbitrary web resources based on a list of requests from the specified file. This is useful to stress-test API resources. 

Parameter | Description
--- | ---
file | Text file with requests

<pre>dish_get_resources --file &lt;path-to-text-file&gt;</pre>

The text file should contain the requests to be fetched. The file should contain one line per request and use context path URLs (not including the base URL specified in the configuration).

Example text file:

<pre>
/api/analytics.json?dimension=dx:SA7WeFZnUci;V37YqbqpEhV&dimension=pe:THIS_YEAR
/api/analytics.json?dimension=dx:rbkr8PL0rwM;ybzlGLjWwnK&dimension=pe:LAST_YEAR
/api/dataValueSets?dataSet=pBOMPrpg1QX&period=201401&orgUnit=DiszpKrYNg8
</pre>

### Build from source

Follow these steps to build this tool from source:

* Install ```node``` and ```git```
* Clone this repo with ```git clone```
* Install module with ```npm install -g```
