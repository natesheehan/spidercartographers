$("#clustersMoreInfo_p").click( function() {

    loadPopupBoxInfoClusters();

    $('#clustersInfoPopupBoxClose').click( function() {            
        unloadPopupBoxInfoClusters();
    });

    function unloadPopupBoxInfoClusters() {    
        $('#clustersInfoPopup').css({
            "display": "none"
        });
        $("#blur_out").css({       
            "display": "none"  
        }); 
    }    

    function loadPopupBoxInfoClusters() {   
        $('#clustersInfoPopup').css({
            "display": "inline-block"
        });
        $("#blur_out").css({
            "display": "inline-block"
        })    
    }        
});


$("#flowsMoreInfo_p").click( function() {

    loadPopupBoxInfoFlows();

    $('#flowsInfoPopupBoxClose').click( function() {            
        unloadPopupBoxInfoFlows();
    });

    function unloadPopupBoxInfoFlows() {    
        $('#flowsInfoPopup').css({
            "display": "none"
        });
        $("#blur_out").css({       
            "display": "none"  
        }); 
    }    

    function loadPopupBoxInfoFlows() {   
        $('#flowsInfoPopup').css({
            "display": "inline-block"
        });
        $("#blur_out").css({
            "display": "inline-block"
        })    
    }        
});

