
! function() {
    var e = function(e, i, a) {
        var r = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        return r ? new Promise(function(i, a) {
            r.call(navigator, e, i, a)
        }) : Promise.reject(new Error("getUserMedia is not implemented in this browser"))
    };
    void 0 === navigator.mediaDevices && (navigator.mediaDevices = {}), void 0 === navigator.mediaDevices.getUserMedia && (navigator.mediaDevices.getUserMedia = e)
}();


var RetryHandler = function() {
    this.interval = 1e3, this.maxInterval = 6e4
};
RetryHandler.prototype.retry = function(t) {
    setTimeout(t, this.interval), this.interval = this.nextInterval_()
}, RetryHandler.prototype.reset = function() {
    this.interval = 1e3
}, RetryHandler.prototype.nextInterval_ = function() {
    var t = 2 * this.interval + this.getRandomInt_(0, 1e3);
    return Math.min(t, this.maxInterval)
}, RetryHandler.prototype.getRandomInt_ = function(t, e) {
    return Math.floor(Math.random() * (e - t + 1) + t)
};
var MediaUploader = function(t) {
    var e = function() {};
    if (this.file = t.file, this.contentType = t.contentType || this.file.type || "application/octet-stream", this.metadata = t.metadata || {
            title: this.file.name,
            mimeType: this.contentType
        }, this.token = t.token, this.onComplete = t.onComplete || e, this.onProgress = t.onProgress || e, this.onError = t.onError || e, this.offset = t.offset || 0, this.chunkSize = t.chunkSize || 0, this.retryHandler = new RetryHandler, this.url = t.url, !this.url) {
        var n = t.params || {};
        n.uploadType = "resumable", this.url = this.buildUrl_(t.fileId, n, t.baseUrl)
    }
    this.httpMethod = t.fileId ? "PUT" : "POST"
};
MediaUploader.prototype.upload = function() {
    var t = new XMLHttpRequest;
    t.open(this.httpMethod, this.url, !0), t.setRequestHeader("Authorization", "Bearer " + this.token), t.setRequestHeader("Content-Type", "application/json"), t.setRequestHeader("X-Upload-Content-Length", this.file.size), t.setRequestHeader("X-Upload-Content-Type", this.contentType), t.onload = function(t) {
        if (t.target.status < 400) {
            var e = t.target.getResponseHeader("Location");
            this.url = e, this.sendFile_()
        } else this.onUploadError_(t)
    }.bind(this), t.onerror = this.onUploadError_.bind(this), t.send(JSON.stringify(this.metadata))
}, MediaUploader.prototype.sendFile_ = function() {
    var t = this.file,
        e = this.file.size;
    (this.offset || this.chunkSize) && (this.chunkSize && (e = Math.min(this.offset + this.chunkSize, this.file.size)), t = t.slice(this.offset, e));
    var n = new XMLHttpRequest;
    n.open("PUT", this.url, !0), n.setRequestHeader("Content-Type", this.contentType), n.setRequestHeader("Content-Range", "bytes " + this.offset + "-" + (e - 1) + "/" + this.file.size), n.setRequestHeader("X-Upload-Content-Type", this.file.type), n.upload && n.upload.addEventListener("progress", this.onProgress), n.onload = this.onContentUploadSuccess_.bind(this), n.onerror = this.onContentUploadError_.bind(this), n.send(t)
}, MediaUploader.prototype.resume_ = function() {
    var t = new XMLHttpRequest;
    t.open("PUT", this.url, !0), t.setRequestHeader("Content-Range", "bytes */" + this.file.size), t.setRequestHeader("X-Upload-Content-Type", this.file.type), t.upload && t.upload.addEventListener("progress", this.onProgress), t.onload = this.onContentUploadSuccess_.bind(this), t.onerror = this.onContentUploadError_.bind(this), t.send()
}, MediaUploader.prototype.extractRange_ = function(t) {
    var e = t.getResponseHeader("Range");
    e && (this.offset = parseInt(e.match(/\d+/g).pop(), 10) + 1)
}, MediaUploader.prototype.onContentUploadSuccess_ = function(t) {
    200 == t.target.status || 201 == t.target.status ? this.onComplete(t.target.response) : 308 == t.target.status ? (this.extractRange_(t.target), this.retryHandler.reset(), this.sendFile_()) : this.onContentUploadError_(t)
}, MediaUploader.prototype.onContentUploadError_ = function(t) {
    t.target.status && t.target.status < 500 ? this.onError(t.target.response) : this.retryHandler.retry(this.resume_.bind(this))
}, MediaUploader.prototype.onUploadError_ = function(t) {
    this.onError(t.target.response)
}, MediaUploader.prototype.buildQuery_ = function(t) {
    return t = t || {}, Object.keys(t).map(function(e) {
        return encodeURIComponent(e) + "=" + encodeURIComponent(t[e])
    }).join("&")
}, MediaUploader.prototype.buildUrl_ = function(t, e, n) {
    var o = n || "https://www.googleapis.com/upload/drive/v2/files/";
    t && (o += t);
    var r = this.buildQuery_(e);
    return r && (o += "?" + r), o
};
