const tbody = document.getElementById("tbody");
let totalTableRow = 0;
let isUnsaved = false;

function showTable(data) {
  tbody.innerHTML = "";
  data.map((chemical) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
          <td><i class="fa-solid fa-check"></i></td>
          <td contenteditable="true">${chemical.id}</td>
          <td contenteditable="true">${chemical.chemical_name}</td>
          <td contenteditable="true">${chemical.vender}</td>
          <td contenteditable="true" style="padding: 6px 10px; border: 1px solid #b1b1b1">${chemical.density}</td>
          <td contenteditable="true" style="padding: 6px 10px; border: 1px solid #b1b1b1">${chemical.viscosity}</td>
          <td contenteditable="true">${chemical.packaging}</td>
          <td contenteditable="true">${chemical.pack_size}</td>
          <td contenteditable="true">${chemical.unit}</td>
          <td contenteditable="true" style="padding: 6px 10px; border: 1px solid #b1b1b1"> ${chemical.quantity}</td>
          `;
    tbody.appendChild(tr);

    const checkIcon = tr.querySelector(".fa-check");
    checkIcon.addEventListener("click", () => {
      tr.classList.toggle("selected");
      if (tr.classList.contains("selected")) {
        checkIcon.style.color = "blue";
        tr.style.backgroundColor = "#dcdcff";
      } else {
        checkIcon.style.color = "#b1b1b1";
        tr.style.backgroundColor = "white";
      }
    });

    const rows = tr.querySelectorAll("[contenteditable = 'true']");
    rows.forEach((row) => {
      row.addEventListener("input", () => {
        isUnsaved = true;
        save.classList.remove("fa-solid");
        save.classList.add("fa-regular");
      });
    });
  });
}

function loadData() {
  const savedData = localStorage.getItem("chemicalData");
  if (savedData) {
    showTable(JSON.parse(savedData));
  } else {
    fetch("ChemicalData.json")
      .then((res) => res.json())
      .then((data) => {
        totalTableRow = data.length;
        showTable(data);
      });
  }
}
loadData();

/************************* ADD ROW *************************/

const addRow = document.querySelector(".fa-circle-plus");
addRow.addEventListener("click", () => {
  let totalRow = totalTableRow + 1;
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
      <td><i class="fa-solid fa-check"></i></td>
      <td contenteditable="true">${totalRow}</td>
      <td contenteditable="true" style="padding: 6px 10px; border: 1px solid #b1b1b1"></td>
      <td contenteditable="true" style="padding: 6px 10px; border: 1px solid #b1b1b1"></td>
      <td contenteditable="true" style="padding: 6px 10px; border: 1px solid #b1b1b1"></td>
      <td contenteditable="true" style="padding: 6px 10px; border: 1px solid #b1b1b1"></td>
      <td contenteditable="true" style="padding: 6px 10px; border: 1px solid #b1b1b1"></td>
      <td contenteditable="true" style="padding: 6px 10px; border: 1px solid #b1b1b1"></td>
      <td contenteditable="true" style="padding: 6px 10px; border: 1px solid #b1b1b1"></td>
      <td contenteditable="true" style="padding: 6px 10px; border: 1px solid #b1b1b1"></td>
    `;

  tbody.appendChild(newRow);
  totalTableRow++;
  save.classList.remove("fa-solid");
  save.classList.add("fa-regular");
  const checkIcon = newRow.querySelector(".fa-check");
  checkIcon.addEventListener("click", () => {
    newRow.classList.toggle("selected");
    if (newRow.classList.contains("selected")) {
      checkIcon.style.color = "blue";
      newRow.style.backgroundColor = "#dcdcff";
    } else {
      checkIcon.style.color = "#b1b1b1";
      newRow.style.backgroundColor = "white";
    }
  });
});

/************************* MOVE ROW DOWN *************************/

const moveRowDown = document.querySelector(".fa-arrow-down");
moveRowDown.addEventListener("click", () => {
  const selectedRow = Array.from(document.querySelectorAll("tr.selected"));
  for (let i = selectedRow.length - 1; i >= 0; i--) {
    const row = selectedRow[i];
    const nextRow = row.nextElementSibling;
    if (nextRow) {
      row.parentNode.insertBefore(nextRow, row);
    }
    save.classList.remove("fa-solid");
    save.classList.add("fa-regular");
  }
});

/************************* MOVE ROW UP *************************/

const moveRowUp = document.querySelector(".fa-arrow-up");
moveRowUp.addEventListener("click", () => {
  const selectedRow = document.querySelectorAll("tr.selected");
  selectedRow.forEach((row) => {
    const prevRow = row.previousElementSibling;
    if (prevRow) {
      row.parentNode.insertBefore(row, prevRow);
    }
    save.classList.remove("fa-solid");
    save.classList.add("fa-regular");
  });
});

/************************* DELETE *************************/

const deleteRow = document.querySelector(".fa-trash");
deleteRow.addEventListener("click", () => {
  const selectedRows = document.querySelectorAll(".selected");
  selectedRows.forEach((row) => {
    row.remove();
    save.classList.remove("fa-solid");
    save.classList.add("fa-regular");
  });
});

/************************* REFRESH *************************/

const refresh = document.querySelector(".fa-rotate-right");
refresh.addEventListener("click", () => {
  if (isUnsaved) {
    const confirmDiscard = confirm(
      "You have unsaved changes. Are you sure you want to discard them?"
    );
    if (confirmDiscard) {
      isUnsaved = false;
      loadData();
    }
  } else {
    loadData();
  }
});

/*************************  BROWSER REFRESH  *************************/

window.addEventListener("beforeunload", () => {
  localStorage.removeItem("chemicalData");
});

/************************* SAVE *************************/

const save = document.querySelector(".fa-floppy-disk");
save.addEventListener("click", () => {
  const rows = Array.from(tbody.querySelectorAll("tr"));
  const savedData = rows.map((row) => {
    const cells = row.querySelectorAll("td");
    return {
      id: cells[1].innerText,
      chemical_name: cells[2].innerText,
      vender: cells[3].innerText,
      density: cells[4].innerText,
      viscosity: cells[5].innerText,
      packaging: cells[6].innerText,
      pack_size: cells[7].innerText,
      unit: cells[8].innerText,
      quantity: cells[9].innerText,
    };
  });
  localStorage.setItem("chemicalData", JSON.stringify(savedData));
  save.classList.remove("fa-regular");
  save.classList.add("fa-solid");
  isUnsaved = false;
  loadData();
});
