
function DragTable(id, settings) {
    if (!id) {
        console.warn("須將table設定id");
        return
    }
    /**全域變數 */
    let tbody = document.querySelector(`#${id} tbody`);
    let thead = document.querySelector(`#${id} thead`);
    let rows = [];
    let currentRow = null//當前抓取對象
    let dragElem = null //當前抓取對象的複製物件
    let mouseDownX = 0
    let mouseDownY = 0
    let mouseX = 0
    let mouseY = 0
    let dragging = false
    let beforeDragIndex = -1
    let afterDragIndex = -1
    let settingsList = Object.keys(settings)
    let params = {
        tableData: [],
        drag: null,
        drop: null,
        targetClass: null,
        dragClass: null
    }

    for (let i = 0; i < settingsList.length; i++) {
        params[settingsList[i]] = settings[settingsList[i]]
    }

    if (params.tableData && params.tableData.length) {
        if (!thead) {
            console.warn("須設定thead")
        } else if (!tbody) {
            console.warn("須設定tbody")
        } else {
            rows = Array.from(tbody.children)
            initTable(params.tableData)
        }
    }

    //點擊目標
    document.addEventListener("mousedown", (e) => {
        e.preventDefault();
        if (e.button != 0) return;
        currentRow = getRow(e.target);

        if (currentRow) {
            updateRow()
            beforeDragIndex = rows.indexOf(currentRow)
            let croods = getCoords(e);

            mouseDownX = croods.x;
            mouseDownY = croods.y;

            addDragRow(currentRow);
            if (checkClass(params.targetClass)) {
                currentRow.classList.add(`${params.targetClass}`);
            }
            dragging = true
        }
    })

    //移動目標
    document.addEventListener("mousemove", (e) => {
        if (!dragging) return

        let croods = getCoords(e);
        mouseX = croods.x - mouseDownX;
        mouseY = croods.y - mouseDownY;
        moveRow(mouseX, mouseY)

        if (params.drag) {
            if (isFunction(params.drag)) {
                params.drag(e)
            }
        }
    })

    //放下目標
    document.addEventListener("mouseup", (e) => {

        if (dragging && dragElem) {
            tbody.removeChild(dragElem)
            dragging = false;
            dragElem = null;
            currentRow.classList.remove(`${params.targetClass}`)

            updateRow()
            afterDragIndex = rows.indexOf(currentRow)
            let data = params.tableData

            if (beforeDragIndex >= 0 && afterDragIndex >= 0) {

                let temp = data[beforeDragIndex];
                data.splice(beforeDragIndex, 1)
                data.splice(afterDragIndex, 0, temp)
            }

            if (isFunction(params.drop)) {
                params.drop(data)
            }
        }
    })

    //把當前點選的對象至一份出來drag
    function addDragRow(row) {
        dragElem = row.cloneNode(true);
        if (checkClass(params.dragClass)) {
            dragElem.classList.add(`${params.dragClass}`);
        }
        let currPos = currentRow.getBoundingClientRect();

        tbody.appendChild(dragElem)
        dragElem.style.position = 'absolute'
        dragElem.style.top = currPos.y + 'px'
        dragElem.style.left = currentRow.left + "px"
    }

    //移動中判斷是否碰觸擊更新位置
    function moveRow(x, y) {
        dragElem.style.transform = `translate3d(${x}px,${y}px,0)`;
        let currPos = dragElem.getBoundingClientRect();//當前drag對象
        updateRow()

        let currStartY = currPos.y;
        let currEndY = currPos.y + currPos.height;

        for (let i = 0; i < rows.length; i++) {
            let rowsPos = rows[i].getBoundingClientRect();
            let rowStartY = rowsPos.y;
            let rowEndY = rowsPos.y + rowsPos.height;

            if (currentRow !== rows[i] && collisionCheck(currStartY, currEndY, rowStartY, rowEndY)) {
                if (Math.abs(currStartY - rowStartY) < rowsPos.height / 2) {
                    switchRow(rows[i], i)
                }
            }
        }
    }

    //更新row的位置
    function switchRow(row, index) {
        let currIndex = Array.from(tbody.children).indexOf(currentRow);
        let row1 = currIndex < index ? row : currentRow;
        let row2 = currIndex > index ? row : currentRow;
        tbody.insertBefore(row1, row2);
    }

    //碰撞檢測
    function collisionCheck(currStartY, currEndY, rowStartY, rowEndY) {
        return currEndY >= rowStartY && currStartY <= rowEndY;
    }

    //取得當前的row
    function getRow(target) {
        if (target.tagName == "TD") return target.parentNode
        else return undefined
    }

    //取得目標座標
    function getCoords(e) {
        return {
            x: e.clientX,
            y: e.clientY
        }
    }

    //更新當前的row
    function updateRow() {
        rows = Array.from(tbody.children)
    }

    //檢查是否為function
    function isFunction(func) {
        if (typeof func == "function") {
            return true
        }
        console.warn("該參數只接受function")
        return false
    }

    //檢查class名稱
    function checkClass(className) {
        if(!className) return;
        if (typeof className == "string" || typeof className == "number") {
            return true
        }
        console.warn("class參數只能式字串或數字");
        return false
    }

    //初始化table
    function initTable(data) {
        if (!data || !data.length) return
        let keys = Object.keys(data[0])
        let theadRow = thead.insertRow();


        for (let i = 0; i < keys.length; i++) {
            var th = document.createElement("th");
            th.innerHTML = keys[i]
            theadRow.appendChild(th);
        }

        for (let i = 0; i < data.length; i++) {
            var tbodyRow = tbody.insertRow();

            for (let j = 0; j < keys.length; j++) {
                var cell = tbodyRow.insertCell()
                cell.innerHTML = data[i][keys[j]]
            }
        }
    }

}


