class CustomReporter {
  onRunComplete(_, results) {
    const fs = require('fs');
    const path = require('path');
    
    // Create reports directory if it doesn't exist
    const reportsDir = path.join(process.cwd(), 'test-reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir);
    }
    
    const summary = {
      numFailedTests: results.numFailedTests,
      numPassedTests: results.numPassedTests,
      numTotalTests: results.numTotalTests,
      failedTests: results.testResults
        .filter(result => result.numFailingTests > 0)
        .map(result => ({
          testPath: result.testFilePath,
          failedTestCases: result.testResults
            .filter(test => test.status === 'failed')
            .map(test => ({
              title: test.title,
              errorMessage: test.failureMessages[0]
            }))
        }))
    };

    fs.writeFileSync(
      path.join(process.cwd(), 'test-reports', `test-results-${new Date().toISOString().split('T')[0]}.txt`),
      JSON.stringify(summary, null, 2)
    );
  }
}

module.exports = CustomReporter; 