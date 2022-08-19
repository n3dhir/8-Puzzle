let cells = document.querySelectorAll(".wrapper > .grid > div > span");
let bfsButton = document.querySelector(".bfs-button");
let dfsButton = document.querySelector(".dfs-button");
let ASatrButton = document.querySelector(".a-star-button");
let shuffleButton = document.querySelector(".shuffle-button");
let toggleButton = document.querySelector('#toggle-button');

toggleButton.addEventListener("click", function () {
  let sheet = document.styleSheets[1];
  if (toggleButton.checked) {
    sheet.cssRules[1].style.setProperty("--back-color", "#212121");
    sheet.cssRules[1].style.setProperty("--color", "#c39a3b");
    sheet.cssRules[1].style.setProperty("--filter1", "invert(1%) sepia(14%) saturate(53%) hue-rotate(314deg) brightness(107%) contrast(76%)");
    sheet.cssRules[1].style.setProperty("--filter2", "invert(60%) sepia(64%) saturate(377%) hue-rotate(4deg) brightness(90%) contrast(101%)");
  }
  else {
    sheet.cssRules[1].style.setProperty("--back-color", "#fafafa");
    sheet.cssRules[1].style.setProperty("--color", "#6125f9");
    sheet.cssRules[1].style.setProperty("--filter1", "invert(100%) sepia(57%) saturate(1%) hue-rotate(286deg) brightness(110%) contrast(96%)");
    sheet.cssRules[1].style.setProperty("--filter2", "invert(18%) sepia(79%) saturate(6544%) hue-rotate(258deg) brightness(96%) contrast(103%)");
  }
})

let moves = [[-1, 0, 3, 6], [1, 2, 5, 8], [-3, 0, 1, 2], [3, 6, 7, 8]];

cells.forEach((cell) => {
  cell.addEventListener("click", (e) => {
    clr();
    let neighbors = getNeighbors(e.target.id);
    for (let i = 0; i < neighbors.length; i++) {
      let neighbor = document.querySelector(`#${neighbors[i]}`);
      if (neighbor.innerHTML === '') {
        swap(neighbor, e.target);
        break;
      }
    }
  })
})

function getNeighbors(cell) {
  let neighbors = [];
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      if (i && j || !i && !j)
        continue;
      let row = +cell[1];
      let column = +cell[2];
      row += i;
      column += j;
      if (isValid(row, column)) {
        neighbors.push(`_${row}${column}`);
      }
    }
  }
  return neighbors;
};

function isValid(row, column) {
  return row > -1 && row < 3 && column > -1 && column < 3;
}

function swap(cell, neighbor) {
  [cell.innerHTML, neighbor.innerHTML] = [neighbor.innerHTML, cell.innerHTML];
}

bfsButton.addEventListener("click", () => {
  clr();
  bfs();
});

dfsButton.addEventListener("click", () => {
  clr();
  dfs();
});

shuffleButton.addEventListener("click", () => {
  clr();
  shuffle();
})
ASatrButton.addEventListener("click", () => {
  clr();
  AStar();
})

function bfs() {
  let nb = 0;
  let startNode = [];
  for (let i = 0; i < cells.length; i++)
    startNode.push(cells[i].innerHTML);
  let par = new Map();
  par[startNode] = startNode;
  let q = [];
  q.push(startNode);
  while (q.length) {
    nb++;
    let currentNode = q.shift();
    if (check(currentNode)) {
      let path = [];
      while (par[currentNode] != currentNode) {
        path.push(currentNode);
        currentNode = par[currentNode];
      }
      show(nb, path.length);
      print(path.length, path, 500);
      break;
    }
    for (let i = 0; i < currentNode.length; i++)
      if (currentNode[i] === '') {
        for (let j = 0; j < moves.length; j++) {
          let flag = true;
          for (let k = 1; k < moves[j].length; k++) {
            if (moves[j][k] == i) {
              flag = false;
              break;
            }
          }
          if (flag) {
            let neighbor = [...currentNode];
            [neighbor[i], neighbor[i + moves[j][0]]] = [neighbor[i + moves[j][0]], neighbor[i]];
            if (!par[neighbor]) {
              par[neighbor] = currentNode;
              q.push(neighbor);
            }
          }
        }
      }
  }
}

