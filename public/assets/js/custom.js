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
        const employeeDatas = [];
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
        $('#file_upload').on('change',function (e){
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader()
                reader.onload = function (e) {
                    const data = e.target.result
                    const workbook = XLSX.read(data, { type: "binary" })
                    const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
                    const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 })
                    if(jsonData[0].length !== 13)
                    {
                        alert('Invalid input data! Please flowing the prototype of data format!')
                        return false
                    }
                    if (!((jsonData[0][0] === 'Employee ID*' || jsonData[0][0] === 'Employee ID') && (jsonData[0][1] === 'Name') && (jsonData[0][2] === 'Department') && (jsonData[0][3] === 'Financial Year From*' || jsonData[0][3] === 'Financial Year From' ) && (jsonData[0][4] === 'Financial Year To*' || jsonData[0][4] === 'Financial Year To' ) && (jsonData[0][5] === 'Basic*' || jsonData[0][5] === 'Basic' ) && (jsonData[0][6] === 'House Rent*' || jsonData[0][6] === 'House Rent' ) && (jsonData[0][7] === 'Conveyance*' || jsonData[0][7] === 'Conveyance' ) && (jsonData[0][8] === 'Medical Allowance*' || jsonData[0][8] === 'Medical Allowance' ) && (jsonData[0][9] === 'Total' ) && (jsonData[0][10] === 'Festival Bonus*' || jsonData[0][10] === 'Festival Bonus' ) && (jsonData[0][11] === 'Others' ) && (jsonData[0][12] === 'Remarks' ) ))
                    {
                        alert('Invalid input data! Please flowing the prototype of data format!')
                        return false
                    }
                    for (let i = 0; i < jsonData.length; i++) {
                        for (let j = 0; j < jsonData[i].length; j++) {
                            if(typeof jsonData[i][j] === 'undefined')
                            {
                                jsonData[i][j] = 0
                            }
                            if (i > 0)
                            {
                                if (typeof jsonData[0][9] !== 'undefined' && jsonData[0][9] !== null)
                                {
                                    let total = parseInt(jsonData[i][9])
                                    jsonData[i][5] = ((total * 60)/100)
                                    jsonData[i][6] = ((total * 30)/100)
                                    jsonData[i][7] = ((total * 5)/100)
                                    jsonData[i][8] = ((total * 5)/100)
                                }
                                if ( j === 3 || j === 4)
                                {
                                    jsonData[i][j] = ExcelDateToJSFinancialDate(jsonData[i][j])
                                }
                            }
                        }
                    }
                    employeeDatas.push(jsonData)
                    showModal(employeeDatas,file.name);
                };
                reader.readAsBinaryString(file)
            }
        });

        $('#employee_file_upload').on('change',function (e){
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader()
                reader.onload = function (e) {
                    const data = e.target.result
                    const workbook = XLSX.read(data, { type: "binary" })
                    const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
                    const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 })
                    if(jsonData[0].length !== 10)
                    {
                        alert('Invalid input data! Please flowing the prototype of data format!')
                        return false
                    }
                    if (!((jsonData[0][0] === 'Employee Name*' || jsonData[0][0] === 'Employee Name') && (jsonData[0][1] === 'Department') && (jsonData[0][2] === 'Department Code*') && (jsonData[0][2] === 'Department Code' || jsonData[0][3] === 'Designation*' ) && (jsonData[0][3] === 'Designation' || jsonData[0][4] === 'Branch' ) && (jsonData[0][5] === 'Joining Date*' || jsonData[0][5] === 'Joining Date' ) && (jsonData[0][6] === 'Phone') && (jsonData[0][7] === 'Email') && (jsonData[0][8] === 'Status') && (jsonData[0][9] === 'Blood Group')))
                    {
                        alert('Invalid input data! Please flowing the prototype of data format!')
                        return false
                    }
                    for (let i = 0; i < jsonData.length; i++) {
                        let zero = jsonData[0].length
                        for (let j = 0; j < zero; j++) {
                            if(typeof jsonData[i][j] === 'undefined')
                            {
                                jsonData[i][j] = null
                            }
                            else if (i !== 0 && j === 5)
                            {
                                jsonData[i][j] = ExcelDateToJSDate(jsonData[i][j])
                            }
                        }
                    }
                    employeeDatas.push(jsonData)
                    showModal(employeeDatas,file.name);
                };
                reader.readAsBinaryString(file)
            }
        });
        let fixedDiv = $('#fixedDiv');
        if (typeof (fixedDiv.offset()) !== 'undefined')
        {
            let initialOffset = fixedDiv.offset().top;

            $(window).scroll(function() {
                var scrollPos = $(window).scrollTop();

                if (scrollPos > initialOffset) {
                    fixedDiv.addClass('fixed');
                } else {
                    fixedDiv.removeClass('fixed');
                }
            });
        }

        $('#selected-delete').click(function (){
            if (confirm("Are you sure?"))
            {
                // Create an array to store the checked values
                let checkedValues = [];

                // Use the :checked selector to get all checked checkboxes
                $('input[type="checkbox"]:checked').each(function () {
                    // Add the value of each checked checkbox to the array
                    checkedValues.push($(this).val());
                });

                // Display the result (you can modify this part based on your needs)
                alert('Checked values: ' + checkedValues.join(', '));
            }
        })

        // Select All checkbox
        $('#select_all').change(function() {
            $('.check-box').prop('checked', this.checked);
        });

        // Individual checkboxes
        $('.check-box').change(function() {
            if (!this.checked) {
                $('#select_all').prop('checked', false);
            }
        });
        // Function to display the modal
        function showModal(data,fileName) {
            const modal = document.getElementById("myModal");
            const modelTitle = document.getElementById("userDataModelLabel")
            const dataTable = document.getElementById("data-table");
            while (dataTable.firstChild) {
                dataTable.removeChild(dataTable.firstChild)
            }

            // Create a table from the data
            const table = document.createElement("table")
            table.className = "table"
            let t=0
            let action
            let row_o = 1;
            data[0].forEach(rowData => {
                const row = document.createElement("tr")
                let cell
                if(t===0)
                {
                    action = "Action"
                    cell = document.createElement("td")
                    cell.textContent = "SL"
                    row.appendChild(cell)
                }
                else
                {
                    action = '<a style="cursor: pointer" class="text-danger" onclick="return confirm(`Are you sure?`)? Obj.removeElementOfEmployeeData(this,'+t+',`'+fileName+'`):false"><i class="fa fa-trash" aria-hidden="true"></i></a>'
                    cell = document.createElement("td")
                    cell.textContent = row_o
                    row_o++;
                    row.appendChild(cell)
                }
                rowData.forEach(cellData => {
                    cell = document.createElement("td")
                    cell.textContent = cellData
                    row.appendChild(cell)
                });
                cell = document.createElement("td")
                cell.innerHTML=action
                row.appendChild(cell)
                table.appendChild(row)
                t++
            });

            // Append the table to the modal
            dataTable.appendChild(table)
            modelTitle.innerText = fileName
            $('#myModal').modal('show')
        }
        function ExcelDateToJSDate(serial) {
            const dateToString = d => `${('00' + d.getDate()).slice(-2)}-${('00' + (d.getMonth() + 1)).slice(-2)}-${d.getFullYear()}`
            return dateToString(new Date(Math.round((serial - 25569)*86400*1000)));
        }
        function ExcelDateToJSFinancialDate(serial) {
            if (typeof serial !== 'number')
            {
                return serial
            }
            const dateToString = d => {
                const months = [
                    "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                ];
                const monthsShort = [
                    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                ];

                const monthName = monthsShort[d.getMonth()];
                return `${monthName}-${d.getFullYear()}`;
            };

            return dateToString(new Date(Math.round((serial - 25569) * 86400 * 1000)));
        }
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
                            if (data.error) {
                                let division = "<option></option>";
                                $("#" + actionID).append(division);
                                alert(data.error.msg);
                            } else {
                                let permissions = data.results;

                                if (!permissions || permissions.length === 0) {
                                    alert("No data found!");
                                    let response = "<option value=\"none\">1. None</option>";
                                    $("#" + actionID).html(response);
                                } else {
                                    let counter = 2;
                                    let response = "<option value=\"none\">1. None</option>";
                                    permissions.forEach(function (permission) {
                                        response += "<option value=\"" + permission.name + "\">" + counter++ + ". " + permission.display_name + "</option>";
                                    });
                                    $("#" + actionID).html(response);
                                }
                            }
                        }
                    })
                }
            },
            removeElementOfEmployeeData:function (e,index,file){
                employeeDatas[0].splice(index, 1)
                showModal(employeeDatas,file)
            },
            employeeDataSubmit:function (e) {
                if (employeeDatas[0].length <= 1)
                {
                    alert('Empty data set please upload your excel file on the input field!')
                    return false
                }
                let url = window.location.origin + sourceDir + "/salary-certificate-input-excel";
                $.ajax({
                    headers: {'X-CSRF-TOKEN':$('meta[name="csrf-token"]').attr('content')},
                    contentType: 'application/json',
                    url: url,
                    type: "POST",
                    data: JSON.stringify({'input': employeeDatas[0]}),
                    success:function (data)
                    {
                        if (data.error) {
                            let alertMessage = data.message + '\nErrors:\n'
                            if (data.errors)
                            {
                                for (let field in data.errors) {
                                    if (data.errors.hasOwnProperty(field)) {
                                        alertMessage += field + ': ' + data.errors[field].join(', ') + '\n'
                                    }
                                }
                            }
                            alert(alertMessage)
                            return false
                        } else {
                            // Handle success
                            // console.log("Success: " + data)
                            let alertMessage = ''
                            if (data.errorMessage)
                            {
                                // Extract and display the Error Message
                                alertMessage += "Error! This Data Are Added not Possible:\n"
                                for (let key in data.errorMessage) {
                                    let employee = data.errorMessage[key]
                                    alertMessage += `Employee ID: ${employee["Employee ID"]}, Name: ${employee.Name}, Department: ${employee.Department}\n`
                                }
                            }
                            if (data.successMessage)
                            {
                                // Extract and display the Success Message
                                alertMessage += "This Data Are Added Successfully:\n"
                                for (let key in data.successMessage) {
                                    let employee = data.successMessage[key]
                                    alertMessage += `Employee ID: ${employee["Employee ID"]}, Name: ${employee.Name}, Department: ${employee.Department}\n`
                                }
                            }
                            if (data.alreadyHasMessage)
                            {
                                // Extract and display the alreadyHasMessage
                                alertMessage += "This Data are Already Exists in DB:\n"
                                for (let key in data.alreadyHasMessage) {
                                    let employee = data.alreadyHasMessage[key]
                                    alertMessage += `Employee ID: ${employee["Employee ID"]}, Name: ${employee.Name}, Department: ${employee.Department}\n`
                                }
                            }
                            alert(alertMessage)
                            window.location.reload()
                            return true
                        }
                    }
                })
            },
            salaryDistribute:function (e){
                let total = $('#total').val()
                if (total.length)
                {
                    total = parseInt(total)
                    let basic = ((total*60) / 100)
                    let house_rent = ((total*30) / 100)
                    let conveyance = ((total*5) / 100)
                    let ma = ((total*5) / 100)
                    $('#basic').val(basic).attr('readonly','readonly')
                    $('#house_rent').val(house_rent).attr('readonly','readonly')
                    $('#conveyance').val(conveyance).attr('readonly','readonly')
                    $('#medical').val(ma).attr('readonly','readonly')
                }
                else {
                    $('#basic').val('').removeAttr('readonly')
                    $('#house_rent').val('').removeAttr('readonly')
                    $('#conveyance').val('').removeAttr('readonly')
                    $('#medical').val('').removeAttr('readonly')
                }
            },
            userExcelFileSubmit:function (e) {
                if (employeeDatas[0].length <= 1)
                {
                    alert('Empty data set please upload your excel file on the input field!')
                    return false
                }
                let url = window.location.origin + sourceDir + "/add-user-excel";
                $.ajax({
                    headers: {'X-CSRF-TOKEN':$('meta[name="csrf-token"]').attr('content')},
                    contentType: 'application/json',
                    url: url,
                    type: "POST",
                    data: JSON.stringify({'input': employeeDatas[0]}),
                    success:function (data)
                    {
                        // console.log(data)
                        if (data.error) {
                            let alertMessage = data.message + '\nErrors:\n'
                            if (data.errors)
                            {
                                for (let field in data.errors) {
                                    if (data.errors.hasOwnProperty(field)) {
                                        alertMessage += field + ': ' + data.errors[field].join(', ') + '\n'
                                    }
                                }
                            }
                            alert(alertMessage)
                            return false
                        } else {
                            // Handle success
                            // console.log("Success: " + data)
                            let alertMessage = ''
                            if (data.errorMessage)
                            {
                                // Extract and display the Error Message
                                alertMessage += "Error! This Data Are Added not Possible:\n"
                                for (let key in data.errorMessage) {
                                    let employee = data.errorMessage[key]
                                    alertMessage += `Employee name: ${employee["Employee name"]}, Phone: ${employee["phone"]}, Email: ${employee["email"]}\n`
                                }
                            }
                            if (data.successMessage)
                            {
                                // Extract and display the Success Message
                                alertMessage += "This Data Are Added Successfully:\n"
                                for (let key in data.successMessage) {
                                    let employee = data.successMessage[key]
                                    alertMessage += `Employee name: ${employee["Employee name"]}, Phone: ${employee["phone"]}, Email: ${employee["email"]}\n`
                                }
                            }
                            if (data.alreadyHasMessage)
                            {
                                // Extract and display the alreadyHasMessage
                                alertMessage += "This Data are Already Exists in DB:\n"
                                for (let key in data.alreadyHasMessage) {
                                    let employee = data.alreadyHasMessage[key]
                                    alertMessage += `Employee name: ${employee["Employee name"]}, Phone: ${employee["phone"]}, Email: ${employee["email"]}\n`
                                }
                            }
                            alert(alertMessage)
                            window.location.reload()
                            return true
                        }
                    }
                })
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
            addVoucherDocumentIndividual:function (e){
                let id = $(e).attr('ref')
                let url = window.location.origin + sourceDir + "/add-voucher-document-individual";
                $.ajax({
                    headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                    url: url,
                    type: "POST",
                    data: {'id':id},
                    success: function(data){
                        if (data.error){
                            alert(data.error.msg)
                        }else{
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
            voucherShareType:function (e)
            {
                let value = $(e).val()
                let refId = $(e).attr('ref');
                if (value.length > 0)
                {
                    let url = window.location.origin + sourceDir + "/voucher-share-type";
                    $.ajax({
                        url: url,
                        method: 'POST',
                        headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                        data: {value: value, refId: refId},
                        success: function(data) {
                            $('#sharedLink').val(data)
                        }
                    });
                }

            },
            copyDocumentShareLink:function (e)
            {
                let sharedLink = $("#sharedLink")
                console.log(sharedLink.val().length)
                if (sharedLink.val().length <= 0)
                {
                    return false
                }
                else {
                    sharedLink.select()
                    try {
                        // Execute the copy command
                        document.execCommand('copy');
                        $(e).html('<i class="fa-solid fa-clipboard"></i> Copied!')
                        // $(e).remove('class','btn-success')
                        $(e).addClass('btn-info')
                    } catch (err) {
                        alert('Unable to copy link:'+err);
                    }
                }
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
                                return false
                            }else {
                                data = JSON.parse(data)
                                alert(data.results)
                                if (data.results)
                                    $('#shareModel').modal('hide')
                                else
                                    return false
                            }
                        },
                        error: function(error) {
                            console.error('Error:', error);
                        }
                    });
                }
            },
            emailLinkStatusChange:function (e) {
                const ref = $(e).attr('ref')
                const status = $(e).attr('status')
                const url = window.location.origin + sourceDir + "/email-link-status-change";
                $.ajax({
                    url: url,
                    method: 'POST',
                    headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                    data: {ref: ref, status: status},
                    success: function(data) {
                        if (data.error){
                            alert(data.error.msg)
                        }else {
                            data = JSON.parse(data)
                            alert(data.results)
                            $('#shareModel').modal('hide')
                        }
                    },
                    error: function(error) {
                        console.error('Error:', error);
                    }
                });
            },
            // salaryCertificateDataRead:function (e,inputID){
            //     if (!confirm('Are you sure!'))
            //         return false
            //
            //
            //     // const xmlFileInput = document.getElementById(inputID);
            //     // if (xmlFileInput.files.length > 0) {
            //     //     const xmlFile = xmlFileInput.files[0];
            //     //     console.log(xmlFile)
            //     //     // loadXmlFile(xmlFile);
            //     // }
            // },
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
