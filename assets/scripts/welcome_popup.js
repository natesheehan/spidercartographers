$(document).ready( function() {

    // when site loaded, load popup box
    loadPopupBox();

    $('#popupBoxClose').click( function() {            
        unloadPopupBox();
    });

    function unloadPopupBox() {    
        $('#popup_box').fadeOut('slow');
        $('#blur_out').css({       
            'display': 'none'  
        }); 
    }    

    function loadPopupBox() {   
        $('#popup_box').fadeIn('slow');       
    }        
});
