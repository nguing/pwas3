var dbPromised = idb.open("football", 1, function(upgradeDb) {
  var dataObjectStore = upgradeDb.createObjectStore("data", {
    keyPath: "id"
  });
  dataObjectStore.createIndex("isi", "isi", { unique: false });
});

function saveForLater(d1) {
  dbPromised
    .then(function(db) {
      var tx = db.transaction("data", "readwrite");
      var store = tx.objectStore("data");
      store.put(d1);
      return tx.complete;
    })
    .then(function() {
      console.log("Artikel berhasil di simpan.");
      M.toast({html: 'Artikel berhasil di simpan.'})
    });    
}

function deletesaved(d1) {
  var x = confirm("Are you sure you want to delete?");
  if (x){
    dbPromised
      .then(function(db) {
        var tx = db.transaction('data', 'readwrite');
        var store = tx.objectStore('data');
        store.delete(d1);
        return tx.complete;
      }).then(function() {
        M.toast({html: 'Item deleted'})
        window.location.reload();
      });    
    return true;
  }
  else{
    return false;
  }
}

function getAll() {
  return new Promise(function(resolve, reject) {
    dbPromised
      .then(function(db) {
        var tx = db.transaction("data", "readonly");
        var store = tx.objectStore("data");
        return store.getAll();
      })
      .then(function(data) {
        resolve(data);
        console.log(data);
      });
  });
}

function getById(id) {
  return new Promise(function(resolve, reject) {
    dbPromised
      .then(function(db) {
        var tx = db.transaction("data", "readonly");
        var store = tx.objectStore("data");
        return store.get(parseInt(id));
      })
      .then(function(d1) {
        resolve(d1);
      });
  });
}
