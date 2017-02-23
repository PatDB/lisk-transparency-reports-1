[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/LiskFrance/lisk-transparency-reports/blob/master/LICENSE)
[![version](https://img.shields.io/badge/version-0.2.0-blue.svg)](https://github.com/SherlockStd/lisk-transparency-reports/releases)
[![Dependency Status](https://gemnasium.com/badges/github.com/SherlockStd/lisk-transparency-reports.svg)](https://gemnasium.com/github.com/SherlockStd/lisk-transparency-reports)

<img align="right" src="https://cdn.rawgit.com/feross/standard/master/badge.svg">

# Lisk Transparency Report tool


This automated tool allow Lisk delegates to manage (very) easily their transparency reports, and voters to access the data efficiently.


## Links
- [Lisk Forum Post](https://forum.lisk.io/viewtopic.php?f=25&t=1347)


## Planned features for futures releases

#### v0.3.0:
- Multiples addresses management
- Profile page (containing only blockchain delegate informations and confirmed addresses atm)
- Report page (containing only blockchain delegate informations and confirmed addresses atm)
- Reset password by transaction functionnality
- _RESTFUL API endpoints_
- _JSDoc (usejsdoc.org)_

#### v0.4.0:
- _Test routines_

#### v0.5.0:
- First reports process
- Email support (only for notifications, no security stuff with the email, too weak)
- *PUBLIC RELEASE*

#### v0.6.0:
- Enhanced reports process
- Reports charts
- _Interface Design_

#### v0.7.0:
- _Admin dashboard_
- _Account deletion (by admin only, and only in case of squatting)_
- _Operations logging, logging dashboard with analysis_


## Installation

```bash
git clone https://github.com/LiskFrance/lisk-transparency-reports.git
cd lisk-transparency-reports
npm install
```


## Configuration

The configuration is stored in the /config/main.js file.


## Launch

```bash
npm start
```


## Authors

- Pierre Cavin <sherlock@sherlockstd.io>
- Tariq Riahi <tariq@lisk-france.fr>


## License

The MIT License (MIT)

Copyright (c) 2017 Pierre CAVIN

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
