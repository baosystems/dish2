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
  "api": {
    "baseUrl": "http://localhost:8080/api",
    "username": "admin",
    "password": "district"
  }
}
</pre>

This configuration file will be searched for at a location defined by a *DHIS2_HOME* environment variable (borrowed from the DHIS 2 setup). If not found, your home directory will be searched. Place the *dish.json* file in the desired directory.

<pre>
export DHIS2_HOME='/home/dhis/config'
touch /home/dhis/config/dish.json
</pre>

### Available commands

The following commands are available.

#### Remove organisation units

The *dish_remove_org_units* command will remove a batch of organisation units, including associated complete data set registrations, data approvals and data values. It reads organisation units from a CSV file. It requires that the authenticated DHIS 2 user has the "ALL" authority in order to delete data values and at least the "delete organisation units" authority in order to delete organisation units.

Parameter | Description
--- | ---
file | CSV file with organisation units

<pre>dish_remove_org_units --file &lt;path-to-org-unit-csv-file&gt;</pre>

The CSV file format allows the following column names: "name", "uid" and "code". The command will attempt to match on any specified column/property. Column names are case-sensitive. You must specify at least one column.

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

<pre>dish_post_tracked_entity_instances --file &lt;path-to-tei-csv-file&gt;</pre>

The CSV file format allows for the following column names: "trackedEntity", "orgUnit", and UIDs for tracked entity attributes. The "trackedEntity" column refers to the UID of the tracked entity, the "orgUnit" column refers to the UID of the organisation unit and the attribute columns may contain corresponding attribute values.

Example CSV file:

<pre>
"trackedEntity","orgUnit","QZO9afZwgtb","CkPE4ap6k6y","YpkMB1YsgyS"
"ahvFNubg3F5","v29iD7vYdpE","10196410140911","11","agfield"
"ahvFNubg3F6","v29iD7vYdpE","10196410140073","54","agfield"
"ahvFNubg3F7","v29iD7vYdpE","10196410140072","68","agfield"
</pre>

#### Upload custom data entry form

The *dish_post_custom_form* command will upload a custom HTML data entry form from a file for a given data set.

Parameter | Description
--- | ---
dataset | Identifier of data set for which to create form
file | Custom form HTML file

<pre>dish_post_custom_form --dataset &lt;dataset-uid&gt; --file &lt;path-to-custom-form-file&gt;</pre>

#### Upload custom Javascript

The *dish_post_js* command will upload a custom Javascript file using the *files/script* Web API resource.

Parameter | Description
--- | ---
file | Javascript file

<pre>dish_post_js --file &lt;path-to-javascript-file&gt;</pre>

#### Upload custom CSS

The *dish_post_js* command will upload a custom CSS file using the *files/style* Web API resource.

Parameter | Description
--- | ---
file | CSS file

<pre>dish_post_css --file &lt;path-to-css-file&gt;</pre>

#### Generate analytics tables

The *dish_gen_analytics_tables* command will initiate the analytics table generation process.

<pre>dish_gen_analytics_tables</pre>

#### Generate resource tables

The *dish_gen_resource_tables* command will initiate the resource table generation process.

<pre>dish_gen_resource_tables</pre>

#### Run integrity checks

The *dish_run_integrity_checks* command will run integrity checks through the remote API. Integrity checks are SQL views with names prefixed with "INTEGRITY_". The integrity SQL views should return rows which illustrate integrity violations. The SQL views checks should return zero rows if the integrity is valid. It is recommended to provide a description for the SQL views explaining the nature of the integrity violation.

<pre>dish_run_integrity_checks</pre>
