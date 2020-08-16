const base_url = "https://api.football-data.org/";

// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}

// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}

// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}

// Blok kode untuk melakukan request data json
function getData1() {

  const myHeaders = new Headers({
    'X-Auth-Token': 'f401a6a154394f318de1731b40d23d0c'
  });  

  if ("caches" in window) {
    caches.match(base_url + "/v2/competitions/2001/standings?standingType=TOTAL").then(function(response) {
      if (response) {
        response.json().then(function(data) {
          let footballHTML = "";
          let group_team = "";
          data.standings.forEach(function(d2) {
            d2.table.forEach(function(d1) {
              group_team += `
                    <div class="card">
                      <a href="./football.html?id=${d1.team.id}">
                        <div class="card-content">
                          <span class="card-title truncate">
                            <img class="materialboxed" width="30" src="${d1.team.crestUrl}">
                            ${d1.team.name}
                          </span>
                        </div>
                      </a>
                    </div>
                  `;
            });             
            footballHTML += `
                  <div class="card">
                    <div class="card-content">
                      <span class="card-title truncate">${d2.group}</span>
                      <span class="card-title truncate">${group_team}</span>
                    </div>
                  </div>
                `;
            group_team = "";                
          });

          // Sisipkan komponen card ke dalam elemen dengan id #content
          document.getElementById("football_content").innerHTML = footballHTML;
        });
      }
    });
  }

  fetch(base_url + "/v2/competitions/2001/standings?standingType=TOTAL", {headers: myHeaders})
    .then(status)
    .then(json)
    .then(function(data) {
      // Objek/array JavaScript dari response.json() masuk lewat data.

      // Menyusun komponen card data secara dinamis
      let footballHTML = "";
      let group_team = "";
      data.standings.forEach(function(d2) {
        d2.table.forEach(function(d1) {
          group_team += `
                <div class="card">
                  <a href="./football.html?id=${d1.team.id}">
                    <div class="card-content">
                      <span class="card-title truncate">
                        <img class="materialboxed" height="30" src="${d1.team.crestUrl}">
                        ${d1.team.name}
                      </span>
                    </div>                  
                  </a>
                </div>
              `;
        });          
        footballHTML += `
              <div class="card">
                <div class="card-content">
                  <span class="card-title truncate">${d2.group}</span>
                  <span class="card-title truncate">${group_team}</span>
                </div>
              </div>
            `;
        group_team = "";         
      });
      // Sisipkan komponen card ke dalam elemen dengan id #content
      document.getElementById("football_content").innerHTML = footballHTML;
    })
    .catch(error);

}

//----------------------------------------------------------------------------------------
function getData2() {
  if ("caches" in window) {
    caches.match(base_url + "v2/competitions/").then(function(response) {
      if (response) {
        response.json().then(function(data) {
          let footballHTML = "";
          data.competitions.forEach(function(d1) {      
            footballHTML += `
                  <div class="card">
                    <div class="card-content">
                      <span class="card-title truncate">Club Name : ${d1.name}</span>
                      <span class="card-title truncate">Area : ${d1.area.name}</span>
                    </div>
                  </div>
                `;
          });

          // Sisipkan komponen card ke dalam elemen dengan id #content
          document.getElementById("idjadwal").innerHTML = footballHTML;
        });
      }
    });
  }

  const myHeaders = new Headers({
    'X-Auth-Token': 'f401a6a154394f318de1731b40d23d0c'
  });

  fetch(base_url + "v2/competitions/", {headers: myHeaders})
    .then(status)
    .then(json)
    .then(function(data) {
      // Objek/array JavaScript dari response.json() masuk lewat data.

      // Menyusun komponen card data secara dinamis
      let footballHTML = "";
      data.competitions.forEach(function(d1) {        
        footballHTML += `
              <div class="card">
                <div class="card-content">
                  <span class="card-title truncate">Club Name : ${d1.name}</span>
                  <span class="card-title truncate">Area : ${d1.area.name}</span>
                </div>
              </div>
            `;      
      });
      // Sisipkan komponen card ke dalam elemen dengan id #content
      document.getElementById("idjadwal").innerHTML = footballHTML;
    })
    .catch(error);
}

function getDataById() {
  return new Promise(function(resolve, reject) {
    // Ambil nilai query parameter (?id=)
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get("id");
    let football1HTML="";
    if ("caches" in window) {
      caches.match(base_url + "v2/teams/" + idParam).then(function(response) {
        if (response) {
          response.json().then(function(data) {
            football1HTML = `
              <div class="card">
                <div class="card-content">
                  <span class="card-title"><img class="materialboxed" width="50" src="${data.crestUrl}"> Club Name : ${data.name}</span>
                  <span class="card-title">Area : ${data.area.name}</span>
                  <span class="card-title">Aktif Competition : ${data.activeCompetitions[0].name}</span>                  
                </div>
              </div>
            `;    
            document.getElementById("body-content").innerHTML = football1HTML;
            // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
            resolve(data);
          });
        }
      });
    }

    const myHeaders = new Headers({
      'X-Auth-Token': 'f401a6a154394f318de1731b40d23d0c'
    });

    fetch(base_url + "v2/teams/" + idParam, {headers: myHeaders})
      .then(status)
      .then(json)
      .then(function(data) {
        // Objek JavaScript dari response.json() masuk lewat variabel data.
        console.log(data);
        // Menyusun komponen card data secara dinamis
        let football1HTML = `
              <div class="card">
                <div class="card-content">
                  <span class="card-title"><img class="materialboxed" width="50" src="${data.crestUrl}"> Name Club : ${data.name}</span>
                  <span class="card-title">Area : ${data.area.name}</span>
                  <span class="card-title">Aktif Competition : ${data.activeCompetitions[0].name}</span>
                </div>
              </div>
        `;
        document.getElementById("body-content").innerHTML = football1HTML;
        // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
        resolve(data);
      });
  });
}

function getSavedData1() {
  getAll().then(function(d1) {
    // Menyusun komponen card data secara dinamis
    const cek = Object.keys(d1).length;
    let footballHTML = "";
    let content = "";
      d1.forEach(function(d1) {
        footballHTML += `
          <div class="card">    
            <a href="./football.html?id=${d1.id}&saved=true">
              <div class="card-content">
                <span class="card-title">Name Club : ${d1.name}</span>
              </div>
            </a>
            <button class="waves-effect waves-light btn red" onclick="deletesaved(${d1.id})">delete</button>
          </div>
        `;
      });      

    if(cek === 0 || cek === null){
      content = "<div><h3>Tidak ada data<h3></div>";
    }
    else{
      content = footballHTML;
    }

    document.getElementById("body-content").innerHTML = content;
    // Sisipkan komponen card ke dalam elemen dengan id #body-content
    
  });
}

function getSavedDataById() {
  const urlParams = new URLSearchParams(window.location.search);
  const idParam = urlParams.get("id");
  console.log(idParam);

  getById(idParam).then(function(d1) {
    console.log(d1+"ddddddd");
    let football1HTML = '';
    football1HTML += `
        <div class="card">
          <div class="card-image waves-effect waves-block waves-light">
          </div>
          <div class="card-content">
            #saved page
            <hr>
            <span class="card-title">Name Club : ${d1.name}</span>
            <span class="card-title">Area : ${d1.area.name}</span>
            <span class="card-title">Aktif Competition : ${d1.activeCompetitions[0].name}</span>   
          </div>
        </div>
    `;
    // Sisipkan komponen card ke dalam elemen dengan id #content
    document.getElementById("body-content").innerHTML = football1HTML;
  });
}

