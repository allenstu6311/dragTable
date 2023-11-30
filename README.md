# Demo
<pre>
<code>
https://allenstu6311.github.io/dragTable/
</code>
</pre>


# dragTable
<pre>
<code>
npm install allendragtable 
</code>
</pre>

<pre>
<code>
https://cdn.jsdelivr.net/gh/allenstu6311/dragTable/cdn.js
</code>
</pre>

# Init
<pre>
<code>
     var data = [
        { id: 1, name: 'Alice', age: 25 },
        { id: 2, name: 'Bob', age: 30 },
        { id: 3, name: 'Charlie', age: 22 },
        { id: 4, name: 'David', age: 28 },
    ];
    
    new DragTable("test", {
        tableData: data,
        drag: function (e) { },
        drop: function (data) {},
        targetClass: "target",
        dragClass: "drag"
    })
</code>
</pre>

```html

  <table id="test" border="1" class="gridtable">
        <thead></thead>
        <tbody></tbody>
  </table>

