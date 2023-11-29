
function DragTable(id, settings) {
    if (!id) {
        console.warn("須將table設定id");
        return;
    }

    let tbody = document.querySelector(`#${id}\t tbody`);
    let thead = document.querySelector(`#${id}\t thead`);
    let rows = [];
    let currentRow = null;
    let dragElem = null ;
    let mouseDownX = 0;
    let mouseDownY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let dragging = false;
    let beforeDragIndex = -1;
    let afterDragIndex = -1;
    let settingsList = Object.keys(settings);
    let params = {
        tableData: [],
        drag: null,
        drop: null,
        targetClass: null,
        dragClass: null
    };

    for (let i = 0; i < settingsList.length; i++) {
        params[settingsList[i]] = settings[settingsList[i]]
    }

    if (params.tableData && params.tableData.length) {
        if (!thead) {
            console.warn("須設定thead")
        } else if (!tbody) {
            console.warn("須設定tbody")
        } else {
            rows = Array.from(tbody.children);
            initTable(params.tableData)
        }
    }

    document.addEventListener("mousedown", (e) => {
        e.preventDefault();
        if (e.button != 0) return;
        currentRow = getRow(e.target);

        if (currentRow) {
            updateRow();
            beforeDragIndex = rows.indexOf(currentRow);
            let croods = getCoords(e);

            mouseDownX = croods.x;
            mouseDownY = croods.y;

            addDragRow(currentRow);
            if (checkClass(params.targetClass)) {
                currentRow.classList.add(`${params.targetClass}`);
            }
            dragging = true;
        }
    });

    document.addEventListener("mousemove", (e) => {
        if (!dragging) return;

        let croods = getCoords(e);
        mouseX = croods.x - mouseDownX;
        mouseY = croods.y - mouseDownY;
        moveRow(mouseX, mouseY);

        if (params.drag) {
            if (isFunction(params.drag)) {
                params.drag(e);
            }
        }
    });


    document.addEventListener("mouseup", (e) => {

        if (dragging && dragElem) {
            tbody.removeChild(dragElem);
            dragging = false;
            dragElem = null;
            currentRow.classList.remove(`${params.targetClass}`);

            updateRow();
            afterDragIndex = rows.indexOf(currentRow);
            let data = params.tableData;

            if (beforeDragIndex >= 0 && afterDragIndex >= 0) {

                let temp = data[beforeDragIndex];
                data.splice(beforeDragIndex, 1);
                data.splice(afterDragIndex, 0, temp);
            }
        }
    });

    function addDragRow(row) {
        dragElem = row.cloneNode(true);
        if (checkClass(params.dragClass)) {
            dragElem.classList.add(`${params.dragClass}`);
        }
        let currPos = currentRow.getBoundingClientRect();

        tbody.appendChild(dragElem);
        dragElem.style.position = 'absolute';
        dragElem.style.top = currPos.y + 'px';
        dragElem.style.left = currentRow.left + "px";
    }

    function moveRow(x, y) {
        dragElem.style.transform = `translate3d(${x}px,${y}px,0)`;
        let currPos = dragElem.getBoundingClientRect();
        updateRow();

        let currStartY = currPos.y;
        let currEndY = currPos.y + currPos.height;

        for (let i = 0; i < rows.length; i++) {
            let rowsPos = rows[i].getBoundingClientRect();
            let rowStartY = rowsPos.y;
            let rowEndY = rowsPos.y + rowsPos.height;

            if (currentRow !== rows[i] && collisionCheck(currStartY, currEndY, rowStartY, rowEndY)) {
                if (Math.abs(currStartY - rowStartY) < rowsPos.height / 2) {
                    switchRow(rows[i], i);
                }
            }
        }
    }

    function switchRow(row, index) {
        let currIndex = Array.from(tbody.children).indexOf(currentRow);
        let row1 = currIndex < index ? row : currentRow;
        let row2 = currIndex > index ? row : currentRow;
        tbody.insertBefore(row1, row2);
    }

    function collisionCheck(currStartY, currEndY, rowStartY, rowEndY) {
        return currEndY >= rowStartY && currStartY <= rowEndY;
    }

    function getRow(target) {
        if (target.tagName == "TD") return target.parentNode;
        else return undefined;
    }

    function getCoords(e) {
        return {
            x: e.clientX,
            y: e.clientY
        }
    }

    function updateRow() {
        rows = Array.from(tbody.children);
    }

    function isFunction(func) {
        if (typeof func == "function") {
            return true;
        }
        console.warn("該參數只接受function");
        return false;
    }

    function checkClass(className) {
        if (typeof className == "string" || typeof className == "number") {
            return true;
        }
        console.warn("class參數只接受字串或數字");
        return false;
    }

    function initTable(data) {
        if (!data || !data.length) return;
        let keys = Object.keys(data[0]);
        let theadRow = thead.insertRow();


        for (let i = 0; i < keys.length; i++) {
            var th = document.createElement("th");
            th.innerHTML = keys[i];
            theadRow.appendChild(th);
        }

        for (let i = 0; i < data.length; i++) {
            var tbodyRow = tbody.insertRow();

            for (let j = 0; j < keys.length; j++) {
                var cell = tbodyRow.insertCell();
                cell.innerHTML = data[i][keys[j]];
            }
        }
    }

}

