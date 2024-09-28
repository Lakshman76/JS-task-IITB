const tbody = document.getElementById("tbody");
let totalTableRow = 0;
let isUnsaved = false;

// function to select or deselect rows
function selectRow(row, checkIcon) {
  row.classList.toggle("selected");
  if (row.classList.contains("selected")) {
    checkIcon.style.color = "blue";
    row.style.backgroundColor = "#dcdcff";
  } else {
    checkIcon.style.color = "#b1b1b1";
    row.style.backgroundColor = "white";
  }
}

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

    // To select or deselect rows click on check icon
    const checkIcon = tr.querySelector(".fa-check");
    checkIcon.addEventListener("click", () => {
      selectRow(tr, checkIcon);
    });

    // Click on any cell to edit it's value
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

// By default table shows json data but when we make some changes into table it will show that data.
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

/************************* SORT COLUMN*************************/

let sortOrder = true; // true for ascending, false for descending

// function to sort the column using sort() method
function sortTable(column, order) {
  const rows = Array.from(tbody.querySelectorAll('tr'));
  const sortedRows = rows.sort((prevRow, nextRow) => {
    const prevRowText = prevRow.querySelector(`td:nth-child(${column})`).innerText;
    const nextRowText = nextRow.querySelector(`td:nth-child(${column})`).innerText;

    const prevRowValue = isNaN(prevRowText) ? prevRowText : parseFloat(prevRowText);
    const nextRowValue = isNaN(nextRowText) ? nextRowText : parseFloat(nextRowText);

    if (prevRowValue < nextRowValue) return order ? -1 : 1;
    if (prevRowValue > nextRowValue) return order ? 1 : -1;
    return 0;
  });

  tbody.innerHTML = "";
  sortedRows.forEach(row => tbody.appendChild(row));
}

// when click on column header it will first sort the table in ascending order and then in descending
// But when you click first on column1 then it sort it into ascending order and in the second click of column2 it will sort it in descending order
document.querySelectorAll('th[head-column]').forEach(header => {
  header.addEventListener('click', () => {
    const columnIndex = Array.from(header.parentNode.children).indexOf(header) + 1; // Index starts from 1
    sortTable(columnIndex, sortOrder);
    sortOrder = !sortOrder; // Toggle sort order
  });
});

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

  // To select or deselect newly added rows click on check icon
  const checkIcon = newRow.querySelector(".fa-check");
  checkIcon.addEventListener("click", () => {
    selectRow(newRow, checkIcon);
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

/************************* DELETE ROW *************************/

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
  // Save data in local storage
  localStorage.setItem("chemicalData", JSON.stringify(savedData));
  save.classList.remove("fa-regular");
  save.classList.add("fa-solid");
  isUnsaved = false;
  loadData();
});
