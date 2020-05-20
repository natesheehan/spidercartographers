$('#flowsMoreInfo_p').click( function() {

    loadPopupBoxInfoFlows();

    $('#flowsInfoPopupBoxClose').click( function() {            
        unloadPopupBoxInfoFlows();
    });

    function unloadPopupBoxInfoFlows() {    
        $('#flowsInfoPopup').css({
            'display': 'none'
        });
        $('#blur_out').css({       
            'display': 'none'  
        }); 
    }    

    function loadPopupBoxInfoFlows() {   
        $('#flowsInfoPopup').css({
            'display': 'inline-block'
        });
        $('#blur_out').css({
            'display': 'inline-block'
        })    
    }        
});

