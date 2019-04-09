String.prototype.format = function() {
    var i = 0,
        args = arguments;
    return this.replace(/{}/g, function() {
        return typeof args[i] != "undefined" ? args[i++] : "";
    });
};

var addpBtn = $("#addP");
var addstBtn = $("#addST");
var addiBtn = $("#addI");

var form = $("#edf");

var last = $(".form-group").last();
var groupP = `
<div class="form-group para">
<label for="{}" ></label>
<textarea
    class="form-control"
    name="{}"
    id="{}"
    cols="30"
    rows="10"
    style="resize:vertical"
    placeholder="Add new paragraph here....."
></textarea>
</div>`;
var groupT = `
<div class="form-group subtitle">
<label for="{}" ></label>
<textarea
    class="form-control"
    name="{}"
    id="{}"
    style="resize:none"
    placeholder="Add new titel for paragraphs....."
></textarea>
</div>`;

addpBtn.click(function() {
    var eleLength = $(".form-group").length + 1;
    var pLength = $(".form-group.para").length + 1;
    var textareaName = "e" + eleLength + "p" + pLength;
    var finalHtml = groupP.format(textareaName,textareaName,textareaName);
    $(finalHtml).insertAfter($(".form-group").last());
    $("#" + textareaName)
        .siblings($("lable"))
        .text("paragraph#" + pLength);
        
});
addstBtn.click(function() {
    var eleLength = $(".form-group").length + 1;
    var stLength = $(".form-group.subtitle").length + 1;
    var subtitelName = "e" + eleLength + "st" + stLength;
    var finalHtml = groupT.format(subtitelName,subtitelName,subtitelName);
    $(finalHtml).insertAfter($(".form-group").last());
    $("#" + subtitelName)
        .siblings($("lable"))
        .text("sub-titel#" + stLength);
});