Test = {}

Test.Get = function() {
    console.log("get...");
    $.get("http://localhost:8686", function(data, status) {
        console.log("data:" + data + ", status:" + status)
    });
}
