$(".kanban-list-body .dropdown-item").off('click').on('click', function(e){  

    var objectId = $(this).closest(".card-task").data("objectid")
    var action =  $(event.target).attr("id");
    
    if(action.indexOf("status")>-1){
        status = action.replaceAll("status-","");
    }else{
        return;
    }
    
    payload = '{"taskStatus": "'+status+'" }';

    submitTaskUpdate(objectId, payload);
});

function submitTaskUpdate(objectId, payload){
    
    Liferay.Util.fetch(
        "/o/c/tasks/"+objectId, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf8'
            },
            method: 'PUT',
            body: payload
        }
    )
    .then((response) => response.json()) 
    .then((data) => {
        //console.log("Return");
        //console.log(data);
        location.reload();
    })
    .catch((error) => {
        console.log(error);
        Liferay.Util.openToast({
            message: 'An error occured.',
            type: 'danger',
        });
    });
}

///////////////////////
// Progress Handling //
///////////////////////

$(".kanban-list-body .progress-value").each(function(){
    let progessValue = $(this).text().trim();
    $(this).closest(".card-task").find(".progress-bar").css("width",progessValue+"%");
});

$(".kanban-list-body .progress").off('click').on('click', function(e){
    var objectId = $(this).closest(".card-task").data("objectid")

    let width = $(this).width();
    let clickX = e.offsetX;
    let progressCalc = Math.floor((clickX/width)*100);

    //console.log(width+":"+clickX+":"+((clickX/width)));

    updateProgress( progressCalc, objectId );
});

function updateProgress( progress, objectId ){      
    if(progress > 95){
        progress = 100;

        payload = '{"taskStatus": "done", "progress": "'+progress+'"}';
    } else {
        payload = '{"progress": "'+progress+'" }';
    }
    submitTaskUpdate(objectId, payload);
}