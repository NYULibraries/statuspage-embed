# Test fixtures

## _statuspage-summaries/_

These are the verbatim https://2xswh16by5jl.statuspage.io/api/v2/summary.json
files served by Statuspage for manually created fake Incidents and Maintenances.

### Filename conventions

#### Incidents

    incident_[IMPACT]_update-[NUMBER]_[STATUS].json

#### Scheduled Maintenances

    maintenance_update-[NUMBER]_[STATUS].json

### How the Incidents and Maintenances were made

#### Incidents

For all possible `IMPACT` values, an initial incident was created with impact=`IMPACT`,
a fake name, a fake message, and the component affected set to
"Library.nyu.edu (NYU Libraries Website)".  This initial _summary.json_ was saved
as the _update-1_ file (`STATUS` was set to "Investigating" automatically).  The
Incident was updated three times, with the status set to
"Identified" -> "Monitoring" -> "Resolved" and the _summary.json_ files were saved
as the appropriately named fixture files.

#### Scheduled Maintenance

The initial Scheduled Maintenance was created with a fake name, fake message,
the component affected set to "Library.nyu.edu (NYU Libraries Website)", and
a start time set to a time very soon after the creation time.  The _summary.json_
response for the initial created Maintenance was saved as the _update-1_ file
before the maintenance start time was reached.  Between the start time and the
time when the maintenance window closed, the _summary.json_ file was saved as
the _update-2_ file.  After the maintenance window had closed, the _summary.json_
file was saved as the _update-3_ file.

Note that the impact for Maintenances is always "maintenance", so having the
`STATUS` token in the filename would be redundant.


