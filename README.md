# Dish

Dhis is a command line tool for interaction with the DHIS 2 Web API. It is suitable for handling batch metadata operations.

The commands heavily utilizes CSV files as input for manipulation of batches of metadata. The CSV files follows a common format where the following header column names are valid: "name", "uid" and "code". The commands will attempt to match on any specified column/property. Column names are case-sensitive. You must specify at least one column.

Example CSV file:

<pre>
"name","code"
"Johns clinic", "Fac021"
"Bobs dispensary", "Fac015"
"St Martas hospital","Fac042"
</pre>

### Configuration

Dish is configured through a "conf.json" configuration file.

<pre>
{
  "api": {
    "baseUrl": "http://www.yourinstance.com",
    "username": "user",
    "password": "pw"
  }
}
</pre>

### Available commands

The following commands are available.

#### Remove organisation units

The *remove_org_units* command will remove a batch of organisation units, including associated complete data set registrations, data approvals and data values. It reads organisation units from a CSV file. It requires that the authenticated user has the "ALL" authority in order to delete data values and at least the "delete organisation units" authority in order to delete organisation units.

Usage:

<pre>node ./remove_org_units.js --file &lt;name-of-org-unit-csv-file&gt;</pre>
