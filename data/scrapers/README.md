# Scrapers

Missing persons records are scattered across websites of government agencies and non-profit organizations. This is an attempt to collect all of them in one place.

[Come Back Home][come-back-home] maintains a database of missing persons across the globe, and periodically refreshes them. It crawls known sites with custom scrapers, extracts data, stores it in a database, and makes it avaialable in a clean, geo-sensitive API.

## Contributing
### Creating your own scraper
If you'd like to add your own data (or build a scraper for a website that carries missing persons information), do the following:
  - create a sub-directory under this folder
  - create a single executable called `scrape` under that folder which produces missing persons data. See the Data fields section below.
  - create a Pull Request to add your scraper into the codebase

[Come Back Home][come-back-home] will periodically run these scripts and update the database with the union of the records produced by the scrapers.

### Data fields
Scrapers should take no arguments and print a `JSON` `array` to `STDOUT`. Each element of the array should have the following fields:
#### `identifier (string)`: required
A unique ID for this record. Could be used to de-dupe records and/or perform incremental updates to the database.
#### `source (string)`: required
The source of this data. It's usually a good idea to use the name of the Agency/Organization providing the data.
#### `display_name (string)`: required
The name of the person that is displayed to [Come Back Home][come-back-home]'s users.
#### `display_location (string)`: required
The location of the person that is displayed to [Come Back Home][come-back-home]'s users. It's usually a good idea to make this a combination of the state/province and the country.
#### `thumbnail_url (string)`: required
The photo of the missing person that can be used to identify them.
#### `url (string)`: required
A link to a actual missing person's record that can be used to gather/provide information.
#### `since (date)`: optional
Date when the person went missing.
#### `age_now (string)`: optional
The age of the missing person today.
#### `first_name (string)`: optional
#### `middle_name (string)`: optional
#### `last_name (string)`: optional
#### `city (string)`: optional
#### `state (string)`: optional
#### `country (string)`: optional


[come-back-home]: <https://comebackhome.org>
