let Obj = {};
if(window.location.port)
{
    sourceDir = "";
}else{
    // sourceDir = "/chl/public";
    sourceDir = "";
}
(function ($){
    $(document).ajaxStop(function(){
        $("#ajax_loader").hide();
        $("#ajax_loader2").hide();
    });
    $(document).ajaxStart(function (){
        $("#ajax_loader").show();
        $("#ajax_loader2").show();
    });
    $(document).ready(function(){
        const tags = [];
        $('#perAdd').click(function (){
            let per = $("#per").val()
            let dir = $("#dir").val()
            let ref = $("#per").attr('ref')
            // alert(window.location.origin + sourceDir + "/user-per-add")
            // return false
            if (per.length > 0 && dir.length > 0)
            {
                let url = window.location.origin + sourceDir + "/user-per-add";
                $.ajax({
                    headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                    url: url,
                    type: "POST",
                    data: {'per': per, 'dir': dir,'ref':ref},
                    success: function (data) {
                        console.log(data)
                        try {
                            data = JSON.parse(data)
                            alert(data.error.msg)
                        } catch (e) {
                            $("#f-p-list").html(data)
                            alert('Data added successfully!')
                            window.location.reload()
                        }
                    }
                })
            }
        })
        $('.per-delete').click(function (){
            if(!(confirm('Are you sure to delete this data!')))
            {
                return false
            }
            let ref = $(this).attr('ref')
            if (ref.length > 0)
            {
                let url = window.location.origin + sourceDir + "/user-per-delete";
                $.ajax({
                    headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                    url: url,
                    type: "POST",
                    data: {'ref':ref},
                    success: function (data) {
                        console.log(data)
                        try {
                            data = JSON.parse(data)
                            alert(data.error.msg)
                        } catch (e) {
                            alert('Data added successfully!')
                            window.location.reload()
                        }
                    }
                })
            }
        })
        // $('#tag-input').on('keydown',function(event) {
        //     alert("hello")
        //     // const pressedKey = event.keyCode;
        //     // console.log(pressedKey)
        //     // Obj.tagInput(this, pressedKey);  // Assuming Obj.tagInput is your function
        //
        //     // // Prevent the default behavior (e.g., form submission) for certain keys if needed
        //     // if (pressedKey === 'Enter' || pressedKey === 'Tab') {
        //     //     event.preventDefault();
        //     // }
        // });
        Obj = {
            fiendPermissionChild : function (e,actionID) {
                let id = $(e).val()
                if (id)
                {
                    let url = window.location.origin + sourceDir + "/fiend-permission-child";
                    $.ajax({
                        headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                        url: url,
                        type: "POST",
                        data: {'pid':id},
                        success: function (data) {
                            if (data.error){
                                // throw data.error.msg;
                                let division = "<option></option>";
                                $("#"+actionID).append(division);
                                alert(data.error.msg)
                            }else{
                                // Parse the JSON string into an object
                                let permissions = JSON.parse(data).results;
                                // console.log(permissions)
                                // return false
                                if ( permissions.length == 0 ) {
                                    alert("No data found!")
                                    let response = "<option value=\"none\">1. None</option>";
                                    $("#"+actionID).html(response);
                                }
                                let counter = 2
                                let response = "<option value=\"none\">1. None</option>";
                                permissions.forEach(function(permission) {
                                    response += "<option value=\"" + permission.name + "\">"+ counter++ +". " + permission.display_name +"</option>";
                                    $("#"+actionID).html(response);
                                });
                            }
                        }
                    })
                }
            },

            findDocument: function (e,actionID,actionID2,actionID3){
                let path = $(e).attr('path')
                let v_type = $(e).attr('vtype')
                let v_no = $(e).attr('vno')
                if (path)
                {
                    let url = window.location.origin + sourceDir + "/fiend-voucher-document";
                    $.ajax({
                        headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                        url: url,
                        type: "POST",
                        data: {'path':path},
                        success: function(pdfPreviewUrl){
                            // Check if the file exists
                            checkFileExists(pdfPreviewUrl, function(exists) {
                                if (exists) {
                                    const fileExtension = pdfPreviewUrl.split('.').pop().toLowerCase();
                                    const fileName = pdfPreviewUrl.split('/').pop();
                                    $('#v_document_name').html(fileName)
                                    $('#'+actionID2).html(v_type);
                                    $('#'+actionID3).html(v_no);
                                    if (['jpg', 'jpeg', 'png', 'gif','pdf','PDF'].includes(fileExtension)) {
                                        // Preview PDF in iframe
                                        const embedTag = '<embed src="'+pdfPreviewUrl+'#toolbar=0" style="width:100%; height:700px;" />'
                                        $('#'+actionID).html(embedTag);
                                    } else if (['mp4', 'webm', 'ogg'].includes(fileExtension)) {
                                        // Play video
                                        // Modify this to fit your video display logic
                                        const videoTag = `<video controls style="width: 100%"><source src="${pdfPreviewUrl}" type="video/mp4">Your browser does not support the video tag.</video>`;
                                        $('#'+actionID).html(videoTag);
                                        // $('#'+actionID).replaceWith(videoTag);
                                        // $('#staticBackdrop').modal('show');
                                        // $('#pdfPreviewModal').modal('show');
                                    } else {
                                        const btn = '<div class="row">\n' +
                                        '                        <div class="col-md-12 text-center">\n' +
                                        '                            <h1 class="text-center">Sorry! This file type is not supported for preview.</h1>\n' +
                                        '                            <a class="btn btn-success text-center" href="' + pdfPreviewUrl + '" download>\n' +
                                        '                                Click To Download\n' +
                                        '                            </a>\n' +
                                        '                        </div>\n' +
                                        '                    </div>'
                                        // Provide a download link
                                        $('#'+actionID).html(btn);
                                        // window.location.href = pdfPreviewUrl;
                                    }
                                    $('#staticBackdrop').modal('show');
                                } else {
                                    const error = '<div class="text-center text-danger">URL Not Found!</div>'
                                    $('#'+actionID).html(error);
                                    $('#staticBackdrop').modal('show');
                                }
                            });
                            return true
                        }
                    })
                }
                return false
            },
            fileSharingModal:function (e) {
                let id = $(e).attr('ref')
                let url = window.location.origin + sourceDir + "/fiend-voucher-document-info";
                $.ajax({
                    headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                    url: url,
                    type: "POST",
                    data: {'id':id},
                    success: function(data){
                        if (data.error){
                            alert(data.error.msg)
                        }else{
                            while(tags.length > 0) {
                                tags.pop();
                            }
                            $('#model_dialog').html(data)
                            $('#shareModel').modal('show')
                        }
                    }
                })
                return false
            },
            closeSharingModel:function (e) {
                while(tags.length > 0) {
                    tags.pop();
                }

            },
            tagInput:function (event)
            {
                // console.log(tags)
                const value = $(event).val()
                const regex = /\s|,/;
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (regex.test(value))
                {
                    const leanedData = value.replace(/[\s,]/g, '');
                    if (emailRegex.test(leanedData))
                    {
                        const tagValue = leanedData.trim();
                        const tag = $('<div>').addClass('tag').attr('onclick','return Obj.removeTag(this)').text(tagValue+' 🗙');
                        $('#tags').append(tag);
                        $('#tag-input').val('');
                        tags.push(tagValue);
                    }
                }
            },
            removeTag:function (event)
            {

                const tagValue = $(event).text();
                const index = tags.indexOf(tagValue);
                if (index !== -1) {
                    tags.splice(index, 1);
                }
                $(event).remove();
            },
            sendDocumentEmail:function (e)
            {
                const url = window.location.origin + sourceDir + "/share-voucher-document-email";
                const refId = $(e).attr('ref');
                const message = $('#message').val()
                // const data = { tags: tags, refId: refId };
                if (tags.length <= 0) {
                    alert("Error! Empty Field");
                    return false;
                } else {
                    $.ajax({
                        url: url,
                        method: 'POST',
                        headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                        data: {tags: tags, refId: refId, message: message},
                        success: function(data) {
                            if (data.error){
                                alert(data.error.msg)
                            }else {
                                data = JSON.parse(data)
                                alert(data.results)
                            }
                        },
                        error: function(error) {
                            console.error('Error:', error);
                        }
                    });
                }
            },
        }
        function checkFileExists(url, callback) {
            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    callback(xhr.status === 200);
                }
            };
            xhr.open('HEAD', url, true);
            xhr.send();
        }

    })
}(jQuery))
