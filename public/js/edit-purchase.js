$(function () {
    console.log('editing')
    const dropzone = new Dropzone("div#file", { url: "/api/upload" });
})