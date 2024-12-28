The solution involves using promises to ensure that all asynchronous operations within the transaction complete before considering the transaction successful.  This can be achieved by chaining `.then()` calls and resolving the promise only after all database updates are confirmed.  Error handling is also crucial to prevent data corruption in case of failures.

```javascript
firebase.database().ref().transaction(function(currentData) {
  // Asynchronous operations must be chained and handled properly 
  return firebase.database().ref('node1').once('value').then(function(snapshot1){
    return firebase.database().ref('node2').once('value').then(function(snapshot2){
      const updatedData = {...currentData, ...newDataBasedOnSnapshots(snapshot1,snapshot2)};
      return updatedData; 
    })
  }).catch(error => {
    console.error('Transaction failed:', error);
    return null; // or throw error as appropriate
  });
}).then(function(committed, error) {
  if (error) {
    console.error('Transaction failed:', error);
  } else if (!committed) {
    console.log('Transaction aborted');
  } else {
    console.log('Transaction successfully committed');
  }
});
```