const fs = require('fs');
const libCoverage = require('istanbul-lib-coverage');
const libReports = require('istanbul-lib-report');
const reports = require('istanbul-reports');

// Load the merged coverage JSON
const coverage = JSON.parse(fs.readFileSync('coverage/total.json', 'utf8'));

// Create a CoverageMap from the JSON
const map = libCoverage.createCoverageMap(coverage);

// Create a report context
const context = libReports.createContext({
	dir: './coverage', // Output directory for the lcov.info file
	coverageMap: map,
});

// Create and execute the lcov report
const lcovReport = reports.create('lcov', {});
lcovReport.execute(context);
