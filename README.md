# inegi
This repository contains data and scripts to download and analyze data provided by the INEGI (National Institute of Geography and Statistics - of Mexico). Each directory contains the following:

*` bin/` - Contains scripts to download and analyze data.
 * `get_indicators.py` - It takes a CSV file as input, that must contain municipality and state codes, and a list of indicators from the INEGI API to add them to the CSV file.
 * `check_power_law.py` - It takes a list of numbers, and checks if they correspond to a power-law ranking.

* `inegi/` - The INEGI Python package. Functionality to interact with the data. - None added yet : )

* `data/` - The data that I've downloaded and analyzed

* `viz/` - Visualizations resulting from this data.
 * `gdp` - Visualization on population and GDP on the Mexican territory.
 * `.` - Visualization of Tortillas, GDP and population in Mexico city.
