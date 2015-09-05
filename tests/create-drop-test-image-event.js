var createDropTestImageEvent = function(callback) {
    var someBlob = new Blob(['same way...'], {type: 'text/plain'})
    var parts = [someBlob, '...you construct blob', new ArrayBuffer()];

    var file = new File(parts, 'sample.txt', {
        lastModified: new Date(0), // optional - default = now
        type: "overide/mimetype" // optional - default = ''
    });

    var files = [
        file
    ];

    var fakeEvt = {
        dataTransfer: {
            files: files
        }
    };
    callback(fakeEvt, file);
}

module.exports = createDropTestImageEvent;
