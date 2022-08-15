let cells = document.querySelectorAll(".wrapper > .grid > div > span");
let btn = document.querySelector("button");

cells.forEach((cell) => {
  cell.addEventListener("click", (e) => {
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

btn.addEventListener("click", () => {
  solve();
})

function solve() {
  let cells = document.querySelectorAll(".wrapper > .grid > div > span");
  let startNode = [];
  for (let i = 0; i < cells.length; i++)
    startNode.push(cells[i].innerHTML);
  let par = new Map();
  par[startNode] = startNode;
  let q = [];
  q.push(startNode);
  while (q.length) {
    let currentNode = q.shift();
    if (check(currentNode)) {
      reconstruct(par, currentNode);
      break;
    }
    for (let i = 0; i < currentNode.length; i++)
      if (currentNode[i] === '') {
        if (i && i != 3 && i != 6) {
          let neighbor = [...currentNode];
          [neighbor[i], neighbor[i - 1]] = [neighbor[i - 1], neighbor[i]];
          if (!par[neighbor]) {
            par[neighbor] = currentNode;
            q.push(neighbor);
          }
        }
        if (i != 2 && i != 5 && i != 8) {
          let neighbor = [...currentNode];
          [neighbor[i], neighbor[i + 1]] = [neighbor[i + 1], neighbor[i]];
          if (!par[neighbor]) {
            par[neighbor] = currentNode;
            q.push(neighbor);
          }
        }
        if (i > 2) {
          let neighbor = [...currentNode];
          [neighbor[i], neighbor[i - 3]] = [neighbor[i - 3], neighbor[i]];
          if (!par[neighbor]) {
            par[neighbor] = currentNode;
            q.push(neighbor);
          }
        }
        if (i < 6) {
          let neighbor = [...currentNode];
          [neighbor[i], neighbor[i + 3]] = [neighbor[i + 3], neighbor[i]];
          if (!par[neighbor]) {
            par[neighbor] = currentNode;
            q.push(neighbor);
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

async function reconstruct(par, node) {
  let path = [];
  while (par[node] != node) {
    path.push(node);
    node = par[node];
  }
  print(path.length, path);
}

function print(n, path) {
  if(!n) {
    return;
  }
  setTimeout(() => {
      for (let j = 0; j < 3; j++)
          for (let k = 0; k < 3; k++) {
              cells[j * 3 + k].innerHTML = path[n-1][j * 3 + k];
          }
          print(n-1, path);
  }, 500);
}