function dfs() {
  let nb = 0;
  let startNode = [];
  for (let i = 0; i < cells.length; i++)
    startNode.push(cells[i].innerHTML);
  let par = new Map();
  par[startNode] = startNode;
  let st = [];
  st.push(startNode);
  while (st.length) {
    nb++;
    let currentNode = st.pop();
    if (check(currentNode)) {
      let path = [];
      while (par[currentNode] != currentNode) {
        path.push(currentNode);
        currentNode = par[currentNode];
      }
      show(nb, path.length);
      print(path.length, path, 0);
      break;
    }
    for (let i = 0; i < currentNode.length; i++)
      if (currentNode[i] === '') {
        for (let j = 0; j < moves.length; j++) {
          let flag = true;
          for (let k = 1; k < moves[j].length; k++) {
            if (moves[j][k] == i) {
              flag = false;
              break;
            }
          }
          if (flag) {
            let neighbor = [...currentNode];
            [neighbor[i], neighbor[i + moves[j][0]]] = [neighbor[i + moves[j][0]], neighbor[i]];
            if (!par[neighbor]) {
              par[neighbor] = currentNode;
              st.push(neighbor);
            }
          }
        }
      }
  }
}

function check(grid) {
  for (let i = 0; i < 8; i++)
    if (grid[i] != i + 1)
      return false;
  return true
}

function print(n, path, speed) {
  if (!n) {
    return;
  }
  setTimeout(() => {
    for (let j = 0; j < 3; j++)
      for (let k = 0; k < 3; k++) {
        cells[j * 3 + k].innerHTML = path[n - 1][j * 3 + k];
      }
    print(n - 1, path, speed);
  }, speed);
}

function shuffle() {
  for (let i = 0; i < 100; i++) {
    let empty;
    for (let i = 0; i < cells.length; i++)
      if (cells[i].innerHTML === '') {
        empty = cells[i];
        break;
      }
    let neighbors = getNeighbors(empty.id);
    let chosen = neighbors[Math.floor(Math.random() * neighbors.length)];
    swap(document.querySelector(`#${chosen}`), empty);
  }
}

function show(nb, len) {
  let p = document.createElement("p");
  p.className = "pop-up";
  p.innerHTML = `<img src="xmark-solid.svg">Path Length: <span>${len}</span><br>Number Of Visited Nodes: <span>${nb}</span>`;
  document.querySelector(".wrapper").prepend(p);
}

document.addEventListener("click", (e) => {
  if (e.target.tagName === "IMG") {
    let parent = e.target.parentElement;
    parent.remove();
  }
})

document.addEventListener("click", (e) => {
  if (e.target.className === "pop-up") {
    e.target.remove();
  }
})

function clr() {
  let popUp = document.querySelector(".pop-up");
  if (popUp)
    popUp.remove();
}

function heuristic(node) {
  let ans = 0;
  for (let i = 0; i < 8; i++)
    ans += node[i] != i + 1;
  ans += node[8] != '';
  return ans;
}

function AStar() {
  let nb = 0;
  let startNode = [];
  for (let i = 0; i < cells.length; i++)
    startNode.push(cells[i].innerHTML);
  let par = new Map();
  let dist = new Map();
  let vis = new Map();
  par[startNode] = startNode;
  dist[startNode] = 0;
  let pq = [];
  pq.push([0, startNode]);
  while (pq.length) {
    nb++;
    let current = pq.shift();
    let currentNode = current[1];
    vis[currentNode] = true;
    if (dist[currentNode] + heuristic(currentNode) < current[0])
      continue;
    if (check(currentNode)) {
      let path = [];
      while (par[currentNode] != currentNode) {
        path.push(currentNode);
        currentNode = par[currentNode];
      }
      show(nb, path.length);
      print(path.length, path, 500);
      break;
    }
    for (let i = 0; i < currentNode.length; i++)
      if (currentNode[i] === '') {
        for (let j = 0; j < moves.length; j++) {
          let flag = true;
          for (let k = 1; k < moves[j].length; k++) {
            if (moves[j][k] == i) {
              flag = false;
              break;
            }
          }
          if (flag) {
            let neighbor = [...currentNode];
            [neighbor[i], neighbor[i + moves[j][0]]] = [neighbor[i + moves[j][0]], neighbor[i]];
            if (vis[neighbor])
              continue;
            if (!par[neighbor] || dist[neighbor] > dist[currentNode] + 1) {
              par[neighbor] = currentNode;
              dist[neighbor] = dist[currentNode] + 1;
              let cost = dist[neighbor] + heuristic(neighbor);
              let i;
              for (i = 0; i < pq.length && cost >= pq[i][0]; i++);
              pq.splice(i, 0, [cost, neighbor]);
            }
          }
        }
      }
  }
}