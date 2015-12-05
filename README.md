# Dish

Dhis is a command line tool for interaction with the DHIS 2 Web API.

The commands heavily utilizes CSV files as input for manipulation of batches of metadata. The CSV files follows a common format where the following header column names are valid: "name", "uid" and "code". The commands will attempt to match on any specified column/property. Column names are case-sensitive. You must specify at least one column.

Example CSV file:

<pre>
"name","code"
"Johns clinic", "Fac021"
"Bobs dispensary", "Fac015"
"St Martas hospital","Fac042"
</pre>

## Available commands

The following commands are available.

### Remove organisation units

The remove_org_units command will remove a batch of organisation units. It reads
organisation units from a CSV file.

Usage:

<pre>node ./remove_org_units.js --file &lt;name-of-org-unit-csv-file&gt;</pre>
