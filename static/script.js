function parseCSV(csvString) {
  return Papa.parse(csvString, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true
  }).data;
}

function sortItems(list, keys, isIncreasing) {
  return list.sort((a, b) => {
    for (const key of keys) {
      let ak = a[key];
      let bk = b[key];
      if (key == 'Date') {
        ak = moment(ak, "DD/MM/YYYY");
        bk = moment(bk, "DD/MM/YYYY");
      }
      if (typeof ak == 'string' || typeof bk == 'string') {
        ak = ak.toString().toLowerCase();
        bk = bk.toString().toLowerCase();
      }
      if (ak != bk)
        return isIncreasing ? 2 * (bk < ak) - 1 : 2 * (bk > ak) - 1;
    }
    return 0;
  });
}

function buildPublicationsHTML(publications) {
  let html = '';
  for (const publication of publications) {
    const authors = publication["entryTags.AUTHOR"];
    /*.replace(/\s+/g, '')
    .split(";")
    .filter(s => s != '')
    .map(s => s.split(',').reverse().join(' '))
    .join(", ");*/
    html += `
      <li>
        <span class="date-one">${publication["entryTags.YEAR"] || ''}</span>
        <p>${publication["entryTags.TITLE"]}. <i>${authors}</i>.<br>`;
    const otherInformation = [`<span class="place">${publication["entryTags.BOOKTITLE"] || "Preprint"}</span>`, publication["entryTags.VOLUME"], publication["entryTags.NUMBER"], publication["entryTags.PAGES"], publication["entryTags.YEAR"]];
    html += otherInformation.filter(s => s != null).join(', ') + `.</p>
      </li>
    `;
  }
  return html;
}

function serialize(dict) {
  var result = {};
  function aux(dict, parentKey) {
    for (var key in dict) {
      if (typeof dict[key] === 'string') {
        result[parentKey + key] = dict[key];
      } else {
        aux(dict[key], parentKey + key + ".");
      }
    }
  }
  aux(dict, "");
  return result;
}

function getListData(url) {
  return fetch(url, { method: 'GET', headers: { 'Content-type': 'text/plain' } })
    .then(response => response.text())
    .then(s => {
      if (url.endsWith(".json"))
        var list = JSON.parse(s);
      else if (url.endsWith(".csv"))
        var list = parseCSV(s);
      else if (url.endsWith(".html"))
        var list = [s];
      else if (url.endsWith(".bib")) {
        var list = bibtexParse.toJSON(s);
        list = list.map(x => serialize(x, ""));
      }
      else
        console.error("Unknown file format.");
      return list;
    })
    .catch(error => {
      // Handle any errors that might occur
      console.error(error);
    });
}

function createList(url, builderHTML, listId, keys, isIncreasing) {
  getListData(url)
    .then(list => {
      list = sortItems(list, keys, isIncreasing);
      const listHTML = builderHTML(list);
      document.getElementById(listId).innerHTML = listHTML;
    })
    .catch(error => {
      // Handle any errors that might occur
      console.error(error);
    });
}

function addPublicationRequest(urlData, jsonRequest, id, keys, builderRequest) {
  return Promise.all([getListData(urlData), getListData(jsonRequest)])
    .then(values => [values[0]
      .filter(item => (item.type == "researcher") || item.type == "lead")
      .reduce(
        (acc, item) => {
          for (var key of keys) {
            if (key in item) {
              key in acc ? acc[key].push(item[key]) : acc[key] = [item[key]]
            }
          }
          return acc
        }, {}
      ), values[1]])
    .then(lists => builderRequest(lists[0], lists[1], keys))
    .then(component => {
      document.getElementById(id).innerHTML = component;
    })
}

/* ─────────────────────────  TALKS LIST  ───────────────────────── */

async function loadRecentTalks() {
  try {
    const response = await fetch('/data/talks.json');
    const data = await response.json();
    const talksList = document.getElementById('recent-talks-list');
    
    // Sort talks by date in descending order (most recent first)
    const sortedTalks = data.talks.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Get only the 3 most recent talks
    const recentTalks = sortedTalks.slice(0, 3);
    
    recentTalks.forEach(talk => {
      const talkDate = new Date(talk.date);
      const isUpcoming = talkDate > new Date();
      
      const talkElement = document.createElement('div');
      talkElement.className = 'talk-item';
      talkElement.innerHTML = `
        <h3>${talk.title}${isUpcoming ? '<span class="upcoming-badge">Upcoming!</span>' : ''}</h3>
        <p class="venue">${talk.venue}, ${talk.date}</p>
      `;
      talksList.appendChild(talkElement);
    });
  } catch (error) {
    console.error('Error loading talks:', error);
    document.getElementById('recent-talks-list').innerHTML = 
      '<p>Error loading talks. Please try again later.</p>';
  }
}